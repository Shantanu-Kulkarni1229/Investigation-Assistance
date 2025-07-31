import { useEffect, useState } from "react";
import API, { authHeader } from "../api";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    API.get("/user/profile", { headers: authHeader() })
      .then((res) => setProfile(res.data.user))
      .catch((err) => {
        console.error("Profile Fetch Error:", err.response?.data);
        alert("Unauthorized or token missing");
        window.location.href = "/login";
      });
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96 text-center">
        {profile ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Welcome, {profile.name}</h2>
            <p>Email: {profile.email}</p>
            <button
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
}
