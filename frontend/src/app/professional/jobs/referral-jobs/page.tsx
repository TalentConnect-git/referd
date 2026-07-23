"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { UserPlus, ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="flex min-h-[calc(100vh-120px)] flex-col">
      {/* Header */}
      <div className="mx-4 mb-0 flex flex-wrap items-center justify-between gap-3 p-3 px-4">
        <div>
          <h1 className="text-lg font-bold text-white">Referral Jobs</h1>

          <p className="text-xs text-zinc-400">
            Manage and track all referral opportunities.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAskForReferral}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/30 bg-transparent px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:border-white hover:bg-white/10"
        >
          <UserPlus className="h-4 w-4" />
          <span>Ask for Referral</span>
        </button>
      </div>

      {/* Jobs Container */}
      <div className="flex-1">
        <JobsContainer jobs={jobs} loading={loading} type="referral" />
      </div>

      {/* Page-based pagination */}
      {/* Pagination */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 rounded-lg border border-[#2a3a52] bg-[#0f172a]/50 px-3 py-2">
        <div className="order-2 text-[10px] text-slate-500 sm:order-1">
          Showing {start} to {end} of {meta.total ?? 0}
        </div>

        <div className="order-1 flex items-center gap-1 sm:order-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={!meta.hasPrev || page === 1 || loading}
            className="
        inline-flex
        items-center
        gap-1
        rounded-lg
        border
        border-[#2a3a52]
        bg-[#0f172a]
        px-2.5
        py-1
        text-[10px]
        font-medium
        text-slate-400
        transition-all
        hover:border-green-500/30
        hover:bg-green-500/10
        hover:text-green-400
        disabled:cursor-not-allowed
        disabled:opacity-40
        disabled:hover:border-[#2a3a52]
        disabled:hover:bg-transparent
        disabled:hover:text-slate-400
      "
          >
            <ChevronLeft size={12} />
            Prev
          </button>

          <div className="flex items-center gap-1 rounded-lg border border-[#2a3a52] bg-[#1a2332] px-2.5 py-1">
            <span className="text-[10px] font-medium text-white">
              {meta.page ?? page}
            </span>

            <span className="text-[10px] text-slate-500">/</span>

            <span className="text-[10px] text-slate-500">
              {meta.totalPages ?? 1}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={
              !meta.hasNext || page === (meta.totalPages ?? 1) || loading
            }
            className="
        inline-flex
        items-center
        gap-1
        rounded-lg
        border
        border-[#2a3a52]
        bg-[#0f172a]
        px-2.5
        py-1
        text-[10px]
        font-medium
        text-slate-400
        transition-all
        hover:border-green-500/30
        hover:bg-green-500/10
        hover:text-green-400
        disabled:cursor-not-allowed
        disabled:opacity-40
        disabled:hover:border-[#2a3a52]
        disabled:hover:bg-transparent
        disabled:hover:text-slate-400
      "
          >
            Next
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
