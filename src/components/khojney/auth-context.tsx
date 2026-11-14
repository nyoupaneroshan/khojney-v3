"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { SessionUser } from "@/lib/auth";

interface AuthContextValue {
  user: SessionUser | null;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: false,
  refreshSession: async () => {},
});

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser?: SessionUser | null;
}) {
  const [user, setUser] = useState<SessionUser | null>(initialUser ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(initialUser === undefined);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user ?? null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // If initialUser was explicitly provided from SSR (e.g. on /dashboard), honor it
    if (initialUser !== undefined) {
      setUser(initialUser);
      setIsLoading(false);
      return;
    }

    // Only hit /api/auth/me if there's a possibility of being logged in
    // (i.e. document.cookie has khojney_session)
    const hasSessionCookie =
      typeof document !== "undefined" &&
      document.cookie.includes("khojney_session=");

    if (!hasSessionCookie) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    refreshSession();
  }, [initialUser, refreshSession]);

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSession() {
  return useContext(AuthContext);
}
