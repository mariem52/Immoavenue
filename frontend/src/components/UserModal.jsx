import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./UserModal.css";

const UserModal = ({ user, onClose, onSaved }) => {
  const { user: currentUser, notify } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    role: "Client"
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || "",
        prenom: user.prenom || "",
        email: user.email || "",
        role: user.role || "Client"
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      };

      if (user) {
        // Mode édition
        await api.put(`/users/${user._id}`, formData, config);
        notify("Utilisateur mis à jour avec succès ✅", "success");
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error("Error saving user:", err);
      notify(err.response?.data?.message || "Erreur lors de la sauvegarde", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{user ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label htmlFor="nom">Nom *</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              placeholder="Entrez le nom"
            />
          </div>

          <div className="form-group">
            <label htmlFor="prenom">Prénom *</label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
              placeholder="Entrez le prénom"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Entrez l'email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Rôle *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="Client">Client</option>
              <option value="ChefProjet">Chef de Projet</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-save"
              disabled={loading}
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;