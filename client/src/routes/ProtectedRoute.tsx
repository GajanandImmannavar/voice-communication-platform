import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { token, loading } = useAuth();

  // ⏳ wait until auth is restored
  if (loading) {
    return null; // or spinner
  }

  // 🔒 not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ logged in
  return <Outlet />;
}

export default ProtectedRoute;
