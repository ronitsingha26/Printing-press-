import { createContext, useEffect, useMemo, useState } from "react";
import * as api from "../mock/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    return api.getAuthedUser();
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // demo mode: keep a simple flag for Protected routes
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    // user is stored by mock api auth state
  }, [user]);

  async function login(email, password) {
    setLoading(true);
    try {
      const auth = await api.login(email, password);
      setToken("demo-token");
      setUser(auth.user);
      return auth;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await api.logout();
    } finally {
      setLoading(false);
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthed: Boolean(token),
      isAdmin: user?.role === "admin",
      login,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

