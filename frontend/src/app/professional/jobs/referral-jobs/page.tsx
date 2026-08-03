"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Sparkles,
} from "lucide-react";

import axiosInstance from "@/lib/axiosInstance";
import JobsContainer from "@/components/jobs/JobContainer";

type CandidatePosted = {
  _id?: string;
  userId?: string;
  currentCompany?: string;
  email?: string;
  name?: string;
};

type ReferralJob = {
  _id: string;
  candidatePosted?: CandidatePosted | null;
  postedByUser?: string;
  companyName?: string;
  alumniCount?: number;
  [key: string]: unknown;
};

type PaginationMeta = {
  limit?: number;
  returned?: number;
  nextCursor?: string | null;
  hasMore?: boolean;

  // Kept in case the backend also returns page-based pagination.
  total?: number;
  page?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
};

export default function ProfessionalReferralJobsPage() {
  const router = useRouter();

  const [jobs, setJobs] = useState<ReferralJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
    returned: 0,
    nextCursor: null,
    hasMore: false,
  });

  const fetchReferralJobs = useCallback(async (pageNumber: number) => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        "/api/student-dashboard/referral-jobs",
        {
          params: {
            page: pageNumber,
            limit: 10,
          },
        },
      );

      const fetchedJobs: ReferralJob[] = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      setJobs(fetchedJobs);

      setMeta(
        response.data?.meta || {
          page: pageNumber,
          limit: 10,
          total: 0,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
          returned: 0,
          nextCursor: null,
          hasMore: false,
        },
      );
    } catch (error) {
      console.error("Failed to fetch referral jobs", error);

      setJobs([]);

      setMeta({
        page: pageNumber,
        limit: 10,
        total: 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
        returned: 0,
        nextCursor: null,
        hasMore: false,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchReferralJobs(page);
  }, [page, fetchReferralJobs]);

  const handleAskForReferral = () => {
    router.push("/professional/referral-jobs");
  };

  const start =
    (meta.total ?? 0) === 0
      ? 0
      : ((meta.page ?? page) - 1) * (meta.limit ?? 10) + 1;

  const end =
    (meta.total ?? 0) === 0
      ? 0
      : Math.min((meta.page ?? page) * (meta.limit ?? 10), meta.total ?? 0);

  return (
    <div className="flex min-h-[calc(100vh-150px)] flex-col bg-background">
      {/* Header */}
      <div className="mx-4 mb-2 mt-2 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-theme bg-card-soft/50 px-4 py-3 shadow-sm sm:mx-6">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-primary-soft border border-primary/20">
            <Briefcase className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-[15px] font-bold text-primary">Referral Jobs</h1>
            <p className="text-xs text-muted">
              Manage and track all referral opportunities
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAskForReferral}
          className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
        >
          <UserPlus className="h-4 w-4" />
          <span>Ask for Referral</span>
        </button>
      </div>

      {/* Jobs Container */}
      <div className="flex-1 px-4 sm:px-6">
        <JobsContainer jobs={jobs} loading={loading} type="referral" />
      </div>

      {/* Pagination */}
      {jobs.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 rounded-lg border border-theme bg-card/50 px-3 py-2 mx-4 sm:mx-6">
          <div className="order-2 text-[10px] text-muted sm:order-1">
            Showing <span className="font-semibold text-primary">{start}</span>{" "}
            to <span className="font-semibold text-primary">{end}</span> of{" "}
            <span className="font-semibold text-primary">
              {meta.total ?? 0}
            </span>{" "}
            jobs
          </div>

          <div className="order-1 flex items-center gap-1 sm:order-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={!meta.hasPrev || page === 1 || loading}
              className="btn-secondary inline-flex items-center gap-1 rounded-lg border border-theme bg-background px-2.5 py-1 text-[10px] font-medium text-muted transition-all hover:border-primary/30 hover:bg-primary-soft hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-theme disabled:hover:bg-transparent disabled:hover:text-muted"
            >
              <ChevronLeft size={12} />
              Prev
            </button>

            <div className="flex items-center gap-1 rounded-lg border border-theme bg-card-soft px-2.5 py-1">
              <span className="text-[10px] font-medium text-primary">
                {meta.page ?? page}
              </span>
              <span className="text-[10px] text-muted">/</span>
              <span className="text-[10px] text-muted">
                {meta.totalPages ?? 1}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={
                !meta.hasNext || page === (meta.totalPages ?? 1) || loading
              }
              className="btn-secondary inline-flex items-center gap-1 rounded-lg border border-theme bg-background px-2.5 py-1 text-[10px] font-medium text-muted transition-all hover:border-primary/30 hover:bg-primary-soft hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-theme disabled:hover:bg-transparent disabled:hover:text-muted"
            >
              Next
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Empty State with Sparkles */}
      {!loading && jobs.length === 0 && (
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="card max-w-md w-full rounded-2xl border border-theme bg-card-soft p-8 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft border border-primary/20">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-primary">
              No Referral Jobs Found
            </h3>
            <p className="mt-2 text-sm text-muted">
              There are no referral jobs available at the moment. Check back
              later or ask for a referral.
            </p>
            <button
              type="button"
              onClick={handleAskForReferral}
              className="btn-primary mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
            >
              <UserPlus className="h-4 w-4" />
              Ask for Referral
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
