import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ProjectDetails(){
  const { id } = useParams();
  const [project,setProject] = useState(null);
  const { user } = useAuth();

  useEffect(()=>{
    (async ()=>{
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
    })();
  },[id]);

  const reserve = async ()=>{
    if(!user){ alert("Veuillez vous connecter."); return; }
    await api.post("/reservations", {
      propertyId: id,
      userId: user._id || undefined, // backend will take from token if needed
      date: new Date()
    });
    alert("Demande de réservation envoyée !");
  };

  const addFav = async ()=>{
    if(!user){ alert("Veuillez vous connecter."); return; }
    await api.post("/favoris", { projectId: id });
    alert("Ajouté aux favoris.");
  };

  if(!project) return <section className="section"><div className="container">Chargement…</div></section>;

  return (
    <section className="section">
      <div className="container">
        <div className="grid" style={{gridTemplateColumns:"1.5fr 1fr"}}>
          <div className="card" style={{overflow:"hidden"}}>
            <img src={project.images?.[0] || "https://picsum.photos/1200/800"} alt={project.title}/>
          </div>
          <div>
            <div className="card" style={{padding:18}}>
              <h2>{project.title}</h2>
              <div style={{color:"var(--muted)"}}>{project.city} • {project.address}</div>
              <div style={{marginTop:12,fontWeight:800,color:"var(--brand-orange)"}}>
                {project.price?.toLocaleString()} TND
              </div>
              <p style={{marginTop:12}}>{project.description}</p>
              <div style={{display:"flex", gap:10}}>
                <button className="btn" onClick={reserve}>Demander une réservation</button>
                <button className="btn secondary" onClick={addFav}>Ajouter aux favoris</button>
              </div>
            </div>
            {project.planPDF && (
              <div className="card" style={{padding:18, marginTop:12}}>
                <a className="btn secondary" href={project.planPDF} target="_blank" rel="noreferrer">Télécharger le plan</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
