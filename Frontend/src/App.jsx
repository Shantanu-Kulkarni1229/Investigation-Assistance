import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import HomePage from "./Pages/HomePage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  // ✅ Check auth dynamically
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [location]);

  // ✅ Show/Hide Botpress widget based on route
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

        {/* Authentication Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        
        <Route
          path="/home"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
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
