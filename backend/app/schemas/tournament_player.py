from pydantic import BaseModel


class AddTournamentPlayerSchema(BaseModel):

    player_id: int