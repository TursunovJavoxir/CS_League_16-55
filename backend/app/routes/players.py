from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.player import Player
from app.models.match import Match
from app.models.season import Season

from app.schemas.player import CreatePlayerSchema

from app.models.season_reward import (SeasonReward)
from app.auth import admin_required
import random

router = APIRouter(prefix="/players")


@router.post("/")
def create_player(
    player: CreatePlayerSchema,

    admin: Player = Depends(
        admin_required
    ),

    db: Session = Depends(get_db)
):

    

    existing_player = db.query(Player).filter(
        Player.nickname.ilike(player.nickname)
    ).first()

    if existing_player:

        return {
            "message": "Player already exists"
        }

    new_player = Player(
        nickname=player.nickname
    )

    db.add(new_player)

    db.commit()

    db.refresh(new_player)

    return {
        "message": "Player created",
        "nickname": new_player.nickname
    }


@router.post("/bulk")
def bulk_create_players(
    players: list[CreatePlayerSchema],

    admin: Player = Depends(
        admin_required
    ),

    db: Session = Depends(get_db)
):

    

    created_players = []

    for player in players:

        existing_player = db.query(Player).filter(
            Player.nickname.ilike(player.nickname)
        ).first()

        if existing_player:
            continue

        new_player = Player(
            nickname=player.nickname
        )

        db.add(new_player)

        created_players.append(player.nickname)

    db.commit()

    return {
        "message": "Players imported",
        "players": created_players
    }


@router.post("/reset-stats")
def reset_stats(
    admin: Player = Depends(
        admin_required
    ),

    db: Session = Depends(get_db)
):

    

    players = db.query(Player).all()

    for player in players:

        player.elo = 1000
        player.wins = 0
        player.losses = 0
        player.matches_played = 0
        player.winrate = 0
        player.mvp = 0
        player.streak = 0
        player.peak_elo = 1000
        player.rank = "Silver"
        player.is_placement = True
        player.placement_matches = 0
        player.placement_seed = 1000

    db.commit()

    return {
        "message": "All player stats reset"
    }


@router.get("/")
def get_players(db: Session = Depends(get_db)):

    

    players = db.query(Player).order_by(
        Player.elo.desc()
    ).all()

    leaderboard = []

    for index, player in enumerate(players):

        leaderboard.append({
            "position": index + 1,
            "id": player.id,
            "nickname": player.nickname,
            "elo":

                None

                if player.is_placement

                else player.elo,
            "rank":

                "Placement"

                if player.is_placement

                else player.rank,

            "is_placement":

                player.is_placement,
            "wins": player.wins,
            "losses": player.losses,
            "matches_played": player.matches_played,
            "winrate": player.winrate,
            "mvp": player.mvp,
            "streak": player.streak,
            "peak_elo": player.peak_elo
        })

    return leaderboard

