"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { api, ApiError } from "./api";
import type { AdminUser } from "./types";

interface AuthContextValue {
  admin: AdminUser | null;
  loading: boolean;
  checked: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  admin: null,
  loading: true,
  checked: false,
  login: async () => {},
  logout: async () => {},
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<{ admin: AdminUser }>("auth.php?action=me");
      setAdmin(data.admin);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
      setChecked(true);
    }
  }, []);

  useEffect(() => {
    // با queueMicrotask، setState اولیه‌ی refresh از بدنه‌ی همزمانِ افکت خارج می‌شود
    queueMicrotask(() => {
      refresh();
    });
  }, [refresh]);

  const login = useCallback(async (username: string, password: string) => {
    const data = await api.post<{ admin: AdminUser }>("auth.php?action=login", { username, password });
    setAdmin(data.admin);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("auth.php?action=logout");
    } catch {
      // حتی اگر خطا داد، سمت کلاینت خروج را اعمال کن
    }
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, checked, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export { ApiError };
