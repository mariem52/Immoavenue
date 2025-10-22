import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Chargement...</p>; // <-- ne redirige pas avant d'avoir vérifié

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  return children;
}
