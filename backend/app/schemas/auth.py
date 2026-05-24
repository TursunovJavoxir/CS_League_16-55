from pydantic import BaseModel, EmailStr


class RegisterSchema(BaseModel):

    nickname: str

    email: EmailStr

    password: str


class LoginSchema(BaseModel):

    email: EmailStr

    password: str