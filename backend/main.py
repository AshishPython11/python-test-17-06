from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import models
import schemas
from database import SessionLocal, engine
from auth import authenticate_user, create_token, get_current_user

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        print("testing")
        db.close()


@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if not authenticate_user(form_data.username, form_data.password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    return {"access_token": create_token(form_data.username), "token_type": "bearer"}


@app.get("/search/movie", response_model=list[schemas.MovieOut])
def search_movie(
    year: int = None,
    genre: str = "",
    type: str = "",
    person_name: str = "",
    db: Session = Depends(get_db),
    user: str = Depends(get_current_user),
):
    query = db.query(models.Movie)

    if year:
        query = query.filter(models.Movie.release_year == year)
    if genre:
        query = query.filter(models.Movie.genre == genre)
    if type:
        query = query.filter(models.Movie.type == type)
    if person_name:
        query = query.join(models.Movie.people).filter(
            models.Person.name.ilike(f"%{person_name}%")
        )

    results = query.all()

    return [
        {
            "title": result.title,
            "year": result.release_year,
            "type": result.type,
            "genre": result.genre,
            "people": [
                {
                    "name": p.name,
                    "birth_year": p.birth_year,
                    "profession": p.profession,
                    "known_for_titles": p.known_for_titles,
                }
                for p in result.people
            ],
        }
        for result in results
    ]


@app.get("/search/person", response_model=list[schemas.PersonOut])
def search_person(
    movie_title: str = "",
    name: str = "",
    profession: str = "",
    db: Session = Depends(get_db),
    user: str = Depends(get_current_user),
):
    query = db.query(models.Person)

    if name:
        query = query.filter(models.Person.name.ilike(f"%{name}%"))
    if profession:
        query = query.filter(models.Person.profession.ilike(f"%{profession}%"))
    if movie_title:
        query = query.join(models.Person.movies).filter(
            models.Movie.title.ilike(f"%{movie_title}%")
        )

    results = query.all()

    return [
        {
            "name": p.name,
            "birth_year": p.birth_year,
            "profession": p.profession,
            "known_for_titles": p.known_for_titles,
        }
        for p in results
    ]
