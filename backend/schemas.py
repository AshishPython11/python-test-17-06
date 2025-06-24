from typing import List, Optional
from pydantic import BaseModel


class PersonOut(BaseModel):
    name: str
    birth_year: Optional[int]
    profession: str
    known_for_titles: str

    class Config:
        orm_mode = True


class MovieOut(BaseModel):
    title: str
    year: Optional[int]
    type: str
    genre: str
    people: List[PersonOut]

    class Config:
        orm_mode = True