@router.get("/season/{season_name}")
def get_season_leaderboard(season_name: str,db: Session = Depends(get_db)):

    

    season = db.query(Season).filter(
        Season.name == season_name
    ).first()

    if not season:

        raise HTTPException(
            status_code=404,
            detail="Season not found"
        )

    matches = db.query(Match).filter(
        Match.season_id == season.id
    ).all()

    seasonal_stats = {}

    # -------------------------
    # BUILD STATS
    # -------------------------

    for match in matches:

        player1 = db.query(Player).filter(
            Player.id == match.player1_id
        ).first()

        player2 = db.query(Player).filter(
            Player.id == match.player2_id
        ).first()

        winner_id = match.winner_id

        for player in [player1, player2]:

            if player.id not in seasonal_stats:

                seasonal_stats[player.id] = {

                    "id": player.id,

                    "nickname": player.nickname,

                    "elo": 1000,

                    "wins": 0,

                    "losses": 0,

                    "matches_played": 0,

                    "winrate": 0,

                    "rank": "Silver"
                }

        # matches

        seasonal_stats[player1.id]["matches_played"] += 1
        seasonal_stats[player2.id]["matches_played"] += 1

        # wins/losses

        if winner_id == player1.id:

            seasonal_stats[player1.id]["wins"] += 1
            seasonal_stats[player2.id]["losses"] += 1

        else:

            seasonal_stats[player2.id]["wins"] += 1
            seasonal_stats[player1.id]["losses"] += 1

    # -------------------------
    # WINRATE
    # -------------------------

    for player_id in seasonal_stats:

        stats = seasonal_stats[player_id]

        if stats["matches_played"] > 0:

            stats["winrate"] = round(

                (
                    stats["wins"]
                    /
                    stats["matches_played"]
                ) * 100,

                1
            )

        # current elo/rank

        player = db.query(Player).filter(
            Player.id == player_id
        ).first()

        stats["elo"] = (

            None

            if player.is_placement

            else player.elo
        )

        stats["rank"] = (

            "Placement"

            if player.is_placement

            else player.rank
        )

        stats["is_placement"] = player.is_placement

    # -------------------------
    # SORT
    # -------------------------

    leaderboard = sorted(

        seasonal_stats.values(),

        key=lambda x: (

            x["elo"]

            if x["elo"] is not None

            else 0
        ),

        reverse=True
    )

    # positions

    for index, player in enumerate(leaderboard):

        player["position"] = index + 1

    return leaderboard

@router.get("/nickname/{nickname}")
def get_player_by_nickname(nickname: str,db: Session = Depends(get_db)):

    

    player = db.query(Player).filter(
        Player.nickname == nickname
    ).first()

    if not player:

        raise HTTPException(
            status_code=404,
            detail="Player not found"
        )

    return {
        "id": player.id,
        "nickname": player.nickname
    }


@router.get("/{player_id}")
def get_player_profile(player_id: int,db: Session = Depends(get_db)):

    

    player = db.query(Player).filter(
        Player.id == player_id
    ).first()

    if not player:

        raise HTTPException(
            status_code=404,
            detail="Player not found"
        )

    recent_matches_query = db.query(Match).filter(
        (Match.player1_id == player.id) |
        (Match.player2_id == player.id)
    ).order_by(
        Match.id.desc()
    ).limit(10).all()

    recent_matches = []

    for match in recent_matches_query:

        opponent_id = (
            match.player2_id
            if match.player1_id == player.id
            else match.player1_id
        )

        opponent = db.query(Player).filter(
            Player.id == opponent_id
        ).first()

        is_pending = (
            match.winner_id is None
        )

        is_win = (
            match.winner_id == player.id
        )

        recent_matches.append({

            "id": match.id,

            "opponent": opponent.nickname,

            "result":

                None

                if is_pending

                else (

                    "win"

                    if is_win

                    else "loss"
                ),

            "score": match.score,

            "elo_change": match.elo_change,

            "match_type": match.match_type,

            "season_id": match.season_id

        })
    from app.models.player_achievement import (
        PlayerAchievement
    )
    achievements = db.query(
        PlayerAchievement
    ).filter(
        PlayerAchievement.player_id == player.id
    ).all()
    season_rewards = db.query(
        SeasonReward
    ).filter(
        SeasonReward.player_id == player.id
    ).all()
    return {

        "id": player.id,

        "nickname": player.nickname,

        "elo":

            None

            if player.is_placement

            else player.elo,

        "rank":

            "Placement"

            if player.is_placement

            else player.rank,

        "wins": player.wins,

        "losses": player.losses,

        "matches_played": player.matches_played,

        "winrate": player.winrate,

        "mvp": player.mvp,

        "streak": player.streak,

        "peak_elo": player.peak_elo,

        "placement_matches":
            player.placement_matches,

        "is_placement":
            player.is_placement,

        "placement_seed":
            player.placement_seed,

        "recent_matches": recent_matches,

        "season_rewards": [

            {
                "title": reward.title,

                "icon": reward.icon,

                "rarity": reward.rarity,

                "season_id": reward.season_id,

                "tournament_name": reward.tournament_name,

                "tournament_id": reward.tournament_id
            }

            for reward in season_rewards
        ],

        "achievements": [

            {
                "title": achievement.title,

                "description": achievement.description,

                "icon": achievement.icon,

                "rarity": achievement.rarity
            }

            for achievement in achievements
        ],
    }


