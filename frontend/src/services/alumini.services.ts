import axiosInstance from "@/lib/axiosInstance";

export const getCollegeAlumini = async () => {
  const { data } = await axiosInstance.get(
    "/api/candidate/college-alumni"
  );

  return data;
};

export const getCompanyAlumini = async () => {
  const { data } = await axiosInstance.get(
    "/api/candidate/company-alumni"
  );

  return data;
};