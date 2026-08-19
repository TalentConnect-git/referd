// app/page.tsx (ReferralJobs component with 6 jobs rotation)
"use client";

import Link from "next/link";
import ReferralCard from "@/components/ui/ReferralCard";
import { RevealItem } from "@/components/ui/RevealSection";
import axiosInstance from "@/lib/axiosInstance";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  RefreshCw,
  Clock,
  Briefcase,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function ReferralJobs() {
  const [referralJobs, setReferralJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const { role, isAuthenticated } = useAuth();
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const JOBS_PER_PAGE = 6; // Only 6 jobs
  const REFRESH_INTERVAL = 60000; // 1 minute

  useEffect(() => {
    fetchReferralJobs(1);

    // Auto-refresh every 1 minute - go to next page
    intervalRef.current = setInterval(() => {
      const nextPage = currentPage < totalPages ? currentPage + 1 : 1;
      fetchReferralJobs(nextPage, true);
      setTimeRemaining(60);
    }, REFRESH_INTERVAL);

    // Timer countdown
    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [currentPage, totalPages]);

  async function fetchReferralJobs(page: number = 1, isAutoRefresh = false) {
    try {
      if (!isAutoRefresh) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }

      const response = await axiosInstance.get(
        `/api/student-dashboard/referral-jobs?page=${page}&limit=${JOBS_PER_PAGE}`
      );

      const jobs = response.data?.data || [];
      const total = response.data?.total || 0;
      const totalPagesFromAPI = response.data?.totalPages || 0;

      setReferralJobs(jobs); // Only 6 jobs
      setCurrentPage(page);
      setTotalJobs(total);
      setTotalPages(totalPagesFromAPI);
    } catch (err) {
      console.error("Failed to fetch referral jobs", err);
      setReferralJobs([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  const handleManualRefresh = () => {
    if (totalPages === 0 || isRefreshing) return;
    const nextPage = currentPage < totalPages ? currentPage + 1 : 1;
    fetchReferralJobs(nextPage, true);
    setTimeRemaining(60);
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || isRefreshing) return;
    fetchReferralJobs(page, true);
    setTimeRemaining(60);
  };

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
      router.push(`/${role}/jobs/referral-jobs`);
    } else {
      router.push(`/login`);
    }
  };

  const handleJobClick = (jobId: string, matchScore: number = 0) => {
    if (isAuthenticated && role) {
      router.push(
        `/${role}/jobs/referral-jobs/${jobId}?matchScore=${matchScore}`
      );
    } else {
      router.push(`/jobs/${jobId}`);
    }
  };

  if (loading) {
    return (
      <section className="app-background min-h-screen px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent"></div>
              <div className="absolute inset-0 h-12 w-12 animate-pulse rounded-full bg-[var(--primary-soft)] blur-xl"></div>
            </div>
            <p className="text-sm font-medium text-[var(--text-secondary)] animate-pulse">
              Loading referral jobs...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="app-background min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.35em] text-[var(--primary)] sm:text-sm">
              <Sparkles className="h-3 w-3" />
              Referral Jobs
            </p>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl md:text-4xl">
              Find Your Dream Role
            </h1>
          </div>

          
          
        </div>

        {/* Hero Section */}
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-[var(--primary-soft)] to-transparent p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h2 className="max-w-3xl text-2xl font-bold leading-tight text-[var(--text-primary)] sm:text-3xl md:text-4xl">
                Referral opportunities
                <br />
                <span className="text-[var(--primary)]">
                  from real employees.
                </span>
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                Every role is posted by someone who can actually pass your
                resume to the hiring manager. Get your foot in the door with a
                personal referral.
              </p>

              {/* Stats - Showing only 6 jobs */}
              {totalJobs > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-[var(--primary)]" />
                    <span className="text-2xl font-bold text-[var(--primary)]">
                      {totalJobs}
                    </span>
                    <span className="text-sm text-[var(--text-secondary)]">
                      Total Jobs
                    </span>
                  </div>
                  <div className="h-6 w-px bg-[var(--border)]"></div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-[var(--text-secondary)]" />
                    <span className="text-sm text-[var(--text-secondary)]">
                      Showing 6 jobs • Page {currentPage} of {totalPages}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleGetStarted}
              className="group inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--primary-hover)] hover:shadow-md"
            >
              See all referrals
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Job Cards Grid - Exactly 6 cards */}
        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {referralJobs.map((job, index) => (
            <RevealItem
              key={`${job._id}-${currentPage}-${index}`}
              delay={index * 0.08}
            >
              <div
                onClick={() => handleJobClick(job._id, job.matchScore)}
                className="cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
              >
                <ReferralCard
                  companyLogo={
                    job.candidatePosted?.currentCompany?.[0]?.toUpperCase() ||
                    "C"
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
                  
                  salary={job.packageDetails?.totalCTC ?? "NA"}
                />

               
              </div>
            </RevealItem>
          ))}
        </div>

        {/* Pagination Controls - Shows all pages */}
        {totalPages > 1 && (
          <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <div className="flex flex-col items-center gap-4">
              {/* Page Navigation */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1 || isRefreshing}
                  className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] disabled:opacity-40"
                >
                  ← Prev
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }).map(
                    (_, idx) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = idx + 1;
                      } else if (currentPage <= 3) {
                        pageNum = idx + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + idx;
                      } else {
                        pageNum = currentPage - 2 + idx;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          disabled={isRefreshing}
                          className={`min-h-[2.25rem] min-w-[2.25rem] rounded-md px-3 py-1 text-sm font-medium transition-all ${
                            pageNum === currentPage
                              ? "bg-[var(--primary)] text-white shadow-sm"
                              : "text-[var(--text-secondary)] hover:bg-[var(--card-hover)]"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    },
                  )}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages || isRefreshing}
                  className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] disabled:opacity-40"
                >
                  Next →
                </button>
              </div>

              {/* Page Indicator Dots */}
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {Array.from({ length: Math.min(totalPages, 8) }).map(
                    (_, idx) => {
                      const dotIndex = idx + 1;
                      return (
                        <button
                          key={idx}
                          onClick={() => goToPage(dotIndex)}
                          disabled={isRefreshing}
                          className={`h-1.5 rounded-full transition-all ${
                            dotIndex === currentPage
                              ? "bg-[var(--primary)] w-6"
                              : "bg-[var(--border)] w-1.5 hover:bg-[var(--text-subtle)]"
                          }`}
                        />
                      );
                    },
                  )}
                </div>
                <span className="text-xs text-[var(--text-subtle)]">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {referralJobs.length === 0 && !loading && (
          <div className="surface-card mt-12 p-12 text-center">
            <div className="mx-auto max-w-md">
              <div className="mb-4 text-6xl">🔍</div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                No referral jobs available
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Check back later for new opportunities from real employees.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}