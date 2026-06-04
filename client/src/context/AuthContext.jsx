import { createContext, useContext, useLayoutEffect, useMemo, useState } from "react";
import apiClient, { setAuthToken } from "../api/apiClient";

const AuthContext = createContext(null);
const STORAGE_KEY = "task_allocation_auth";

const readStoredAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

export const AuthProvider = ({ children }) => {
  const [storedAuth] = useState(readStoredAuth);
  const [token, setToken] = useState(storedAuth.token || "");
  const [admin, setAdmin] = useState(storedAuth.admin || null);

  useLayoutEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = async (credentials) => {
    const { data } = await apiClient.post("/auth/login", credentials);
    setAuthToken(data.token);
    setToken(data.token);
    setAdmin(data.admin);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token: data.token,
        admin: data.admin
      })
    );
    return data;
  };

  const logout = () => {
    setToken("");
    setAdmin(null);
    localStorage.removeItem(STORAGE_KEY);
    setAuthToken("");
  };

  const value = useMemo(
    () => ({
      admin,
      isAuthenticated: Boolean(token),
      login,
      logout,
      token
    }),
    [admin, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};
