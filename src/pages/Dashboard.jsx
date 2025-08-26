import React, { useEffect, useState } from "react";
import axios from "axios";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";
import { useNavigate } from "react-router-dom";

const DashboardRouter = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRole(res.data.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
        setError("Authentication Failed");
        setTimeout(() => {
          navigate("/auth");
        }, 3500);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="relative p-8 rounded-2xl bg-gray-800/80 backdrop-blur-lg border border-gray-700/50 shadow-2xl overflow-hidden">
          {/* 3D Glass Morphism Container */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-20"></div>
          
          {/* Subtle 3D Texture */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          
          <div className="relative z-10 text-center space-y-6">
            {/* Animated 3D Sphere */}
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg animate-pulse flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 shadow-inner flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12"
                  />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-200">
              Preparing Your Dashboard
            </h2>
            <p className="text-gray-400 font-light">
              Securely authenticating your credentials...
            </p>
            
            {/* 3D Progress Bar */}
            <div className="w-full h-2.5 bg-gray-700/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-[pulse_2s_infinite]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
        <div className="relative max-w-md w-full p-8 rounded-2xl bg-gray-800/90 backdrop-blur-lg border border-gray-700/50 shadow-2xl overflow-hidden">
          {/* 3D Glass Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent opacity-30"></div>
          
          {/* Carbon Fiber Texture */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          
          <div className="relative z-10 text-center space-y-6">
            {/* 3D Error Icon */}
            <div className="mx-auto w-24 h-24 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg flex items-center justify-center transform rotate-45">
              <div className="transform -rotate-45">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-rose-200">
              Authentication Error
            </h2>
            <p className="text-gray-300 font-light">
              {error}. Redirecting to login...
            </p>
            
            {/* 3D Countdown Indicator */}
            <div className="w-full h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full animate-[progress_3s_linear_forwards] origin-left"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return role === "admin" ? <AdminDashboard /> : <UserDashboard />;
};

export default DashboardRouter;