@router.get("/{player_id}/matches")
def get_player_matches(player_id: int,db: Session = Depends(get_db)):

    

    matches = db.query(Match).filter(
        (Match.player1_id == player_id) |
        (Match.player2_id == player_id)
    ).order_by(
        Match.id.desc()
    ).all()

    result = []

    for match in matches:

        opponent_id = (
            match.player2_id
            if match.player1_id == player_id
            else match.player1_id
        )

        opponent = db.query(Player).filter(
            Player.id == opponent_id
        ).first()

        is_winner = (
            match.winner_id == player_id
        )

        result.append({

            "id": match.id,

            "opponent": opponent.nickname,

            "result":

                None

                if match.winner_id is None

                else (

                    "win"

                    if is_winner

                    else "loss"
                ),

            "score": match.score,

            "elo_change": match.elo_change,

            "match_type": match.match_type,

            "season_id": match.season_id

        })

    return result

@router.get("/{player_id}/placement-opponent")
def get_placement_opponent(
    player_id: int,
    db: Session = Depends(get_db)
):

    

    player = db.query(Player).filter(
        Player.id == player_id
    ).first()

    if not player:

        raise HTTPException(
            status_code=404,
            detail="Player not found"
        )
    existing_pending_match = db.query(Match).filter(
        (
            Match.player1_id == player.id
        )
        |
        (
            Match.player2_id == player.id
        ),
        Match.winner_id == None
    ).first()

    if existing_pending_match:
        raise HTTPException(
            status_code=400,
            detail="У игрока уже есть активный матч"
        )
    
    if not player.is_placement:

        raise HTTPException(
            status_code=400,
            detail="Калибровка завершена"
        )

    placement_matches = db.query(Match).filter(

        (
            Match.player1_id == player.id
        )

        |

        (
            Match.player2_id == player.id
        ),

        Match.match_type == "Placement"

    ).all()

    # hard limit

    if len(placement_matches) >= 5:

        raise HTTPException(
            status_code=400,
            detail="Все placement матчи уже созданы"
        )

    # exclude used opponents

    used_opponent_ids = set()

    for match in placement_matches:

        opponent_id = (

            match.player2_id

            if match.player1_id == player.id

            else match.player1_id
        )

        used_opponent_ids.add(
            opponent_id
        )

    min_elo = player.placement_seed - 75
    max_elo = player.placement_seed + 75

    opponents = db.query(Player).filter(

        Player.id != player.id,

        ~Player.id.in_(used_opponent_ids),

        Player.elo >= min_elo,

        Player.elo <= max_elo

    ).all()

    # fallback

    if not opponents:

        opponents = db.query(Player).filter(

            Player.id != player.id,

            ~Player.id.in_(used_opponent_ids)

        ).all()

    if not opponents:

        raise HTTPException(
            status_code=400,
            detail="Нет доступных opponents"
        )

    opponent = random.choice(
        opponents
    )

    active_season = db.query(Season).filter(
        Season.is_active == True
    ).first()

    if not active_season:

        raise HTTPException(
            status_code=400,
            detail="Нет активного сезона"
        )

    
    new_match = Match(

        player1_id=player.id,

        player2_id=opponent.id,

        winner_id=None,

        loser_id=None,

        score="0:0",

        elo_change="+0 / -0",

        match_type="Placement",

        season_id=active_season.id
    )

    db.add(new_match)

    db.commit()

    return {

        "message": "Placement match created",

        "player": player.nickname,

        "opponent": opponent.nickname
    }