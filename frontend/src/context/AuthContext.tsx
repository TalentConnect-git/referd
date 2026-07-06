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

import axiosInstance from "@/lib/axiosInstance";

import {
  AuthUser,
  getCurrentUser,
  logoutUser,
} from "@/services/auth.service";

import type { ProfileData } from "@/types/profile";

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

const AUTH_KEYS = ["token", "user"];

const ONBOARDING_KEYS = [
  "parsedResume",
  "basicInfo",
  "educationInfo",
  "careerPreferences",
  "skillsAchievements",
  "selectedRole",
];

const clearOnboardingStorage = () => {
  if (typeof window === "undefined") return;

  ONBOARDING_KEYS.forEach((key) => localStorage.removeItem(key));
};

const clearAuthStorage = () => {
  if (typeof window === "undefined") return;

  [...AUTH_KEYS, ...ONBOARDING_KEYS].forEach((key) =>
    localStorage.removeItem(key),
  );

  sessionStorage.clear();
};

const getStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;

  const rawUser = localStorage.getItem("user");

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export function AuthContextRole({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const resetAuthState = useCallback(() => {
    clearAuthStorage();
    setUser(null);
    setToken(null);
    setProfile(null);
  }, []);

  const redirectToLogin = useCallback(() => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    const currentToken =
      token ||
      (typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null);

    if (!currentToken) return;

    try {
      setProfileLoading(true);

      /**
       * Important:
       * Use axiosInstance, not raw axios.
       * Then expired token will auto-refresh here also.
       */
      const response = await axiosInstance.get("/api/onboarding/me");

      const profileData =
        response.data?.data ||
        response.data?.profile ||
        response.data?.user ||
        response.data ||
        {};

      setProfile(profileData);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setProfileLoading(false);
    }
  }, [token]);

  const refreshUser = useCallback(async () => {
    try {
      const savedToken =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      const savedUser = getStoredUser();

      if (!savedToken) {
        resetAuthState();
        setLoading(false);
        return;
      }

      setToken(savedToken);

      if (savedUser) {
        setUser(savedUser);
      }

      /**
       * getCurrentUser uses axiosInstance.
       * If access token expired:
       * axiosInstance -> /api/auth/refresh -> retry /api/auth/me
       */
      const data = await getCurrentUser();

      if (!data?.user) {
        resetAuthState();
        redirectToLogin();
        setLoading(false);
        return;
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.onboardingCompleted) {
        await fetchProfile();
      }
    } catch (error) {
      console.error("refreshUser error:", error);
      resetAuthState();
      redirectToLogin();
    } finally {
      setLoading(false);
    }
  }, [resetAuthState, redirectToLogin, fetchProfile]);

  const login = useCallback(
    (userData: AuthUser, jwtToken: string) => {
      localStorage.setItem("token", jwtToken);
      localStorage.setItem("user", JSON.stringify(userData));

      clearOnboardingStorage();

      setToken(jwtToken);
      setUser(userData);

      if (userData.onboardingCompleted) {
        fetchProfile();
      }
    },
    [fetchProfile],
  );

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

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  /**
   * When axiosInstance refreshes token,
   * update context token also.
   */
  useEffect(() => {
    const handleTokenRefresh = (event: Event) => {
      const customEvent = event as CustomEvent<{ token: string }>;

      if (customEvent.detail?.token) {
        setToken(customEvent.detail.token);
      }
    };

    const handleLogout = () => {
      setUser(null);
      setToken(null);
      setProfile(null);
    };

    window.addEventListener("auth-token-refreshed", handleTokenRefresh);
    window.addEventListener("auth-logout", handleLogout);

    return () => {
      window.removeEventListener("auth-token-refreshed", handleTokenRefresh);
      window.removeEventListener("auth-logout", handleLogout);
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      role: user?.userType,
      login,
      logout,
      refreshUser,
      profile,
      profileLoading,
      refreshProfile: fetchProfile,
    }),
    [
      user,
      token,
      loading,
      profile,
      profileLoading,
      login,
      logout,
      refreshUser,
      fetchProfile,
    ],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthContextRole");
  }

  return ctx;
}