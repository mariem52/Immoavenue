import React from "react";
import heroImage from "../assets/logIn.jpg";
import "./Hero.css";

export default function Hero() {

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
                  Explorez vos 
                  <span className="hero-highlight"> projets immobiliers  </span>
                 où que vous soyez
                </h1>
              </div>

             
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}