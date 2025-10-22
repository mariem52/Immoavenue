// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // restore user from localStorage
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");
    const nom = localStorage.getItem("nom");
    const prenom = localStorage.getItem("prenom");
    const id = localStorage.getItem("userId");

    if (token && email) {
      setUser({
        token,
        role: role || (email === process.env.REACT_APP_ADMIN_EMAIL ? "Admin" : "Client"),
        email,
        nom,
        prenom,
        _id: id,
      });
    }
    setLoading(false);
  }, []);

  const notify = (message, type = "success", timeout = 4000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), timeout);
  };

  const login = async (email, password) => {
    try {
      const payload = { email, motDePasse: password };
      const { data } = await api.post("/users/login", payload);

      const userObj = {
        token: data.token,
        role: data.role || (data.email === process.env.REACT_APP_ADMIN_EMAIL ? "Admin" : "Client"),
        email: data.email,
        nom: data.nom || "",
        prenom: data.prenom || "",
        _id: data._id || data.id || "",
      };

      // save in localStorage
      localStorage.setItem("token", userObj.token);
      localStorage.setItem("role", userObj.role);
      localStorage.setItem("email", userObj.email);
      localStorage.setItem("nom", userObj.nom);
      localStorage.setItem("prenom", userObj.prenom);
      localStorage.setItem("userId", userObj._id);

      setUser(userObj);
      notify("Connexion réussie ✅", "success");
      return data;
    } catch (err) {
      notify(err.response?.data?.message || err.message || "Erreur de connexion", "error");
      throw err;
    }
  };

  const register = async (payload) => {
    const { data } = await api.post("/users/register", payload);
    return data;
  };

  const loginWithGoogle = (token, userData = {}) => {
    if (userData.email === process.env.REACT_APP_ADMIN_EMAIL) {
      notify("Admin ne peut pas se connecter avec Google", "error");
      return;
    }

    const userObj = {
      token,
      role: userData.role || "Client",
      email: userData.email || "",
      nom: userData.nom || "",
      prenom: userData.prenom || "",
      _id: userData._id || "",
    };

    // save in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("role", userObj.role);
    localStorage.setItem("email", userObj.email);
    localStorage.setItem("nom", userObj.nom);
    localStorage.setItem("prenom", userObj.prenom);
    localStorage.setItem("userId", userObj._id);

    setUser(userObj);
    notify("Connexion Google réussie ✅", "success");
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    notify("Déconnecté", "success");
  };

  // 🔹 Nouvelle fonction updateProfile
  const updateProfile = async (formData) => {
    if (!user) throw new Error("Utilisateur non connecté");
    const { data } = await api.put("/users/edit", formData, {
      headers: { Authorization: `Bearer ${user.token}` },
    });

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);

    // mettre à jour localStorage
    localStorage.setItem("nom", updatedUser.nom);
    localStorage.setItem("prenom", updatedUser.prenom);
    localStorage.setItem("email", updatedUser.email);

    notify("Profil mis à jour ✅", "success");

    return updatedUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        loginWithGoogle,
        notify,
        notification,
        loading,
        updateProfile, // on expose la fonction
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
