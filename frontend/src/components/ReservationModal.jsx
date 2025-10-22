import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./ReservationModal.css"; // Assurez-vous que cette ligne existe

export default function ReservationModal({ projectId, onClose, onSaved }) {
  const { notify } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    dateDebut: '',
    dateFin: '',
    notes: ''
  });

  useEffect(() => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    setFormData({
      dateDebut: today.toISOString().split('T')[0],
      dateFin: nextWeek.toISOString().split('T')[0],
      notes: ''
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.dateDebut || !formData.dateFin) {
      notify("Veuillez sélectionner les dates", "error");
      return;
    }

    if (new Date(formData.dateFin) <= new Date(formData.dateDebut)) {
      notify("La date de fin doit être après la date de début", "error");
      return;
    }

    setLoading(true);
    try {
      await api.post("/reservations", {
        propertyId: projectId,
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin
      });
      
      notify("🎉 Réservation créée avec succès!", "success");
      onSaved();
      onClose();
    } catch (err) {
      console.error("Erreur réservation:", err);
      notify(err.response?.data?.message || "Erreur lors de la réservation", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reservation-modal-overlay" onClick={onClose}>
      <div className="reservation-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="reservation-modal-header">
          <h3>📅 Réserver une visite</h3>
          <button className="reservation-close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="reservation-form">
          <div className="reservation-form-group">
            <label className="reservation-form-label">Date de début *</label>
            <input
              type="date"
              name="dateDebut"
              value={formData.dateDebut}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="reservation-form-input"
            />
          </div>

          <div className="reservation-form-group">
            <label className="reservation-form-label">Date de fin *</label>
            <input
              type="date"
              name="dateFin"
              value={formData.dateFin}
              onChange={handleChange}
              required
              min={formData.dateDebut}
              className="reservation-form-input"
            />
          </div>

          <div className="reservation-form-group">
            <label className="reservation-form-label">Notes (optionnel)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Informations supplémentaires..."
              rows="3"
              className="reservation-form-textarea"
            />
          </div>

          <div className="reservation-modal-actions">
            <button 
              type="submit" 
              className="reservation-btn reservation-btn-primary"
              disabled={loading}
            >
              {loading ? "⏳ Réservation..." : "✅ Confirmer la réservation"}
            </button>
            <button 
              type="button" 
              className="reservation-btn reservation-btn-cancel" 
              onClick={onClose}
              disabled={loading}
            >
              ❌ Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}