import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import HomePage from "./Pages/HomePage";
import AdminLogin from "./admin/AdminLogin";

import AdminDashboard from "./admin/AdminDashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const location = useLocation();

  // ✅ Check normal user auth
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    const adminToken = localStorage.getItem("adminToken");
    setIsAdminAuthenticated(!!adminToken);
  }, [location]);

  // ✅ Show/Hide Botpress widget on /home only
  useEffect(() => {
    const widget = document.getElementById("bp-web-widget");
    if (widget) {
      widget.style.display = location.pathname === "/home" ? "block" : "none";
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/signup" />} />

        {/* User Auth Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* User Protected Route */}
        <Route
          path="/home"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/dashboard"
          element={isAdminAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" />}
        />
       

      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
