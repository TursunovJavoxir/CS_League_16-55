from datetime import datetime, timedelta

from jose import jwt, JWTError

from passlib.context import CryptContext

from fastapi import (
    Depends,
    HTTPException
)

from fastapi.security import (
    OAuth2PasswordBearer
)

from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models.player import Player


from app.config import (
    JWT_SECRET_KEY,
    JWT_ALGORITHM
)

ACCESS_TOKEN_EXPIRE_HOURS = 24


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


# -------------------------
# PASSWORD
# -------------------------

def hash_password(password: str):

    return pwd_context.hash(password)


def verify_password(

    plain_password: str,
    hashed_password: str

):

    return pwd_context.verify(
        plain_password,
        hashed_password
    )


# -------------------------
# JWT
# -------------------------

def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        hours=ACCESS_TOKEN_EXPIRE_HOURS
    )

    to_encode.update({
        "exp": expire
    })

    return jwt.encode(
        to_encode,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM
    )


def decode_access_token(token: str):

    try:

        payload = jwt.decode(

            token,

            JWT_SECRET_KEY,

            algorithms=[JWT_ALGORITHM]
        )

        return payload

    except JWTError:

        return None


# -------------------------
# DATABASE
# -------------------------

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()


# -------------------------
# CURRENT PLAYER
# -------------------------

def get_current_player(

    token: str = Depends(oauth2_scheme),

    db: Session = Depends(get_db)

):

    payload = decode_access_token(token)

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    player_id = payload.get("player_id")

    player = db.query(Player).filter(
        Player.id == player_id
    ).first()

    if not player:

        raise HTTPException(
            status_code=401,
            detail="Player not found"
        )

    return player


# -------------------------
# ADMIN REQUIRED
# -------------------------

def admin_required(

    current_player: Player = Depends(
        get_current_player
    )

):

    if current_player.role != "admin":

        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return current_player