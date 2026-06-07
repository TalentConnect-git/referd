"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardJobs from "./DashboardJobs";
import DashboardAppStatus from "./DashboardAppStatus";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

type UserType = "student" | "fresher" | "professional";

export default function DashboardBody() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { profile} = useAuth();

  const role=profile?.profileType;

  const userType = useMemo(() => {
    return (role || profile?.profileType ) as
      | UserType
      | undefined;
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
          const [jobsResponse, offCampusRes, internshipRes, referralRes] =
            await Promise.all([
              axiosInstance.get("/api/student-dashboard/job-postings"),
              axiosInstance.get("/application/status/candidate/Off-campus"),
              axiosInstance.get("/application/status/candidate/Internship"),
              axiosInstance.get("/application/status/candidate/Referral"),
            ]);

          if (!isMounted) return;

          setJobs(jobsResponse.data?.data || []);

          setApplications([
            ...(offCampusRes.data?.data || []),
            ...(internshipRes.data?.data || []),
            ...(referralRes.data?.data || []),
          ]);
        }

        if (userType === "professional") {
          const [jobsResponse, referralRes] = await Promise.all([
            axiosInstance.get("/api/student-dashboard/referral-jobs"),
            axiosInstance.get("/application/status/candidate/Referral"),
          ]);

          if (!isMounted) return;

          setJobs(jobsResponse.data?.data || []);

          console.log("job data",jobs)
          setApplications(referralRes.data?.data || []);
        }
      } catch (err) {
        console.error("Error fetching dashboard body data:", err);

        if (!isMounted) return;

        setJobs([]);
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

  if (loading) {
    return (
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-80 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--card)] lg:col-span-2" />
        <div className="h-80 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--card)]" />
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <DashboardJobs jobs={jobs} />
      </div>

      <div>
        <DashboardAppStatus applications={applications} />
      </div>
    </div>
  );
}