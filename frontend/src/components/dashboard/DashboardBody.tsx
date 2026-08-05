"use client";

import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import { getCandidateApplications, getProfessionalApplications } from "@/services/application.service";
import { UserType } from "@/types/dashboard";
import { Job } from "@/types/dashboard";

// Lazy load child components
const DashboardJobs = lazy(() => import("./DashboardJobs"));
const DashboardAppStatus = lazy(() => import("./DashboardAppStatus"));

// ==========================================
// SKELETON LOADING COMPONENTS
// ==========================================

// Skeleton for DashboardJobs
const JobsSkeleton = () => (
  <div className="surface-card p-4 sm:p-6">
    {/* Header skeleton */}
    <div className="flex items-center justify-between mb-4">
      <div className="skeleton shimmer h-5 w-32 rounded" />
      <div className="skeleton shimmer h-7 w-24 rounded" />
    </div>
    
    {/* Job cards skeleton */}
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-[var(--background-soft)]">
          <div className="skeleton shimmer h-12 w-12 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="skeleton shimmer h-4 w-3/4 rounded" />
            <div className="skeleton shimmer h-3 w-1/2 rounded" />
          </div>
          <div className="skeleton shimmer h-7 w-16 rounded" />
        </div>
      ))}
    </div>
    
    {/* View all skeleton */}
    <div className="mt-4 pt-4 border-t border-theme flex justify-between items-center">
      <div className="skeleton shimmer h-3 w-24 rounded" />
      <div className="skeleton shimmer h-7 w-20 rounded" />
    </div>
  </div>
);

// Skeleton for DashboardAppStatus
const AppStatusSkeleton = () => (
  <div className="surface-card p-4 sm:p-6">
    {/* Header skeleton */}
    <div className="flex items-center justify-between mb-4">
      <div className="skeleton shimmer h-5 w-36 rounded" />
      <div className="skeleton shimmer h-6 w-6 rounded" />
    </div>
    
    {/* Status items skeleton */}
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[var(--background-soft)]">
          <div className="flex items-center gap-3">
            <div className="skeleton shimmer h-8 w-8 rounded-full" />
            <div className="space-y-1.5">
              <div className="skeleton shimmer h-3.5 w-20 rounded" />
              <div className="skeleton shimmer h-2.5 w-16 rounded" />
            </div>
          </div>
          <div className="skeleton shimmer h-5 w-12 rounded" />
        </div>
      ))}
    </div>
    
    {/* View all skeleton */}
    <div className="mt-4 pt-4 border-t border-theme">
      <div className="skeleton shimmer h-7 w-full rounded" />
    </div>
  </div>
);

// Main skeleton when data is loading
const MainSkeleton = () => (
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
    <div className="lg:col-span-2">
      <JobsSkeleton />
    </div>
    <div>
      <AppStatusSkeleton />
    </div>
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
// MAIN DASHBOARD BODY
// ==========================================

export default function DashboardBody() {
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [referralJobs, setReferralJobs] = useState<Job[]>([]);
  const [internshipJobs, setInternshipJobs] = useState<Job[]>([]);
  const [offCampusJobs, setOffCampusJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { profile } = useAuth();
  const role = profile?.profileType;

  const userType = useMemo(() => {
    return (role || profile?.profileType) as UserType | undefined;
  }, [role, profile?.profileType]);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardBodyData() {
      if (!userType) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        if (userType === "student" || userType === "fresher") {
          const [offCampusRes, internshipRes, referralRes] = await Promise.all([
            axiosInstance.get("/api/student-dashboard/off-campus"),
            axiosInstance.get("/api/student-dashboard/internship-postings"),
            axiosInstance.get("/api/student-dashboard/referral-jobs"),
          ]);

          if (!isMounted) return;

          const referrals = referralRes.data?.data || [];
          const internships = internshipRes.data?.data || [];
          const offCampus = offCampusRes.data?.data || [];

          setReferralJobs(referrals.slice(0, 2));
          setInternshipJobs(internships.slice(0, 2));
          setOffCampusJobs(offCampus.slice(0, 2));

          const allJobs = [...referrals, ...internships, ...offCampus];
          setAllJobs(allJobs);

          const [offCampusApplications, internshipApplications, referralApplications] = await Promise.all([
            getCandidateApplications("Off-campus"),
            getCandidateApplications("Internship"),
            getCandidateApplications("Referral"),
          ]);

          setApplications([
            ...(offCampusApplications.data || []),
            ...(internshipApplications.data || []),
            ...(referralApplications.data || []),
          ]);
        }

        if (userType === "professional") {
          const [referralRes, applicationsRes] = await Promise.all([
            axiosInstance.get("/api/student-dashboard/referral-jobs"),
            getProfessionalApplications(),
          ]);

          if (!isMounted) return;

          const referrals = referralRes.data?.data || [];

          setReferralJobs(referrals.slice(0, 4));
          setAllJobs(referrals);

          setApplications(applicationsRes.data || []);
        }
      } catch (err) {
        console.error("Error fetching dashboard body data:", err);

        if (!isMounted) return;

        setAllJobs([]);
        setApplications([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDashboardBodyData();

    return () => {
      isMounted = false;
    };
  }, [userType]);

  // Show main skeleton while data is loading
  if (loading) {
    return <MainSkeleton />;
  }

  const isStudent = userType === "student" || userType === "fresher";
  const isProfessional = userType === "professional";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left Column - Dashboard Jobs */}
      <div className="lg:col-span-2">
        <StaggeredSuspense fallback={<JobsSkeleton />} delay={0}>
          <DashboardJobs
            referralJobs={referralJobs}
            internshipJobs={isStudent ? internshipJobs : []}
            offCampusJobs={isStudent ? offCampusJobs : []}
            allJobs={allJobs}
          />
        </StaggeredSuspense>
      </div>

      {/* Right Column - Application Status */}
      <div>
        <StaggeredSuspense fallback={<AppStatusSkeleton />} delay={100}>
          <DashboardAppStatus applications={applications} />
        </StaggeredSuspense>
      </div>
    </div>
  );
}