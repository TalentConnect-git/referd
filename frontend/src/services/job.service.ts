import axiosInstance from "@/lib/axiosInstance";

export const saveJob = async (
  jobId: string,
  jobType: string,
  matchScore: number = 0
) => {
  return axiosInstance.post(
    "/application/saveopportunity",
    {
      jobId,
      jobType,
      matchScore,
    }
  );
};


export const applyJob = async (
  id: string,
  jobType: string,
  matchScore: number
) => {

  switch (jobType) {

    case "Referral":
      return axiosInstance.post(
        "/application/candidate/referral",
        {
          referralId: id,
          matchScore,
        }
      );

    case "Internship":

      return axiosInstance.post(
        "/application/candidate/internship",
        {
          internshipId: id,
          matchScore,
        }
      );

    case "Off-campus":
      return axiosInstance.post(
        "/application/candidate/offcampus",
        {
          jobId: id,
          matchScore,
        }

      );

    default:
      throw new Error(`Invalid job type: ${jobType}`);
  }

};


export const getJobById = async (jobId: string) => {
  return axiosInstance.get(
    `/api/student-dashboard/job/${jobId}`
  );
};
