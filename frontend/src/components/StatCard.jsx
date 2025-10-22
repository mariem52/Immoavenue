import React from "react";
import "./StatCard.css";

export default function StatCard({ title, count, color, icon }) {
  return (
    <div className="stat-card" style={{ borderLeft: `5px solid ${color}` }}>
      <div className="stat-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className="stat-info">
        <h3>{count}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
}
