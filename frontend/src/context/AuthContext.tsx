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

  login: (
    user: AuthUser,
    token: string
  ) => void;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;

  profile: ProfileData | null;
  profileLoading: boolean;

  refreshProfile: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

const AUTH_KEYS = ["token", "user"];

const ONBOARDING_KEYS = [
  "parsedResume",
  "basicInfo",
  "educationInfo",
  "careerPreferences",
  "skillsAchievements",
  "selectedRole",
];

const ALLOWED_ROLES: AuthUser["userType"][] = [
  "student",
  "fresher",
  "professional",
];

const isAllowedRole = (
  role: AuthUser["userType"]
) => {
  return ALLOWED_ROLES.includes(role);
};

const clearOnboardingStorage = () => {
  if (typeof window === "undefined") {
    return;
  }

  ONBOARDING_KEYS.forEach((key) => {
    localStorage.removeItem(key);
  });
};

const clearAuthStorage = () => {
  if (typeof window === "undefined") {
    return;
  }

  [...AUTH_KEYS, ...ONBOARDING_KEYS].forEach(
    (key) => {
      localStorage.removeItem(key);
    }
  );

  sessionStorage.clear();
};

const getStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser =
    localStorage.getItem("user");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export function AuthContextRole({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [profile, setProfile] =
    useState<ProfileData | null>(null);

  const [profileLoading, setProfileLoading] =
    useState(false);

  const resetAuthState = useCallback(() => {
    clearAuthStorage();

    setUser(null);
    setToken(null);
    setProfile(null);
  }, []);

  const redirectToLogin = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const currentPath =
      window.location.pathname;

    if (currentPath === "/login") {
      return;
    }

    window.location.replace(
      `/login?redirect=${encodeURIComponent(
        currentPath
      )}`
    );
  }, []);

  const fetchProfile = useCallback(async () => {
    const currentToken =
      token ||
      (typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null);

    if (!currentToken) {
      return;
    }

    try {
      setProfileLoading(true);

      const response =
        await axiosInstance.get(
          "/api/onboarding/me"
        );

      const profileData =
        response.data?.data ||
        response.data?.profile ||
        response.data?.user ||
        response.data ||
        {};

      setProfile(profileData);
    } catch (error: any) {
      console.error(
        "Failed to fetch profile:",
        error?.response?.data ||
          error?.message ||
          error
      );
    } finally {
      setProfileLoading(false);
    }
  }, [token]);

  const refreshUser = useCallback(
    async () => {
      try {
        const savedToken =
          typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;

        const savedUser =
          getStoredUser();

        /*
         * No token means guest.
         * Do not redirect here because public pages
         * are allowed.
         */
        if (!savedToken) {
          setUser(null);
          setToken(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        /*
         * Immediately restore local auth state.
         */
        setToken(savedToken);

        if (savedUser) {
          setUser(savedUser);
        }

        /*
         * Verify token with backend.
         */
        const data =
          await getCurrentUser();

        if (!data?.user) {
          console.warn(
            "Current user not found"
          );

          resetAuthState();
          setLoading(false);

          return;
        }

        /*
         * Validate role.
         */
        if (
          !isAllowedRole(
            data.user.userType
          )
        ) {
          console.warn(
            "Unauthorized user type:",
            data.user.userType
          );

          await logoutUser().catch(
            () => {}
          );

          resetAuthState();
          setLoading(false);

          redirectToLogin();

          return;
        }

        /*
         * Backend confirmed user.
         */
        setUser(data.user);

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        /*
         * Fetch profile if onboarding completed.
         */
        if (
          data.user.onboardingCompleted
        ) {
          await fetchProfile();
        }
      } catch (error: any) {
        console.error(
          "refreshUser error:",
          error?.response?.data ||
            error?.message ||
            error
        );

        /*
         * Only clear auth when backend
         * explicitly says authentication failed.
         */
        const status =
          error?.response?.status;

        if (status === 401) {
          resetAuthState();
        }

        /*
         * Do NOT blindly redirect on every
         * network/server error.
         */
      } finally {
        setLoading(false);
      }
    },
    [
      resetAuthState,
      redirectToLogin,
      fetchProfile,
    ]
  );

  const login = useCallback(
    (
      userData: AuthUser,
      jwtToken: string
    ) => {
      console.log(
        "🔥 AuthContext login:",
        {
          user: userData,
          hasToken: Boolean(jwtToken),
        }
      );

      if (
        !isAllowedRole(
          userData.userType
        )
      ) {
        console.error(
          "❌ Invalid user role:",
          userData.userType
        );

        resetAuthState();
        return;
      }

      /*
       * Save authentication.
       */
      localStorage.setItem(
        "token",
        jwtToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      clearOnboardingStorage();

      /*
       * Update React state.
       */
      setToken(jwtToken);
      setUser(userData);

      console.log(
        "✅ Auth state updated"
      );

      /*
       * Fetch profile asynchronously.
       * Do NOT wait for this before redirect.
       */
      if (
        userData.onboardingCompleted
      ) {
        fetchProfile().catch(
          (error) => {
            console.error(
              "Profile fetch after login failed:",
              error
            );
          }
        );
      }
    },
    [
      fetchProfile,
      resetAuthState,
    ]
  );

  const logout = useCallback(
    async () => {
      try {
        await logoutUser();
      } catch (error) {
        console.warn(
          "Logout API failed:",
          error
        );
      } finally {
        resetAuthState();

        if (
          typeof window !== "undefined"
        ) {
          window.location.replace(
            "/login"
          );
        }
      }
    },
    [resetAuthState]
  );

  /*
   * Restore authentication on page load.
   */
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  /*
   * Token refresh listener.
   */
  useEffect(() => {
    const handleTokenRefresh = (
      event: Event
    ) => {
      const customEvent =
        event as CustomEvent<{
          token: string;
        }>;

      const newToken =
        customEvent.detail?.token;

      if (!newToken) {
        return;
      }

      setToken(newToken);

      localStorage.setItem(
        "token",
        newToken
      );
    };

    const handleLogout = () => {
      setUser(null);
      setToken(null);
      setProfile(null);
    };

    window.addEventListener(
      "auth-token-refreshed",
      handleTokenRefresh
    );

    window.addEventListener(
      "auth-logout",
      handleLogout
    );

    return () => {
      window.removeEventListener(
        "auth-token-refreshed",
        handleTokenRefresh
      );

      window.removeEventListener(
        "auth-logout",
        handleLogout
      );
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,

      isAuthenticated:
        Boolean(user && token),

      role: user?.userType,

      login,
      logout,
      refreshUser,

      profile,
      profileLoading,

      refreshProfile:
        fetchProfile,
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
    ]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthContextRole"
    );
  }

  return context;
}