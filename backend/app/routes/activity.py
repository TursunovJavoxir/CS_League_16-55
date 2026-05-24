from fastapi import APIRouter, HTTPException, Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.match import Match
from app.models.player import Player
from app.models.player_achievement import (
    PlayerAchievement
)
from app.models.tournament import Tournament

router = APIRouter(prefix="/activity")


@router.get("/")
def get_activity_feed(
    db: Session = Depends(get_db)
):

    feed = []

    # -------------------------
    # RECENT MATCHES
    # -------------------------

    recent_matches = db.query(Match).filter(
        Match.winner_id != None
    ).order_by(
        Match.id.desc()
    ).limit(10).all()

    for match in recent_matches:

        winner = db.query(Player).filter(
            Player.id == match.winner_id
        ).first()

        loser_id = (
            match.player2_id
            if match.winner_id == match.player1_id
            else match.player1_id
        )

        loser = db.query(Player).filter(
            Player.id == loser_id
        ).first()

        if not winner or not loser:

            continue

        feed.append({

            "type": "match",

            "title":
                f"{winner.nickname} победил {loser.nickname}",

            "subtitle":
                f"{match.match_type} • {match.score}",

            "icon": "⚔️",

            "timestamp": match.id
        })

    # -------------------------
    # ACHIEVEMENTS
    # -------------------------

    achievements = db.query(
        PlayerAchievement
    ).order_by(
        PlayerAchievement.id.desc()
    ).limit(10).all()

    for achievement in achievements:

        player = db.query(Player).filter(
            Player.id == achievement.player_id
        ).first()

        feed.append({

            "type": "achievement",

            "title":
                f"{player.nickname} получил достижение",

            "subtitle":
                achievement.title,

            "icon": achievement.icon,

            "timestamp": achievement.id + 100000
        })

    # -------------------------
    # TOURNAMENTS
    # -------------------------

    tournaments = db.query(
        Tournament
    ).filter(
        Tournament.status == "finished"
    ).order_by(
        Tournament.id.desc()
    ).limit(5).all()

    for tournament in tournaments:

        feed.append({

            "type": "tournament",

            "title":
                f"{tournament.winner} выиграл турнир",

            "subtitle":
                tournament.name,

            "icon": "🏆",

            "timestamp": tournament.id + 200000
        })

    # -------------------------
    # SORT
    # -------------------------

    feed.sort(
        key=lambda x: x["timestamp"],
        reverse=True
    )

    return feed[:20]