import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token");

      const userRes = await axios.get("http://localhost:5000/api/user/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(userRes.data);

      const activityRes = await axios.get("http://localhost:5000/api/activity/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities(activityRes.data);
    };

    fetchAdminData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 p-6 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Admin Dashboard
          </h2>
          <button 
            onClick={handleLogout} 
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-cyan-400">Registered Users</h3>
            <div className="overflow-y-auto max-h-96 pr-2">
              <ul className="space-y-3">
                {users.map((user, i) => (
                  <li 
                    key={i} 
                    className="bg-gray-800 bg-opacity-50 p-3 rounded-lg border-l-4 border-cyan-500 hover:bg-gray-700 transition-colors duration-200"
                  >
                    <span className="font-medium">{user.email}</span> — 
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-blue-600 text-white'
                    }`}>
                      {user.role}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              Total: {users.length} users
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-amber-400">User Activities</h3>
            <div className="overflow-y-auto max-h-96 pr-2">
              <ul className="space-y-4">
                {activities.map((act, i) => (
                  <li 
                    key={i} 
                    className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border-l-4 border-amber-500 hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-cyan-300">{act.email}</span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="italic text-amber-300">{act.action}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(act.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              Latest {activities.length} activities
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;