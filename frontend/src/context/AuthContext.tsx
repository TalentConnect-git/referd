"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AuthUser,
  getCurrentUser,
  logoutUser,
} from "@/services/auth.service";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  role: AuthUser["userType"] | undefined;
  login: (user: AuthUser, token: string) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = [
  "token",
  "user",
  "parsedResume",
  "basicInfo",
  "educationInfo",
  "careerPreferences",
  "skillsAchievements",
  "selectedRole",
];

function clearAuthStorage() {
  STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  sessionStorage.clear();
}

export function AuthContextRole({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const resetAuthState = () => {
    clearAuthStorage();
    setUser(null);
    setToken(null);
  };

  const redirectToLogin = () => {
    window.location.href = "/login";
  };

  const refreshUser = async () => {
    try {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        resetAuthState();
        return;
      }

      setToken(savedToken);

      const data = await getCurrentUser();

      console.log("current user", data);

      if (data?.user?.onboardingCompleted) {
        resetAuthState();
        redirectToLogin();
        return;
      }

      setUser(data.user);
    } catch (error) {
      console.log(error);
      resetAuthState();
      redirectToLogin();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (userData: AuthUser, jwtToken: string) => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(jwtToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore logout API error
    } finally {
      resetAuthState();
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      setUser,
      isAuthenticated: !!user && !!token,
      role: user?.userType,
      login,
      logout,
      refreshUser,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthContextRole");
  }

  return ctx;
}