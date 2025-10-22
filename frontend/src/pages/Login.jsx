import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { login, notify } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      const role =
        data.role ||
        (data.email === process.env.REACT_APP_ADMIN_EMAIL ? "Admin" : "Client");

      if (role === "Admin") {
        navigate("/dashboard");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message || "Email ou mot de passe incorrect";
      notify(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="login-page">
      {/* Image à gauche */}
      <div className="login-image" />

      {/* Formulaire à droite */}
      <div className="login-form-container">
        <div className="login-card">
          <h2 className="login-title">Se connecter</h2>
          <form className="form" onSubmit={onSubmit}>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Connexion"}
            </button>
          </form>

          <p className="forgot-link">
            <Link to="/forgot-password">Mot de passe oublié ?</Link>
          </p>

          <div className="divider">ou</div>

          <button
            onClick={handleGoogleLogin}
            className="btn google-btn"
            type="button"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="google-icon"
            />
            Se connecter avec Google
          </button>

          <p className="register-link">
            Pas de compte ? <Link to="/register">Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
