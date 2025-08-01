import { useEffect, useState } from "react";
import API from "../api";
import logo from "../assets/Logo.png"; // Add your logo in public or assets folder

export default function Navbar() {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const res = await API.get("/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserName(res.data.name);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="flex flex-col md:flex-row items-center justify-between">
        {/* Left Logo and Address */}
        <div className="flex flex-col items-center md:items-start">
          <img src={logo} alt="Maharashtra Police" className="w-20 h-auto mb-1" />
          <p className="text-sm font-semibold text-gray-700 text-center md:text-left leading-tight">
            Chhatrapati Sambhajinagar Rural <br />
            Chhatrapati Sambhajinagar Gramin
          </p>
        </div>

        {/* Center Title */}
        <div className="my-4 md:my-0 text-center">
          <h1 className="text-xl md:text-2xl font-bold text-blue-800">
            Investigation Assistant
          </h1>
        </div>

        {/* Right Side User Name */}
        <div className="text-sm text-gray-600 text-center md:text-right">
          <p className="font-semibold">Welcome,</p>
          <p className="text-blue-700 font-bold">{userName}</p>
        </div>
      </div>
    </nav>
  );
}
