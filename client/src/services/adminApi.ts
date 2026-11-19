import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* ================= AUTH HEADER ================= */
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

/* ================= USERS ================= */
export const fetchUsers = () => API.get("/users");

/* ================= REPORTED CALLS ================= */
export const fetchReportedCalls = () =>
  API.get("/admin/reported-calls");

/* ================= ANALYTICS ================= */
export const fetchAnalytics = () =>
  API.get("/admin/analytics");

/* ================= EMAIL ================= */
export const sendReportMail = (email: string) =>
  API.post("/test/send-test-mail", { email });

/* ================= TOGGLE OFFENDER (✅ FIXED) ================= */
export const toggleOffender = (callId: string) =>
  API.put(`/admin/toggle-offender/${callId}`);
