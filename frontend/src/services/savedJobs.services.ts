import axiosInstance from "@/lib/axiosInstance";

export const getSavedJobs = async (
  page = 1,
  limit = 10
) => {
  const { data } = await axiosInstance.get(
    `/application/saveopportunity?page=${page}&limit=${limit}`
  );

  return data;
};

export const unsaveJob = async (jobId: string) => {
  const { data } = await axiosInstance.delete(
    `/application/saveopportunity/${jobId}`
  );

  return data;
};