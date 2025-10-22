// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const { notify } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/users/forgot-password", { email });
      notify("Lien envoyé à votre email ✅", "success");
      setEmail("");
    } catch (err) {
      notify(err.response?.data?.message || "Erreur", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="card" style={{ padding: 24 }}>
          <h2>Mot de passe oublié</h2>
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
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Envoi..." : "Envoyer"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
