import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const role = params.get("role");
    const nom = params.get("nom");
    const prenom = params.get("prenom");
    const email = params.get("email");
    const userId = params.get("userId");

    if (token) {
      // Met à jour le contexte et le localStorage
loginWithGoogle(token, { role, nom, prenom, email, _id: userId });
navigate(role === "Admin" ? "/dashboard" : "/profile");

    }
  }, [loginWithGoogle, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>Connexion Google en cours...</h2>
      <p>Veuillez patienter, vous allez être redirigé automatiquement.</p>
    </div>
  );
}
