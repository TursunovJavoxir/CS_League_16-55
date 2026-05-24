from pydantic import BaseModel


class CreateTournamentMatchSchema(BaseModel):

    player1_id: int

    player2_id: int

    round: str