import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Favorites from "./pages/Favorites";
import Reservations from "./pages/Reservations";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import Notification from "./components/Notification";
import "./styles/notification.css"; // ensure styles loaded
import Verify from "./pages/Verify";
import GoogleSuccess from "./pages/GoogleSuccess";
import GoogleLogin from "./pages/GoogleLogin";
import Profile from "./pages/Profile";
import ChangePasswordForm from "./components/ChangePasswordForm";
import EditProfileForm from "./components/EditProfileForm";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Notification />
        <Navbar /> {/* Navbar gère maintenant le lien Pointage selon le rôle */}
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/favorites"
              element={
                <PrivateRoute roles={["Client"]}>
                  <Favorites />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute roles={["Client"]}>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <PrivateRoute roles={["Client"]}>
                  <EditProfileForm />
                </PrivateRoute>
              }
            />

            <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route
              path="/edit"
              element={
                <PrivateRoute roles={["Client"]}>
                  <ChangePasswordForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/reservations"
              element={
                <PrivateRoute roles={["Client", "Admin", "ChefProjet"]}>
                  <Reservations />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute roles={["Admin", "ChefProjet"]}>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Page de pointage */}
            <Route
              path="/attendance"
              element={
                <PrivateRoute roles={["Employe", "ChefProjet"]}>
                  <Attendance />
                </PrivateRoute>
              }
            />
  <Route path="/verify/:token" element={<Verify />} />
  <Route path="/google-login" element={<GoogleLogin />} />
  <Route path="/google-success" element={<GoogleSuccess />} />
  <Route path="/contact" element={<Contact />} />

            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
