import React, { useState } from "react";
import ChangePasswordForm from "../components/ChangePasswordForm";
import EditProfileForm from "../components/EditProfileForm";
import Favorites from "./Favorites";
import Reservations from "./Reservations";
import { useAuth } from "../context/AuthContext";
import {
  FaUserEdit,
  FaKey,
  FaHeart,
  FaCalendarAlt,
  FaUserCircle,
  FaCog,
  FaShieldAlt
} from "react-icons/fa";
import "./Profile.css";

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("edit");

  if (!user) return <p>Chargement...</p>;

  const menuItems = [
    {
      id: "edit",
      label: "Modifier le profil",
      icon: <FaUserEdit />,
      description: "Gérez vos informations personnelles"
    },
    {
      id: "password",
      label: "Sécurité",
      icon: <FaKey />,
      description: "Changez votre mot de passe"
    },
    ...(user.role === "Client" ? [
      {
        id: "favorites",
        label: "Mes favoris",
        icon: <FaHeart />,
        description: "Vos propriétés préférées"
      },
      {
        id: "reservations",
        label: "Réservations",
        icon: <FaCalendarAlt />,
        description: "Vos visites planifiées"
      }
    ] : [])
  ];

  return (
    <div className="profile-page">
      {/* Header avec informations utilisateur */}
      <div className="profile-header">
        <div className="header-content">
          <div className="user-avatar">
            <FaUserCircle className="avatar-icon" />
            <div className="online-status"></div>
          </div>
          <div className="user-info">
            <h1 className="user-name">{user.prenom} {user.nom}</h1>
            <p className="user-email">{user.email}</p>
            <div className="user-badge">
              <span className={`role-badge role-${user.role.toLowerCase()}`}>
                {user.role}
              </span>
              <span className="member-since">
                Membre depuis {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-container">
        {/* Sidebar moderne */}
        <aside className="profile-sidebar">
          <div className="sidebar-header">
            <FaCog className="settings-icon" />
            <h3 className="sidebar-title">Paramètres du compte</h3>
          </div>
          
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                <div className="nav-icon">{item.icon}</div>
                <div className="nav-content">
                  <span className="nav-label">{item.label}</span>
                  <span className="nav-description">{item.description}</span>
                </div>
                <div className="nav-indicator"></div>
              </button>
            ))}
          </nav>

          {/* Section sécurité */}
          <div className="security-section">
            <div className="security-header">
              <FaShieldAlt className="security-icon" />
              <span>Sécurité du compte</span>
            </div>
            <div className="security-status">
              <div className="status-item">
                <div className="status-dot verified"></div>
                <span>Email vérifié</span>
              </div>
              <div className="status-item">
                <div className="status-dot secure"></div>
                <span>Mot de passe fort</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Contenu principal */}
        <main className="profile-content">


<div className="content-card compact-view">
  {activeTab === "edit" && (
    <div className="edit-profile-form ultra-compact">
      <EditProfileForm />
    </div>
  )}
  {activeTab === "password" && (
    <div className="change-password-form compact">
      <ChangePasswordForm />
    </div>
  )}
  {activeTab === "favorites" && <Favorites />}
  {activeTab === "reservations" && <Reservations />}
</div>
        </main>
      </div>
    </div>
  );
}