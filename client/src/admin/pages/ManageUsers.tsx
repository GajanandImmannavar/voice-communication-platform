import { useEffect, useState, useMemo } from "react";
import { fetchUsers, sendReportMail } from "../../services/adminApi";
import { Search, Mail } from "lucide-react";

const ManageUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers()
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  const sendMail = async (email: string) => {
    try {
      setLoadingEmail(email);
      await sendReportMail(email);
      alert(`Report sent to ${email}`);
    } catch (err) {
      alert("Failed to send mail");
      console.error(err);
    } finally {
      setLoadingEmail(null);
    }
  };

  /* 🔍 Netflix-style instant search */
  const filteredUsers = useMemo(() => {
    return users.filter(u =>
      `${u.name} ${u.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Manage Users
        </h1>

        {/* SEARCH BOX */}
        <div className="relative w-full sm:w-72">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="
              w-full bg-gray-800 text-white
              pl-10 pr-4 py-2 rounded
              border border-gray-700
              focus:outline-none focus:ring-2 focus:ring-blue-600
            "
          />
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto rounded border border-gray-700">
        <table className="min-w-full bg-gray-900 text-white text-sm">
          
          <thead className="bg-gray-800 sticky top-0 z-10">
            <tr className="text-left text-gray-300">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">
                Email
              </th>
              <th className="px-4 py-3 font-medium text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                  Loading users...
                </td>
              </tr>
            )}

            {!loading && filteredUsers.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                  No users found
                </td>
              </tr>
            )}

            {filteredUsers.map(u => (
              <tr
                key={u._id}
                className="
                  border-t border-gray-800
                  hover:bg-gray-800 transition
                "
              >
                {/* USER */}
                <td className="px-4 py-3">
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-xs text-gray-400 md:hidden">
                    {u.email}
                  </p>
                </td>

                {/* EMAIL (desktop only) */}
                <td className="px-4 py-3 text-gray-300 hidden md:table-cell">
                  {u.email}
                </td>

                {/* ACTION */}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => sendMail(u.email)}
                    disabled={loadingEmail === u.email}
                    className="
                      inline-flex items-center gap-2
                      bg-blue-600 px-3 py-1.5 rounded
                      hover:bg-blue-700 transition
                      disabled:opacity-50
                    "
                  >
                    <Mail size={16} />
                    {loadingEmail === u.email
                      ? "Sending..."
                      : "Send Report"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
