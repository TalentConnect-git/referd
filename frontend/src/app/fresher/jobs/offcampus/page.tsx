"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Briefcase, ChevronLeft, ChevronRight } from "lucide-react";

import JobsTabs from "@/components/jobs/JobTabs";
import JobsContainer from "@/components/jobs/JobContainer";

export default function OffCampusPage() {
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
    fetchOffCampusJobs(page);
  }, [page]);

  async function fetchOffCampusJobs(pageNumber: number) {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        `/api/student-dashboard/off-campus?page=${pageNumber}&limit=10`
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
      console.error("Failed to fetch off-campus jobs", error);

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

  const start =
    meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;

  const end =
    meta.total === 0
      ? 0
      : Math.min(meta.page * meta.limit, meta.total);

  return (
    <div className="min-h-[calc(100vh-120px)] bg-[var(--background)] px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--info-border)] bg-[var(--info-soft)]">
            <Briefcase size={14} className="text-[var(--info)]" />
          </div>

          <div>
            <h1 className="text-xs font-bold text-[var(--text-primary)]">
              Off-Campus Opportunities
            </h1>
            <p className="text-[8px] text-[var(--text-muted)]">
              Discover off-campus jobs tailored to your profile
            </p>
          </div>
        </div>

        {/* Tabs */}
        <JobsTabs />

        {/* Jobs */}
        <div className="mt-4">
          <JobsContainer
            jobs={jobs}
            loading={loading}
            type="offcampus"
          />
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col items-center justify-between gap-2 rounded-lg border border-[var(--border)] bg-[var(--background-soft)] px-3 py-2 sm:flex-row">
          <div className="order-2 text-[10px] text-[var(--text-muted)] sm:order-1">
            Showing {start} to {end} of {meta.total}
          </div>

          <div className="order-1 flex items-center gap-1 sm:order-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={!meta.hasPrev || page === 1}
              className="
                inline-flex items-center gap-1 rounded-lg border
                border-[var(--border)] bg-[var(--background-soft)]
                px-2.5 py-1 text-[10px] font-medium
                text-[var(--text-muted)] transition-all
                hover:border-[var(--primary-border)]
                hover:bg-[var(--primary-soft)]
                hover:text-[var(--primary)]
                disabled:cursor-not-allowed disabled:opacity-40
                disabled:hover:border-[var(--border)]
                disabled:hover:bg-transparent
                disabled:hover:text-[var(--text-muted)]
              "
            >
              <ChevronLeft size={12} />
              Prev
            </button>

            <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--card-hover)] px-2.5 py-1">
              <span className="text-[10px] font-medium text-[var(--text-primary)]">
                {meta.page}
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">/</span>
              <span className="text-[10px] text-[var(--text-muted)]">
                {meta.totalPages}
              </span>
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={!meta.hasNext || page === meta.totalPages}
              className="
                inline-flex items-center gap-1 rounded-lg border
                border-[var(--border)] bg-[var(--background-soft)]
                px-2.5 py-1 text-[10px] font-medium
                text-[var(--text-muted)] transition-all
                hover:border-[var(--primary-border)]
                hover:bg-[var(--primary-soft)]
                hover:text-[var(--primary)]
                disabled:cursor-not-allowed disabled:opacity-40
                disabled:hover:border-[var(--border)]
                disabled:hover:bg-transparent
                disabled:hover:text-[var(--text-muted)]
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