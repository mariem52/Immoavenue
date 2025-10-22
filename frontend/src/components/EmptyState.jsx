import React from "react";
export default function EmptyState({ title="Aucun résultat", subtitle="Essayez de modifier les filtres." }){
  return (
    <div className="card" style={{padding:24, textAlign:"center"}}>
      <h3 style={{marginBottom:6}}>{title}</h3>
      <div style={{color:"var(--muted)"}}>{subtitle}</div>
    </div>
  );
}
