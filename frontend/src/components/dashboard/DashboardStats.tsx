"use client";

import { useEffect, useState } from "react";
import DashboardProfStats from "./DashboardProfStats";
import DashboardStudStats from "./DashboardStudStats";
import {
  getProfessionalStats,
  getCandidateStats,
  getCareerInsights,
} from "@/services/stats.services";

import { DashboardStatsProps } from "@/types/dashboard";

export default function DashboardStats({
  userType,
}: DashboardStatsProps) {
  const [totalJobsPosted, setTotalJobsPosted] = useState(0);
  const [approvedJobs, setApprovedJobs] = useState(0);
  const [rejectedJobs, setRejectedJobs] = useState(0);
  const [totalApplicationsDone, setTotalApplicationsDone] = useState(0);

  // Student/Fresher Stats
  const [applicationsSent, setApplicationsSent] = useState(0);
  const [resumeScore, setResumeScore] = useState(0);
  const [hiringScore, setHiringScore] = useState(0);
  const [interviewCalls, setInterviewCalls] = useState(0);

  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      if (userType === "professional") {
      const profData = await getProfessionalStats();
      const metrics = profData?.data ?? profData;
          setTotalJobsPosted(
            metrics?.totalJobsPosted ?? 0
          );
          setApprovedJobs(
            metrics?.approvedJobs ?? 0
          );
          setRejectedJobs(
            metrics?.rejectedJobs ?? 0
          );
          setTotalApplicationsDone(
            metrics?.totalApplicationsDone ?? 0
          );
        }
       else if (
        userType === "student" ||
        userType === "fresher"
      ) {
        const [statsData, insightsData] = await Promise.all([
          getCandidateStats(),
          getCareerInsights(),
        ]);

        console.log("Candidate Stats:", statsData);
        console.log("Career Insights:", insightsData);

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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userType) {
      fetchDashboardStats();
    }
  }, [userType]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 ">
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
        totalJobsPosted={totalJobsPosted}
        approvedJobs={approvedJobs}
        rejectedJobs={rejectedJobs}
        totalApplicationsDone={totalApplicationsDone}
        />
      )}

      {(userType === "student" ||
        userType === "fresher") && (
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