import axiosInstance from "@/lib/axiosInstance";

export const getProfessionalStats = async () => {
  const res = await axiosInstance.get(
    "/application/professional/metrics"
  );

  return res.data;
};

export const getCandidateStats = async () => {
  const res = await axiosInstance.get(
    "/application/dashboard/candidate/stats"
  );

  return res.data;
};

export const getCareerInsights = async () => {
  const res = await axiosInstance.get(
    "/api/career-insights"
  );

  return res.data;
};