import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { api, clearStoredSession, getStoredSession, storeSession } from "@/lib/api-client";
import type { AuthSession, ZeloUser } from "@/types/api";

type AuthContextValue = {
  user: ZeloUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (input: {
    nome: string;
    email: string;
    senha: string;
    confirmarSenha: string;
    telefone?: string;
    cidade?: string;
    estado?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getStoredSession()
      .then((stored) => {
        if (active) setSession(stored);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.usuario ?? null,
      token: session?.token ?? null,
      isLoading,
      isAuthenticated: Boolean(session?.token),
      async login(email, senha) {
        const nextSession = await api.login(email, senha);
        await storeSession(nextSession);
        setSession(nextSession);
      },
      async register(input) {
        const nextSession = await api.register(input);
        await storeSession(nextSession);
        setSession(nextSession);
      },
      async logout() {
        await clearStoredSession();
        setSession(null);
      },
    }),
    [isLoading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return value;
}
