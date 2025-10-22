import React from "react";
export default function NotFound(){
  return (
    <section className="section">
      <div className="container">
        <div className="card" style={{padding:24}}>
          <h2>Page introuvable</h2>
          <p>La page demandée n’existe pas.</p>
        </div>
      </div>
    </section>
  );
}
