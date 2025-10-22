import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import heroImage from "../assets/logIn.jpg";
import "./Hero.css";

export default function Hero() {
  const { user } = useAuth();

  return (
    <section className="hero-compass">
      {/* Background avec SEULEMENT l'image */}
      <div className="hero-background">
        <img 
          src={heroImage} 
          alt="Properties" 
          className="hero-bg-image"
        />
        <div className="hero-overlay-light"></div>
      </div>
      
      <div className="hero-content">
        <div className="container">
          <div className="hero-layout">
            {/* Navigation à GAUCHE - Forme ovale/délavée */}
            <div className="hero-left">
              <div className="search-tabs-left">
                {/* Barre de recherche */}
                <div className="search-bar-oval">
                  <div className="search-input-group-oval">
                    <span className="search-icon">📍</span>
                    <input 
                      type="text" 
                      placeholder="Ville, Quartier, Adresse, Code postal..."
                      className="search-input-oval"
                    />
                  </div>
                  <button className="search-btn-oval">
                    <span className="search-btn-text">Rechercher</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Titre principal à DROITE */}
            <div className="hero-right">
              <div className="hero-text-right">
                <h1 className="hero-title">
                  Trouvez Votre
                  <span className="hero-highlight"> Propriété Idéale</span>
                </h1>
                <p className="hero-subtitle">
                  Découvrez des biens immobiliers exceptionnels adaptés à votre style de vie
                </p>
              </div>

              {/* CTA Principal - BOUTONS LARGES */}
              <div className="hero-actions-wide">
                {user ? (
                  <Link to="/projects" className="btn btn-super-wide btn-primary">
                    Explorer les projets
                  </Link>
                ) : (
                  <div className="wide-auth-actions">
                    <Link to="/register" className="btn btn-super-wide btn-primary">
                      Créer un compte
                    </Link>
                    <Link to="/login" className="btn btn-super-wide btn-secondary">
                      Se connecter
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}