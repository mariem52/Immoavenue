import React, { useState } from "react";
import "./ProjectCard.css";

export default function ProjectCard({ project, isFavorited, onToggleFavorite, onEdit, onDelete, onReserve }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => setImageError(true);
  const handleImageLoad = () => setImageLoaded(true);

  const getImageUrl = (image) => {
    if (!image) return '/default-image.jpg';
    if (image.startsWith("data:image")) return image;
    if (!image.startsWith("http")) return `http://localhost:5000/uploads/projects/${image}`;
    return image;
  };

  const mainImage = project.image ? getImageUrl(project.image) : '/default-image.jpg';

  const formatPrice = (price) => new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 0
  }).format(price);

  const statusColors = {
    disponible: { bg: '#e8f5e8', text: '#2e7d32' },
    vendu: { bg: '#ffebee', text: '#c62828' },
    réservé: { bg: '#fff3e0', text: '#ef6c00' }
  };

  const statusConfig = statusColors[project.status?.toLowerCase()] || statusColors.disponible;

  return (
    <div className="project-card">
      <div className="project-image-container">
        <div className="image-wrapper">
          {!imageLoaded && !imageError && (
            <div className="image-skeleton">
              <div className="skeleton-shimmer"></div>
            </div>
          )}
          <img
            src={imageError ? "/default-image.jpg" : mainImage}
            alt={project.title}
            className={`project-image ${imageLoaded ? 'loaded' : ''}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </div>

        <div className="image-overlay">
          {onToggleFavorite && (
            <button
              className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(project._id); }}
              aria-label={isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <span className="favorite-icon">{isFavorited ? "❤️" : "🤍"}</span>
            </button>
          )}

          <span 
            className="project-status-badge"
            style={{ backgroundColor: statusConfig.bg, color: statusConfig.text }}
          >
            {project.status}
          </span>
        </div>
      </div>

      <div className="project-content">
        <h3 className="project-title" title={project.title}>{project.title}</h3>
        <div className="project-location">
          <span className="location-icon">📍</span>
          <span className="location-text">{project.address}, {project.city}</span>
        </div>
        <div className="project-details">
          <div className="price-section">
            <span className="price">{formatPrice(project.price)}</span>
          </div>
          <div className="type-badge">{project.typeLogement}</div>
        </div>
      </div>

      <div className="project-actions">
        {onReserve && (
          <button 
            className="btn btn-primary reserve-btn"
            onClick={() => onReserve(project._id)}
          >
            <span className="btn-icon">📅</span>
            <span className="btn-text">Réserver une visite</span>
          </button>
        )}

        <div className="action-buttons">
          {onEdit && (
            <button className="btn btn-secondary icon-btn" onClick={onEdit} title="Modifier">✏️</button>
          )}
          {onDelete && (
            <button className="btn btn-danger icon-btn" onClick={onDelete} title="Supprimer">🗑️</button>
          )}
        </div>
      </div>
    </div>
  );
}
