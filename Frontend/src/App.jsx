import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Components/Signup.JSX";
import Login from "./components/Login";
import Profile from "./components/Profile";
import ForgotPassword from "./components/ForgotPassword";


function App() {
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

          {/* Protected Profile Route */}
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
