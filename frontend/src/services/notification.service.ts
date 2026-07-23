import axiosInstance from "@/lib/axiosInstance";

export const getNotifications = async () => {
  const response = await axiosInstance.get("/api/notifications");
  return response.data;
};

export const getUnreadNotifications = async () => {
  const response = await axiosInstance.get("/api/notifications/unread");
  return response.data;
};

export const markNotificationAsRead = async (id: string) => {
  const response = await axiosInstance.patch(
    `/api/notifications/${id}/read`
  );

  return response.data;
};