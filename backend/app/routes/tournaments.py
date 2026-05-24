from fastapi import APIRouter, HTTPException, Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.tournament import Tournament
from app.models.season import Season
from app.models.player import Player
from app.models.tournament_player import TournamentPlayer
from app.models.tournament_match import TournamentMatch

from app.models.match import Match

from app.routes.matches import process_match_logic

from app.utils.achievements import (
    give_achievement
)
from app.schemas.tournament import CreateTournamentSchema
from app.schemas.tournament_match import CreateTournamentMatchSchema

from app.auth import (
    admin_required
)

from fastapi import Depends



router = APIRouter(prefix="/tournaments")


@router.post("/")
def create_tournament(

    tournament: CreateTournamentSchema,

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

    new_tournament = Tournament(

        name=tournament.name,

        season_id=active_season.id
    )

    db.add(new_tournament)

    db.commit()

    db.refresh(new_tournament)

    return {
        "message": "Tournament created",
        "tournament": new_tournament.name,
        "season": active_season.name
    }


@router.get("/")
def get_tournaments(
    db: Session = Depends(get_db)
):

    

    tournaments = db.query(Tournament).order_by(
        Tournament.id.asc()
    ).all()

    result = []

    for tournament in tournaments:

        result.append({
            "id": tournament.id,
            "name": tournament.name,
            "status": tournament.status,
            "winner": tournament.winner,
            "season_id": tournament.season_id,
            "bye_players":
                tournament.bye_players.split(",")
                if tournament.bye_players
                else []
        })

    return result


@router.get("/{tournament_id}")
def get_tournament(
    tournament_id: int,
    db: Session = Depends(get_db)
):

    

    tournament = db.query(Tournament).filter(
        Tournament.id == tournament_id
    ).first()

    if not tournament:
        raise HTTPException(
            status_code=404,
            detail="Tournament not found"
        )
        
    return {
        "id": tournament.id,
        "name": tournament.name,
        "status": tournament.status,
        "winner": tournament.winner,
        "season_id": tournament.season_id,
        "bye_players":
            tournament.bye_players.split(",")
            if tournament.bye_players
            else []
    }


@router.post("/{tournament_id}/players/{player_id}")
def add_player_to_tournament(
    tournament_id: int,
    player_id: int,

    admin: Player = Depends(
        admin_required
    ),

    db: Session = Depends(get_db)
):

    

    tournament = db.query(Tournament).filter(
        Tournament.id == tournament_id
    ).first()

    if not tournament:
        raise HTTPException(
            status_code=404,
            detail="Tournament not found"
        )
    
    existing_matches = db.query(TournamentMatch).filter(
        TournamentMatch.tournament_id == tournament_id
    ).first()

    if existing_matches:
        raise HTTPException(
            status_code=400,
            detail="Bracket already generated"
        )

    player = db.query(Player).filter(
        Player.id == player_id
    ).first()

    if not player:
        raise HTTPException(
            status_code=404,
            detail="Player not found"
        )

    existing = db.query(TournamentPlayer).filter(
        TournamentPlayer.tournament_id == tournament.id,
        TournamentPlayer.player_id == player.id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Player already added"
        )

    tp = TournamentPlayer(
        tournament_id=tournament.id,
        player_id=player.id
    )

    db.add(tp)

    db.commit()

    return {
        "message": "Player added"
    }


@router.post("/{tournament_id}/add-all-players")
def add_all_players(
    tournament_id: int,
    

    admin: Player = Depends(
        admin_required
    ),

    db: Session = Depends(get_db)
):

    

    tournament = db.query(Tournament).filter(
        Tournament.id == tournament_id
    ).first()

    if not tournament:
        raise HTTPException(
            status_code=404,
            detail="Tournament not found"
        )
    
    existing_matches = db.query(TournamentMatch).filter(
        TournamentMatch.tournament_id == tournament_id
    ).first()

    if existing_matches:
        raise HTTPException(
            status_code=400,
            detail="Bracket already generated"
        )

    players = db.query(Player).all()

    added = 0

    for player in players:

        existing = db.query(
            TournamentPlayer
        ).filter(
            TournamentPlayer.tournament_id == tournament_id,
            TournamentPlayer.player_id == player.id
        ).first()

        if existing:
            continue

        tp = TournamentPlayer(
            tournament_id=tournament_id,
            player_id=player.id
        )

        db.add(tp)

        added += 1

    db.commit()

    return {
        "message": f"{added} players added"
    }


@router.get("/{tournament_id}/players")
def get_tournament_players(
    tournament_id: int,
    db: Session = Depends(get_db)
):

    

    players = db.query(TournamentPlayer).filter(
        TournamentPlayer.tournament_id == tournament_id
    ).all()

    result = []

    for tp in players:

        player = db.query(Player).filter(
            Player.id == tp.player_id
        ).first()

        result.append({
            "id": player.id,
            "nickname": player.nickname,
            "elo": player.elo,
            "rank": player.rank
        })

    return result


@router.get("/{tournament_id}/matches")
def get_tournament_matches(
    tournament_id: int,
    db: Session = Depends(get_db)
):

    

    matches = db.query(TournamentMatch).filter(
        TournamentMatch.tournament_id == tournament_id
    ).order_by(
        TournamentMatch.id.asc()
    ).all()

    result = []

    for match in matches:

        player1 = None
        player2 = None
        winner = None

        if match.player1_id:

            player1_obj = db.query(Player).filter(
                Player.id == match.player1_id
            ).first()

            if player1_obj:
                player1 = player1_obj.nickname

        if match.player2_id:

            player2_obj = db.query(Player).filter(
                Player.id == match.player2_id
            ).first()

            if player2_obj:
                player2 = player2_obj.nickname

        if match.winner_id:

            winner_obj = db.query(Player).filter(
                Player.id == match.winner_id
            ).first()

            if winner_obj:
                winner = winner_obj.nickname

        result.append({
            "id": match.id,
            "player1": player1,
            "player2": player2,
            "winner": winner,
            "score": match.score,
            "round": match.round,
            "status": match.status,
            "next_match_id": match.next_match_id,
            "next_match_slot": match.next_match_slot,
        })

    return result


@router.post("/{tournament_id}/generate-bracket")
def generate_bracket(

    tournament_id: int,

    admin: Player = Depends(
        admin_required
    ),
    db: Session = Depends(get_db)
):

    

    tournament = db.query(Tournament).filter(
        Tournament.id == tournament_id
    ).first()

    if not tournament:
        raise HTTPException(
            status_code=404,
            detail="Tournament not found"
        )

    existing_matches = db.query(
        TournamentMatch
    ).filter(
        TournamentMatch.tournament_id == tournament_id
    ).first()

    if existing_matches:
        raise HTTPException(
            status_code=400,
            detail="Bracket already generated"
        )

    tournament_players = db.query(
        TournamentPlayer
    ).filter(
        TournamentPlayer.tournament_id == tournament_id
    ).all()

    players = []

    for tp in tournament_players:

        player = db.query(Player).filter(
            Player.id == tp.player_id
        ).first()

        players.append(player)

    players.sort(
        key=lambda p: p.elo,
        reverse=True
    )

    total_players = len(players)

    if total_players < 4:
        raise HTTPException(
            status_code=400,
            detail="Minimum 4 players required"
        )
    
    next_bracket_size = 1

    while next_bracket_size < total_players:
        next_bracket_size *= 2

    bye_count = next_bracket_size - total_players

    bye_players = players[:bye_count]

    normal_players = players[bye_count:]

    tournament.bye_players = ",".join(
        [p.nickname for p in bye_players]
    )

    db.commit()

    qualification_matches = []

    if total_players not in [8, 16]:

        for i in range(0, len(normal_players), 2):

            if i + 1 >= len(normal_players):
                break

            match = TournamentMatch(
                tournament_id=tournament_id,
                player1_id=normal_players[i].id,
                player2_id=normal_players[i + 1].id,
                round="Qualification",
                status="pending"
            )

            db.add(match)

            qualification_matches.append(match)

        db.commit()

        # -------------------------
    # CREATE BRACKET ROUNDS
    # -------------------------

    quarterfinal_matches = []
    semifinal_matches = []

        # =====================================
    # 5 PLAYERS
    # =====================================

    if total_players == 5:

        # -------------------------
        # QUARTERFINALS
        # -------------------------

        # QF1
        qf1 = TournamentMatch(
            tournament_id=tournament_id,
            round="Quarterfinal",
            status="waiting",
            player1_id=bye_players[0].id
        )

        db.add(qf1)

        # QF2
        qf2 = TournamentMatch(
            tournament_id=tournament_id,
            round="Quarterfinal",
            status="pending",
            player1_id=bye_players[1].id,
            player2_id=bye_players[2].id
        )

        db.add(qf2)

        db.commit()

        # qualification winner -> qf1

        qualification_matches[0].next_match_id = qf1.id
        qualification_matches[0].next_match_slot = 2

        db.commit()

        # -------------------------
        # FINAL
        # -------------------------

        final_match = TournamentMatch(
            tournament_id=tournament_id,
            round="Grand Final",
            status="waiting"
        )

        db.add(final_match)

        db.commit()

        qf1.next_match_id = final_match.id
        qf1.next_match_slot = 1

        qf2.next_match_id = final_match.id
        qf2.next_match_slot = 2

        db.commit()

    # =====================================
    # 6 PLAYERS
    # =====================================

    elif total_players == 6:

        quarterfinal_matches = []

        for _ in range(2):

            match = TournamentMatch(
                tournament_id=tournament_id,
                round="Quarterfinal",
                status="waiting"
            )

            db.add(match)

            quarterfinal_matches.append(match)

        db.commit()

        quarterfinal_matches[0].player1_id = bye_players[0].id
        quarterfinal_matches[1].player1_id = bye_players[1].id

        db.commit()

        qualification_matches[0].next_match_id = quarterfinal_matches[0].id
        qualification_matches[0].next_match_slot = 2

        qualification_matches[1].next_match_id = quarterfinal_matches[1].id
        qualification_matches[1].next_match_slot = 2

        db.commit()

        final_match = TournamentMatch(
            tournament_id=tournament_id,
            round="Grand Final",
            status="waiting"
        )

        db.add(final_match)

        db.commit()

        quarterfinal_matches[0].next_match_id = final_match.id
        quarterfinal_matches[0].next_match_slot = 1

        quarterfinal_matches[1].next_match_id = final_match.id
        quarterfinal_matches[1].next_match_slot = 2

        db.commit()

        # =====================================
        # 7-8 PLAYERS
        # =====================================
    elif total_players == 8:

        quarterfinal_matches = []

        for i in range(0, 8, 2):

            match = TournamentMatch(
                tournament_id=tournament_id,
                player1_id=players[i].id,
                player2_id=players[i + 1].id,
                round="Quarterfinal",
                status="pending"
            )

            db.add(match)

            quarterfinal_matches.append(match)

        db.commit()

        semifinal1 = TournamentMatch(
            tournament_id=tournament_id,
            round="Semifinal",
            status="waiting"
        )

        semifinal2 = TournamentMatch(
            tournament_id=tournament_id,
            round="Semifinal",
            status="waiting"
        )

        db.add(semifinal1)
        db.add(semifinal2)

        db.commit()

        quarterfinal_matches[0].next_match_id = semifinal1.id
        quarterfinal_matches[0].next_match_slot = 1

        quarterfinal_matches[1].next_match_id = semifinal1.id
        quarterfinal_matches[1].next_match_slot = 2

        quarterfinal_matches[2].next_match_id = semifinal2.id
        quarterfinal_matches[2].next_match_slot = 1

        quarterfinal_matches[3].next_match_id = semifinal2.id
        quarterfinal_matches[3].next_match_slot = 2

        db.commit()

        grand_final = TournamentMatch(
            tournament_id=tournament_id,
            round="Grand Final",
            status="waiting"
        )

        db.add(grand_final)

        db.commit()

        semifinal1.next_match_id = grand_final.id
        semifinal1.next_match_slot = 1

        semifinal2.next_match_id = grand_final.id
        semifinal2.next_match_slot = 2

        db.commit()


    elif total_players == 7:

        quarterfinal_matches = []

        for _ in range(4):

            match = TournamentMatch(
                tournament_id=tournament_id,
                round="Quarterfinal",
                status="waiting"
            )

            db.add(match)

            quarterfinal_matches.append(match)

        db.commit()

        for index, player in enumerate(bye_players):

            if index >= 4:
                break

            quarterfinal_matches[index].player1_id = player.id

        db.commit()

        qualification_index = 0

        for index, qf in enumerate(quarterfinal_matches):

            if index < bye_count:

                qualification_matches[
                    qualification_index
                ].next_match_id = qf.id

                qualification_matches[
                    qualification_index
                ].next_match_slot = 2

                qualification_index += 1

            else:

                qualification_matches[
                    qualification_index
                ].next_match_id = qf.id

                qualification_matches[
                    qualification_index
                ].next_match_slot = 1

                qualification_index += 1

                if qualification_index < len(qualification_matches):

                    qualification_matches[
                        qualification_index
                    ].next_match_id = qf.id

                    qualification_matches[
                        qualification_index
                    ].next_match_slot = 2

                    qualification_index += 1

        db.commit()

        semifinal1 = TournamentMatch(
            tournament_id=tournament_id,
            round="Semifinal",
            status="waiting"
        )

        semifinal2 = TournamentMatch(
            tournament_id=tournament_id,
            round="Semifinal",
            status="waiting"
        )

        db.add(semifinal1)
        db.add(semifinal2)

        db.commit()

        quarterfinal_matches[0].next_match_id = semifinal1.id
        quarterfinal_matches[0].next_match_slot = 1

        quarterfinal_matches[1].next_match_id = semifinal1.id
        quarterfinal_matches[1].next_match_slot = 2

        quarterfinal_matches[2].next_match_id = semifinal2.id
        quarterfinal_matches[2].next_match_slot = 1

        quarterfinal_matches[3].next_match_id = semifinal2.id
        quarterfinal_matches[3].next_match_slot = 2

        db.commit()

        grand_final = TournamentMatch(
            tournament_id=tournament_id,
            round="Grand Final",
            status="waiting"
        )

        db.add(grand_final)

        db.commit()

        semifinal1.next_match_id = grand_final.id
        semifinal1.next_match_slot = 1

        semifinal2.next_match_id = grand_final.id
        semifinal2.next_match_slot = 2

        db.commit()

    

        # =====================================
        # 9-11 PLAYERS
        # =====================================

    elif total_players >= 9 and total_players <= 15:

        quarterfinal_matches = []

        for _ in range(4):

            match = TournamentMatch(
                tournament_id=tournament_id,
                round="Quarterfinal",
                status="waiting"
            )

            db.add(match)

            quarterfinal_matches.append(match)

        db.commit()

        qf_index = 0
        qualification_index = 0
        bye_index = 0

        # BYE vs Qualification Winner
        while (
            bye_index < len(bye_players)
            and
            qualification_index < len(qualification_matches)
            and
            qf_index < 4
        ):

            quarterfinal_matches[qf_index].player1_id = bye_players[bye_index].id

            qualification_matches[qualification_index].next_match_id = quarterfinal_matches[qf_index].id
            qualification_matches[qualification_index].next_match_slot = 2

            bye_index += 1
            qualification_index += 1
            qf_index += 1

        # Qualification Winner vs Qualification Winner
        while (
            qualification_index < len(qualification_matches)
            and
            qf_index < 4
        ):

            qualification_matches[qualification_index].next_match_id = quarterfinal_matches[qf_index].id
            qualification_matches[qualification_index].next_match_slot = 1

            qualification_index += 1

            if qualification_index < len(qualification_matches):

                qualification_matches[qualification_index].next_match_id = quarterfinal_matches[qf_index].id
                qualification_matches[qualification_index].next_match_slot = 2

                qualification_index += 1

            qf_index += 1

        # Remaining BYE vs BYE
        while (
            bye_index + 1 < len(bye_players)
            and
            qf_index < 4
        ):

            quarterfinal_matches[qf_index].player1_id = bye_players[bye_index].id
            quarterfinal_matches[qf_index].player2_id = bye_players[bye_index + 1].id
            quarterfinal_matches[qf_index].status = "pending"

            bye_index += 2
            qf_index += 1

        db.commit()

        semifinal1 = TournamentMatch(
            tournament_id=tournament_id,
            round="Semifinal",
            status="waiting"
        )

        semifinal2 = TournamentMatch(
            tournament_id=tournament_id,
            round="Semifinal",
            status="waiting"
        )

        db.add(semifinal1)
        db.add(semifinal2)

        db.commit()

        quarterfinal_matches[0].next_match_id = semifinal1.id
        quarterfinal_matches[0].next_match_slot = 1

        quarterfinal_matches[1].next_match_id = semifinal1.id
        quarterfinal_matches[1].next_match_slot = 2

        quarterfinal_matches[2].next_match_id = semifinal2.id
        quarterfinal_matches[2].next_match_slot = 1

        quarterfinal_matches[3].next_match_id = semifinal2.id
        quarterfinal_matches[3].next_match_slot = 2

        db.commit()

        grand_final = TournamentMatch(
            tournament_id=tournament_id,
            round="Grand Final",
            status="waiting"
        )

        db.add(grand_final)

        db.commit()

        semifinal1.next_match_id = grand_final.id
        semifinal1.next_match_slot = 1

        semifinal2.next_match_id = grand_final.id
        semifinal2.next_match_slot = 2

        db.commit()        
        # =====================================
    # 16 PLAYERS
    # =====================================

    elif total_players == 16:

        round16_matches = []

        for i in range(0, 16, 2):

            match = TournamentMatch(
                tournament_id=tournament_id,
                player1_id=players[i].id,
                player2_id=players[i + 1].id,
                round="Round of 16",
                status="pending"
            )

            db.add(match)

            round16_matches.append(match)

        db.commit()

        # -------------------------
        # QUARTERFINALS
        # -------------------------

        quarterfinal_matches = []

        for _ in range(4):

            match = TournamentMatch(
                tournament_id=tournament_id,
                round="Quarterfinal",
                status="waiting"
            )

            db.add(match)

            quarterfinal_matches.append(match)

        db.commit()

        for i in range(4):

            round16_matches[i * 2].next_match_id = quarterfinal_matches[i].id
            round16_matches[i * 2].next_match_slot = 1

            round16_matches[i * 2 + 1].next_match_id = quarterfinal_matches[i].id
            round16_matches[i * 2 + 1].next_match_slot = 2

        db.commit()

        # -------------------------
        # SEMIFINALS
        # -------------------------

        semifinal1 = TournamentMatch(
            tournament_id=tournament_id,
            round="Semifinal",
            status="waiting"
        )

        semifinal2 = TournamentMatch(
            tournament_id=tournament_id,
            round="Semifinal",
            status="waiting"
        )

        db.add(semifinal1)
        db.add(semifinal2)

        db.commit()

        quarterfinal_matches[0].next_match_id = semifinal1.id
        quarterfinal_matches[0].next_match_slot = 1

        quarterfinal_matches[1].next_match_id = semifinal1.id
        quarterfinal_matches[1].next_match_slot = 2

        quarterfinal_matches[2].next_match_id = semifinal2.id
        quarterfinal_matches[2].next_match_slot = 1

        quarterfinal_matches[3].next_match_id = semifinal2.id
        quarterfinal_matches[3].next_match_slot = 2

        db.commit()

        # -------------------------
        # GRAND FINAL
        # -------------------------

        grand_final = TournamentMatch(
            tournament_id=tournament_id,
            round="Grand Final",
            status="waiting"
        )

        db.add(grand_final)

        db.commit()

        semifinal1.next_match_id = grand_final.id
        semifinal1.next_match_slot = 1

        semifinal2.next_match_id = grand_final.id
        semifinal2.next_match_slot = 2

        db.commit()

    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported tournament size"
        )


    tournament.status = "active"

    db.commit()

    return {
        "message": "Bracket generated",
        "bye_players": [
            p.nickname
            for p in bye_players
        ]
    }

