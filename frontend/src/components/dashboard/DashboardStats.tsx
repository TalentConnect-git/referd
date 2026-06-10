"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import DashboardProfStats from "./DashboardProfStats";
import DashboardStudStats from "./DashboardStudStats";
import {
  getProfessionalStats,
  getCandidateStats,
  getCareerInsights,
} from "@/services/stats.services";

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
 
  useEffect(() => {
    let isMounted = true;

   const fetchDashboardStats = async () => {
  try {
    setLoading(true);

    if (userType === "professional") {
      const profData = await getProfessionalStats();

      if (!isMounted) return;

      const metrics = profData?.data ?? profData;

      setReferralsPosted(
        metrics?.totalReferralsPosted ?? 0
      );

      setApplicationsReceived(
        metrics?.totalApplicationsReceived ?? 0
      );

      setResponseRate(
        metrics?.responseRate ?? 0
      );

      setSuccessRate(
        metrics?.referralSuccessRate ?? 0
      );
    } 
    
    else if (
      userType === "student" ||
      userType === "fresher"
    ) {
      const [statsData, insightsData] =
        await Promise.all([
          getCandidateStats(),
          getCareerInsights(),
        ]);

      if (!isMounted) return;

      const stats = statsData?.data ?? {};
      const insights = insightsData?.data ?? {};

      setApplicationsSent(
        stats?.totalApplications ?? 0
      );

      setInterviewCalls(
        stats?.interviewCalls ??
        stats?.referralApplications ??
        0
      );

      setResumeScore(
        insights?.resumeScore ?? 0
      );

      setHiringScore(
        insights?.hiringScore ?? 0
      );
    }
  } catch (error) {
    console.error(
      `Error fetching ${userType} stats:`,
      error
    );
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