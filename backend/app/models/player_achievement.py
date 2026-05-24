from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime
)

from datetime import datetime

from app.database import Base


class PlayerAchievement(Base):

    __tablename__ = "player_achievements"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    player_id = Column(
        Integer,
        ForeignKey("players.id")
    )

    title = Column(String)

    description = Column(String)

    icon = Column(String)

    rarity = Column(String)

    unlocked_at = Column(
        DateTime,
        default=datetime.utcnow
    )