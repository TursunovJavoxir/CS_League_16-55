from pydantic import BaseModel


class CreateMatchSchema(BaseModel):

    player1_id: int

    player2_id: int

    score: str

    match_type: str = "1x1"

    selected_map: str | None = None