import React from "react";
export default function Unauthorized(){
  return (
    <section className="section">
      <div className="container">
        <div className="card" style={{padding:24}}>
          <h2>Accès refusé</h2>
          <p>Vous n’avez pas les droits pour accéder à cette page.</p>
        </div>
      </div>
    </section>
  );
}
