"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "./api-client";

interface User {
  id: string;
  email: string;
  name: string;
  role: "brand" | "creator";
  company?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Record<string, unknown>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.auth
      .me()
      .then((data) => setUser(data as User))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = (await api.auth.login({ email, password })) as { user: User };
    setUser(res.user);
  };

  const register = async (data: Record<string, unknown>) => {
    const res = (await api.auth.register(data)) as { user: User };
    setUser(res.user);
  };

  const logout = () => {
    api.auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
