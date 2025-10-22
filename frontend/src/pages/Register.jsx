// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css"; // on réutilise le CSS du login

export default function Register() {
  const { register, notify } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    role: "Client", // par défaut Client
  });
  const [loading, setLoading] = useState(false);

  const onChange = (k, v) => setForm({ ...form, [k]: v });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(form);
      notify("Compte créé ✅ Vérifiez vos emails pour activer votre compte", "success");
      navigate("/login");
    } catch (err) {
      console.error(err);
      notify(err.response?.data?.message || "Erreur lors de l'inscription", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Image à gauche */}
      <div className="login-image" />

      {/* Formulaire à droite */}
      <div className="login-form-container">
        <div className="login-card">
          <h2 className="login-title">Créer un compte</h2>
          <form className="form" onSubmit={onSubmit}>
            <div className="field">
              <label>Nom</label>
              <input
                value={form.nom}
                onChange={(e) => onChange("nom", e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Prénom</label>
              <input
                value={form.prenom}
                onChange={(e) => onChange("prenom", e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => onChange("email", e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Mot de passe</label>
              <input
                type="password"
                value={form.motDePasse}
                onChange={(e) => onChange("motDePasse", e.target.value)}
                required
              />
            </div>

            <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
              ⚠️ L’email de confirmation est obligatoire. Vérifiez votre boîte avant de vous connecter.
            </div>

            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? "Création..." : "S'inscrire"}
            </button>
          </form>

          <div className="divider">ou</div>

          <p className="register-link">
            Déjà un compte ? <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
