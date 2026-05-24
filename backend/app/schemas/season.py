from pydantic import BaseModel


class CreateSeasonSchema(BaseModel):

    name: str