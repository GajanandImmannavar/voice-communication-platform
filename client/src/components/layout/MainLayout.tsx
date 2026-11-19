import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FaMicrophoneAlt,
  FaTachometerAlt,
  FaUserCircle,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

function MainLayout() {
  const { user, logout } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
     ${
       isActive
         ? "bg-blue-600 text-white"
         : "text-gray-300 hover:bg-gray-700 hover:text-white"
     }`;

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* ================= FIXED SIDEBAR ================= */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 z-40 hidden md:flex flex-col">
        {/* LOGO */}
        <div className="px-6 py-6 border-b border-gray-800 flex items-center gap-3">
          <FaMicrophoneAlt className="text-blue-500 text-2xl" />
          <h2 className="text-xl font-bold text-white">Voice Platform</h2>
        </div>

        {/* USER INFO */}
        <div className="px-6 py-4 border-b border-gray-800">
          <p className="text-xs text-gray-400">Logged in as</p>
          <p className="font-semibold text-white truncate">{user?.name}</p>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink to="/dashboard" className={linkClass}>
            <FaTachometerAlt />
            Dashboard
          </NavLink>

          <NavLink to="/profile" className={linkClass}>
            <FaUserCircle />
            Profile
          </NavLink>

          <NavLink to="/call" className={linkClass}>
            <FaMicrophoneAlt />
            Start Call
          </NavLink>

          <NavLink to="/settings" className={linkClass}>
            <FaCog />
            Settings
          </NavLink>
        </nav>

        {/* FOOTER */}
        <div className="px-4 py-4 border-t border-gray-800 text-xs text-gray-500 text-center">
          Voice Coach AI © 2026
        </div>
      </aside>

      {/* ================= MAIN AREA ================= */}
      <div className="ml-0 md:ml-64 min-h-screen flex flex-col">
        {/* FIXED TOP BAR */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-8 border-b border-gray-800 bg-gray-900">
          <h1 className="text-lg font-semibold">Dashboard</h1>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-md text-sm hover:bg-red-700 transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 p-8 overflow-y-auto bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
