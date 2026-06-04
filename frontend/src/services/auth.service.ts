import axiosInstance from "@/lib/axios";

export type UserType = "student" | "fresher" | "professional";

export type AuthUser = {
  _id: string;
  email: string;
  userType: UserType;
  name?: string;
  onboardingCompleted?: boolean;
  authProvider?: string;
  status?: string;
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

const getErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const axiosError = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

    return axiosError.response?.data?.message || fallback;
  }

  return fallback;
};

/* ---------------- OTP ---------------- */

export const sendSignupOtp = async (
  email: string,
): Promise<SendOtpResponse> => {
  try {
    const { data } = await axiosInstance.post(
      "/api/auth/send-otp",
      { email },
    );

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to send OTP"),
    );
  }
};

/* ---------------- SIGNUP ---------------- */

export const signupUser = async (
  payload: SignupPayload,
): Promise<SignupResponse> => {
  try {
    const { data } = await axiosInstance.post(
      "/api/auth/signup",
      payload,
    );

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        "Signup failed. Please try again.",
      ),
    );
  }
};

/* ---------------- LOGIN ---------------- */

export const loginUser = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  try {
    const { data } = await axiosInstance.post(
      "/api/auth/login",
      payload,
    );

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Invalid credentials"),
    );
  }
};

/* ---------------- LOGOUT ---------------- */

export const logoutUser = async () => {
  try {
    const { data } = await axiosInstance.post(
      "/api/auth/logout",
    );

    return data;
  } catch {
    return {
      message: "Logged out",
    };
  }
};

/* ---------------- FORGOT PASSWORD ---------------- */

export const requestPasswordReset = async (
  email: string,
): Promise<ApiResponse> => {
  try {
    const { data } = await axiosInstance.post(
      "/api/auth/forgot-password",
      {
        email,
      },
    );

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to send password reset link",
      ),
    );
  }
};

/* ---------------- VALIDATE TOKEN ---------------- */

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
      getErrorMessage(
        error,
        "Invalid or expired reset link",
      ),
    );
  }
};

/* ---------------- RESET PASSWORD ---------------- */

export const resetPassword = async (
  token: string,
  newPassword: string,
): Promise<ApiResponse> => {
  try {
    const { data } = await axiosInstance.post(
      "/api/auth/reset-password",
      {
        token,
        newPassword,
      },
    );

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to reset password",
      ),
    );
  }
};

/* ---------------- CURRENT USER ---------------- */

export const getCurrentUser =
  async (): Promise<MeResponse> => {
    try {
      const { data } =
        await axiosInstance.get("/api/auth/me");

      return data;
    } catch {
      return {
        user: null,
      };
    }
  };