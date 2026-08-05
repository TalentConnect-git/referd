"use client";

import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import {
  getProfessionalStats,
  getCandidateStats,
  getCareerInsights,
} from "@/services/stats.services";
import axiosInstance from "@/lib/axiosInstance";
import { DashboardStatsProps } from "@/types/dashboard";

// Lazy load child components
const DashboardProfStats = lazy(() => import("./DashboardProfStats"));
const DashboardStudStats = lazy(() => import("./DashboardStudStats"));
const QuickActionChips = lazy(() => import("./QuickActionChips"));

// ==========================================
// SKELETON LOADING COMPONENTS
// ==========================================

// Professional stats skeleton
const ProfStatsSkeleton = () => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div
        key={i}
        className="surface-card rounded-xl p-3.5 border border-[var(--border)]"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="skeleton shimmer h-2.5 w-16 rounded" />
            <div className="skeleton shimmer h-5 w-12 rounded" />
            <div className="skeleton shimmer h-2 w-14 rounded" />
          </div>
          <div className="skeleton shimmer h-7 w-7 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

// Student stats skeleton
const StudStatsSkeleton = () => (
  <div className="space-y-4">
    {/* Quick action chips skeleton */}
    <div className="flex flex-wrap gap-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton shimmer h-8 w-24 rounded-full" />
      ))}
    </div>
    {/* Stats skeleton */}
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="surface-card rounded-xl p-3.5 border border-[var(--border)]"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="skeleton shimmer h-2.5 w-16 rounded" />
              <div className="skeleton shimmer h-5 w-12 rounded" />
              <div className="skeleton shimmer h-2 w-14 rounded" />
            </div>
            <div className="skeleton shimmer h-7 w-7 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Main loading skeleton
const MainSkeleton = () => (
  <div className="flex flex-wrap gap-4">
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <div
        key={item}
        className="skeleton min-w-[140px] flex-1 h-28 rounded-2xl border border-[var(--border)] bg-[var(--card)]"
      />
    ))}
  </div>
);

// ==========================================
// STAGGERED SUSPENSE WRAPPER
// ==========================================

interface StaggeredSuspenseProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  delay?: number;
}

const StaggeredSuspense = ({ children, fallback, delay = 0 }: StaggeredSuspenseProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  return <Suspense fallback={fallback}>{children}</Suspense>;
};

// ==========================================
// TYPES
// ==========================================

type CountResponse = {
  data?: {
    data?: unknown[];
    meta?: {
      total?: number;
    };
  };
};

// ==========================================
// MAIN COMPONENT
// ==========================================

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
    return response.data?.data?.length || response.data?.meta?.total || 0;
  };

  // Function to fetch total alumni count from all endpoints with fallback to 0
  const fetchTotalAlumniCount = useCallback(async () => {
    try {
      const DEFAULT_LIMIT = 10;

      // Fetch all three endpoints with error handling
      const [hiringResponse] = await Promise.all([
        axiosInstance
          .get(
            `/api/candidate/hiring-network?jobPostedOnly=true&page=1&limit=${DEFAULT_LIMIT}`,
          )
          .catch(() => ({ data: { data: [] } })),
      ]);

      // Safely get counts from each response
      const hiringCount = getCountFromResponse(hiringResponse);

      console.log("📊 Alumni Counts:", {
        hiring: hiringCount,
        total: hiringCount,
      });

      return hiringCount;
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
            .catch(() => ({ data: { data: [] } })),
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

  // Show main skeleton while loading
  if (loading) {
    return <MainSkeleton />;
  }

  // Professional Dashboard
  if (userType === "professional") {
    return (
      <StaggeredSuspense fallback={<ProfStatsSkeleton />} delay={0}>
        <DashboardProfStats
          totalReferralsPosted={totalReferralsPosted}
          totalApplicationsReceived={totalApplicationsReceived}
          responseRate={responseRate}
          referralSuccessRate={referralSuccessRate}
          candidatesWaiting={candidatesWaiting}
          alumniCount={alumniCount}
          userType={userType}
        />
      </StaggeredSuspense>
    );
  }

  // Student/Fresher Dashboard
  if (userType === "student" || userType === "fresher") {
    return (
      <div className="space-y-4">
        {/* Quick Action Chips with lazy loading */}
        <StaggeredSuspense fallback={null} delay={0}>
          <QuickActionChips userType={userType} />
        </StaggeredSuspense>

        {/* Student Stats with lazy loading */}
        <StaggeredSuspense fallback={<StudStatsSkeleton />} delay={100}>
          <DashboardStudStats
            applicationsSent={applicationsSent}
            savedCount={savedCount}
            resumeScore={resumeScore}
            hiringScore={hiringScore}
            alumniCount={studentAlumniCount}
            userType={userType}
          />
        </StaggeredSuspense>
      </div>
    );
  }

  return null;
}