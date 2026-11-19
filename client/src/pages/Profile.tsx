import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-gray-900 rounded-lg p-8"
      >
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <FaUserCircle className="text-6xl text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>

        {/* PROFILE DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileItem label="User ID" value={user.id} />
          <ProfileItem label="Role" value={user.role} />
          <ProfileItem label="Account Status" value="Active" />
          <ProfileItem label="Session" value="Authenticated" />
        </div>
      </motion.div>
    </div>
  );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-800 p-4 rounded">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

export default Profile;
