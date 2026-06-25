// import axiosInstance from "@/lib/axiosInstance";

// export const getAllUsers = async () => {
//   const response = await axiosInstance.get("/api/messages/allusers");
//   return response.data;
// };

// export const getUnreadCounts = async () => {
//   const response = await axiosInstance.get("/api/messages/unread-count");
//   return response.data;
// };

// export const getMessages = async (conversationId: string) => {
//   const response = await axiosInstance.get(
//     `/api/messages/get/${conversationId}`
//   );
//   return response.data;
// };

// export const sendMessage = async (
//   conversationId: string,
//   message: string
// ) => {
//   const response = await axiosInstance.post(
//     `/api/messages/send/${conversationId}`,
//     { message }
//   );

//   return response.data;
// };