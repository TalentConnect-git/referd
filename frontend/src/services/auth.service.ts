import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";

export type UserType = "student" | "fresher" | "professional";

export type BasicDetails = {
  _id?: string;
  email?: string;
  name?: string | null;
  userType?: UserType;
  authProvider?: string;
  onboardingCompleted?: boolean;
  onboardingStep?: number;
  isNewUser?: boolean;
  emailVerified?: boolean;
  status?: string;
  profileImage?: string | null;
  activeCompanyId?: string | null;
  deviceToken?: string | null;
  jobVisibilityThreshold?: number;
  lastActivity?: string;
  createdAt?: string;
  updatedAt?: string;
  password?: string;
  __v?: number;
};

export type AuthUser = {
  _id: string;
  email: string;
  userType: UserType;
  name?: string | null;
  onboardingCompleted?: boolean;
  basicDetails?: BasicDetails;
  authProvider?: string;
  status?: string;
  profileImage?: string | null;
  onboardingStep?: number;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success?: boolean;
  message: string;
  token: string;
  accessToken: string;
  user: AuthUser;
};

export type MeResponse = {
  success?: boolean;
  user: AuthUser | null;
};

export type SendOtpResponse = {
  success: boolean;
  message: string;
};

export type SignupPayload = {
  email: string;
  password: string;
  userType: UserType;
  otp: string;
};

export type SignupResponse = {
  success?: boolean;
  message: string;
  token: string;
  accessToken: string;
  user: AuthUser;
};

export type ApiResponse<T = object> = {
  success: boolean;
  message: string;
} & T;

export type ValidateResetTokenResponse = ApiResponse<{
  email?: string;
}>;

export type GoogleOAuthLoginPayload = {
  code: string;
  userType: UserType;
  isApp?: boolean;
  googleToken?: string;
};

export type GoogleOAuthLoginResponse = {
  success?: boolean;
  message: string;
  token: string;
  accessToken: string;
  user: AuthUser;
};

export type RefreshTokenResponse = {
  success: boolean;
  message?: string;
  token: string;
  accessToken: string;
};

export type ParsedResumeResponse = {
  name?: string;
  email?: string;
  phone?: string;
  skills?: string[];
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  education?: {
    institution?: string;
    degree?: string;
    field_of_study?: string;
    year?: string;
  }[];
  work_experience?: {
    organization?: string;
    title?: string;
    start_date?: string;
    end_date?: string;
    description?: string | string[];
  }[];
  total_experience_years?: number;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8081";

const TOKEN_KEY = "token";
const USER_KEY = "user";

const refreshAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

const extractAccessToken = (data: any): string | null => {
  return (
    data?.accessToken ||
    data?.token ||
    data?.data?.accessToken ||
    data?.data?.token ||
    null
  );
};

const extractUser = (data: any): AuthUser | null => {
  return data?.user || data?.data?.user || null;
};

export const saveAuthToStorage = (data: any) => {
  const token = extractAccessToken(data);
  const user = extractUser(data);

  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }

    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  return {
    token,
    accessToken: token,
    user,
  };
};

export const clearAuthStorage = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.clear();

  window.dispatchEvent(new Event("auth-logout"));
};

export const sendSignupOtp = async (
  email: string,
): Promise<SendOtpResponse> => {
  try {
    const { data } = await axiosInstance.post("/api/auth/send-otp", {
      email: email.trim().toLowerCase(),
    });

    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to send OTP"));
  }
};

export const signupUser = async (
  payload: SignupPayload,
): Promise<SignupResponse> => {
  try {
    const { data } = await axiosInstance.post("/api/auth/signup", {
      ...payload,
      email: payload.email.trim().toLowerCase(),
    });

    const saved = saveAuthToStorage(data);

    if (!saved.token || !saved.user) {
      throw new Error("Signup API did not return token or user.");
    }

    return {
      ...data,
      token: saved.token,
      accessToken: saved.token,
      user: saved.user,
    };
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Signup failed. Please try again."),
    );
  }
};

