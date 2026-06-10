import axiosInstance from "@/lib/axios";

export const saveJob = async (
  jobId: string,
  jobType: string,
  matchScore: number
) => {
  const response = await axiosInstance.post("/saved-jobs", {
    jobId,
    jobType,
    matchScore,
  });

  return response.data;
};

export const applyJob = async (jobId: string) => {
  const response = await axiosInstance.post(
    "/application/candidate/referral",
    {
      jobId,
    }
  );

  return response.data;
};