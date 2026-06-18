import axiosInstance from "@/lib/axios";

export const getNotifications =
   async () => {
      const response =
         await axiosInstance.get(
            "/api/notifications"
         );

      return response.data;
   };