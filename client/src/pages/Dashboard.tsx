import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Dashboard() {
  const { user, token } = useAuth();
  const { darkMode } = useTheme();

  const [showLanguageForm, setShowLanguageForm] = useState(false);
  const [language, setLanguage] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLanguageSave = async () => {
    if (!language || !reason) {
      setMessage("Please select language and enter reason");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await axios.post(
        "http://localhost:5000/api/language/select",
        { language, reason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Language saved successfully 🎉");
      setShowLanguageForm(false);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to save language");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-2">
        Welcome, {user?.name}
      </h2>

      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xl">
        Practice real conversations, get instant AI-powered feedback,
        and improve your communication skills confidently.
      </p>

      {/* LANGUAGE CARD */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Practice Language</h3>
          <button
            onClick={() => setShowLanguageForm(!showLanguageForm)}
            className="text-sm text-blue-500 hover:underline"
          >
            {showLanguageForm ? "Close" : "Change"}
          </button>
        </div>

        {showLanguageForm && (
          <div className="space-y-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
            >
              <option value="">Select Language</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Kannada">Kannada</option>
              <option value="Spanish">Spanish</option>
            </select>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Why do you want to practice?"
              className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
            />

            <button
              onClick={handleLanguageSave}
              disabled={loading}
              className="w-full bg-blue-600 py-2 rounded text-white hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        )}

        {message && (
          <p className="text-sm text-green-500 mt-3">{message}</p>
        )}
      </div>
    </>
  );
}

export default Dashboard;
