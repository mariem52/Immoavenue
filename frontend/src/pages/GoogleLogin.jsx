// src/pages/GoogleLogin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GoogleLogin() {
  const { login, notify } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Connexion classique
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/projects");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Email ou mot de passe incorrect";
      notify(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Connexion Google
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <section className="section">
      <div className="container">
        <div className="card" style={{ padding: 24 }}>
          <h2>Se connecter</h2>

          {/* 🔹 Formulaire classique */}
          <form className="form" onSubmit={onSubmit}>
            <div className="field">
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label className="label">Mot de passe</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Connexion"}
            </button>
          </form>

          {/* 🔹 Bouton Google */}
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <button
              onClick={handleGoogleLogin}
              className="btn"
              style={{ backgroundColor: "#4285F4", color: "#fff" }}
            >
              Se connecter avec Google
            </button>
          </div>

          <p style={{ marginTop: 12 }}>
            Pas de compte ?{" "}
            <Link to="/register" style={{ color: "var(--brand-blue)" }}>
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
