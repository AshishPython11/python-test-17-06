import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function MovieSearch() {
  const [filters, setFilters] = useState({
    year: "",
    genre: "",
    type: "",
    personName: "",
  });
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");

    const fetchInitialMovies = async () => {
      try {
        const res = await API.get("/search/movie");
        setMovies(res.data);
      } catch (error) {
        alert("Error in getting the initial movies");
      }
    };
    fetchInitialMovies();
  }, []);

  const filter = async () => {
    try {
      const params = {};

      if (filters.year) params.year = filters.year;
      if (filters.genre) params.genre = filters.genre;
      if (filters.type) params.type = filters.type;
      if (filters.personName) params.person_name = filters.personName;

      const res = await API.get("/search/movie", { params });
      setMovies(res.data);
    } catch (error) {
      alert("Error fetching movies on filter.");
    }
  };

  return (
    <div>
      <h2>Movies</h2>
      <div>
        <input
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          type="text"
          placeholder="Year"
        />
        <input
          value={filters.genre}
          onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
          type="text"
          placeholder="Genre"
        />
        <input
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          type="text"
          placeholder="Type"
        />
        <input
          value={filters.personName}
          onChange={(e) =>
            setFilters({ ...filters, personName: e.target.value })
          }
          type="text"
          placeholder="Person Name"
        />
        <button onClick={filter}>Apply Filter</button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        {movies.length > 0 ? (
          movies.map((movie, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <h3>{movie.title}</h3>
              <p>
                Person Name:{" "}
                {movie.people && movie.people.length > 0
                  ? movie.people.map((p) => p.name).join(", ")
                  : "-"}
              </p>
              <p>Year: {movie.year}</p>
              <p>Genre: {movie.genre}</p>
              <p>Type: {movie.type}</p>
            </div>
          ))
        ) : (
          <div
            style={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            Loading...
          </div>
        )}
      </div>
    </div>
  );
}
