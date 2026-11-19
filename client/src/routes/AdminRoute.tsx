// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// function AdminRoute() {
//   const { user } = useAuth();

//   if (!user) return <Navigate to="/login" replace />;

//   if (user.role !== "admin") {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return <Outlet />;
// }

// export default AdminRoute;

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute() {
  const { user, loading } = useAuth();

  // 🔑 WAIT until auth is restored
  if (loading) {
    return null; // or loader spinner
  }

  // 🔐 Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ⛔ Logged in but not admin
  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Admin access allowed
  return <Outlet />;
}

export default AdminRoute;
