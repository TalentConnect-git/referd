import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

const TOKEN_KEY = "token";
const USER_KEY = "user";

type CustomAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Separate axios instance for refresh API.
 * Important: do not use axiosInstance here, otherwise interceptor loop can happen.
 */
const refreshAxios = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(TOKEN_KEY, token);

  window.dispatchEvent(
    new CustomEvent("auth-token-refreshed", {
      detail: {
        token,
      },
    }),
  );
};

const clearAuthStorage = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.clear();

  window.dispatchEvent(new Event("auth-logout"));
};

const logoutUser = () => {
  clearAuthStorage();

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

const extractAccessToken = (data: any): string | null => {
  return (
    data?.token ||
    data?.accessToken ||
    data?.data?.token ||
    data?.data?.accessToken ||
    null
  );
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError<any>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const requestUrl = originalRequest.url || "";

    const isLoginRequest = requestUrl.includes("/api/auth/login");
    const isSignupRequest = requestUrl.includes("/api/auth/signup");
    const isGoogleLoginRequest = requestUrl.includes("/api/auth/google");
    const isRefreshRequest = requestUrl.includes("/api/auth/refresh");
    const isLogoutRequest = requestUrl.includes("/api/auth/logout");

    /**
     * Do not refresh for auth entry APIs.
     */
    if (
      isLoginRequest ||
      isSignupRequest ||
      isGoogleLoginRequest ||
      isRefreshRequest ||
      isLogoutRequest
    ) {
      return Promise.reject(error);
    }

    /**
     * Only refresh on first 401.
     */
    if (status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    /**
     * If refresh is already running, wait for it.
     */
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(axiosInstance(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      /**
       * Your backend route:
       * router.post("/refresh", refreshToken)
       *
       * Because your frontend currently calls auth as:
       * /api/auth/login
       *
       * refresh endpoint should be:
       * /api/auth/refresh
       */
      const refreshResponse = await refreshAxios.post("/api/auth/refresh");

      const newToken = extractAccessToken(refreshResponse.data);

      if (!newToken) {
        throw new Error("Refresh API did not return a new access token.");
      }

      setToken(newToken);

      axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;

      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      logoutUser();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;