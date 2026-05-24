from fastapi import APIRouter, HTTPException, Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.match import Match
from app.models.player import Player
from app.models.season import Season
from app.utils.achievements import (
    check_achievements


)
from app.models.player_achievement import (
    PlayerAchievement
)
from app.schemas.match import CreateMatchSchema

from app.utils.elo import (
    calculate_new_elo,
    get_k_factor,
    get_rank
)

from app.auth import (
    admin_required
)

router = APIRouter(prefix="/matches")


def process_match_logic(match_data, db):

    player1 = db.query(Player).filter(
        Player.id == match_data.player1_id
    ).first()

    player2 = db.query(Player).filter(
        Player.id == match_data.player2_id
    ).first()

    if not player1 or not player2:

        raise HTTPException(
            status_code=400,
            detail="Players not found"
        )

    try:
        p1_score = int(match_data.score.split(":")[0])
        p2_score = int(match_data.score.split(":")[1])
    except:

        raise HTTPException(
            status_code=400,
            detail="Invalid score format"
        )

    if p1_score > p2_score:
        winner = player1
        loser = player2
    else:
        winner = player2
        loser = player1

    # Placement matches

    if (
        player1.matches_played < 5
        or
        player2.matches_played < 5
    ):

        k_factor = get_k_factor("placement")

    else:

        k_factor = get_k_factor(
            match_data.match_type
        )
    old_winner_elo = winner.elo
    old_loser_elo = loser.elo

    new_winner_elo = calculate_new_elo(
        old_winner_elo,
        old_loser_elo,
        1,
        k_factor
    )

    new_loser_elo = calculate_new_elo(
        old_loser_elo,
        old_winner_elo,
        0,
        k_factor
    )

    winner.elo = new_winner_elo

    loser.elo = new_loser_elo

    # Upset bonus
    elo_difference = old_winner_elo - old_loser_elo

    if elo_difference <= -150:
        winner.elo += 5

    # Wins/Losses
    winner.wins += 1
    loser.losses += 1

    # Matches played
    winner.matches_played += 1
    loser.matches_played += 1

    # -------------------------
    # PLACEMENT CALIBRATION
    # -------------------------

    for player in [winner, loser]:

        if player.is_placement:

            player.placement_matches += 1

            # placement completed

            if player.placement_matches >= 5:

                player.is_placement = False

                # final placement rank

                if player.elo >= 1250:

                    player.rank = "Platinum"

                elif player.elo >= 1150:

                    player.rank = "Gold"

                elif player.elo >= 1000:

                    player.rank = "Silver"

                else:

                    player.rank = "Bronze"
    # Winrate
    winner.winrate = round(
        (winner.wins / winner.matches_played) * 100,
        1
    )

    loser.winrate = round(
        (loser.wins / loser.matches_played) * 100,
        1
    )

    # Streak
    winner.streak += 1
    loser.streak = 0

    # MVP
    winner.mvp += 1

    if winner.streak >= 3:
        winner.mvp += 2

    # Peak elo
    if winner.elo > winner.peak_elo:
        winner.peak_elo = winner.elo

    # Ranks
    if not winner.is_placement:

        winner.rank = get_rank(
            winner.elo
        )

    if not loser.is_placement:

        loser.rank = get_rank(
            loser.elo
        )

    elo_change = (
        f'+{winner.elo - old_winner_elo} / '
        f'{loser.elo - old_loser_elo}'
    )

    return winner, loser, elo_change


@router.post("/")
def create_match(

    match: CreateMatchSchema,

    admin: Player = Depends(
        admin_required
    ),
    db: Session = Depends(get_db)
):

    

    active_season = db.query(Season).filter(
        Season.is_active == True
    ).first()

    if not active_season:
        raise HTTPException(
            status_code=400,
            detail="No active season"
        )

    winner, loser, elo_change = process_match_logic(
        match,
        db
    )

    new_match = Match(
        player1_id=match.player1_id,
        player2_id=match.player2_id,
        winner_id=winner.id,
        loser_id=loser.id,
        score=match.score,
        elo_change=elo_change,
        match_type=match.match_type,
        season_id=active_season.id
    )

    db.add(new_match)

    check_achievements(
        db,
        winner
    )

    check_achievements(
        db,
        loser
    )

    db.commit()

    return {
        "message": "Match created",
        "winner": winner.nickname,
        "elo_change": elo_change,
        "season": active_season.name
    }


