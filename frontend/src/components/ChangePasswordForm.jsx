// src/components/ChangePasswordForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ChangePasswordForm() {
  const { user, notify, logout } = useAuth();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm) {
      notify("Les mots de passe ne correspondent pas", "error");
      return;
    }
    try {
      setLoading(true);
      await api.put(
        "/users/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      notify("Mot de passe changé ✅ Veuillez vous reconnecter", "success");

      // Déconnexion + redirection
      logout();
      navigate("/login");
    } catch (err) {
      notify(err.response?.data?.message || "Erreur", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <h3 style={{ marginBottom: 20 }}>Changer le mot de passe 🔒</h3>
      <div className="field">
        <label>Ancien mot de passe</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
      </div>
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
        <label>Confirmer le mot de passe</label>
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
  );
}
