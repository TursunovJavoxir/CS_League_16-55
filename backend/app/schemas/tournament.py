from pydantic import BaseModel


class CreateTournamentSchema(BaseModel):

    name: str