@router.get("/")
def get_matches(db: Session = Depends(get_db)):

    

    matches = db.query(Match).all()

    result = []

    for match in matches:

        player1 = db.query(Player).filter(
            Player.id == match.player1_id
        ).first()

        player2 = db.query(Player).filter(
            Player.id == match.player2_id
        ).first()

        winner = db.query(Player).filter(
            Player.id == match.winner_id
        ).first()

        result.append({

            "id": match.id,
            "player1_id": match.player1_id,
            "player2_id": match.player2_id,

            "player1": (
                player1.nickname
                if player1
                else "TBD"
            ),

            "player2": (
                player2.nickname
                if player2
                else "TBD"
            ),

            "winner": (
                winner.nickname
                if winner
                else None
            ),

            "status": (

                "completed"

                if winner

                else "pending"
            ),

            "score": match.score,

            "elo_change": match.elo_change,

            "match_type": match.match_type,

            "season_id": match.season_id
        })

    return result

@router.get("/{match_id}")
def get_match(
    match_id: int,
    db: Session = Depends(get_db)
):

    

    match = db.query(Match).filter(
        Match.id == match_id
    ).first()

    if not match:

        raise HTTPException(
            status_code=404,
            detail="Матч не найден"
        )

    player1 = db.query(Player).filter(
        Player.id == match.player1_id
    ).first()

    player2 = db.query(Player).filter(
        Player.id == match.player2_id
    ).first()

    winner = db.query(Player).filter(
        Player.id == match.winner_id
    ).first() if match.winner_id else None

    banned_maps = [
        map_name for map_name in
        (match.banned_maps or "").split(",")
        if map_name
    ]

    map_pool = [
        map_name for map_name in
        (
            match.map_pool
            or
            "aim_sk_ak_m4,awp_map,$2000$,de_dust2,cs_mansion"
        ).split(",")
        if map_name
    ]

    return {
        "id": match.id,

        "player1_id": match.player1_id,
        "player2_id": match.player2_id,

        "player1": player1.nickname if player1 else "TBD",
        "player2": player2.nickname if player2 else "TBD",

        "winner": winner.nickname if winner else None,

        "score": match.score,
        "elo_change": match.elo_change,
        "match_type": match.match_type,
        "season_id": match.season_id,

        "map_pool": map_pool,
        "banned_maps": banned_maps,
        "selected_map": match.selected_map,
        "veto_completed": match.veto_completed,
        "veto_turn": match.veto_turn
    }


@router.post("/recalculate")
def recalculate_all(

    admin: Player = Depends(
        admin_required
    ),
    db: Session = Depends(get_db)
):

    
    db.query(
        PlayerAchievement
    ).delete()

    db.commit()
    
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

    db.commit()

    matches = db.query(Match).order_by(
        Match.id.asc()
    ).all()

    for match in matches:

        winner, loser, _ = process_match_logic(
            match,
            db
        )

        check_achievements(
            db,
            winner
        )

        check_achievements(
            db,
            loser
        )
    db.commit()

    return {
        "message": "All ratings recalculated",
        "matches_processed": len(matches)
    }

