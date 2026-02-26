"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isLoggedIn: boolean;
  memberId: string;
  login: (memberId: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Demo credentials
const VALID_MEMBER_ID = "WC-2015-00482";
const VALID_PASSWORD = "wealth2026";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const stored = sessionStorage.getItem("welth-auth");
    if (stored) {
      const data = JSON.parse(stored);
      setIsLoggedIn(true);
      setMemberId(data.memberId);
    }
    setChecked(true);
  }, []);

  useEffect(() => {
    if (!checked) return;
    if (!isLoggedIn && pathname !== "/login") {
      router.replace("/login");
    }
  }, [checked, isLoggedIn, pathname, router]);

  function login(id: string, pw: string): boolean {
    if (id === VALID_MEMBER_ID && pw === VALID_PASSWORD) {
      setIsLoggedIn(true);
      setMemberId(id);
      sessionStorage.setItem("welth-auth", JSON.stringify({ memberId: id }));
      router.replace("/");
      return true;
    }
    return false;
  }

  function logout() {
    setIsLoggedIn(false);
    setMemberId("");
    sessionStorage.removeItem("welth-auth");
    router.replace("/login");
  }

  if (!checked) return null;

  if (!isLoggedIn && pathname !== "/login") return null;

  return (
    <AuthContext.Provider value={{ isLoggedIn, memberId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
