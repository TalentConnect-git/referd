"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Briefcase, ChevronLeft, ChevronRight } from "lucide-react";

import JobsTabs from "@/components/jobs/JobTabs";
import JobsContainer from "@/components/jobs/JobContainer";

export default function ReferralJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  useEffect(() => {
    fetchReferralJobs(page);
  }, [page]);

  async function fetchReferralJobs(pageNumber: number) {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        `/api/student-dashboard/referral-jobs?page=${pageNumber}&limit=10`
      );

      setJobs(response.data?.data || []);

      setMeta(
        response.data?.meta || {
          page: pageNumber,
          limit: 10,
          total: 0,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        }
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
      });
    } finally {
      setLoading(false);
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > meta.totalPages) return;
    setPage(newPage);
  };

  const getDisplayRange = () => {
    if (meta.total === 0) {
      return { start: 0, end: 0 };
    }

    const start = (meta.page - 1) * meta.limit + 1;
    const end = Math.min(meta.page * meta.limit, meta.total);

    return { start, end };
  };

  const { start, end } = getDisplayRange();

  return (
    <div className="min-h-[calc(100vh-120px)] mt-3 px-4 sm:px-6 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Briefcase size={14} className="text-blue-400" />
          </div>

          <div>
            <h1 className="text-[12px] font-bold text-white">
              Referral Opportunities
            </h1>
            <p className="text-[8px] text-slate-400">
              Discover referral jobs tailored to your profile
            </p>
          </div>
        </div>

        <JobsTabs />

        <div className="mt-4">
          <JobsContainer
            jobs={jobs}
            loading={loading}
            type="referral"
          />
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 px-3 py-2 rounded-lg border border-[#2a3a52] bg-[#0f172a]/50">
          <div className="text-[10px] text-slate-500 order-2 sm:order-1">
            {meta.total > 0
              ? `Showing ${start} to ${end} of ${meta.total}`
              : "Showing 0 of 0"}
          </div>

          <div className="flex items-center gap-1 order-1 sm:order-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={!meta.hasPrev || page === 1}
              className="
                inline-flex
                items-center
                gap-1
                px-2.5
                py-1
                rounded-lg
                border
                border-[#2a3a52]
                bg-[#0f172a]
                text-[10px]
                font-medium
                text-slate-400
                transition-all
                hover:border-green-500/30
                hover:bg-green-500/10
                hover:text-green-400
                disabled:opacity-40
                disabled:cursor-not-allowed
                disabled:hover:border-[#2a3a52]
                disabled:hover:bg-transparent
                disabled:hover:text-slate-400
              "
            >
              <ChevronLeft size={12} />
              Prev
            </button>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1a2332] border border-[#2a3a52]">
              <span className="text-[10px] font-medium text-white">
                {meta.page}
              </span>
              <span className="text-[10px] text-slate-500">/</span>
              <span className="text-[10px] text-slate-500">
                {meta.totalPages}
              </span>
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={!meta.hasNext || page === meta.totalPages}
              className="
                inline-flex
                items-center
                gap-1
                px-2.5
                py-1
                rounded-lg
                border
                border-[#2a3a52]
                bg-[#0f172a]
                text-[10px]
                font-medium
                text-slate-400
                transition-all
                hover:border-green-500/30
                hover:bg-green-500/10
                hover:text-green-400
                disabled:opacity-40
                disabled:cursor-not-allowed
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
    </div>
  );
}