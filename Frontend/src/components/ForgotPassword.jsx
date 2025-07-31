import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(() => localStorage.getItem("resetUserId") || null);
  const [newPassword, setNewPassword] = useState("");

  // Step 1: Request OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/forgot-password", { email });
      setUserId(res.data.userId);
      localStorage.setItem("resetUserId", res.data.userId); // ✅ Persist userId
      alert("OTP sent to your email");
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/verify-forgot-otp", { userId, otp });
      alert("OTP verified successfully");
      setStep(3);
    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed");
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/reset-password", { userId, newPassword });
      alert("Password updated successfully");
      localStorage.removeItem("resetUserId");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
            <form onSubmit={handleSendOTP} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Send OTP
              </button>
            </form>
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

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
              >
                Update Password
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
