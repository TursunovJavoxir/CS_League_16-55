def get_k_factor(match_type: str):

    match_type = match_type.lower()

    if match_type == "placement":
        return 60

    if match_type == "bo3":
        return 40

    if match_type == "fast cup":
        return 45

    if match_type == "final":
        return 50

    return 32


def calculate_expected(player_elo, opponent_elo):

    return 1 / (
        1 + 10 ** ((opponent_elo - player_elo) / 400)
    )


def calculate_new_elo(
    player_elo,
    opponent_elo,
    score,
    k
):

    expected = calculate_expected(
        player_elo,
        opponent_elo
    )

    new_elo = player_elo + k * (score - expected)

    return round(new_elo)


def get_rank(elo: int):

    if elo < 900:
        return "Bronze"

    if elo < 1100:
        return "Silver"

    if elo < 1300:
        return "Gold"

    if elo < 1500:
        return "Platinum"

    if elo < 1800:
        return "Diamond"

    return "Elite"