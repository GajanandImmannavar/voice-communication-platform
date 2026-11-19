// import { NavLink } from "react-router-dom";
// import { LayoutDashboard, Users, BarChart3 } from "lucide-react";


// const AdminSidebar = () => {
//   const linkClass = ({ isActive }: { isActive: boolean }) =>
//     `flex items-center gap-3 px-4 py-3 rounded-lg transition
//      ${
//        isActive
//          ? "bg-blue-600 text-white"
//          : "text-gray-300 hover:bg-gray-800 hover:text-white"
//      }`;

//   return (
//     <aside className="fixed left-0 top-0 w-64 h-screen bg-gray-900 border-r border-gray-800 flex flex-col z-50">
//       {/* LOGO */}
//       <div className="px-6 py-6 border-b border-gray-800 text-center">
//         <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
//         <p className="text-xs text-gray-400 mt-1">Voice Coach AI</p>
//       </div>

//       {/* NAV */}
//       <nav className="flex-1 px-4 py-6 space-y-2">
//         <NavLink to="/admin/dashboard" className={linkClass}>
//           <LayoutDashboard size={20} />
//           Dashboard
//         </NavLink>

//         <NavLink to="/admin/users" className={linkClass}>
//           <Users size={20} />
//           Manage Users
//         </NavLink>

//         <NavLink to="/admin/analytics" className={linkClass}>
//           <BarChart3 size={20} />
//           Analytics
//         </NavLink>
//       </nav>

//       {/* FOOTER */}
//       <div className="px-4 py-4 border-t border-gray-800 text-sm text-gray-500 text-center">
//         © 2026 Voice Coach AI
//       </div>
//     </aside>
//   );
// };

// export default AdminSidebar;
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  AlertTriangle
} from "lucide-react";

const AdminSidebar = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
     ${
       isActive
         ? "bg-blue-600 text-white shadow"
         : "text-gray-300 hover:bg-gray-800 hover:text-white"
     }`;

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-gray-900 border-r border-gray-800 flex flex-col z-50">
      
      {/* ================= LOGO ================= */}
      <div className="px-6 py-6 border-b border-gray-800 text-center">
        <h2 className="text-2xl font-bold text-white tracking-wide">
          Admin Panel
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Voice Coach AI
        </p>
      </div>

      {/* ================= NAVIGATION ================= */}
      <nav className="flex-1 px-4 py-6 space-y-2 text-sm font-medium">
        
        <NavLink to="/admin/dashboard" className={linkClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          <Users size={18} />
          Manage Users
        </NavLink>

        <NavLink to="/admin/analytics" className={linkClass}>
          <BarChart3 size={18} />
          Analytics
        </NavLink>

        <NavLink to="/admin/reported-calls" className={linkClass}>
          <AlertTriangle size={18} />
          Reported Calls
        </NavLink>

      </nav>

      {/* ================= FOOTER ================= */}
      <div className="px-4 py-4 border-t border-gray-800 text-xs text-gray-500 text-center">
        © 2026 Voice Coach AI
      </div>
    </aside>
  );
};

export default AdminSidebar;
