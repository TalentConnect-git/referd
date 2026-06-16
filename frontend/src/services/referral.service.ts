import axiosInstance from "@/lib/axiosInstance";

export const createReferralPosting = async (
  payload: any
) => {
    console.log("Payload:", payload);
  const response = await axiosInstance.post(
    "/api/hiring-channels/referral-posting",
    payload
  );

  return response.data;
};


export const getMyReferrals = async (
  page = 1,
  limit = 10
) => {
  const { data } = await axiosInstance.get(
    `/student-dashboard/posted-referral-job?showAll=true&page=${page}&limit=${limit}`
  );
  return data;

};
export const getReferralCandidates = async (
  jobId: string
) => {
  const { data } = await axiosInstance.get(
    `/application/my-referral-applications?jobId=${jobId}&adminApprovalStatus=Approved`
  );

  return data;
};

export const deleteReferral = async (
  jobId: string
) => {
  const { data } = await axiosInstance.delete(
    `/delete-job/${jobId}`
  );

  return data;
};

export const pauseReferral = async (jobId: string) => {
  const { data } = await axiosInstance.patch(
    `/company/jobmanagement/referral/${jobId}`
  );

  return data;
};

export const reactivateReferral = async (
  jobId: string,
    startDate: string,
    endDate: string,
  
) => {
  const { data } = await axiosInstance.patch(
    `/company/jobmanagement/reactivate/${jobId}`,
    {startDate,endDate}
  );

  return data;
};