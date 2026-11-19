// 
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <AdminSidebar />

      {/* MAIN CONTENT (OFFSET SIDEBAR WIDTH) */}
      <main className="ml-64 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
