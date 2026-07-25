"use client";
import Link from "next/link";
import ReferralCard from "@/components/ui/ReferralCard";
import { RevealItem } from "@/components/ui/RevealSection";
import axiosInstance from "@/lib/axiosInstance";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ReferralJobs() {
  const [referralJobs, setReferralJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { role, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchReferralJobs();
  }, []);

  async function fetchReferralJobs() {
    try {
      const response = await axiosInstance.get(
        "/api/student-dashboard/referral-jobs",
      );

      const jobs = response.data?.data?.slice(0, 6) || [];
      setReferralJobs(jobs);
    } catch (err) {
      console.error("Failed to fetch referral jobs", err);
      setReferralJobs([]);
    } finally {
      setLoading(false);
    }
  }

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const handleGetStarted = () => {
    if (loading) return;

    if (isAuthenticated && role) {
      if (role === "professional") {
        router.push(`/${role}/jobs/referral-jobs`);
      } else {
        router.push(`/${role}/jobs`);
      }
    } else {
      router.push(`/login`);
    }
  };

  if (loading) {
    return (
      <section className="bg-[var(--background)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[200px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="referrals"
      className="bg-[var(--background)] px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.35em] text-[var(--primary)] sm:mb-5 sm:text-sm">
          Referral Jobs
        </p>

        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end lg:gap-8">
          <div>
            <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-[-0.04em] text-[var(--text-primary)] sm:text-4xl md:text-[42px]">
              Referral opportunities
              <br />
              from real employees.
            </h2>

            <p className="mt-4 max-w-5xl text-base leading-7 text-[var(--text-secondary)] sm:mt-6 sm:text-lg sm:leading-8">
              Every role is posted by someone who can actually pass your resume
              to the hiring manager.
            </p>
          </div>

          <button
            onClick={handleGetStarted}
            className="group flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] transition-all duration-200 hover:text-[var(--text-primary)] sm:gap-3 sm:text-base"
          >
            See all referrals
            <span className="text-2xl transition-transform duration-200 group-hover:translate-x-1 sm:text-[26px]">
              →
            </span>
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {referralJobs.map((job, index) => (
            <RevealItem key={job._id} delay={index * 0.08}>
              <ReferralCard
                companyLogo={
                  job.candidatePosted?.currentCompany?.[0]?.toUpperCase() || "C"
                }
                title={job.jobTitle?.[0] || "Referral Opportunity"}
                company={
                  job.candidatePosted?.currentCompany || "Unknown Company"
                }
                location={
                  job.receiverProfile?.locations?.[0] ||
                  job.location?.[0] ||
                  "Remote"
                }
                match={`${job.matchScore}%`}
                postedByInitials={getInitials(job.candidatePosted?.name)}
                postedByName={
                  job.receiverProfile?.name ||
                  job.candidatePosted?.name ||
                  "Anonymous"
                }
                college={job.receiverProfile?.educations?.[0]?.college || "-"}
                salary={job.packageDetails?.totalCTC ?? "-"}
              />
            </RevealItem>
          ))}
        </div>

        {/* Empty state */}
        {referralJobs.length === 0 && !loading && (
          <div className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--card)]/50 p-8 text-center">
            <p className="text-[var(--text-secondary)]">
              No referral jobs available right now. Check back later!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}