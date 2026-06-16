import axiosInstance from "@/lib/axiosInstance";

export const getCandidateApplications = async (jobType: string , page=1,limit=10) => {
  const { data } = await axiosInstance.get(
    `/application/status/candidate/${jobType}?page=${page}&limit=${limit}`
  );
  return data;

}

// export const getProfessionalApplications = async () => {

//   const referralRes = await axiosInstance.get(
//     "/application/status/candidate/Referral"
//   );

//   return referralRes.data?.data || [];

// };

export const getProfessionalApplications = async (
  page = 1,
  limit = 10) => {
  const { data } = await axiosInstance.get(`/application/status/candidate/Referral?page=${page}&limit=${limit}`);
  return data;
};

export const getProfessionalReceivedApplications = async (
  page = 1,
  limit = 10
) => {
  const { data } = await axiosInstance.get(
    `/application/all-referrals?page=${page}&limit=${limit}`
  );

  return data;
};
