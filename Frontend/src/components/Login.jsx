import { useState, useEffect } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaKey, FaArrowLeft, FaRedo } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = login form, 2 = OTP
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
useEffect(() => {
  const checkToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return; // No token, go to login

    try {
      // Try hitting a protected endpoint
      const res = await API.get("/auth/check-token", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.valid) {
        navigate("/home"); // Token is valid → skip login
      }
    } catch {
      localStorage.removeItem("token"); // Token expired or invalid
    }
  };

  checkToken();
}, [navigate]);

  // Clear OTP field when step changes
  useEffect(() => {
    if (step === 2) {
      setOtp("");
      startCountdown();
    }
  }, [step]);

  // Countdown for resend OTP
  useEffect(() => {
    if (countdown > 0 && resendDisabled) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  const startCountdown = () => {
    setCountdown(30);
    setResendDisabled(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      setUserId(res.data.userId);
      setStep(2);
      toast.success("OTP sent to your email!\n(OTP तुमच्या ईमेलवर पाठवला आहे!)", {
        position: "top-center",
        autoClose: 5000,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed\n(लॉगिन अयशस्वी)", {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

const handleVerifyOTP = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const res = await API.post("/auth/verify-login-otp", { userId, otp });
    
    // Save token locally
    localStorage.setItem("token", res.data.token);
    
    toast.success("Login successful!\n(लॉगिन यशस्वी!)", {
      position: "top-center",
      autoClose: 3000,
    });

    // Navigate to home page
    navigate("/home");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "OTP verification failed\n(OTP सत्यापन अयशस्वी)",
      { position: "top-center", autoClose: 5000 }
    );
  } finally {
    setIsLoading(false);
  }
};


  const handleResendOTP = async () => {
    try {
      await API.post("/auth/login", form); // Same endpoint as initial login
      startCountdown();
      toast.success("New OTP sent!\n(नवीन OTP पाठवला आहे!)", {
        position: "top-center",
        autoClose: 5000,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP\n(OTP पुन्हा पाठवणे अयशस्वी)", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <ToastContainer />
      <div className="border-2 border-blue-600 p-8 rounded-xl shadow-lg w-full max-w-md mx-4">
        {/* Logo/Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-24 h-24 mb-3">
            <img src={Logo} alt="Maharashtra Police Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Maharashtra Police</h1>
          <p className="text-lg font-medium text-gray-700">(महाराष्ट्र पोलीस)</p>
          <p className="text-blue-600 font-medium mt-2">Investigation Assistant</p>
          <p className="text-blue-500 text-sm">(चौकशी सहाय्यक)</p>
        </div>

        {step === 1 && (
          <>
            <h2 className="text-xl font-bold mb-6 text-center text-gray-700">
              Login
              <br />
              <span className="text-lg">(लॉगिन)</span>
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email (ईमेल)"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  autoFocus
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password (पासवर्ड)"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                  isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors flex justify-center items-center`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                    <br />
                    <span className="text-sm">(प्रक्रिया करत आहे...)</span>
                  </>
                ) : (
                  <>
                    Login
                    <br />
                    <span className="text-sm">(लॉगिन)</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center space-y-3">
              <p className="text-gray-600">
                Don't have an account?
                <br />
                <span className="text-sm">(खाते नाही?)</span>
                <br />
                <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign Up (नोंदणी करा)
                </Link>
              </p>
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm block"
              >
                Forgot Password?
                <br />
                <span className="text-xs">(पासवर्ड विसरलात?)</span>
              </Link>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <button
              onClick={() => setStep(1)}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <FaArrowLeft className="mr-1" /> Back (मागे)
            </button>
            
            <h2 className="text-xl font-bold mb-6 text-center text-gray-700">
              Verify OTP
              <br />
              <span className="text-lg">(OTP सत्यापित करा)</span>
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Enter the OTP sent to your email
              <br />
              <span className="text-sm">(तुमच्या ईमेलवर पाठवलेला OTP प्रविष्ट करा)</span>
            </p>
            
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaKey className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Enter OTP (OTP प्रविष्ट करा)"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                  isLoading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                } transition-colors flex justify-center items-center`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                    <br />
                    <span className="text-sm">(सत्यापित करत आहे...)</span>
                  </>
                ) : (
                  <>
                    Verify OTP
                    <br />
                    <span className="text-sm">(OTP सत्यापित करा)</span>
                  </>
                )}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendDisabled}
                  className={`text-blue-600 hover:text-blue-800 font-medium flex flex-col items-center justify-center mx-auto ${
                    resendDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <FaRedo className="mr-2" />
                    {resendDisabled ? 
                      <>Resend OTP in {countdown}s</> : 
                      <>Resend OTP</>}
                  </div>
                  <span className="text-sm">
                    {resendDisabled ? 
                      <>(OTP पुन्हा पाठवा {countdown}s मध्ये)</> : 
                      <>(OTP पुन्हा पाठवा)</>}
                  </span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}