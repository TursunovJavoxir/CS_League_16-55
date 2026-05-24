from fastapi import FastAPI

from app.models.season_reward import SeasonReward
from fastapi.middleware.cors import (
    CORSMiddleware
)
from app.config import FRONTEND_URL
from sqlalchemy import text

from app.database import (
    engine,
    Base
)

from app.routes.auth import (
    router as auth_router
)

from app.routes.players import (
    router as players_router
)

from app.routes.matches import (
    router as matches_router
)





from app.routes.seasons import (
    router as seasons_router
)

from app.routes.tournaments import (
    router as tournaments_router
)

from app.routes.admin import (
    router as admin_router
)

from app.routes.activity import (
    router as activity_router
)

# -------------------------
# MODELS
# -------------------------

from app.models.user import User
from app.models.player import Player
from app.models.match import Match
from app.models.season import Season
from app.models.tournament import Tournament
from app.models.tournament_player import (
    TournamentPlayer
)
from app.models.tournament_match import (
    TournamentMatch
)
from app.models.tournament_bye import (
    TournamentBye
)

# -------------------------
# APP
# -------------------------

app = FastAPI()

# -------------------------
# CORS
# -------------------------

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        FRONTEND_URL
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],

)

# -------------------------
# DATABASE
# -------------------------

Base.metadata.create_all(
    bind=engine
)

from app.database import SessionLocal

db = SessionLocal()

existing_season = db.query(Season).filter(
    Season.is_active == True
).first()

if not existing_season:

    default_season = Season(

        name="Season 1",

        is_active=True
    )

    db.add(default_season)

    db.commit()

db.close()

# -------------------------
# ROUTES
# -------------------------

app.include_router(auth_router)

app.include_router(players_router)

app.include_router(matches_router)

app.include_router(seasons_router)

app.include_router(tournaments_router)

app.include_router(admin_router)

app.include_router(activity_router)

# -------------------------
# ROOT
# -------------------------

@app.get("/")
def root():

    return {

        "message":
            "CS League API is running"
    }

# -------------------------
# DATABASE TEST
# -------------------------

@app.get("/test-db")
def test_db():

    with engine.connect() as connection:

        connection.execute(
            text("SELECT 1")
        )

    return {

        "database": "connected"
    }