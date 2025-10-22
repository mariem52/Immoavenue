// Dans votre Projects.jsx, modifiez la fonction handleReserve :
import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import ProjectCard from "../components/ProjectCard";
import ReservationModal from "../components/ReservationModal"; // IMPORT AJOUTÉ
import { useAuth } from "../context/AuthContext";
import "./Projects.css";

export default function Projects() {
  const { user, notify } = useAuth();
  const [projects, setProjects] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    typeLogement: '',
    minPrice: '',
    maxPrice: '',
    status: ''
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const { data } = await api.get(`/projects?${params}`);
      setProjects(data);

      if (user?.role === "Client") {
        const { data: favs } = await api.get("/favoris");
        setFavorites(favs);
      }
    } catch (err) {
      console.error("load projects", err);
      notify("Erreur lors du chargement des projets", "error");
    } finally {
      setLoading(false);
    }
  }, [notify, user, filters]);

  useEffect(() => { load(); }, [load]);

  // 🔹 OUVRIR le modal de réservation (au lieu de créer directement)
  const handleReserve = (projectId) => {
    setSelectedProject(projectId);
    setShowReservationModal(true);
  };

  // 🔹 FERMER le modal
  const handleCloseModal = () => {
    setShowReservationModal(false);
    setSelectedProject(null);
  };

  // 🔹 SAUVEGARDER la réservation
  const handleReservationSaved = () => {
    notify("Réservation créée avec succès!", "success");
    load(); // Recharger si nécessaire
  };

  const isFavorited = (projectId) =>
    favorites.some((f) => f.projectId?._id === projectId);

  const toggleFavorite = async (projectId) => {
    try {
      const fav = favorites.find((f) => f.projectId?._id === projectId);
      if (fav) {
        await api.delete(`/favoris/${fav._id}`);
        setFavorites(favorites.filter((f) => f._id !== fav._id));
        notify("Retiré des favoris", "success");
      } else {
        const { data: newFav } = await api.post(`/favoris`, { projectId });
        setFavorites([...favorites, newFav]);
        notify("Ajouté aux favoris", "success");
      }
    } catch (err) {
      console.error("fav error", err);
      notify("Impossible de mettre à jour les favoris", "error");
    }
  };

  const filteredProjects = projects.filter(project => {
    return Object.keys(filters).every(key => {
      if (!filters[key]) return true;
      switch (key) {
        case 'minPrice':
          return project.price >= parseInt(filters[key] || 0);
        case 'maxPrice':
          return project.price <= parseInt(filters[key] || Number.MAX_SAFE_INTEGER);
        default:
          return project[key]?.toLowerCase().includes(filters[key].toLowerCase());
      }
    });
  });

  return (
    <section className="projects-section">
      <div className="container">
        <div className="projects-header">
          <h2>🏠 Propriétés disponibles</h2>
          <p className="projects-subtitle">
            Découvrez {filteredProjects.length} propriété{filteredProjects.length > 1 ? 's' : ''} exceptionnelle{filteredProjects.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Filtres */}
        <div className="filters-section">
          <input
            type="text"
            placeholder="🔍 Ville..."
            value={filters.city}
            onChange={(e) => setFilters({...filters, city: e.target.value})}
            className="filter-input"
          />
          <select
            value={filters.typeLogement}
            onChange={(e) => setFilters({...filters, typeLogement: e.target.value})}
            className="filter-select"
          >
            <option value="">🏠 Type de logement</option>
            <option value="Appartement">Appartement</option>
            <option value="Maison">Maison</option>
            <option value="Studio">Studio</option>
            <option value="Villa">Villa</option>
          </select>
          <input
            type="number"
            placeholder="Prix min (TND)"
            value={filters.minPrice}
            onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
            className="filter-input price-input"
            min="0"
          />
          <input
            type="number"
            placeholder="Prix max (TND)"
            value={filters.maxPrice}
            onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
            className="filter-input price-input"
            min="0"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="filter-select"
          >
            <option value="">📊 Statut</option>
            <option value="Disponible">Disponible</option>
            <option value="Vendu">Vendu</option>
            <option value="Réservé">Réservé</option>
          </select>
          <button
            onClick={() => setFilters({ city: '', typeLogement: '', minPrice: '', maxPrice: '', status: '' })}
            className="clear-filters-btn"
          >
            🔄 Effacer
          </button>
        </div>

        {/* Projets */}
        {loading ? (
          <Loader />
        ) : filteredProjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏠</div>
            <h3>Aucun projet trouvé</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map(project => (
              <ProjectCard
                key={project._id}
                project={project}
                isFavorited={isFavorited(project._id)}
                onToggleFavorite={user && user.role === "Client" ? () => toggleFavorite(project._id) : null}
                onReserve={user && user.role === "Client" ? () => handleReserve(project._id) : null}
              />
            ))}
          </div>
        )}

        {/* MODAL DE RÉSERVATION */}
        {showReservationModal && (
          <ReservationModal
            projectId={selectedProject}
            onClose={handleCloseModal}
            onSaved={handleReservationSaved}
          />
        )}
      </div>
    </section>
  );
}