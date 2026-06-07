import DashboardJobs from "./DashboardJobs";
import DashboardAppStatus from "./DashboardAppStatus";
import axiosInstance from "@/lib/axios";

export default async function DashboardBody() 
{
let jobs:any[] = [];
let applications:any[] = [];
try{
  const response = await axiosInstance.get("/api/auth/me");
  const userType = response.data.user?.userType;
  if (userType === "student" || userType === "fresher") 
    {
      const jobsResponse = await axiosInstance.get("/api/student-dashboard/job-postings");
      jobs = jobsResponse.data.data || [];


      const [offCampusRes,internshipRes,referralRes] = await Promise.all([
                  axiosInstance.get("/application/status/candidate/Off-campus"),
                  axiosInstance.get("/application/status/candidate/Internship"),
                  axiosInstance.get("/application/status/candidate/Referral")
                ]);
      applications = [...(offCampusRes.data.data || []),...(internshipRes.data.data || []),...(referralRes.data.data || [])];
  }
else if (userType === "professional") 
  {
    const jobsResponse = await axiosInstance.get("/api/student-dashboard/referral-postings");
    jobs = jobsResponse.data.data || [];
    const referralRes = await axiosInstance.get("/application/status/candidate/Referral");
    applications = referralRes.data.data || [];
  }
}
catch(err)
{
    console.error("Error fetching dashboard body data:", err);
}
  return (

    <div className="grid grid-cols-3 gap-6 mt-6">

      <div className="col-span-2">
        <DashboardJobs jobs={jobs} />
      </div>

      <div>
        <DashboardAppStatus applications={applications} />
      </div>

    </div>
  );
}



