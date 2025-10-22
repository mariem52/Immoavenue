// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ResetPassword() {
  const { token } = useParams();
  const { notify } = useAuth();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm) {
      notify("Les mots de passe ne correspondent pas ❌", "error");
      return;
    }
    try {
      setLoading(true);
      await api.post(`/users/reset-password/${token}`, { newPassword });
      notify("Mot de passe changé ✅", "success");
      navigate("/login");
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
          <h2>Réinitialiser le mot de passe</h2>
          <form className="form" onSubmit={onSubmit}>
            <div className="field">
              <label>Nouveau mot de passe</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Confirmer</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Changement..." : "Changer"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
