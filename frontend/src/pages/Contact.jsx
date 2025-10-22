// src/pages/Contact.jsx
import React, { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Contact.css";

export default function Contact() {
  const { user, notify } = useAuth();
  const [contenu, setContenu] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      notify("Vous devez être connecté pour envoyer un message", "error");
      return;
    }

    setLoading(true);
    try {
      await api.post("/messages", { contenu }, { 
        headers: { Authorization: `Bearer ${user.token}` } 
      });
      notify("Message envoyé avec succès ✅", "success");
      setContenu("");
    } catch (err) {
      console.error(err);
      notify(err.response?.data?.message || "Erreur lors de l'envoi", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-box">
        <h2>Contactez-nous</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Votre message..."
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            required
          ></textarea>
          <button type="submit" disabled={loading}>
            {loading ? "Envoi..." : "Envoyer"}
          </button>
        </form>
      </div>
    </div>
  );
}
