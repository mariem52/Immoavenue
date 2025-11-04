import React from 'react';
import './StatisticsCharts.css';

const StatisticsCharts = ({ projects = [], reservations = [], favoris = [] }) => {
  // Vérifications de sécurité
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeReservations = Array.isArray(reservations) ? reservations : [];
  const safeFavoris = Array.isArray(favoris) ? favoris : [];

  // Statistique des projets les plus favoris
  const getMostLikedProjects = () => {
    const projectFavorisCount = {};
    
    safeFavoris.forEach(fav => {
      if (!fav) return;
      const projectId = fav.projectId?._id || fav.projectId;
      if (projectId) {
        projectFavorisCount[projectId] = (projectFavorisCount[projectId] || 0) + 1;
      }
    });

    return safeProjects
      .filter(project => project && project._id)
      .map(project => ({
        name: project.title || 'Sans titre',
        favoris: projectFavorisCount[project._id] || 0,
      }))
      .sort((a, b) => b.favoris - a.favoris)
      .slice(0, 5);
  };

  // Statistique des projets les plus réservés
  const getMostReservedProjects = () => {
    const projectReservationsCount = {};
    
    safeReservations.forEach(res => {
      if (!res) return;
      const projectId = res.propertyId?._id || res.propertyId;
      if (projectId) {
        projectReservationsCount[projectId] = (projectReservationsCount[projectId] || 0) + 1;
      }
    });

    return safeProjects
      .filter(project => project && project._id)
      .map(project => ({
        name: project.title || 'Sans titre',
        reservations: projectReservationsCount[project._id] || 0,
      }))
      .sort((a, b) => b.reservations - a.reservations)
      .slice(0, 5);
  };

  // Statistique par type de logement
  const getProjectsByType = () => {
    const typeCount = {};
    
    safeProjects
      .filter(project => project && project.typeLogement)
      .forEach(project => {
        const type = project.typeLogement || 'Non spécifié';
        typeCount[type] = (typeCount[type] || 0) + 1;
      });

    const total = safeProjects.length;
    return Object.entries(typeCount).map(([type, count]) => ({
      name: type,
      value: count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }));
  };

  // Statistique des statuts de réservations
  const getReservationStatusStats = () => {
    const statusCount = {};
    
    safeReservations
      .filter(res => res && res.status)
      .forEach(res => {
        const status = res.status || 'Non spécifié';
        statusCount[status] = (statusCount[status] || 0) + 1;
      });

    const total = safeReservations.length;
    return Object.entries(statusCount).map(([status, count]) => ({
      name: status,
      value: count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }));
  };

  const mostLikedProjects = getMostLikedProjects();
  const mostReservedProjects = getMostReservedProjects();
  const projectsByType = getProjectsByType();
  const reservationStatusStats = getReservationStatusStats();

  // Trouver les valeurs max pour l'échelle
  const maxFavoris = Math.max(...mostLikedProjects.map(p => p.favoris), 1);
  const maxReservations = Math.max(...mostReservedProjects.map(p => p.reservations), 1);

  if (safeProjects.length === 0) {
    return (
      <div className="statistics-charts">
        <h3>📊 Statistiques des Projets</h3>
        <div className="no-data">
          <p>Aucune donnée disponible pour afficher les statistiques</p>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics-charts">
      <h3>📊 Statistiques des Projets</h3>
      
      <div className="charts-grid">
        {/* Graphique à barres - Projets les plus favoris */}
        <div className="chart-card">
          <h4>❤️ Projets les Plus Aimés</h4>
          <div className="bar-chart-container">
            {mostLikedProjects.map((project, index) => (
              <div key={index} className="bar-item">
                <div className="bar-label">
                  <span className="project-name" title={project.name}>
                    {project.name.length > 20 ? project.name.substring(0, 20) + '...' : project.name}
                  </span>
                  <span className="bar-value">{project.favoris} favoris</span>
                </div>
                <div className="bar-track">
                  <div 
                    className="bar-fill"
                    style={{ 
                      width: `${(project.favoris / maxFavoris) * 100}%`,
                      backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][index]
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graphique en barres horizontales - Types de logements */}
        <div className="chart-card">
          <h4>🏠 Types de Logements</h4>
          <div className="horizontal-bar-chart">
            {projectsByType.map((type, index) => (
              <div key={index} className="horizontal-bar-item">
                <div className="bar-info">
                  <span className="bar-label">{type.name}</span>
                  <span className="bar-percentage">{type.percentage.toFixed(1)}%</span>
                </div>
                <div className="horizontal-bar-track">
                  <div 
                    className="horizontal-bar-fill"
                    style={{ 
                      width: `${type.percentage}%`,
                      backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][index]
                    }}
                  >
                    <span className="bar-count">{type.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Graphique à barres - Projets les plus réservés */}
        <div className="chart-card">
          <h4>📅 Projets les Plus Réservés</h4>
          <div className="bar-chart-container">
            {mostReservedProjects.map((project, index) => (
              <div key={index} className="bar-item">
                <div className="bar-label">
                  <span className="project-name" title={project.name}>
                    {project.name.length > 20 ? project.name.substring(0, 20) + '...' : project.name}
                  </span>
                  <span className="bar-value">{project.reservations} réservations</span>
                </div>
                <div className="bar-track">
                  <div 
                    className="bar-fill"
                    style={{ 
                      width: `${(project.reservations / maxReservations) * 100}%`,
                      backgroundColor: ['#A8E6CF', '#DCEDC1', '#FFD3B6', '#FFAAA5', '#FF8B94'][index]
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Graphique en barres horizontales - Statut des réservations */}
        <div className="chart-card">
          <h4>📋 Statut des Réservations</h4>
          <div className="horizontal-bar-chart">
            {reservationStatusStats.map((status, index) => (
              <div key={index} className="horizontal-bar-item">
                <div className="bar-info">
                  <span className="bar-label">{status.name}</span>
                  <span className="bar-percentage">{status.percentage.toFixed(1)}%</span>
                </div>
                <div className="horizontal-bar-track">
                  <div 
                    className="horizontal-bar-fill"
                    style={{ 
                      width: `${status.percentage}%`,
                      backgroundColor: ['#A8E6CF', '#DCEDC1', '#FFD3B6', '#FFAAA5', '#FF8B94'][index]
                    }}
                  >
                    <span className="bar-count">{status.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cartes de résumé */}
      <div className="stats-summary-cards">
        <div className="summary-card primary">
          <div className="summary-icon">⭐</div>
          <div className="summary-content">
            <h5>Projet le Plus Populaire</h5>
            <p>{mostLikedProjects[0]?.name || 'Aucun'}</p>
            <span>{mostLikedProjects[0]?.favoris || 0} favoris</span>
          </div>
        </div>

        <div className="summary-card success">
          <div className="summary-icon">🔥</div>
          <div className="summary-content">
            <h5>Projet le Plus Réservé</h5>
            <p>{mostReservedProjects[0]?.name || 'Aucun'}</p>
            <span>{mostReservedProjects[0]?.reservations || 0} réservations</span>
          </div>
        </div>

        <div className="summary-card info">
          <div className="summary-icon">📊</div>
          <div className="summary-content">
            <h5>Taux de Réservation</h5>
            <p>{((safeReservations.length / Math.max(safeProjects.length, 1)) * 100).toFixed(1)}%</p>
            <span>{safeReservations.length} / {safeProjects.length} projets</span>
          </div>
        </div>

        <div className="summary-card warning">
          <div className="summary-icon">❤️</div>
          <div className="summary-content">
            <h5>Taux de Favoris</h5>
            <p>{((safeFavoris.length / Math.max(safeProjects.length, 1)) * 100).toFixed(1)}%</p>
            <span>{safeFavoris.length} / {safeProjects.length} projets</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCharts;