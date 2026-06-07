"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import DashboardProfStats from "./DashboardProfStats";
import DashboardStudStats from "./DashboardStudStats";

interface DashboardStatsProps {
  userType: string;
}

export default function DashboardStats({ userType }: DashboardStatsProps) {
  // Professional Stats
  const [referralsPosted, setReferralsPosted] = useState(0);
  const [applicationsReceived, setApplicationsReceived] = useState(0);
  const [responseRate, setResponseRate] = useState(0);
  const [successRate, setSuccessRate] = useState(0);
  

  // Student/Fresher Stats
  const [applicationsSent, setApplicationsSent] = useState(0);
  const [resumeScore, setResumeScore] = useState(0);
  const [hiringScore, setHiringScore] = useState(0);
  const [interviewCalls, setInterviewCalls] = useState(0);

  const [loading, setLoading] = useState(true);


//please call api inside useEffect whenever fetching data other repetative api call again and again 
  useEffect(() => {
    let isMounted = true;

    const fetchDashboardStats = async () => {
      try {
        setLoading(true);

        if (userType === "professional") {
          const profRes = await axiosInstance.get(
            "/application/dashboard/candidate/stats"
          );

          if (!isMounted) return;

          setReferralsPosted(profRes.data?.totalReferralsPosted ?? 0);
          setApplicationsReceived(profRes.data?.totalApplicationsReceived ?? 0);
          setResponseRate(profRes.data?.responseRate ?? 0);
          setSuccessRate(profRes.data?.referralSuccessRate ?? 0);
        }

        if (userType === "student" || userType === "fresher") {
          const [statsRes, insightsRes] = await Promise.all([
            axiosInstance.get("/application/dashboard/candidate/stats"),
            axiosInstance.get("/api/career-insights"),
          ]);

          if (!isMounted) return;

          setApplicationsSent(statsRes.data?.totalApplications ?? 0);
          setResumeScore(insightsRes.data?.resumeScore ?? 0);
          setHiringScore(insightsRes.data?.hiringScore ?? 0);
          setInterviewCalls(statsRes.data?.interviewCalls ?? 0);
        }
      } catch (error) {
        console.error(`Error fetching ${userType} stats:`, error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (userType) {
      fetchDashboardStats();
    }

    return () => {
      isMounted = false;
    };
  }, [userType]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--card)]"
          />
        ))}
      </div>
    );
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