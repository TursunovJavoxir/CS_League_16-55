from fastapi import APIRouter, HTTPException, Depends

from pydantic import BaseModel

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.player import Player

from app.auth import (
    hash_password,
    verify_password,
    create_access_token
)


router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


class RegisterSchema(BaseModel):

    nickname: str
    email: str
    password: str


class LoginSchema(BaseModel):

    email: str
    password: str


@router.post("/register")
def register(
    data: RegisterSchema,
    db: Session = Depends(get_db)
):

    email = data.email.lower()
    
    existing_nickname = db.query(Player).filter(
        Player.nickname.ilike(data.nickname)
    ).first()

    if existing_nickname:

        raise HTTPException(
            status_code=400,
            detail="Никнейм уже занят"
        )

    existing_email = db.query(Player).filter(
        Player.email == email
    ).first()

    if existing_email:

        raise HTTPException(
            status_code=400,
            detail="Email уже используется"
        )

    hashed_password = hash_password(
        data.password
    )

    new_player = Player(

        nickname=data.nickname,

        email=email,

        password_hash=hashed_password,

        role="player"
    )

    db.add(new_player)

    db.commit()

    db.refresh(new_player)

    token = create_access_token({

        "player_id": new_player.id,

        "role": new_player.role
    })

    return {

        "message": "Регистрация успешна",

        "token": token,

        "player": {

            "id": new_player.id,

            "nickname": new_player.nickname,

            "email": new_player.email,

            "role": new_player.role
        }
    }


@router.post("/login")
def login(
    data: LoginSchema,
    db: Session = Depends(get_db)
):

    email = data.email.lower()

    player = db.query(Player).filter(
        Player.email == email
    ).first()
    if not player:

        raise HTTPException(
            status_code=401,
            detail="Неверный email или пароль"
        )

    valid_password = verify_password(

        data.password,
        player.password_hash
    )

    if not valid_password:

        raise HTTPException(
            status_code=401,
            detail="Неверный email или пароль"
        )

    token = create_access_token({

        "player_id": player.id,

        "role": player.role
    })

    return {

        "message": "Вход выполнен",

        "token": token,

        "player": {

            "id": player.id,

            "nickname": player.nickname,

            "email": player.email,

            "role": player.role
        }
    }