export const loginUser = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  try {
    const { data } = await axiosInstance.post(
      "/api/auth/login",
      {
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
      },
      {
        withCredentials: true,
      },
    );

    const saved = saveAuthToStorage(data);

    if (!saved.token || !saved.user) {
      throw new Error("Login API did not return token or user.");
    }

    return {
      ...data,
      token: saved.token,
      accessToken: saved.token,
      user: saved.user,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error, "Invalid credentials"));
  }
};

export const googleOAuthLogin = async ({
  code,
  userType,
  isApp = false,
  googleToken = "",
}: GoogleOAuthLoginPayload): Promise<GoogleOAuthLoginResponse> => {
  try {
    const { data } = await axiosInstance.post(
      "/api/auth/google",
      {
        code,
        userType,
        isApp,
        googleToken,
      },
      {
        withCredentials: true,
      },
    );

    const saved = saveAuthToStorage(data);

    if (!saved.token || !saved.user) {
      throw new Error("Google login API did not return token or user.");
    }

    return {
      ...data,
      token: saved.token,
      accessToken: saved.token,
      user: saved.user,
    };
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Google authentication failed."),
    );
  }
};

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  try {
    /**
     * Important:
     * Use refreshAxios, not axiosInstance.
     * This avoids sending old accessToken in Authorization header.
     *
     * Web refreshToken is sent automatically through httpOnly cookie.
     */
    const { data } = await refreshAxios.post("/api/auth/refresh", {});

    const token = extractAccessToken(data);

    if (!token) {
      throw new Error("Refresh API did not return access token.");
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);

      window.dispatchEvent(
        new CustomEvent("auth-token-refreshed", {
          detail: {
            token,
          },
        }),
      );
    }

    return {
      ...data,
      token,
      accessToken: token,
    };
  } catch (error) {
    clearAuthStorage();

    throw new Error(
      getErrorMessage(error, "Session expired. Please login again."),
    );
  }
};

export const logoutUser = async () => {
  try {
    const { data } = await refreshAxios.post("/api/auth/logout", {});

    clearAuthStorage();

    return data;
  } catch {
    clearAuthStorage();

    return {
      success: true,
      message: "Logged out",
    };
  }
};

export const requestPasswordReset = async (
  email: string,
): Promise<ApiResponse> => {
  try {
    const { data } = await axiosInstance.post("/api/auth/forgot-password", {
      email: email.trim().toLowerCase(),
    });

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to send password reset link"),
    );
  }
};

export const validateResetToken = async (
  token: string,
): Promise<ValidateResetTokenResponse> => {
  try {
    const { data } = await axiosInstance.post(
      "/api/auth/validate-reset-token",
      {
        token,
      },
    );

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Invalid or expired reset link"),
    );
  }
};

export const resetPassword = async (
  token: string,
  newPassword: string,
): Promise<ApiResponse> => {
  try {
    const { data } = await axiosInstance.post("/api/auth/reset-password", {
      token,
      newPassword,
    });

    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to reset password"));
  }
};

export const getCurrentUser = async (): Promise<MeResponse> => {
  try {
    const { data } = await axiosInstance.get("/api/auth/me");

    return {
      success: data?.success ?? true,
      user: data?.user ?? null,
    };
  } catch {
    return {
      success: false,
      user: null,
    };
  }
};

export async function uploadResumeApi(
  file: File,
): Promise<ParsedResumeResponse> {
  try {
    const formData = new FormData();
    formData.append("resume", file);

    const { data } = await axiosInstance.post(
      "/api/upload/resume",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to upload resume"));
  }
}

export function getResumePdfViewUrl(userId?: string | null) {
  if (!userId) return "";
  return `${API_URL}/api/upload/view-pdf/${userId}`;
}

export function getResumeServeUrl(userId?: string | null) {
  if (!userId) return "";
  return `${API_URL}/api/upload/serve/${userId}`;
}

export async function updateOnboardingFilesApi(formData: FormData) {
  try {
    const { data } = await axiosInstance.put(
      "/api/onboarding/update",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to update onboarding files"),
    );
  }
}