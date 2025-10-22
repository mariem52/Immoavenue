import React, { useState } from "react";

export default function FilterBar({ onChange }){
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");

  const apply = ()=>{
    onChange({ q, city, type, status, sort });
  };

  return (
    <div className="card" style={{padding:12, marginBottom:16}}>
      <div style={{display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", gap:10}}>
        <input className="input" placeholder="Rechercher..." value={q} onChange={e=>setQ(e.target.value)} />
        <input className="input" placeholder="Ville" value={city} onChange={e=>setCity(e.target.value)} />
        <select className="input" value={type} onChange={e=>setType(e.target.value)}>
          <option value="">Type</option>
          <option>Appartement</option>
          <option>Villa</option>
          <option>Local</option>
        </select>
        <select className="input" value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">Statut</option>
          <option>Disponible</option>
          <option>Vendu</option>
        </select>
        <select className="input" value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="">Trier</option>
          <option value="priceAsc">Prix ↑</option>
          <option value="priceDesc">Prix ↓</option>
          <option value="dateDesc">Plus récent</option>
        </select>
      </div>
      <div style={{marginTop:10, display:"flex", gap:10, justifyContent:"flex-end"}}>
        <button className="btn secondary" onClick={()=>{
          setQ("");setCity("");setType("");setStatus("");setSort("");
          onChange({});
        }}>Réinitialiser</button>
        <button className="btn" onClick={apply}>Appliquer</button>
      </div>
    </div>
  );
}
