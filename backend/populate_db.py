# app/populate_db.py

import gzip
import csv
import os
import requests
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Movie, Person

MOVIE_URL = "https://datasets.imdbws.com/title.basics.tsv.gz"
PERSON_URL = "https://datasets.imdbws.com/name.basics.tsv.gz"
MOVIE_FILE = "title.basics.tsv.gz"
PERSON_FILE = "name.basics.tsv.gz"
MOVIE_TYPES = {"movie", "tvSeries", "tvMovie", "short", "documentary"}


def download_file(url: str, filename: str):
    if not os.path.exists(filename):
        print(f"Downloading {filename}...")
        r = requests.get(url)
        with open(filename, "wb") as f:
            f.write(r.content)


def load_movies(filepath: str, limit: int = 100):
    movies = {}
    with gzip.open(filepath, "rt", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter="\t")
        for row in reader:
            if (
                row["titleType"] in MOVIE_TYPES
                and row["isAdult"] == "0"
                and row["startYear"].isdigit()
            ):
                tconst = row["tconst"]
                movies[tconst] = {
                    "title": row["primaryTitle"],
                    "year": int(row["startYear"]),
                    "type": row["titleType"],
                    "genre": row["genres"] if row["genres"] != "\\N" else "",
                }
                if len(movies) >= limit:
                    break
    return movies


def load_people(filepath: str, movie_ids: set, limit: int = 100):
    people = []
    with gzip.open(filepath, "rt", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter="\t")
        for row in reader:
            if row["knownForTitles"] == "\\N":
                continue
            known_titles = row["knownForTitles"].split(",")
            related = [tid for tid in known_titles if tid in movie_ids]
            if related:
                person = Person(
                    name=row["primaryName"],
                    birth_year=int(row["birthYear"])
                    if row["birthYear"].isdigit()
                    else None,
                    profession=row["primaryProfession"]
                    if row["primaryProfession"] != "\\N"
                    else "",
                    known_for_titles=",".join(related),
                )
                people.append((person, related))
            if len(people) >= limit:
                break
    return people


def populate():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    download_file(MOVIE_URL, MOVIE_FILE)
    download_file(PERSON_URL, PERSON_FILE)

    print("Loading 100 movies...")
    movie_data = load_movies(MOVIE_FILE, limit=100)

    db: Session = SessionLocal()
    movie_objs = {}

    for tconst, m in movie_data.items():
        movie = Movie(
            title=m["title"],
            release_year=m["year"],
            genre=m["genre"],
            type=m["type"],
        )
        db.add(movie)
        movie_objs[tconst] = movie
    db.commit()

    print("Loading 100 people related to above movies...")
    people = load_people(PERSON_FILE, movie_ids=set(movie_objs.keys()), limit=100)

    for person, titles in people:
        for tid in titles:
            person.movies.append(movie_objs[tid])
        db.add(person)

    db.commit()
    db.close()
    print("🎉 Database successfully populated with 100 movies & 100 people.")


if __name__ == "__main__":
    populate()
