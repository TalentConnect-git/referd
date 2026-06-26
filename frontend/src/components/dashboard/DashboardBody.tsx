"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardJobs from "./DashboardJobs";
import DashboardAppStatus from "./DashboardAppStatus";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import { getCandidateApplications, getProfessionalApplications } from "@/services/application.service";
import { UserType } from "@/types/dashboard";

export default function DashboardBody() {
  const [allJobs, setAllJobs] = useState<any[]>([]);

  const [referralJobs, setReferralJobs] = useState<any[]>([]);
  const [internshipJobs, setInternshipJobs] = useState<any[]>([]);
  const [offCampusJobs, setOffCampusJobs] = useState<any[]>([]);
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

          setReferralJobs(referrals.slice(0,2));
          setInternshipJobs(internships.slice(0,2));
          setOffCampusJobs(offCampus.slice(0,2));

          const allJobs = [...referrals, ...internships, ...offCampus];
          setAllJobs(allJobs);
          const 
          [offCampusApplications,
            internshipApplications,
            referralApplications,] = await Promise.all([
                                        getCandidateApplications("Off-campus"),
                                        getCandidateApplications("Internship"),
                                        getCandidateApplications("Referral"),
                                        ]);

            setApplications([...(offCampusApplications.data || []),
                          ...(internshipApplications.data || []),
                          ...(referralApplications.data || []),]);}
          

        // if (userType === "professional") {
        //   const [ referralRes] = await Promise.all([
        //     axiosInstance.get("/api/student-dashboard/referral-jobs"),
        //   ]);

        //   if (!isMounted) return;

        //   setReferralJobs(referralRes.data?.data || []);
        //   const referrals = referralRes.data?.data || [];
        //   setAllJobs(referrals);
        //   setApplications(referralRes.data?.data || []);
        // }


        if (userType === "professional") {
        const [referralRes, applicationsRes] = await Promise.all(
          [axiosInstance.get("/api/student-dashboard/referral-jobs"),getProfessionalApplications(),]);

        if (!isMounted) return;

        const referrals = referralRes.data?.data || [];

        setReferralJobs(referrals.slice(0,4));
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

  if (loading) {
    return (
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-80 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--card)] lg:col-span-2" />
        <div className="h-80 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--card)]" />
      </div>
    );
  }
  const dashboardJobs = referralJobs.slice(0, 5);
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
      { (userType == "student"||userType == "fresher") && (
        <div className="lg:col-span-2">
          <DashboardJobs
            referralJobs={referralJobs}
            internshipJobs={internshipJobs}
            offCampusJobs={offCampusJobs}
            allJobs={allJobs}
          />
        </div>
      )}
      {userType == "professional" && (
        <div className="lg:col-span-2">
          <DashboardJobs
            referralJobs={referralJobs}
            internshipJobs={[]}
            offCampusJobs={[]}
            allJobs={allJobs}
          />
        </div>
      )}

      <div>
        <DashboardAppStatus applications={applications} />
      </div>
    </div>
  );
}
