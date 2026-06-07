import axiosInstance from "@/lib/axiosInstance";
import DashboardProfStats from "./DashboardProfStats";
import DashboardStudStats from "./DashboardStudStats";

interface DashboardStatsrops {
  userType:string}
export default async function DashboardStats({userType}:DashboardStatsrops) 
{
  // Professional Stats
    let referralsPosted = 0;
    let applicationsReceived = 0;
    let responseRate = 0;
    let successRate = 0;

  // Student Stats
  let applicationsSent = 0;
  let resumeScore = 0;
  let hiringScore = 0;
  let interviewCalls = 0;
  try {

      const Profres = await axiosInstance.get("/application/dashboard/candidate/stats");
      referralsPosted = Profres.data.totalReferralsPosted;
      applicationsReceived = Profres.data.totalApplicationsReceived;
      responseRate = Profres.data.responseRate;
      successRate = Profres.data.referralSuccessRate;
    } catch (error) {
      console.error("Error fetching professional stats:", error);
  }

  try 
  {
  const statsRes = await axiosInstance.get("/application/dashboard/candidate/stats");
  const insightsRes = await axiosInstance.get("/api/career-insights");
  applicationsSent = statsRes.data.totalApplications;
  resumeScore = insightsRes.data.resumeScore;
  hiringScore = insightsRes.data.hiringScore;
  interviewCalls = 0;
  } 
  catch (error) {
    console.error("Error fetching student stats:", error);
  }

  return (
    <>

    {userType === "professional" && (

      <DashboardProfStats
        referralsPosted={referralsPosted}
        applicationsReceived={applicationsReceived}
        responseRate={responseRate}
        successRate={successRate}
      />
      )}

      {(userType === "student" || userType === "fresher") && (

      <DashboardStudStats
        applicationsSent={applicationsSent}
        interviewCalls={interviewCalls}
        resumeScore={resumeScore}
        hiringScore={hiringScore}

      />

    )}

  </>
        
  );
}