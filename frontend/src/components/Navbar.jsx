import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

// ✅ Import du logo
import logo from "../assets/logoimmoavennue.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="container inner">
        {/* Brand avec logo */}
        <div
          className="brand"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt="Logo" className="logo" />
          <div className="name">Immobilière de l’Avenue</div>
        </div>

        {/* Navigation */}
        <nav className="nav">
          <NavLink to="/" end>
            Accueil
          </NavLink>
          <NavLink to="/projects">Projets</NavLink>

          {/* Client */}
          {user?.role === "Client" && <NavLink to="/favorites">Favoris</NavLink>}
          {user?.role === "Client" && (
            <NavLink to="/reservations">Mes réservations</NavLink>
          )}

          {/* Admin & ChefProjet */}
          {["Admin", "ChefProjet"].includes(user?.role) && (
            <NavLink to="/dashboard">Dashboard</NavLink>
          )}

          {/* Employé & ChefProjet */}
          {["Employe", "ChefProjet"].includes(user?.role) && (
            <NavLink to="/attendance">Pointage</NavLink>
          )}

          {/* Authenticated user */}
          {user ? (
            <div className="user">
              <span className="welcome">Bonjour {user.nom || user.email}</span>

              {/* Masquer icône profil si Admin */}
              {user.role !== "Admin" && (
                <FaUserCircle
                  size={36} // icône plus grande
                  className="profile-icon"
                  onClick={() => navigate("/profile")}
                />
              )}

              <button
                className="btn logout-btn"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Se déconnecter
              </button>
            </div>
          ) : (
            <>
              <NavLink to="/login">Se connecter</NavLink>
              <NavLink to="/register">Créer un compte</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
