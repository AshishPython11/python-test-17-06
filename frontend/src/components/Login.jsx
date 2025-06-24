import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
    const [form, setForm] = useState({ username: "", password: "" });
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/token', form, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
            if (res.status === 200) {
                localStorage.setItem("token", res.data.access_token)
                // window.location.href = "/movies";
                onLogin(res.data.access_token);
                navigate("/movies")
            }
        } catch (error) {
            console.log(error, "Error");
        }
    }

    return (
        <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} type="text" name="username" placeholder="Username" />
            <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" name="password" placeholder="Password" />
            <button type="submit">Log In</button>
        </form>
    )
}