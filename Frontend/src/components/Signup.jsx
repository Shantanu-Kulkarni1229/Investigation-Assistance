import { useState, useEffect } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import { FaUserShield, FaEnvelope, FaLock, FaKey, FaArrowLeft, FaCheck, FaTimes, FaRedo } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from "../assets/logo.png";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  
  const [passwordChecks, setPasswordChecks] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasUpperCase: false,
  });

  // Clear OTP field and start countdown when step changes to 2
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
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (name === "password") {
      setPasswordChecks({
        minLength: value.length >= 8,
        hasNumber: /\d/.test(value),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        hasUpperCase: /[A-Z]/.test(value),
      });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.post("/auth/signup", form);
      setUserId(res.data.userId);
      setStep(2);
      toast.success("OTP sent to your email!\n(OTP तुमच्या ईमेलवर पाठवला आहे!)", {
        position: "top-center",
        autoClose: 5000,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed\n(नोंदणी अयशस्वी)", {
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
      await API.post("/auth/verify-signup-otp", { email: form.email, otp });
      toast.success("Signup successful! You can now log in.\n(नोंदणी यशस्वी! आता तुम्ही लॉगिन करू शकता.)", {
        position: "top-center",
        autoClose: 2000,
        onClose: () => navigate("/login"),
      });
    } catch (error) {
      console.error("OTP Error:", error.response?.data);
      toast.error(error.response?.data?.message || "OTP verification failed\n(OTP सत्यापन अयशस्वी)", {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await API.post("/auth/signup", form); // Same endpoint as initial signup
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

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

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
              Create Your Account
              <br />
              <span className="text-lg">(खाते तयार करा)</span>
            </h2>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserShield className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name (पूर्ण नाव)"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

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

              {/* Password requirements */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium mb-2">Password Requirements
                  <br />
                  <span className="text-xs">(पासवर्ड आवश्यकता)</span>
                </p>
                <ul className="text-xs space-y-1">
                  <li className={`flex items-center ${passwordChecks.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordChecks.minLength ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                    Minimum 8 characters (किमान 8 वर्ण)
                  </li>
                  <li className={`flex items-center ${passwordChecks.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordChecks.hasNumber ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                    At least one number (किमान एक संख्या)
                  </li>
                  <li className={`flex items-center ${passwordChecks.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordChecks.hasSpecialChar ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                    At least one special character (किमान एक विशेष वर्ण)
                  </li>
                  <li className={`flex items-center ${passwordChecks.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordChecks.hasUpperCase ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                    At least one uppercase letter (किमान एक मोठे अक्षर)
                  </li>
                </ul>
              </div>

                <button
                type="submit"
                disabled={isLoading || !isPasswordValid}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                  isLoading || !isPasswordValid ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
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
                    Sign Up
                    <br />
                    <span className="text-sm">(नोंदणी करा)</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Already have an account?
                <br />
                <span className="text-sm">(आधीपासून खाते आहे?)</span>
                <br />
                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Login here (येथे लॉगिन करा)
                </Link>
              </p>
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
              Verify Your Email
              <br />
              <span className="text-lg">(तुमचा ईमेल सत्यापित करा)</span>
            </h2>
            <p className="text-gray-600 text-center mb-6">
              We've sent an OTP to your email. Please enter it below.
              <br />
              <span className="text-sm">(आम्ही तुमच्या ईमेलवर OTP पाठवला आहे. कृपया ते खाली प्रविष्ट करा.)</span>
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
                  className={`text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center mx-auto ${
                    resendDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FaRedo className="mr-2" />
                  {resendDisabled ? 
                    <>Resend OTP in {countdown}s<br /><span className="text-sm">(OTP पुन्हा पाठवा {countdown}s मध्ये)</span></> : 
                    <>Resend OTP<br /><span className="text-sm">(OTP पुन्हा पाठवा)</span></>}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}