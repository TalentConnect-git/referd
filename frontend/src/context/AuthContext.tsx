"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import axios from "axios";

import {
  AuthUser,
  getCurrentUser,
  logoutUser,
} from "@/services/auth.service";
import type { ProfileData } from "@/types/profile";

// ---------- Context type ----------
type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  role: AuthUser["userType"] | undefined;
  login: (user: AuthUser, token: string) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  profile: ProfileData | null;
  profileLoading: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------- Storage helpers ----------
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

const clearOnboardingStorage = () => {
  [
    "parsedResume",
    "basicInfo",
    "educationInfo",
    "careerPreferences",
    "skillsAchievements",
    "selectedRole",
  ].forEach((key) => localStorage.removeItem(key));
};

const clearAuthStorage = () => {
  STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  sessionStorage.clear();
};

// ---------- Provider ----------
export function AuthContextRole({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // ---------- Reset ----------
  const resetAuthState = useCallback(() => {
    clearAuthStorage();
    setUser(null);
    setToken(null);
    setProfile(null);
  }, []);

  const redirectToLogin = useCallback(() => {
    window.location.href = "/login";
  }, []);

  // ---------- Fetch full profile ----------
  const fetchProfile = useCallback(async () => {
    const currentToken = token || localStorage.getItem("token");
    if (!currentToken) return;

    try {
      setProfileLoading(true);

      const backendUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!backendUrl) throw new Error("API URL missing");

      const response = await axios.get(`${backendUrl}/api/onboarding/me`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${currentToken}` },
      });

      const profileData = response.data?.data || response.data?.profile || response.data?.user || response.data || {};
      setProfile(profileData);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      // Keep last profile if any, don't null it on failure
    } finally {
      setProfileLoading(false);
    }
  }, [token]); // ✅ depends on token, but also reads localStorage as fallback

  // ---------- Refresh user (and then profile) ----------
  const refreshUser = useCallback(async () => {
    try {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        resetAuthState();
        setLoading(false);
        return;
      }

      setToken(savedToken);
      const data = await getCurrentUser();

      if (!data?.user) {
        resetAuthState();
        redirectToLogin();
        setLoading(false);
        return;
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Fetch profile after setting user
      await fetchProfile();
    } catch (error) {
      console.error(error);
      resetAuthState();
      redirectToLogin();
    } finally {
      setLoading(false);
    }
  }, [resetAuthState, redirectToLogin, fetchProfile]);

  // ---------- Login ----------
  const login = useCallback(
    (userData: AuthUser, jwtToken: string) => {
      localStorage.setItem("token", jwtToken);
      localStorage.setItem("user", JSON.stringify(userData));

      clearOnboardingStorage();

      setToken(jwtToken);
      setUser(userData);

      // Immediately fetch profile after login
      fetchProfile();
    },
    [fetchProfile]
  );

  // ---------- Logout ----------
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // ignore logout API error
    } finally {
      resetAuthState();
      redirectToLogin();
    }
  }, [resetAuthState, redirectToLogin]);

  // ---------- Initial load ----------
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // ---------- Context value ----------
  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!user && !!token,
      role: user?.userType,
      login,
      logout,
      refreshUser,
      profile,
      profileLoading,
      refreshProfile: fetchProfile, // same as fetchProfile
    }),
    [user, token, loading, profile, profileLoading, login, logout, refreshUser, fetchProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ---------- Hook ----------
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthContextRole");
  }
  return ctx;
}