from sqlalchemy.orm import Session

from app.models.player import Player

from app.models.player_achievement import (
    PlayerAchievement
)


def has_achievement(
    db: Session,
    player_id: int,
    title: str
):

    existing = db.query(
        PlayerAchievement
    ).filter(

        PlayerAchievement.player_id == player_id,

        PlayerAchievement.title == title

    ).first()

    return existing is not None


def give_achievement(
    db: Session,
    player: Player,
    title: str,
    description: str,
    icon: str,
    rarity: str
):

    if has_achievement(
        db,
        player.id,
        title
    ):

        return

    achievement = PlayerAchievement(

        player_id=player.id,

        title=title,

        description=description,

        icon=icon,

        rarity=rarity
    )

    db.add(achievement)

    db.flush()


def check_achievements(
    db: Session,
    player: Player
):

    # -------------------------
    # FIRST WIN
    # -------------------------

    if player.wins >= 1:

        give_achievement(

            db,

            player,

            "First Victory",

            "Выиграть первый матч",

            "🏆",

            "common"
        )

    # -------------------------
    # WIN STREAK
    # -------------------------

    if player.streak >= 5:

        give_achievement(

            db,

            player,

            "Unstoppable",

            "Серия из 5 побед",

            "🔥",

            "rare"
        )

    # -------------------------
    # DIAMOND
    # -------------------------

    if player.rank == "Diamond":

        give_achievement(

            db,

            player,

            "Diamond Player",

            "Достичь ранга Diamond",

            "💎",

            "epic"
        )

    # -------------------------
    # ELITE
    # -------------------------

    if player.rank == "Elite":

        give_achievement(

            db,

            player,

            "Elite Legend",

            "Достичь ранга Elite",

            "👑",

            "legendary"
        )

    # -------------------------
    # 80% WINRATE
    # -------------------------

    if (
        player.matches_played >= 10
        and
        player.winrate >= 80
    ):

        give_achievement(

            db,

            player,

            "Sharpshooter",

            "Достичь 80% Winrate",

            "🎯",

            "epic"
        )