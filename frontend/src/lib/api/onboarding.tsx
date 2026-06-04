import axiosInstance from "@/lib/axiosInstance";

export async function getOnboardingProfile() {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get("/api/onboarding/me", {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(response.data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.details ||
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to fetch onboarding profile",
    );
  }
}
