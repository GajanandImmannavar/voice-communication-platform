// import { Routes, Route, Navigate } from "react-router-dom";
// import ProtectedRoute from "./routes/ProtectedRoute";

// import Landing from "./pages/Landing";
// import Login from "./pages/Login";
// import Register from "./pages/Register";

// import Dashboard from "./pages/Dashboard";
// import Profile from "./pages/Profile";
// import Settings from "./pages/Settings";

// import MainLayout from "./components/layout/MainLayout";

// function App() {
//   return (
//     <Routes>

//       {/* ✅ PUBLIC ROUTES */}
//       <Route path="/" element={<Landing />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />

//       {/* ✅ PROTECTED ROUTES */}
//       <Route element={<ProtectedRoute />}>
//         <Route element={<MainLayout />}>
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/settings" element={<Settings />} />
//         </Route>
//       </Route>

//       {/* ✅ FALLBACK */}
//       <Route path="*" element={<Navigate to="/" />} />
//     </Routes>
//   );
// }

// export default App;
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Call from "./pages/Call";

import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import ManageUsers from "./admin/pages/ManageUsers";
import Analytics from "./admin/pages/Analytics";
import ReportedCalls from "./admin/pages/ReportedCalls";


import MainLayout from "./components/layout/MainLayout";

function App() {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* USER */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/Call" element={<Call/>}/>
        </Route>
      </Route>

      {/* ADMIN */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/reported-calls" element={<ReportedCalls />} />

        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
