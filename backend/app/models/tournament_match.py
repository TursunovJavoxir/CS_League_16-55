from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from app.database import Base


class TournamentMatch(Base):

    __tablename__ = "tournament_matches"

    id = Column(
        Integer,
        primary_key=True
    )

    tournament_id = Column(
        Integer,
        ForeignKey("tournaments.id")
    )

    player1_id = Column(
        Integer,
        ForeignKey("players.id"),
        nullable=True
    )

    player2_id = Column(
        Integer,
        ForeignKey("players.id"),
        nullable=True
    )

    winner_id = Column(
        Integer,
        ForeignKey("players.id"),
        nullable=True
    )

    score = Column(
        String,
        nullable=True
    )

    round = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        default="pending"
    )

    next_match_id = Column(
        Integer,
        ForeignKey("tournament_matches.id"),
        nullable=True
    )

    next_match_slot = Column(
        Integer,
        nullable=True
    )