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
  message: string;
  token: string;
  user: AuthUser;
};

export type MeResponse = {
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
  message: string;
  user: AuthUser;
  token: string;
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

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

    return axiosError.response?.data?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const saveAuthToStorage = (data: any) => {
  const token =
    data?.token ||
    data?.accessToken ||
    data?.data?.token ||
    data?.data?.accessToken;

  const user = data?.user || data?.data?.user;

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
    user,
  };
};

export const sendSignupOtp = async (
  email: string,
): Promise<SendOtpResponse> => {
  try {
    const { data } = await axiosInstance.post("/api/auth/send-otp", {
      email,
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
    const { data } = await axiosInstance.post("/api/auth/signup", payload);

    saveAuthToStorage(data);

    return data;
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
    const { data } = await axiosInstance.post("/api/auth/login", payload);

    saveAuthToStorage(data);

    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Invalid credentials"));
  }
};

export const googleOAuthLogin = async ({
  code,
  userType,
  isApp = false,
  googleToken = "",
}: GoogleOAuthLoginPayload) => {
  try {
    const { data } = await axiosInstance.post("/api/auth/google", {
      code,
      userType,

      /**
       * Important:
       * Web login sends authorization code.
       * Your backend uses code flow only when isApp is false.
       */
      isApp,

      /**
       * Web flow does not use googleToken.
       */
      googleToken,
    });

    saveAuthToStorage(data);

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Google authentication failed."),
    );
  }
};

export const refreshToken = async () => {
  try {
    const { data } = await axiosInstance.post("/api/auth/refresh");

    saveAuthToStorage(data);

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Session expired. Please login again."),
    );
  }
};

export const logoutUser = async () => {
  try {
    const { data } = await axiosInstance.post("/api/auth/logout");

    return data;
  } catch {
    return {
      message: "Logged out",
    };
  }
};

export const requestPasswordReset = async (
  email: string,
): Promise<ApiResponse> => {
  try {
    const { data } = await axiosInstance.post("/api/auth/forgot-password", {
      email,
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

    return data;
  } catch {
    return {
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