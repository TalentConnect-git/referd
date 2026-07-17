"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

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
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const fetchReferralJobs = useCallback(
    async (pageNumber: number) => {
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
        setMeta(response.data?.meta || null);
      } catch (error) {
        console.error("Failed to fetch referral jobs", error);

        setJobs([]);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void fetchReferralJobs(page);
  }, [page, fetchReferralJobs]);

  const handleAskForReferral = () => {
    router.push("/professional/referral-jobs");
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col">
      {/* Header */}
      <div className="mx-4 mb-0 flex flex-wrap items-center justify-between gap-3 p-3 px-4">
        <div>
          <h1 className="text-lg font-bold text-white">
            Referral Jobs
          </h1>

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
        <JobsContainer
          jobs={jobs}
          loading={loading}
          type="referral"
        />
      </div>

      {/* Page-based pagination */}
      {meta?.totalPages && jobs.length > 0 && (
        <div className="mt-4 flex items-center justify-center gap-3 rounded-lg border border-[#1e293b] bg-[#111827] p-2">
          <button
            type="button"
            disabled={!meta.hasPrev || loading}
            onClick={() => {
              setPage((previousPage) =>
                Math.max(1, previousPage - 1),
              );
            }}
            className="rounded-md border border-[#1e293b] px-3 py-1 text-xs text-gray-400 transition-all hover:border-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-xs text-gray-400">
            Page {meta.page ?? page} of {meta.totalPages}
          </span>

          <button
            type="button"
            disabled={!meta.hasNext || loading}
            onClick={() => {
              setPage((previousPage) => previousPage + 1);
            }}
            className="rounded-md border border-[#1e293b] px-3 py-1 text-xs text-gray-400 transition-all hover:border-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}