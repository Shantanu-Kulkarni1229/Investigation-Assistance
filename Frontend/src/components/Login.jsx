import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = login form, 2 = OTP

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Login Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      setUserId(res.data.userId);
      setStep(2); // Go to OTP screen
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  // Handle OTP Verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/verify-login-otp", { userId, otp });
      
      // Store JWT token in localStorage
      localStorage.setItem("token", res.data.token);

      alert("Login successful!");
      navigate("/profile");
    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Login
              </button>
            </form>
            {/* Forgot Password Link */}
            <div className="text-center mt-4">
              <Link
                to="/forgot-password"
                className="text-blue-500 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Verify OTP</h2>
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Verify OTP
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
