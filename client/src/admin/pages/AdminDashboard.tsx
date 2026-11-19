// 



import { useEffect, useState } from "react";
import { fetchUsers } from "../../services/adminApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

const AdminDashboard = () => {
  const [active, setActive] = useState(0);
  const [blocked, setBlocked] = useState(0);

  const { logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers().then(res => {
      const users = res.data;
      setActive(users.filter((u: any) => !u.isBlocked).length);
      setBlocked(users.filter((u: any) => u.isBlocked).length);
    });
  }, []);

  const handleLogout = () => {
    logout();                // clears token + user
    navigate("/", { replace: true });
  };

  if (loading) {
    return <p className="p-6 text-white">Loading...</p>;
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <button
          onClick={handleLogout}
          title="Logout"
          className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
        >
          <FiLogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded">
          <h3 className="text-gray-300">Active Users</h3>
          <p className="text-3xl font-bold">{active}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded">
          <h3 className="text-gray-300">Blocked Users</h3>
          <p className="text-3xl font-bold text-red-400">{blocked}</p>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
