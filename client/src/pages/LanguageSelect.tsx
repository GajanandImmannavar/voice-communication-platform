// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const LanguageSelect = () => {
//   const [language, setLanguage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const startCall = async () => {
//     if (!language) {
//       alert("Please select a language");
//       return;
//     }

//     try {
//       setLoading(true);

//       const token = localStorage.getItem("token");

//       const res = await axios.post(
//         "http://localhost:5000/api/call/start",
//         { language },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       navigate("/call", {
//         state: { callId: res.data.callId, language },
//       });
//     } catch (error: any) {
//       if (error.response?.status === 403) {
//         alert("Your account has been blocked by admin.");
//       } else {
//         alert("Failed to start call");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
//       <h1 className="text-2xl font-bold mb-6">Select Language</h1>

//       <select
//         value={language}
//         onChange={(e) => setLanguage(e.target.value)}
//         className="px-4 py-2 rounded bg-gray-800 border border-gray-600"
//       >
//         <option value="">Choose Language</option>
//         <option value="English">English</option>
//         <option value="Hindi">Hindi</option>
//         <option value="Kannada">Kannada</option>
//       </select>

//       <button
//         onClick={startCall}
//         disabled={loading}
//         className="mt-6 px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
//       >
//         {loading ? "Connecting..." : "Start Call"}
//       </button>
//     </div>
//   );
// };

// export default LanguageSelect;


import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LanguageSelect = () => {
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const startCall = async () => {
    if (!language) {
      alert("Please select a language");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      // ✅ SAVE LANGUAGE IN DB
      await axios.post(
        "http://localhost:5000/api/language/select",
        {
          language,
          reason: "call", // required in your schema
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ THEN START CALL
      const res = await axios.post(
        "http://localhost:5000/api/call/start",
        { language },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/call", {
        state: { callId: res.data.callId },
      });

    } catch (error: any) {
      if (error.response?.status === 403) {
        alert("Your account has been blocked by admin.");
      } else {
        alert("Failed to start call");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-6">Select Language</h1>

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="px-4 py-2 rounded bg-gray-800 border border-gray-600"
      >
        <option value="">Choose Language</option>
        <option value="ENGLISH">English</option>
        <option value="HINDI">Hindi</option>
        <option value="KANNADA">Kannada</option>
      </select>

      <button
        onClick={startCall}
        disabled={loading}
        className="mt-6 px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Connecting..." : "Start Call"}
      </button>
    </div>
  );
};

export default LanguageSelect;