// src/context/AuthContext.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api, { setAccessToken, setAuthHandlers } from "#lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true selama cek sesi awal
  const navigate = useNavigate();
  const location = useLocation();

  // --- handler: dipanggil dari interceptor saat token berhasil di-refresh
  const handleTokenRefreshed = useCallback((token) => {
    setAccessToken(token);
    // token null artinya refresh gagal di fase ini (jarang, biasanya lewat handleSessionExpired)
  }, []);

  // --- handler: dipanggil dari interceptor saat refresh token juga invalid/expired
  const handleSessionExpired = useCallback(() => {
    setUser(null);
    // hindari redirect berulang kalau memang sudah di /login
    if (location.pathname !== "/login") {
      navigate("/login", {
        replace: true,
        state: { sessionExpired: true, from: location.pathname },
      });
    }
  }, [navigate, location]);

  // 1. Daftarkan handler ke api.js sekali saat provider mount
  useEffect(() => {
    setAuthHandlers({
      onRefreshed: handleTokenRefreshed,
      onExpired: handleSessionExpired,
    });
  }, [handleTokenRefreshed, handleSessionExpired]);

  // 2. Restore session sekali saat app pertama kali load (F5 / buka tab baru)
  useEffect(() => {
    let mounted = true;

    api
      .post("/auth/refresh")
      .then(({ data }) => {
        setAccessToken(data.data.accessToken);
        return api.get("/auth/me");
      })
      .then(({ data }) => {
        if (mounted) setUser(data.data);
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post(
      "/auth/login",
      { email, password },
      { headers: { "x-platform": "web" } },
    );
    setAccessToken(data.data.accessToken);
    setUser(data.data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setAccessToken(null);
      setUser(null);
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const value = { user, isLoading, isAuthenticated: !!user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}
