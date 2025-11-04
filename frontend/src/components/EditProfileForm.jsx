import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { FaUser, FaEnvelope, FaSave, FaTimes } from "react-icons/fa";

const EditProfileForm = () => {
  const { user, notify, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: user.nom || "",
    prenom: user.prenom || "",
    email: user.email || "",
  });

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
      headers: { Authorization: `Bearer ${user.token}` }
    };

    const { data } = await api.put("/users/edit", formData, config);
    
    updateProfile(data); // ← CHANGE THIS LINE
    notify("Profil mis à jour avec succès ✅", "success");
  } catch (err) {
    console.error("Error updating profile:", err);
    notify(err.response?.data?.message || "Erreur lors de la mise à jour", "error");
  } finally {
    setLoading(false);
  }
};

  const handleReset = () => {
    setFormData({
      nom: user.nom || "",
      prenom: user.prenom || "",
      email: user.email || "",
    });
  };

  return (
    <div className="edit-profile-form">
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h3 className="section-title">
            <FaUser className="section-icon" />
            Informations personnelles
          </h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="prenom" className="form-label">
                Prénom *
              </label>
              <div className="input-container">
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Votre prénom"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="nom" className="form-label">
                Nom *
              </label>
              <div className="input-container">
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Votre nom"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">
            <FaEnvelope className="section-icon" />
            Informations de contact
          </h3>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Adresse email *
            </label>
            <div className="input-container">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="votre@email.com"
              />
            </div>
            <p className="input-help">
              Vous recevrez les confirmations de réservation à cette adresse
            </p>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={loading}
          >
            <FaTimes className="btn-icon" />
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            <FaSave className="btn-icon" />
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;