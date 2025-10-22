// src/pages/Verify.jsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Verify() {
  const { token } = useParams();
  const { notify } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        await api.get(`/users/verify/${token}`);
        notify("Compte vérifié avec succès 🎉", "success");
        navigate("/login");
      } catch (err) {
        notify("Lien invalide ou expiré", "error");
        navigate("/register");
      }
    };
    verify();
  }, [token, notify, navigate]);

  return <div className="container">Vérification en cours...</div>;
}
