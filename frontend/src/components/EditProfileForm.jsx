import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function EditProfileForm() {
  const { user, updateProfile } = useAuth();
  const [nom, setNom] = useState(user.nom || "");
  const [prenom, setPrenom] = useState(user.prenom || "");
  const [email, setEmail] = useState(user.email || "");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateProfile({ nom, prenom, email });
      // le contexte AuthContext et localStorage sont déjà mis à jour
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="field">
        <label className="label">Nom</label>
        <input className="input" value={nom} onChange={(e) => setNom(e.target.value)} />
      </div>
      <div className="field">
        <label className="label">Prénom</label>
        <input className="input" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
      </div>
      <div className="field">
        <label className="label">Email</label>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <button className="btn primary" type="submit" disabled={loading}>
        {loading ? "Mise à jour..." : "Sauvegarder"}
      </button>
    </form>
  );
}
