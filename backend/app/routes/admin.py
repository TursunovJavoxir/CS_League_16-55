from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.player import Player
from app.models.match import Match
from app.models.tournament import Tournament
from app.models.tournament_match import TournamentMatch
from app.models.tournament_player import TournamentPlayer
from app.models.tournament_bye import TournamentBye
from app.models.player_achievement import (PlayerAchievement)
from app.models.season_reward import (SeasonReward)
from app.models.season import Season

from app.auth import (
    admin_required
)

from app.models.player import Player

router = APIRouter(prefix="/admin")


@router.post("/reset")
@router.post("/reset")
def full_reset(

    admin: Player = Depends(
        admin_required
    ),

    db: Session = Depends(get_db)

):

    

    # -------------------------
    # DELETE TOURNAMENT DATA
    # -------------------------

    db.query(TournamentMatch).delete()

    db.query(TournamentBye).delete()

    db.query(TournamentPlayer).delete()

    db.query(Tournament).delete()
    
    # -------------------------
    # DELETE Season DATA
    # -------------------------
    db.query(Season).delete()

    # -------------------------
    # DELETE SeasonReward DATA
    # -------------------------
    db.query(SeasonReward).delete()
    # -------------------------
    # DELETE MATCH HISTORY
    # -------------------------
    

    db.query(Match).delete()
    db.query(
        PlayerAchievement
    ).delete()
    # -------------------------
    # RESET PLAYERS
    # -------------------------

    players = db.query(Player).all()

    for player in players:

        player.elo = 1000

        player.wins = 0

        player.losses = 0

        player.matches_played = 0

        player.winrate = 0

        player.mvp = 0

        player.streak = 0

        player.peak_elo = 1000

        player.rank = "Silver"

        player.placement_matches = 0

        player.is_placement = True

        player.placement_seed = 1000

    db.commit()

    

    return {

        "message": "Competitive system fully reset"

    }