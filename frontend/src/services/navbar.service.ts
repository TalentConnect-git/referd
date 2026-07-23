import axiosInstance from "@/lib/axiosInstance";

// ✅ Get all interviews
export const getInterviews = async () => {
  const response = await axiosInstance.get("/interviews");
  return response.data;
};

// ✅ Get unread interviews
export const getUnreadInterviews = async () => {
  const response = await axiosInstance.get("/interviews/unread");
  return response.data;
};

// ✅ Get single interview by ID
export const getInterviewById = async (interviewId: string) => {
  const response = await axiosInstance.get(`/interviews/${interviewId}`);
  return response.data;
};

// ✅ Mark interview as read
export const markInterviewAsRead = async (interviewId: string) => {
  const response = await axiosInstance.patch(`/interviews/${interviewId}/mark-read`);
  return response.data;
};