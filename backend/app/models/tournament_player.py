from sqlalchemy import (
    Column,
    Integer,
    ForeignKey
)

from app.database import Base


class TournamentPlayer(Base):

    __tablename__ = "tournament_players"

    id = Column(Integer, primary_key=True)

    tournament_id = Column(
        Integer,
        ForeignKey("tournaments.id")
    )

    player_id = Column(
        Integer,
        ForeignKey("players.id")
    )