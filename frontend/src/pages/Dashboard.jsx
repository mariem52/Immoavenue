// src/pages/Dashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import "./Dashboard.css";
import {
  FaUsers,
  FaProjectDiagram,
  FaClipboardList,
  FaHeart,
  FaPlus,
  FaEnvelope,
  FaHome,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import ProjectModal from "../components/ProjectModal";

export default function Dashboard() {
  const { user, notify } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  // Data states
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [favoris, setFavoris] = useState([]);
  const [messages, setMessages] = useState([]);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  // Filters & search
  const [userSearch, setUserSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [projectTypeFilter, setProjectTypeFilter] = useState("");
  const [reservationSearch, setReservationSearch] = useState("");
  const [favoriSearch, setFavoriSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");

  // Fonction pour les URLs d'images
  const getImageUrl = (image) => {
    if (!image) return '/default-image.jpg';
    if (image.startsWith("data:image")) return image;
    if (!image.startsWith("http")) return `http://localhost:5000/uploads/projects/${image}`;
    return image;
  };

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    try {
      const [usersRes, projectsRes, reservationsRes, favorisRes, messagesRes] =
        await Promise.all([
          api.get("/users", config).catch(() => ({ data: [] })),
          api.get("/projects", config).catch(() => ({ data: [] })),
          api.get("/reservations", config).catch(() => ({ data: [] })),
          api.get("/favoris", config).catch(() => ({ data: [] })),
          api.get("/messages", config).catch(() => ({ data: [] })),
        ]);

      setUsers(usersRes.data || []);
      setProjects(projectsRes.data || []);
      setReservations(reservationsRes.data || []);
      setFavoris(favorisRes.data || []);
      setMessages(messagesRes.data || []);
    } catch (err) {
      console.error("fetchData error", err);
      notify(err.response?.data?.message || "Erreur lors du chargement", "error");
    } finally {
      setLoading(false);
    }
  }, [user, notify]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Modal handlers
  const openModal = (project = null) => {
    setCurrentProject(project);
    setShowModal(true);
  };
  const closeModal = () => {
    setCurrentProject(null);
    setShowModal(false);
  };
  const onSaved = () => {
    fetchData();
  };

  // Generic delete
  const deleteItem = async (type, id) => {
    if (!window.confirm("Voulez-vous supprimer cet élément ?")) return;
    try {
      await api.delete(`/${type}/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      notify(`${type.slice(0, -1)} supprimé`, "success");

      switch (type) {
        case "users":
          setUsers((prev) => prev.filter((u) => u._id !== id));
          break;
        case "projects":
          setProjects((prev) => prev.filter((p) => p._id !== id));
          break;
        case "reservations":
          setReservations((prev) => prev.filter((r) => r._id !== id));
          break;
        case "favoris":
          setFavoris((prev) => prev.filter((f) => f._id !== id));
          break;
        case "messages":
          setMessages((prev) => prev.filter((m) => m._id !== id));
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(err);
      notify("Impossible de supprimer", "error");
    }
  };

  // Update reservation status
  const updateReservationStatus = async (id, currentStatus) => {
    try {
      const newStatus =
        currentStatus === "En attente"
          ? "Confirmée"
          : currentStatus === "Confirmée"
          ? "Refusée"
          : "En attente";
      const { data } = await api.put(
        `/reservations/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setReservations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: data.status } : r))
      );
      notify("Statut mis à jour ✅", "success");
    } catch (err) {
      console.error("updateReservationStatus error:", err);
      notify("Impossible de mettre à jour", "error");
    }
  };

  // Helpers
  const getMessageContent = (m) => m.contenu || m.message || m.content || "";
  const getMessageEmail = (m) => m.email || m.from || m.senderEmail || "";

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  // Filtering
  const filteredUsers = users.filter((u) =>
    `${u.nom || ""} ${u.prenom || ""} ${u.email || ""}`
      .toLowerCase()
      .includes(userSearch.toLowerCase())
  );

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = (p.title || "")
      .toLowerCase()
      .includes(projectSearch.toLowerCase());
    const matchesType = projectTypeFilter ? p.typeLogement === projectTypeFilter : true;
    return matchesSearch && matchesType;
  });

  const filteredReservations = reservations.filter((r) =>
    ((r.userId?.nom || r.userId?.email || "") + (r.propertyId?.title || ""))
      .toLowerCase()
      .includes(reservationSearch.toLowerCase())
  );

  const filteredFavoris = favoris.filter((f) =>
    ((f.userId?.nom || "") + (f.projectId?.title || ""))
      .toLowerCase()
      .includes(favoriSearch.toLowerCase())
  );

  const filteredMessages = messages.filter((m) =>
    `${getMessageEmail(m)} ${getMessageContent(m)}`
      .toLowerCase()
      .includes(messageSearch.toLowerCase())
  );

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Dashboard</h2>
        <div className="menu">
          <button
            className={activeSection === "dashboard" ? "active" : ""}
            onClick={() => handleSectionClick("dashboard")}
          >
            <FaHome /> Tableau de bord
          </button>

          {user.role === "Admin" && (
            <button
              className={activeSection === "users" ? "active" : ""}
              onClick={() => handleSectionClick("users")}
            >
              <FaUsers /> Utilisateurs
            </button>
          )}

          {(user.role === "Admin" || user.role === "ChefProjet") && (
            <>
              <button
                className={activeSection === "projects" ? "active" : ""}
                onClick={() => handleSectionClick("projects")}
              >
                <FaProjectDiagram /> Projets
              </button>
              <button className="btn create-project" onClick={() => openModal()}>
                <FaPlus /> Nouveau projet
              </button>
              <button
                className={activeSection === "reservations" ? "active" : ""}
                onClick={() => handleSectionClick("reservations")}
              >
                <FaClipboardList /> Réservations
              </button>
            </>
          )}

          {user.role === "Admin" && (
            <>
              <button
                className={activeSection === "favoris" ? "active" : ""}
                onClick={() => handleSectionClick("favoris")}
              >
                <FaHeart /> Favoris
              </button>
              <button
                className={activeSection === "messages" ? "active" : ""}
                onClick={() => handleSectionClick("messages")}
              >
                <FaEnvelope /> Messages
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="content">
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Dashboard stats */}
            {activeSection === "dashboard" && (
              <div className="stats-cards">
                <div className="stat-card users">
                  <h3>Utilisateurs</h3>
                  <p>{users.length}</p>
                </div>
                <div className="stat-card projects">
                  <h3>Projets</h3>
                  <p>{projects.length}</p>
                </div>
                <div className="stat-card reservations">
                  <h3>Réservations</h3>
                  <p>{reservations.length}</p>
                </div>
                <div className="stat-card favoris">
                  <h3>Favoris</h3>
                  <p>{favoris.length}</p>
                </div>
                <div className="stat-card messages">
                  <h3>Messages</h3>
                  <p>{messages.length}</p>
                </div>
              </div>
            )}

            {/* Users */}
            {activeSection === "users" && (
              <>
                <div className="section-header">
                  <h3>Utilisateurs ({users.length})</h3>
                </div>
                <input
                  className="search-bar"
                  type="text"
                  placeholder="Rechercher utilisateur..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
                <table>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Email</th>
                      <th>Rôle</th>
                      <th>Date création</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u._id}>
                        <td>{u.nom}</td>
                        <td>{u.prenom}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`badge badge-blue`}>{u.role}</span>
                        </td>
                        <td>{new Date(u.createdAt || u.dateCreation).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="btn delete"
                            onClick={() => deleteItem("users", u._id)}
                            title="Supprimer"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {/* Projects */}
            {activeSection === "projects" && (
              <>
                <div className="filters-row">
                  <input
                    className="search-bar"
                    type="text"
                    placeholder="Rechercher projet..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                  />
                  <select
                    className="select-filter"
                    value={projectTypeFilter}
                    onChange={(e) => setProjectTypeFilter(e.target.value)}
                  >
                    <option value="">Tous</option>
                    <option value="Appartement">Appartement</option>
                    <option value="Maison">Maison</option>
                    <option value="Studio">Studio</option>
                    <option value="Villa">Villa</option>
                  </select>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Titre</th>
                      <th>Description</th>
                      <th>Ville</th>
                      <th>Adresse</th>
                      <th>Prix</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((p) => (
                      <tr key={p._id}>
                        <td>
                          {p.image ? (
                            <img
                              src={getImageUrl(p.image)}
                              alt={p.title}
                              className="project-img"
                              onError={(e) => { e.target.src = "/default-image.jpg"; }}
                            />
                          ) : (
                            <span className="badge badge-gray">No img</span>
                          )}
                        </td>
                        <td>{p.title}</td>
                        <td className="td-desc">{p.description}</td>
                        <td>{p.city}</td>
                        <td>{p.address}</td>
                        <td>{p.price} DT</td>
                        <td>
                          <span className={`badge badge-blue`}>{p.typeLogement}</span>
                        </td>
                        <td>
                          <span className={`badge ${p.status === "Disponible" ? "badge-green" : "badge-red"}`}>
                            {p.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn update" onClick={() => openModal(p)} title="Modifier">
                            <FaEdit />
                          </button>
                          <button className="btn delete" onClick={() => deleteItem("projects", p._id)} title="Supprimer">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {/* Reservations */}
            {activeSection === "reservations" && (
              <>
                <div className="section-header">
                  <h3>Réservations ({reservations.length})</h3>
                </div>
                <input
                  className="search-bar"
                  type="text"
                  placeholder="Rechercher réservation..."
                  value={reservationSearch}
                  onChange={(e) => setReservationSearch(e.target.value)}
                />
                <table>
                  <thead>
                    <tr>
                      <th>Utilisateur</th>
                      <th>Projet</th>
                      <th>Du</th>
                      <th>Au</th>
                      <th>Statut</th>
                      <th>Date création</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.map((r) => (
                      <tr key={r._id}>
                        <td>{r.userId?.nom || r.userId}</td>
                        <td>{r.propertyId?.title || r.propertyId}</td>
                        <td>{new Date(r.dateDebut).toLocaleDateString()}</td>
                        <td>{new Date(r.dateFin).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${
                            r.status === "Confirmée" ? "badge-green" :
                            r.status === "Refusée" ? "badge-red" : "badge-yellow"
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td>{new Date(r.createdAt || r.dateCreation).toLocaleDateString()}</td>
                        <td>
                          <button className="btn update" onClick={() => updateReservationStatus(r._id, r.status)}>
                            Mettre à jour
                          </button>
                          <button className="btn delete" onClick={() => deleteItem("reservations", r._id)}>
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {/* Favoris */}
            {activeSection === "favoris" && (
              <>
                <input
                  className="search-bar"
                  type="text"
                  placeholder="Rechercher favori..."
                  value={favoriSearch}
                  onChange={(e) => setFavoriSearch(e.target.value)}
                />
                <table>
                  <thead>
                    <tr>
                      <th>Utilisateur</th>
                      <th>Projet</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFavoris.map((f) => (
                      <tr key={f._id}>
                        <td>{f.userId?.nom || f.userId}</td>
                        <td>{f.projectId?.title || f.projectId}</td>
                        <td>
                          <button className="btn delete" onClick={() => deleteItem("favoris", f._id)}>
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {/* Messages */}
            {activeSection === "messages" && (
              <>
                <div className="section-header">
                  <h3>Messages ({messages.length})</h3>
                </div>
                <input
                  className="search-bar"
                  type="text"
                  placeholder="Rechercher message..."
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                />
                <table>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMessages.map((m) => (
                      <tr key={m._id}>
                        <td>{getMessageEmail(m)}</td>
                        <td>{getMessageContent(m)}</td>
                        <td>{new Date(m.createdAt || m.dateCreation).toLocaleString()}</td>
                        <td>
                          <button className="btn delete" onClick={() => deleteItem("messages", m._id)}>
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}
      </main>

      {showModal && (
        <ProjectModal project={currentProject} onClose={closeModal} onSaved={onSaved} />
      )}
    </div>
  );
}