from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from app.database import Base


class Tournament(Base):

    __tablename__ = "tournaments"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        default="upcoming"
    )

    winner = Column(
        String,
        nullable=True
    )

    season_id = Column(
        Integer,
        ForeignKey("seasons.id"),
        nullable=True
    )

    bye_players = Column(
        String,
        nullable=True
    )