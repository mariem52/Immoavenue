// src/components/Notification.jsx
import React from "react";
import "../styles/notification.css";
import { useAuth } from "../context/AuthContext";

export default function Notification(){
  const { notification, setNotification } = useAuth();

  if(!notification) return null;

  const { message, type } = notification;

  return (
    <div className={`notification ${type}`}>
      <div className="msg">{message}</div>
      <button className="close" onClick={()=>setNotification(null)}>✕</button>
    </div>
  );
}
