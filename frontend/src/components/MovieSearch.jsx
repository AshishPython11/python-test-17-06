import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function MovieSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const isLoggedin = localStorage.getItem("token")
        if (!isLoggedin) navigate("/")
    }, [])

    const search = async () => {
        const res = await API.get('/search/movie', { params: { query: searchTerm } })
        setMovies(res.data)
    }

    return (
        <div>
            <h2>Search Movies</h2>
            <div>
                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder="Search here" />
                <button onClick={search}>Search</button>
            </div>
            {movies.map((movies, i) => (
                <>
                    <p>{movies.year}</p>
                    <p>{movies.title}</p>
                </>
            ))}
        </div>
    )
}