from fastapi import APIRouter, HTTPException, Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.season import Season

from app.models.player import Player

from app.models.tournament import Tournament

from app.models.season_reward import (
    SeasonReward
)

from fastapi import Depends

from app.auth import (
    admin_required
)
router = APIRouter(prefix="/seasons")


@router.post("/create")
def create_season(

    name: str,

    admin = Depends(
        admin_required
    ),
    db: Session = Depends(get_db)
):

    

    existing = db.query(Season).filter(
        Season.name == name
    ).first()

    if existing:

        raise HTTPException(
            status_code=400,
            detail="Season already exists"
        )

    # deactivate old seasons

    old_seasons = db.query(Season).all()

    for season in old_seasons:

        season.is_active = False

    # create new active season

    new_season = Season(
        name=name,
        is_active=True
    )

    db.add(new_season)

    db.commit()

    db.refresh(new_season)

    return {

        "message": "Season created",

        "season": new_season.name

    }


@router.get("/active")
def get_active_season(db: Session = Depends(get_db)):

    

    season = db.query(Season).filter(
        Season.is_active == True
    ).first()

    

    if not season:

        raise HTTPException(
            status_code=404,
            detail="No active season"
        )

    return {

        "id": season.id,

        "name": season.name,

        "is_active": season.is_active

    }


@router.get("/")
def get_seasons(db: Session = Depends(get_db)):

    

    seasons = db.query(Season).order_by(
        Season.id.desc()
    ).all()

    result = []

    for season in seasons:

        result.append({

            "id": season.id,

            "name": season.name,

            "is_active": season.is_active

        })

    return result


@router.post("/{season_id}/activate")
def activate_season(

    season_id: int,

    admin = Depends(
        admin_required
    ),
    db: Session = Depends(get_db)
):

    

    season = db.query(Season).filter(
        Season.id == season_id
    ).first()

    if not season:

        raise HTTPException(
            status_code=404,
            detail="Season not found"
        )

    # deactivate all

    all_seasons = db.query(Season).all()

    for s in all_seasons:

        s.is_active = False

    # activate selected

    season.is_active = True

    db.commit()

    return {

        "message": "Season activated",

        "season": season.name

    }

@router.post("/soft-reset")
def soft_reset(

    admin = Depends(
        admin_required
    ),
    db: Session = Depends(get_db)
):

    

    players = db.query(Player).all()

    updated_players = []

    for player in players:

        old_elo = player.elo

        new_elo = int(
            1000 + (old_elo - 1000) * 0.5
        )

        if new_elo < 1000:
            new_elo = 1000

        player.elo = new_elo

        player.streak = 0

        if new_elo > player.peak_elo:
            player.peak_elo = new_elo

        updated_players.append({

            "nickname": player.nickname,

            "old_elo": old_elo,

            "new_elo": new_elo

        })

    db.commit()

    return {

        "message": "Soft reset completed",

        "players": updated_players

    }

@router.post("/{season_id}/set-champion/{player_id}")
def set_season_champion(

    season_id: int,
    player_id: int,
    

    admin = Depends(
        admin_required
    ),
    db: Session = Depends(get_db)
):

    

    season = db.query(Season).filter(
        Season.id == season_id
    ).first()

    if not season:

        raise HTTPException(
            status_code=404,
            detail="Season not found"
        )
    if season.champion_id is not None:
        raise HTTPException(
            status_code=400,
            detail="Champion already set for this season"
        )

    player = db.query(Player).filter(
        Player.id == player_id
    ).first()

    if not player:

        raise HTTPException(
            status_code=404,
            detail="Player not found"
        )

    season.champion_id = player.id
    season.champion_elo = player.elo
    season.champion_rank = player.rank

    db.commit()

    return {

        "message": "Season champion set",

        "season": season.name,

        "champion": player.nickname
    }

@router.get("/hall-of-fame")
def get_hall_of_fame(db: Session = Depends(get_db)):

    

    seasons = db.query(Season).filter(
        Season.champion_id != None
    ).order_by(
        Season.id.desc()
    ).all()

    result = []

    for season in seasons:

        champion = db.query(Player).filter(
            Player.id == season.champion_id
        ).first()

        if not champion:
            continue

        result.append({

            "season_id": season.id,

            "season_name": season.name,

            "champion_id": champion.id,

            "champion_name": champion.nickname,

            "champion_elo": season.champion_elo or champion.elo,

            "champion_rank": season.champion_rank or champion.rank
        })

    return result

@router.post("/{season_id}/distribute-rewards")
def distribute_season_rewards(

    season_id: int,

    admin = Depends(
        admin_required
    ),
    db: Session = Depends(get_db)
):

    

    season = db.query(Season).filter(
        Season.id == season_id
    ).first()

    if not season:

        raise HTTPException(
            status_code=404,
            detail="Season not found"
        )
    
    existing_rewards = db.query(SeasonReward).filter(
        SeasonReward.season_id == season.id
    ).first()

    if existing_rewards:
        raise HTTPException(
            status_code=400,
            detail="Rewards already distributed for this season"
        )
    
    tournament = db.query(Tournament).filter(
        Tournament.season_id == season.id,
        Tournament.winner != None
    ).order_by(
        Tournament.id.desc()
    ).first()
    
    players = []

    if tournament and tournament.winner:

        champion = db.query(Player).filter(
            Player.nickname == tournament.winner
        ).first()

        if champion:

            players.append(champion)

    top_players = db.query(Player).order_by(
        Player.elo.desc()
    ).limit(10).all()

    for player in top_players:

        if player not in players:

            players.append(player)

    players = players[:3]

    if len(players) == 0:

        raise HTTPException(
            status_code=400,
            detail="No players found"
        )

    rewards = []

    reward_templates = [

        {
            "title": "Чемпион сезона",
            "icon": "👑",
            "rarity": "legendary"
        },

        {
            "title": "Элита сезона",
            "icon": "🏆",
            "rarity": "epic"
        },

        {
            "title": "Лучший игрок сезона",
            "icon": "🥇",
            "rarity": "rare"
        }
    ]

    for index, player in enumerate(players):

        template = reward_templates[index]

        reward = SeasonReward(

            player_id=player.id,

            season_id=season.id,

            title=template["title"],

            icon=template["icon"],

            rarity=template["rarity"],

            tournament_name=(

                tournament.name

                if tournament

                else None
            ),

            tournament_id=(

                tournament.id

                if tournament

                else None
            ),
        )

        db.add(reward)

        rewards.append({

            "player": player.nickname,

            "reward": template["title"]
        })

    db.commit()

    return {

        "message": "Сезонные награды выданы",

        "season": season.name,

        "rewards": rewards
    }