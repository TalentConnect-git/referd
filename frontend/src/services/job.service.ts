import axiosInstance from "@/lib/axios";

export const saveJob = async (
  jobId: string,
  jobType: string,
  matchScore: number
) => {
  const response = await axiosInstance.post(
    "/application/saveopportunity",
    {
      jobId,
      jobType,
      matchScore,
    }
  );

  return response.data;
};

export const applyJob = async (
  referralId: string,
  matchScore?: number,
  referralCompany?: string
) => {
  const response = await axiosInstance.post(
    "/application/candidate/referral",
    {
      referralId,
      matchScore,
      referralCompany,
    }
  );

  return response.data;
};