from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from app.database import Base


class Match(Base):

    __tablename__ = "matches"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    player1_id = Column(
        Integer,
        ForeignKey("players.id")
    )

    player2_id = Column(
        Integer,
        ForeignKey("players.id")
    )

    winner_id = Column(
        Integer,
        ForeignKey("players.id")
    )

    loser_id = Column(
        Integer,
        ForeignKey("players.id")
    )

    score = Column(
        String,
        nullable=False
    )

    elo_change = Column(
        String,
        default="+0 / -0"
    )

    match_type = Column(
        String,
        default="1x1"
    )

    
    map_pool = Column(
        String,
        default=
            "aim_sk_ak_m4,"
            "awp_map,"
            "$2000$,"
            "de_dust2,"
            "cs_mansion"
    )

    banned_maps = Column(
        String,
        default=""
    )

    selected_map = Column(
        String,
        nullable=True
    )

    veto_completed = Column(
        String,
        default="false"
    )

    veto_turn = Column(
        Integer,
        default=1
    )
    


    season_id = Column(
        Integer,
        ForeignKey("seasons.id"),
        nullable=True
    )