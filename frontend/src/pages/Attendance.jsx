// src/pages/Attendance.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Notification from "../components/Notification";
import "../styles/attendance.css";

export default function Attendance() {
  const { notify } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [history, setHistory] = useState([]);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const fetchAttendance = useCallback(async () => {
    try {
      const { data } = await api.get("/attendance/me", { params: { month } });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayAtt = data.find(
        (a) => new Date(a.date).getTime() === today.getTime()
      );

      setTodayAttendance(todayAtt || null);
      setHistory(data);
    } catch (err) {
      console.error(err);
      notify("Impossible de charger les pointages", "error");
    }
  }, [month, notify]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleClockIn = async () => {
    try {
      await api.post("/attendance/clock-in");
      notify("Pointage d'arrivée enregistré", "success");
      fetchAttendance();
    } catch (err) {
      console.error(err);
      notify(err.response?.data?.message || "Erreur Clock In", "error");
    }
  };

  const handleClockOut = async () => {
    try {
      await api.post("/attendance/clock-out");
      notify("Pointage de sortie enregistré", "success");
      fetchAttendance();
    } catch (err) {
      console.error(err);
      notify(err.response?.data?.message || "Erreur Clock Out", "error");
    }
  };

  return (
    <div className="attendance-page">
      <Notification />

      <div className="attendance-card">
        <h2>Pointage du jour</h2>
        {todayAttendance ? (
          <>
            <div className="attendance-status">
              {todayAttendance.clockIn && (
                <p>
                  Arrivée :{" "}
                  {new Date(todayAttendance.clockIn).toLocaleTimeString()}
                </p>
              )}
              {todayAttendance.clockOut && (
                <p>
                  Sortie :{" "}
                  {new Date(todayAttendance.clockOut).toLocaleTimeString()}
                </p>
              )}
              <p>Total heures : {todayAttendance.totalHours || 0} h</p>
            </div>
            <div className="attendance-buttons">
              <button
                className="btn clock-in"
                onClick={handleClockIn}
                disabled={!!todayAttendance.clockIn}
              >
                Clock In
              </button>
              <button
                className="btn clock-out"
                onClick={handleClockOut}
                disabled={!todayAttendance.clockIn || !!todayAttendance.clockOut}
              >
                Clock Out
              </button>
            </div>
          </>
        ) : (
          <div className="attendance-buttons">
            <button className="btn clock-in" onClick={handleClockIn}>
              Clock In
            </button>
          </div>
        )}
      </div>

      <div className="attendance-history">
        <h3>Historique des pointages</h3>

        <div className="attendance-filter">
          <label htmlFor="month">Filtrer par mois : </label>
          <input
            id="month"
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>

        {history.length === 0 ? (
          <p className="no-data">Aucun pointage disponible</p>
        ) : (
          <div className="attendance-table-wrapper">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Arrivée</th>
                  <th>Sortie</th>
                  <th>Total heures</th>
                </tr>
              </thead>
              <tbody>
                {history.map((att) => (
                  <tr key={att._id}>
                    <td>{new Date(att.date).toLocaleDateString()}</td>
                    <td>
                      {att.clockIn
                        ? new Date(att.clockIn).toLocaleTimeString()
                        : "-"}
                    </td>
                    <td>
                      {att.clockOut
                        ? new Date(att.clockOut).toLocaleTimeString()
                        : "-"}
                    </td>
                    <td>{att.totalHours || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
