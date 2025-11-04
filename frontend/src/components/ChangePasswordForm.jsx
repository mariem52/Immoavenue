import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FaKey, FaLock, FaShieldAlt, FaSave } from "react-icons/fa";

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
    <div className="change-password-form">
      <form className="profile-form" onSubmit={onSubmit}>
        <div className="form-section">
          <h3 className="section-title">
            <FaShieldAlt className="section-icon" />
            Sécurité du compte
          </h3>
          
          <div className="form-group">
            <label htmlFor="oldPassword" className="form-label">
              <FaLock className="label-icon" />
              Ancien mot de passe *
            </label>
            <div className="input-container">
              <input
                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="form-input"
                placeholder="Entrez votre mot de passe actuel"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              <FaKey className="label-icon" />
              Nouveau mot de passe *
            </label>
            <div className="input-container">
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="form-input"
                placeholder="Choisissez un nouveau mot de passe"
              />
            </div>
            <p className="input-help">
              Utilisez au moins 8 caractères avec des lettres, chiffres et symboles
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              <FaShieldAlt className="label-icon" />
              Confirmer le mot de passe *
            </label>
            <div className="input-container">
              <input
                type="password"
                id="confirmPassword"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="form-input"
                placeholder="Confirmez votre nouveau mot de passe"
              />
            </div>
          </div>
        </div>

        <div className="security-notice">
          <div className="notice-icon">⚠️</div>
          <div className="notice-content">
            <strong>Important :</strong> Après le changement de mot de passe, vous serez déconnecté et devrez vous reconnecter avec votre nouveau mot de passe.
          </div>
        </div>

        <div className="form-actions">
          <button 
            className="btn btn-primary" 
            type="submit" 
            disabled={loading}
          >
            <FaSave className="btn-icon" />
            {loading ? "Changement en cours..." : "Changer le mot de passe"}
          </button>
        </div>
      </form>
    </div>
  );
}