@router.post("/{tournament_id}/matches/{match_id}/finish")
def finish_match( 
    
    tournament_id: int,
    match_id: int,
    winner_id: int,
    score: str,

    admin: Player = Depends(
        admin_required
    ),
    db: Session = Depends(get_db)
    
):

    

    match = db.query(TournamentMatch).filter(
        TournamentMatch.id == match_id,
        TournamentMatch.tournament_id == tournament_id
    ).first()

    if not match:
        raise HTTPException(
            status_code=404,
            detail="Match not found"
        )
    if match.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Match is not active"
        )

    winner = db.query(Player).filter(
        Player.id == winner_id
    ).first()

    if not winner:
        raise HTTPException(
            status_code=404,
            detail="Winner not found"
        )

    if match.status == "finished":

        raise HTTPException(
            status_code=400,
            detail="Match already finished"
        )
    if winner_id not in [
        match.player1_id,
        match.player2_id
    ]:

        raise HTTPException(
            status_code=400,
            detail="Invalid winner"
        )
    # -------------------------
    # SCORE VALIDATION
    # -------------------------

    separator = ":"

    if "-" in score:
        separator = "-"

    parts = score.split(separator)

    if len(parts) != 2:

        raise HTTPException(
            status_code=400,
            detail="Invalid score format"
        )

    try:

        score1 = int(parts[0])
        score2 = int(parts[1])

    except:

        raise HTTPException(
            status_code=400,
            detail="Score must contain numbers"
        )

    if score1 == score2:

        raise HTTPException(
            status_code=400,
            detail="Draws are not allowed"
        )

    real_winner_id = (
        match.player1_id
        if score1 > score2
        else match.player2_id
    )

    if winner_id != real_winner_id:

        raise HTTPException(
            status_code=400,
            detail="Winner does not match score"
        )

    match.winner_id = winner_id
    match.score = score
    match.status = "finished"
    # -------------------------
    # AUTO ADVANCE WINNER
    # -------------------------

    if match.next_match_id:

        next_match = db.query(
            TournamentMatch
        ).filter(
            TournamentMatch.id == match.next_match_id
        ).first()

        if next_match:

            if match.next_match_slot == 1:

                next_match.player1_id = winner_id

            elif match.next_match_slot == 2:

                next_match.player2_id = winner_id

            # activate match if ready

            if (
                next_match.player1_id
                and next_match.player2_id
            ):

                next_match.status = "pending"

    # -------------------------
    # TOURNAMENT FINISH
    # -------------------------

    if match.round == "Grand Final":

        tournament = db.query(Tournament).filter(
            Tournament.id == tournament_id
        ).first()

        if tournament:

            tournament.status = "finished"

            tournament.winner = winner.nickname

            give_achievement(

                db,

                winner,

                "Tournament Champion",

                "Выиграть турнир",

                "👑",

                "legendary"
            )

    # -------------------------
    # CREATE RANKED MATCH
    # -------------------------

    active_season = db.query(Season).filter(
        Season.is_active == True
    ).first()

    ranked_match = Match(

        player1_id=match.player1_id,

        player2_id=match.player2_id,

        winner_id=winner_id,

        loser_id=(
            match.player2_id
            if winner_id == match.player1_id
            else match.player1_id
        ),

        score=score,

        match_type=(
            "Final"
            if match.round == "Grand Final"
            else "BO3"
            if match.round == "Semifinal"
            else "1x1"
        ),

        season_id=active_season.id
    )

    winner_player, loser_player, elo_change = process_match_logic(
        ranked_match,
        db
    )

    ranked_match.elo_change = elo_change

    db.add(ranked_match)

    db.commit()

    return {

        "message": "Match finished",

        "winner": winner.nickname,

        "elo_change": elo_change
    }