@router.post("/create-placement-match")
def create_placement_match(

    player_id: int,
    opponent_id: int,

    admin: Player = Depends(
        admin_required
    ),

    db: Session = Depends(get_db)
):

    

    player = db.query(Player).filter(
        Player.id == player_id
    ).first()

    opponent = db.query(Player).filter(
        Player.id == opponent_id
    ).first()

    if not player or not opponent:

        raise HTTPException(
            status_code=404,
            detail="Player not found"
        )

    if player.id == opponent.id:

        raise HTTPException(
            status_code=400,
            detail="Player cannot play against himself"
        )

    if not player.is_placement:

        raise HTTPException(
            status_code=400,
            detail="Player already calibrated"
        )

    if not opponent.is_placement:

        raise HTTPException(
            status_code=400,
            detail="Opponent already calibrated"
        )

    # prevent duplicate pending match

    existing_match = db.query(Match).filter(

        (
            (
                Match.player1_id == player.id
            )

            &

            (
                Match.player2_id == opponent.id
            )
        )

        |

        (
            (
                Match.player1_id == opponent.id
            )

            &

            (
                Match.player2_id == player.id
            )
        ),

        Match.match_type == "Placement",

        Match.winner_id == None

    ).first()

    

    
    if existing_match:

        raise HTTPException(
            status_code=400,
            detail=(
                "Placement матч "
                "уже существует"
            )
        )
    
    
    
    active_season = db.query(Season).filter(
        Season.is_active == True
    ).first()

    if not active_season:

        raise HTTPException(
            status_code=400,
            detail="No active season"
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

    db.refresh(new_match)

    return {

        "message": "Placement match created",

        "match_id": new_match.id,

        "player": player.nickname,

        "opponent": opponent.nickname
    }

@router.post("/{match_id}/finish")
def finish_pending_match(

    match_id: int,
    winner_id: int,
    score: str,

    admin: Player = Depends(
        admin_required
    ),
    db: Session = Depends(get_db)
):

    

    match = db.query(Match).filter(
        Match.id == match_id
    ).first()

    if not match:

        raise HTTPException(
            status_code=404,
            detail="Match not found"
        )

    if match.winner_id:

        raise HTTPException(
            status_code=400,
            detail="Match already finished"
        )

    # validate winner

    if winner_id not in [
        match.player1_id,
        match.player2_id
    ]:

        raise HTTPException(
            status_code=400,
            detail="Invalid winner"
        )
    # validate score orientation

    try:

        p1_score = int(score.split(":")[0])

        p2_score = int(score.split(":")[1])

    except:

        raise HTTPException(
            status_code=400,
            detail="Неверный формат счёта"
        )

    # player1 selected as winner

    if (
        winner_id == match.player1_id
        and
        p1_score <= p2_score
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Недопустимый счёт "
                "для выбранного победителя"
            )
        )

    # player2 selected as winner

    if (
        winner_id == match.player2_id
        and
        p2_score <= p1_score
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Недопустимый счёт "
                "для выбранного победителя"
            )
        )
    # apply result

    match.winner_id = winner_id

    match.loser_id = (
        match.player2_id
        if winner_id == match.player1_id
        else match.player1_id
    )

    match.score = score

    # process elo

    winner, loser, elo_change = process_match_logic(
        match,
        db
    )

    match.elo_change = elo_change

    check_achievements(
        db,
        winner
    )

    check_achievements(
        db,
        loser
    )

    db.commit()

    return {

        "message": "Матч завершён",

        "winner": winner.nickname,

        "elo_change": elo_change,

        "score": score
    }


PLACEMENT_MAP_POOL = [

    "aim_sk_ak_m4",
    "awp_map",
    "$2000$",
    "de_dust2",
    "cs_mansion"
]





@router.post("/{match_id}/ban-map")
def ban_map(
    match_id: int,
    player_id: int,
    map_name: str,
    db: Session = Depends(get_db)
):

    

    current_player = db.query(Player).filter(
        Player.id == player_id
    ).first()

    match = db.query(Match).filter(
        Match.id == match_id
    ).first()

    if not match:

        raise HTTPException(
            status_code=404,
            detail="Матч не найден"
        )

    if match.veto_completed == "true":

        raise HTTPException(
            status_code=400,
            detail="Veto уже завершён"
        )

    if current_player.id not in [

        match.player1_id,
        match.player2_id

    ]:

        raise HTTPException(
            status_code=403,
            detail="Вы не участник матча"
        )

    banned = [

        m for m in
        match.banned_maps.split(",")

        if m
    ]

    if map_name in banned:

        raise HTTPException(
            status_code=400,
            detail="Карта уже забанена"
        )

    if map_name not in PLACEMENT_MAP_POOL:

        raise HTTPException(
            status_code=400,
            detail="Недопустимая карта"
        )

    expected_player = (

        match.player1_id

        if match.veto_turn % 2 == 1

        else match.player2_id
    )

    if current_player.id != expected_player:

        raise HTTPException(
            status_code=400,
            detail="Сейчас не ваш ход"
        )

    banned.append(map_name)

    match.banned_maps = ",".join(banned)
    remaining_maps = [

        m for m in PLACEMENT_MAP_POOL

        if m not in banned
    ]

    if len(remaining_maps) == 1:

        match.selected_map = remaining_maps[0]

        match.veto_completed = "true"
    

    match.veto_turn += 1

    
    db.commit()

    return {

        "message": "Карта забанена",

        "banned_maps": banned,

        "remaining_maps": remaining_maps,

        "selected_map": match.selected_map,

        "veto_completed": match.veto_completed
    }

