// src/components/Footer.jsx
import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        {/* Brand */}
        <div className="section">
          <div className="brand">Immobilière de l’Avenue</div>
          <p>Votre partenaire de confiance pour trouver le logement idéal.</p>
        </div>

        {/* À propos */}
        <div className="section">
          <h4>À propos</h4>
          <ul>
            <li><a href="/about">Qui sommes-nous</a></li>
            <li><a href="/privacy">Règles de confidentialité</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="section">
          <h4>Contact</h4>
          <ul>
            <li><a href="/contact">Nous contacter</a></li>
            <li><a href="/login">Espace client</a></li>
          </ul>
        </div>
      </div>

      <div className="bottom">
        © {new Date().getFullYear()} • Immobilière de l’Avenue • Tous droits réservés
      </div>
    </footer>
  );
}
