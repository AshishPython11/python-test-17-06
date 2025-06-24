import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function PersonSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const [person, setPerson] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedin = localStorage.getItem("token")
        if (!isLoggedin) navigate("/")
    }, [])

    const search = async () => {
        const res = await API.get('/search/movie', { params: { query: searchTerm } })
        setPerson(res.data)
    }

    return (
        <div>
            <h2>Seacrh PersonSearch</h2>
            <div>
                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder="Search here" />
                <button onClick={search}>Search</button>
            </div>
            {person.map((person, i) => (
                <>
                    <p>{person.birth_year}</p>
                    <p>{person.name}</p>
                </>
            ))}
        </div>
    )
}