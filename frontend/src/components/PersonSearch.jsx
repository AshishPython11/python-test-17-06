import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function PersonSearch() {
  const [filters, setFilters] = useState({
    movie: "",
    name: "",
    profession: "",
  });
  const [people, setPeople] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");

    const fetchInitialData = async () => {
      try {
        const res = await API.get("/search/person");
        setPeople(res?.data);
      } catch (error) {
        alert("Error in getting the initial data");
      }
    };
    fetchInitialData();
  }, []);

  const filter = async () => {
    try {
      const params = {};
      if (filters.movie) params.movie = filters.movie;
      if (filters.name) params.name = filters.name;
      if (filters.profession) params.profession = filters.profession;

      const res = await API.get("/search/person", { params });
      setPeople(res.data);
    } catch (error) {
      alert("Error fetching data on filter");
    }
  };

  return (
    <div>
      <h2>People</h2>
      <div>
        <input
          value={filters.movie}
          onChange={(e) => setFilters({ ...filters, movie: e.target.value })}
          type="text"
          placeholder="Movie Title"
        />
        <input
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          type="text"
          placeholder="Name"
        />
        <input
          value={filters.profession}
          onChange={(e) =>
            setFilters({ ...filters, profession: e.target.value })
          }
          type="text"
          placeholder="Profession"
        />
        <button onClick={filter}>Apply Filter</button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        {people.length > 0 ? (
          people.map((person, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <h3>{person.name}</h3>
              <p>Birth Year: {person.birth_year}</p>
              <p>Profession: {person.profession}</p>
              <p>Known for: {person.known_for_titles}</p>
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
