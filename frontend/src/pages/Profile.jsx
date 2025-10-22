// src/pages/Profile.jsx
import React, { useState } from "react";
import ChangePasswordForm from "../components/ChangePasswordForm";
import EditProfileForm from "../components/EditProfileForm";
import Favorites from "./Favorites";
import Reservations from "./Reservations";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("edit");

  if (!user) return <p>Chargement...</p>;

  return (
    <div className="profile-page">
      {/* Sidebar */}
      <aside className="profile-sidebar">
        <h3 className="sidebar-title">Mon compte</h3>
        <nav className="sidebar-nav">
          <button
            className={activeTab === "edit" ? "active" : ""}
            onClick={() => setActiveTab("edit")}
          >
            Modifier profil
          </button>
          <button
            className={activeTab === "password" ? "active" : ""}
            onClick={() => setActiveTab("password")}
          >
            Changer mot de passe
          </button>
          {user.role === "Client" && (
            <>
              <button
                className={activeTab === "favorites" ? "active" : ""}
                onClick={() => setActiveTab("favorites")}
              >
                Mes favoris
              </button>
              <button
                className={activeTab === "reservations" ? "active" : ""}
                onClick={() => setActiveTab("reservations")}
              >
                Mes réservations
              </button>
            </>
          )}
        </nav>
      </aside>

      {/* Contenu */}
      <main className="profile-content">
        {activeTab === "edit" && <EditProfileForm />}
        {activeTab === "password" && <ChangePasswordForm />}
        {activeTab === "favorites" && <Favorites />}
        {activeTab === "reservations" && <Reservations />}
      </main>
    </div>
  );
}
