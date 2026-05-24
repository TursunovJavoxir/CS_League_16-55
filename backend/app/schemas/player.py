from pydantic import BaseModel


class CreatePlayerSchema(BaseModel):

    nickname: str