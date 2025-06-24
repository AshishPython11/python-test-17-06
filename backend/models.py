from sqlalchemy import Column, String, Integer, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base

movie_person = Table(
    "movie_person",
    Base.metadata,
    Column("movie_id", String, ForeignKey("movies.id")),
    Column("person_id", String, ForeignKey("people.id")),
)


class Movie(Base):
    __tablename__ = "movies"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String)
    release_year = Column(Integer, nullable=True)
    genre = Column(String)
    type = Column(String)
    people = relationship("Person", secondary=movie_person, back_populates="movies")


class Person(Base):
    __tablename__ = "people"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    birth_year = Column(Integer, nullable=True)
    profession = Column(String)
    known_for_titles = Column(String)
    movies = relationship("Movie", secondary=movie_person, back_populates="people")
