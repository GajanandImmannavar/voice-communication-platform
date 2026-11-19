import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  iat: number;
  exp: number;
}

interface AuthContextType {
  user: JwtPayload | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      const decoded = jwtDecode<JwtPayload>(savedToken);
      setToken(savedToken);
      setUser(decoded);
      console.log("AUTH RESTORED:", decoded);
    }

    setLoading(false); // 🔑 VERY IMPORTANT
  }, []);

  const login = (newToken: string) => {
    const decoded = jwtDecode<JwtPayload>(newToken);
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(decoded);
    console.log("LOGIN SUCCESS:", decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    console.log("LOGOUT");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
