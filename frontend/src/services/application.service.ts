import axiosInstance from "@/lib/axiosInstance";

export const getCandidateApplications = async (jobType: string , page=1,limit=10) => {
  const { data } = await axiosInstance.get(
    `/application/status/candidate/${jobType}?page=${page}&limit=${limit}`
  );
  return data;

}


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

export const getApplicationById = async (
  applicationId: string
) => {
  const { data } = await axiosInstance.get(
    `/application/details/${applicationId}`
  );

  return data;
};


export const updateApplicationStatus = async (
  applicationId: string,
  status: "Referred To Company" | "Rejected" | "Accepted" | string
) => {
  try {
    const { data } = await axiosInstance.patch(
      `/application/update-status/${applicationId}`,
      {
        status,
      }
    );
    return data;
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
};

export const getApplicationDetails = async (
  applicationId: string
) => {
  const response = await axiosInstance.get(
    `/application/details/${applicationId}`
  );

  return response.data;
};


export const getReferredByMe = async (
  page: number = 1,
  limit: number = 10
) => {
  const response = await axiosInstance.get(
    `/application/referrals/referred-by-me?page=${page}&limit=${limit}`
  );

  return response.data;
};


