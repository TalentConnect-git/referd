import axiosInstance from "@/lib/axiosInstance";

export const getCandidateApplications = async (jobType: string) => {
  const { data } = await axiosInstance.get(
    `/application/status/candidate/${jobType}`
  );
  return data;

}

export const getProfessionalApplications = async () => {

  const referralRes = await axiosInstance.get(
    "/application/status/candidate/Referral"
  );

  return referralRes.data?.data || [];

};