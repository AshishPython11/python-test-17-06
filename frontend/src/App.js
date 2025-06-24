import './App.css';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import MovieSearch from './components/MovieSearch';
import PersonSearch from './components/PersonSearch';
import Login from './components/Login';
import { useState } from 'react';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // if (!auth) {
  //   <Login onLogin={() => setAuth(true)} />;
  // }

  const handleLogout = () => {
    localStorage.clear();
   window.location.href = "/";
  }

  return (
    <>
      {token && (
        <nav>
          <Link to="/movies">Movies</Link>
          <Link to="/people">People</Link>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      )}
      <Routes>
        <Route path="/" element={!token ? <Login onLogin={setToken} /> : <Navigate to="/movies" />} />
        <Route
          path="/movies"
          element={token ? <MovieSearch /> : <Navigate to="/" />}
        />
        <Route
          path="/people"
          element={token ? <PersonSearch /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
}

export default App;
