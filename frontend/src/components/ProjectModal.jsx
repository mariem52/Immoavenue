import React, { useState, useEffect } from "react";
import "./ProjectModal.css";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ProjectModal({ project, onClose, onSaved }) {
  const { notify } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    address: "",
    typeLogement: "Appartement",
    status: "Disponible",
    image: "" // Base64 string
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        price: project.price || "",
        city: project.city || "",
        address: project.address || "",
        typeLogement: project.typeLogement || "Appartement",
        status: project.status || "Disponible",
        image: project.image || ""
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      notify("L'image ne doit pas dépasser 5MB", "error");
      return;
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      notify("Veuillez sélectionner une image valide", "error");
      return;
    }

    setImageFile(file);

    // Convertir l'image en Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ 
        ...prev, 
        image: reader.result // Stocke l'image en Base64
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: "" }));
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Préparer les données pour l'envoi JSON (pas FormData)
      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        city: formData.city,
        address: formData.address,
        typeLogement: formData.typeLogement,
        status: formData.status,
        image: formData.image // Base64 string
      };

      console.log('Données envoyées:', payload);

      let response;
      if (project) {
        response = await api.put(`/projects/${project._id}`, payload);
      } else {
        response = await api.post("/projects", payload);
      }

      console.log('Réponse du serveur:', response.data);
      notify(project ? "Projet modifié avec succès! 🎉" : "Projet créé avec succès! 🎉", "success");
      onSaved();
      onClose();

    } catch (err) {
      console.error('❌ Erreur complète:', err);
      console.error('📊 Données de réponse:', err.response?.data);
      
      let errorMessage = "Erreur lors de la sauvegarde";
      
      if (err.response) {
        errorMessage = err.response.data?.message || 
                      `Erreur ${err.response.status}: ${err.response.statusText}`;
      } else if (err.request) {
        errorMessage = "Impossible de contacter le serveur";
      } else {
        errorMessage = err.message;
      }
      
      notify(`Erreur: ${errorMessage}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <h2>{project ? "✏️ Modifier le projet" : "🏠 Ajouter un projet"}</h2>
           
          </div>
          <button className="close-btn" onClick={onClose} disabled={loading}>
            <span>×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-content">
            {/* Section Informations de base */}
            <div className="form-section">
              <h3>📋 Informations de base</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="title" className="required">Titre du projet</label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ex: Belle villa moderne..."
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price" className="required">Prix (DT)</label>
                  <div className="price-input-container">
                    <input
                      id="price"
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Ex: 250000"
                      min="0"
                      required
                      disabled={loading}
                    />
                    <span className="currency">DT</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description" className="required">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez le projet en détail..."
                  rows="4"
                  required
                  disabled={loading}
                />
                <div className="char-count">{formData.description.length}/500 caractères</div>
              </div>
            </div>

            {/* Section Localisation */}
            <div className="form-section">
              <h3>📍 Localisation</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="city" className="required">Ville</label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Ex: Tunis"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address" className="required">Adresse</label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Ex: Rue Habib Thameur..."
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Section Détails */}
            <div className="form-section">
              <h3>⚙️ Détails du projet</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="typeLogement" className="required">Type de logement</label>
                  <select
                    id="typeLogement"
                    name="typeLogement"
                    value={formData.typeLogement}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="Appartement">🏢 Appartement</option>
                    <option value="Maison">🏠 Maison</option>
                    <option value="Studio">🔧 Studio</option>
                    <option value="Villa">🏡 Villa</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="status" className="required">Statut</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="Disponible">🟢 Disponible</option>
                    <option value="Vendu">🔴 Vendu</option>
                    <option value="Réservé">🟡 Réservé</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section Image */}
            <div className="form-section">
              <h3>🖼️ Image du projet</h3>
              <div className="form-group">
                <label htmlFor="image" className={!project ? "required" : ""}>
                  Image principale
                </label>
                
                <div className="file-upload-container">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!project && !formData.image}
                    disabled={loading}
                    className="file-input"
                  />
                  <label htmlFor="image" className="file-upload-label">
                    <div className="upload-content">
                      <span className="upload-icon">📁</span>
                      <span className="upload-text">
                        {imageFile ? imageFile.name : (formData.image ? "Image sélectionnée" : "Choisir une image")}
                      </span>
                      <span className="upload-hint">PNG, JPG, JPEG (max 5MB)</span>
                    </div>
                  </label>
                </div>

                {formData.image && (
                  <div className="image-preview-container">
                    <div className="image-preview">
                      <img src={formData.image} alt="Aperçu du projet" />
                      <button 
                        type="button" 
                        className="remove-image-btn"
                        onClick={removeImage}
                        disabled={loading}
                      >
                        🗑️
                      </button>
                    </div>
                    <span className="preview-label">Aperçu</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  {project ? "Modification..." : "Création..."}
                </>
              ) : (
                <>
                  {project ? "💾 Modifier le projet" : "✨ Créer le projet"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}