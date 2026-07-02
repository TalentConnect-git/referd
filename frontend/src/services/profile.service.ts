import axiosInstance from "@/lib/axios";

export const getCandidateProfile = async (candidateId: string) => {
  const response = await axiosInstance.get(
    `/api/onboarding/get-details/${candidateId}`
  );

  return response.data;
};