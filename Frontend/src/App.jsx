import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import ForgotPassword from "./components/ForgotPassword";
import HomePage from "./Pages/HomePage";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // ✅ true if token exists
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
       

        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/signup" />} />

          {/* Authentication Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Pages Routes */}
          

          {/* Protected Profile Route */}
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/home"
            element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
