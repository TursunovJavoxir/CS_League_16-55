from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from app.database import Base


class SeasonReward(Base):

    __tablename__ = "season_rewards"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    player_id = Column(
        Integer,
        ForeignKey("players.id")
    )

    season_id = Column(
        Integer,
        ForeignKey("seasons.id")
    )

    title = Column(
        String,
        nullable=False
    )

    icon = Column(
        String,
        nullable=False
    )

    rarity = Column(
        String,
        default="common"
    )

    tournament_name = Column(
        String,
        nullable=True
    )

    tournament_id = Column(
        Integer,
        ForeignKey("tournaments.id"),
        nullable=True
    )