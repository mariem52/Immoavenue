// src/pages/Favorites.jsx - VERSION COMPLÈTEMENT CORRIGÉE
import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import ProjectCard from "../components/ProjectCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import "./Favorites.css";

export default function Favorites() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { notify } = useAuth();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/favoris");
      
      const projects = data.map(f => {
        const projectData = f.projectId && typeof f.projectId === 'object' 
          ? f.projectId 
          : { 
              _id: f.projectId || f._id,
              title: 'Projet non disponible',
              city: 'Inconnue',
              address: '',
              price: 0,
              typeLogement: 'Non spécifié',
              status: 'inconnu',
              images: []
            };
        
        return {
          favId: f._id,
          project: projectData
        };
      });
      
      setItems(projects);
    } catch (err) {
      console.error("load favoris", err);
      notify("Erreur lors du chargement des favoris", "error");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    load();
  }, [load]);

  const removeFavorite = async (favId, projectTitle) => {
    if (!window.confirm(`Supprimer "${projectTitle}" de vos favoris ?`)) return;
    try {
      await api.delete(`/favoris/${favId}`);
      notify("Favori supprimé", "success");
      setItems(prev => prev.filter(item => item.favId !== favId));
    } catch (err) {
      console.error("del fav", err);
      notify("Impossible de supprimer", "error");
    }
  };

  return (
    <section className="favorites-section">
      <div className="container">
        <div className="favorites-header">
          <h2>❤️ Mes favoris</h2>
          <p className="favorites-subtitle">
            {items.length} propriété{items.length > 1 ? 's' : ''} sauvegardée{items.length > 1 ? 's' : ''}
          </p>
        </div>

        {loading ? (
          <div className="loading-container">
            <Loader />
          </div>
        ) : items.length ? (
          <div className="favorites-grid">
            {items.map(it => (
              <div key={it.favId} className="favorite-item-wrapper">
                {/* ProjectCard SANS le bouton cœur (onToggleFavorite=null) */}
                <ProjectCard 
                  project={it.project} 
                  isFavorited={true}
                  onToggleFavorite={null} // DÉSACTIVER le cœur interne
                />
                
                {/* Bouton de suppression positionné CORRECTEMENT */}
                <button
                  onClick={() => removeFavorite(it.favId, it.project.title)}
                  className="remove-favorite-btn"
                  title="Supprimer des favoris"
                >
                  <span className="trash-icon">🗑️</span>
                  <span className="remove-text">Supprimer</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            title="Aucun favori pour le moment" 
            subtitle="Explorez les projets disponibles et ajoutez vos favoris en cliquant sur le cœur ❤️"
            icon="❤️"
          />
        )}
      </div>
    </section>
  );
}