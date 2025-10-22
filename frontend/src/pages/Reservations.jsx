import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";

export default function Reservations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { notify, user } = useAuth();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Correction de la route : "/reservations/me" au lieu de "/reservations/my"
      const { data } = await api.get("/reservations/me");
      setItems(data);
    } catch (err) {
      console.error("load reservations", err);
      notify(err.response?.data?.message || "Erreur lors du chargement des réservations", "error");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    if (user) {
      load();
    }
  }, [load, user]);

  const cancel = async (id) => {
    if (!window.confirm("Annuler cette réservation ?")) return;
    try {
      await api.put(`/reservations/${id}`, { status: "Annulée" });
      notify("Réservation annulée", "success");
      load();
    } catch (err) {
      console.error("cancel res", err);
      notify("Impossible d'annuler", "error");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmée': return '#28a745';
      case 'Annulée': return '#dc3545';
      case 'Refusée': return '#ffc107';
      case 'Terminée': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  return (
    <section className="section">
      <div className="container">
        <h2>Mes réservations</h2>
        {loading ? (
          <Loader />
        ) : items.length ? (
          <div className="card" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: 12 }}>Bien</th>
                  <th style={{ textAlign: "left", padding: 12 }}>Adresse</th>
                  <th style={{ textAlign: "left", padding: 12 }}>Du</th>
                  <th style={{ textAlign: "left", padding: 12 }}>Au</th>
                  <th style={{ textAlign: "left", padding: 12 }}>Statut</th>
                  <th style={{ textAlign: "left", padding: 12 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r._id} style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: 12 }}>
                      <strong>{r.propertyId?.title}</strong>
                    </td>
                    <td style={{ padding: 12 }}>
                      {r.propertyId?.address}, {r.propertyId?.city}
                    </td>
                    <td style={{ padding: 12 }}>
                      {new Date(r.dateDebut).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={{ padding: 12 }}>
                      {new Date(r.dateFin).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={{ padding: 12 }}>
                      <span style={{
                        color: getStatusColor(r.status),
                        fontWeight: 'bold',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: getStatusColor(r.status) + '20'
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: 12 }}>
                      {r.status === 'En attente' && (
                        <button 
                          className="btn secondary" 
                          onClick={() => cancel(r._id)}
                          style={{ marginRight: '8px' }}
                        >
                          Annuler
                        </button>
                      )}

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState 
            title="Aucune réservation" 
            subtitle="Réservez une visite depuis la page des projets." 
          />
        )}
      </div>
    </section>
  );
}