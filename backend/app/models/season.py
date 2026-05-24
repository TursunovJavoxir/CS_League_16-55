from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey
)

from app.database import Base


class Season(Base):

    __tablename__ = "seasons"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        unique=True,
        nullable=False
    )

    is_active = Column(
        Boolean,
        default=True
    )

    champion_id = Column(
        Integer,
        ForeignKey("players.id"),
        nullable=True
    )

    champion_elo = Column(Integer, nullable=True)
    champion_rank = Column(String, nullable=True)