"use client";

import { useCallback, useEffect, useState } from "react";
import DashboardProfStats from "./DashboardProfStats";
import DashboardStudStats from "./DashboardStudStats";
import {
  getProfessionalStats,
  getCandidateStats,
  getCareerInsights,
} from "@/services/stats.services";
import axiosInstance from "@/lib/axiosInstance";
import { DashboardStatsProps } from "@/types/dashboard";
import EmptyStateStepper from "./EmptyStateStepper";
import QuickActionChips from "./QuickActionChips";

type CountResponse = {
  data?: {
    data?: unknown[];
    meta?: {
      total?: number;
    };
  };
};

export default function DashboardStats({ userType }: DashboardStatsProps) {
  // Professional Stats
  const [totalReferralsPosted, setTotalReferralsPosted] = useState(0);
  const [totalApplicationsReceived, setTotalApplicationsReceived] = useState(0);
  const [responseRate, setResponseRate] = useState(0);
  const [referralSuccessRate, setReferralSuccessRate] = useState(0);
  const [candidatesWaiting, setCandidatesWaiting] = useState(0);
  const [alumniCount, setAlumniCount] = useState(0);

  // Student/Fresher Stats
  const [applicationsSent, setApplicationsSent] = useState(0);
  const [resumeScore, setResumeScore] = useState(0);
  const [hiringScore, setHiringScore] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [studentAlumniCount, setStudentAlumniCount] = useState(0);

  const [loading, setLoading] = useState(true);

  // Helper function to safely get count from API response
  const getCountFromResponse = (response: CountResponse): number => {
    if (!response?.data) return 0;
    return response.data?.data?.length || 
           response.data?.meta?.total || 
           0;
  };

  // Function to fetch total alumni count from all endpoints with fallback to 0
  const fetchTotalAlumniCount = useCallback(async () => {
    try {
      const DEFAULT_LIMIT = 10;

      // Fetch all three endpoints with error handling
      const [hiringResponse, collegeResponse, companyResponse] = await Promise.all([
        axiosInstance
          .get(`/api/candidate/hiring-network?jobPostedOnly=true&page=1&limit=${DEFAULT_LIMIT}`)
          .catch(() => ({ data: { data: [] } })),
        axiosInstance
          .get(`/api/candidate/college-alumni?page=1&limit=${DEFAULT_LIMIT}`)
          .catch(() => ({ data: { data: [] } })),
        axiosInstance
          .get(`/api/candidate/company-alumni?page=1&limit=${DEFAULT_LIMIT}`)
          .catch(() => ({ data: { data: [] } })),
      ]);

      // Safely get counts from each response
      const hiringCount = getCountFromResponse(hiringResponse);
      const collegeCount = getCountFromResponse(collegeResponse);
      const companyCount = getCountFromResponse(companyResponse);

      console.log("📊 Alumni Counts:", {
        hiring: hiringCount,
        college: collegeCount,
        company: companyCount,
        total: hiringCount + collegeCount + companyCount,
      });

      return hiringCount + collegeCount + companyCount;
    } catch (error) {
      console.error("Error fetching alumni counts:", error);
      return 0;
    }
  }, []);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);

      // Get total alumni count with fallback to 0
      const totalAlumni = await fetchTotalAlumniCount();

      if (userType === "professional") {
        // Fetch professional stats and candidates waiting in parallel
        const [profData, candidatesResponse] = await Promise.all([
          getProfessionalStats().catch(() => ({ data: {} })),
          axiosInstance
            .get(`/application/all-referrals`)
            .catch(() => ({ data: { data: [] } }))
        ]);

        const metrics = profData?.data ?? profData;
        const candidatesList = candidatesResponse?.data?.data || [];
        
        setTotalReferralsPosted(metrics?.totalReferralsPosted ?? 0);
        setTotalApplicationsReceived(metrics?.totalApplicationsReceived ?? 0);
        setResponseRate(metrics?.responseRate ?? 0);
        setReferralSuccessRate(metrics?.referralSuccessRate ?? 0);
        setCandidatesWaiting(candidatesList.length); 
        setAlumniCount(totalAlumni);
        
      } else if (userType === "student" || userType === "fresher") {
        const [statsData, insightsData] = await Promise.all([
          getCandidateStats().catch(() => ({ data: {} })),
          getCareerInsights().catch(() => ({ data: {} })),
        ]);

        const stats = statsData?.data ?? {};
        const insights = insightsData?.data ?? {};

        setApplicationsSent(stats?.totalApplications ?? 0);
        setSavedCount(stats?.savedCount ?? 0);
        setResumeScore(insights?.resumeScore ?? 0);
        setHiringScore(insights?.hiringScore ?? 0);
        setStudentAlumniCount(totalAlumni);
      }
    } catch (error) {
      console.error(`Error fetching ${userType} stats:`, error);
      // Reset all values to 0 on error
      if (userType === "professional") {
        setTotalReferralsPosted(0);
        setTotalApplicationsReceived(0);
        setResponseRate(0);
        setReferralSuccessRate(0);
        setCandidatesWaiting(0);
        setAlumniCount(0);
      } else {
        setApplicationsSent(0);
        setSavedCount(0);
        setResumeScore(0);
        setHiringScore(0);
        setStudentAlumniCount(0);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchTotalAlumniCount, userType]);

  useEffect(() => {
    if (userType) {
      const timer = window.setTimeout(() => {
        void fetchDashboardStats();
      }, 0);

      return () => window.clearTimeout(timer);
    }
  }, [fetchDashboardStats, userType]);

  if (loading) {
    return (
      <div className="flex flex-wrap gap-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="flex-1 min-w-[140px] h-28 animate-pulse rounded-2xl border border-[#1e293b] bg-[#0f172a]"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      {userType === "professional" && (
        <DashboardProfStats
          totalReferralsPosted={totalReferralsPosted}
          totalApplicationsReceived={totalApplicationsReceived}
          responseRate={responseRate}
          referralSuccessRate={referralSuccessRate}
          candidatesWaiting={candidatesWaiting}
          alumniCount={alumniCount}
          userType={userType}
        />
      )}

      {(userType === "student" || userType === "fresher") && (
        <>
          <QuickActionChips userType={userType} />
          <DashboardStudStats
            applicationsSent={applicationsSent}
            savedCount={savedCount}
            resumeScore={resumeScore}
            hiringScore={hiringScore}
            alumniCount={studentAlumniCount}
            userType={userType}
          />
          <EmptyStateStepper
            count={applicationsSent}
            userType={userType}
            variant="applications"
          />
          <EmptyStateStepper
            count={savedCount}
            userType={userType}
            variant="savedJobs"
          />
        </>
      )}
    </>
  );
}
