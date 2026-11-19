import { FaMoon, FaSun, FaUserCog, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      className={`min-h-screen p-8 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <FaUserCog className="text-3xl text-blue-500" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      {/* SETTINGS CARD */}
      <div className="max-w-2xl bg-gray-800 rounded-lg p-6 space-y-6">
        
        {/* ACCOUNT INFO */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Account</h2>
          <div className="space-y-2 text-gray-300">
            <p>
              <span className="text-gray-400">Name:</span> {user?.name}
            </p>
            <p>
              <span className="text-gray-400">Email:</span> {user?.email}
            </p>
          </div>
        </div>

        <hr className="border-gray-700" />

        {/* APPEARANCE */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Appearance</h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <hr className="border-gray-700" />

        {/* LOGOUT */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Session</h2>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
