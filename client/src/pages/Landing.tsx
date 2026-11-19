import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaMicrophone } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Landing() {
  const { user, isAuthenticated, logout } = useAuth();

  console.log("AUTH USER:", user);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-xl"
      >
        {/* 🎤 Microphone Icon */}
        <FaMicrophone className="text-6xl mx-auto text-blue-600 mb-4" />

        {/* 👋 Title */}
        <h1 className="text-5xl font-bold mb-4">
          {isAuthenticated
            ? `Welcome, ${user?.name}`
            : "Voice Communication Platform"}
        </h1>

        {/* 📄 Description */}
        <p className="text-gray-400 mb-8">
          Practice real conversations, get instant AI-powered feedback,
          improve your communication skills confidently.
        </p>

        {/* 🔘 Buttons */}
        {!isAuthenticated ? (
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-2 bg-gray-700 rounded hover:bg-gray-800 transition"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              Login
            </Link>
          </div>
        ) : (
          <div className="flex justify-center gap-4">
          {/* 🔓 Logout */}
            <button
              onClick={logout}
              className="px-6 py-2 bg-red-600 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
            {/* 🚀 Dashboard Button */}
            <Link
              to="/dashboard"
              className="px-6 py-2 bg-green-600 rounded hover:bg-green-700 transition"
            >
              Go to Dashboard
            </Link>

            
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Landing;
