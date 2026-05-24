from sqlalchemy import Column, Integer, String, Float, Boolean

from app.database import Base


class Player(Base):

    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)

    nickname = Column(String, unique=True, nullable=False)

    
    email = Column(
        String,
        unique=True,
        nullable=True
    )

    password_hash = Column(
        String,
        nullable=True
    )

    role = Column(
        String,
        default="player"
    )
    


    elo = Column(Integer, default=1000)

    wins = Column(Integer, default=0)

    losses = Column(Integer, default=0)

    matches_played = Column(Integer, default=0)

    winrate = Column(Float, default=0)

    mvp = Column(Integer, default=0)

    streak = Column(Integer, default=0)

    peak_elo = Column(Integer, default=1000)

    rank = Column(String, default="Silver")

    placement_matches = Column(
        Integer,
        default=0
    )

    is_placement = Column(
        Boolean,
        default=True
    )

    placement_seed = Column(
        Integer,
        default=1000
    )