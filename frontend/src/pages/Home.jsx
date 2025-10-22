import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import ProjectCard from "../components/ProjectCard";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [exclusiveProjects, setExclusiveProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Charger les projets en vedette
      const featuredRes = await api.get("/projects?limit=3&featured=true");
      setFeaturedProjects(featuredRes.data);

      // Charger les exclusivités
      const exclusiveRes = await api.get("/projects?limit=2&exclusive=true");
      setExclusiveProjects(exclusiveRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
      // Données mockées basées sur votre modèle
      setFeaturedProjects([
        {
          _id: 1,
          title: "Résidence Les Jardins",
          description: "Appartement luxueux avec vue exceptionnelle",
          price: 450000,
          address: "16 Avenue Victor Hugo",
          city: "Tunis",
          typeLogement: "Appartement",
          status: "Disponible",
          image: "/api/placeholder/400/300"
        }
      ]);
      setExclusiveProjects([
        {
          _id: 2,
          title: "Villa Moderne",
          description: "Villa contemporaine avec piscine",
          price: 750000,
          address: "45 Chemin des Oliviers", 
          city: "Hammamet",
          typeLogement: "Villa",
          status: "Disponible",
          image: "/api/placeholder/400/300"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour formater le prix en DT
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Hero />
      
      {/* Section Exclusivités - Style Compass */}
      <section className="exclusives-section">
        <div className="container">
          <div className="section-header-compass">
            <h2>Exclusivités Immo Avenue</h2>
            <p>Soyez le premier à découvrir nos listings exclusifs avant leur mise sur le marché</p>
          </div>

          <div className="exclusives-grid">
            {exclusiveProjects.map(project => (
              <div key={project._id} className="exclusive-card">
                <div className="exclusive-badge">EXCLUSIVITÉ</div>
                <div className="exclusive-image">
                  <img 
                    src={project.image || "/default-property.jpg"} 
                    alt={project.title} 
                    onError={(e) => {
                      e.target.src = "/default-property.jpg";
                    }}
                  />
                </div>
                <div className="exclusive-content">
                  <h3>{project.title}</h3>
                  <div className="property-type">
                    <span className="type-badge">{project.typeLogement}</span>
                  </div>
                  <div className="property-address">
                    📍 {project.address}, {project.city}
                  </div>
                  <div className="property-status-price">
                    <span className={`status-badge status-${project.status?.toLowerCase()}`}>
                      {project.status}
                    </span>
                    <div className="property-price">
                      {formatPrice(project.price)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="exclusives-cta">
            <p>Travailler avec un agent Immo Avenue pour voir nos exclusivités privées</p>
            <Link to="/contact" className="btn btn-outline">
              Voir les exclusivités privées
            </Link>
          </div>
        </div>
      </section>

      {/* Section Statistiques Élégantes */}
      <section className="stats-section-compass">
        <div className="container">
          <div className="stats-grid-compass">
            <div className="stat-item-compass">
              <div className="stat-number">50+</div>
              <div className="stat-label">Projets disponibles</div>
            </div>
            <div className="stat-item-compass">
              <div className="stat-number">95%</div>
              <div className="stat-label">Clients satisfaits</div>
            </div>
            <div className="stat-item-compass">
              <div className="stat-number">500+</div>
              <div className="stat-label">Clients heureux</div>
            </div>
            <div className="stat-item-compass">
              <div className="stat-number">15+</div>
              <div className="stat-label">Villes couvertes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Services Premium */}
      <section className="services-section-compass">
        <div className="container">
          <div className="section-header-compass">
            <h2>Nos Services Immobiliers</h2>
            <p>Une expérience complète et personnalisée pour votre projet</p>
          </div>

          <div className="services-grid-compass">
            <div className="service-card-compass">
              <div className="service-icon">🏠</div>
              <h3>Projets Disponibles</h3>
              <p>Parcourez notre catalogue dynamique et réservez vos visites en ligne facilement.</p>
              <Link to="/projects" className="service-link">
                Voir les projets →
              </Link>
            </div>

            <div className="service-card-compass">
              <div className="service-icon">📋</div>
              <h3>Mes Réservations</h3>
              <p>Suivez en temps réel l'état de vos demandes et planifiez vos visites.</p>
              <Link to="/reservations" className="service-link">
                Mes réservations →
              </Link>
            </div>

            <div className="service-card-compass">
              <div className="service-icon">❤️</div>
              <h3>Favoris</h3>
              <p>Créez votre collection de biens préférés et recevez des alertes personnalisées.</p>
              <Link to="/favorites" className="service-link">
                Mes favoris →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section Projets en Vedette */}
      {featuredProjects.length > 0 && (
        <section className="featured-section-compass">
          <div className="container">
            <div className="section-header-compass">
              <h2>Projets en Vedette</h2>
              <p>Découvrez nos propriétés les plus exclusives et demandées</p>
            </div>

            <div className="featured-grid-compass">
              {featuredProjects.map(project => (
                <ProjectCard 
                  key={project._id}
                  project={project}
                  showFavorite={true}
                />
              ))}
            </div>

            <div className="text-center">
              <Link to="/projects" className="btn btn-primary btn-large">
                Voir tous les projets
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Final Élégant */}
      <section className="cta-section-compass">
        <div className="container">
          <div className="cta-content-compass">
            <h2>Prêt à trouver votre propriété idéale ?</h2>
            <p>Rejoignez notre communauté de clients satisfaits et démarrez votre recherche aujourd'hui</p>
            <div className="cta-actions">
              {user ? (
                <Link to="/projects" className="btn btn-primary btn-large">
                  Explorer les projets
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-large">
                    Créer un compte
                  </Link>
                  <Link to="/login" className="btn btn-secondary btn-large">
                    Se connecter
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}