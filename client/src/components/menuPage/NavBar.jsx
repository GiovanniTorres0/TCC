// ./menuPage/NavBar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    try {
      await Axios.post("http://localhost:4000/logout", {}, { withCredentials: true });
      localStorage.removeItem("userName");
      navigate("/"); 
    } catch (error) {
      console.error("Erro no logout:", error);
      alert("Erro ao realizar o logout");
    }
  };
  

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light">
      <div className="container">
        <h1 className="navbar-brand">O NEGOCIADOR</h1>
        <button
          className={`navbar-toggler ${isMenuOpen ? 'collapsed' : ''}`}
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen ? 'true' : 'false'}
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="navbar-brand btn btn-outline-secondary" href="/chat">Chat</a>
            </li>
            <li className="nav-item">
              <a className="navbar-brand btn btn-outline-secondary" href="/publicar">Publicar</a>
            </li>
            <li className="nav-item">
              <a className="navbar-brand btn btn-outline-secondary" href="/produto">Produto</a>
            </li>
            <li className="nav-item">
              <button className="navbar-brand btn btn-outline-secondary" onClick={handleLogout}>Sair</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
