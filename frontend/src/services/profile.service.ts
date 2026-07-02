import axiosInstance from "@/lib/axiosInstance";

export const getCandidateProfile = async (candidateId: string) => {
  const response = await axiosInstance.get(
    `/api/onboarding/get-details/${candidateId}`
  );

  return response.data;
};