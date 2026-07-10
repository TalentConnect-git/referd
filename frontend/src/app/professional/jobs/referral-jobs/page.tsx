"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import JobsContainer from "@/components/jobs/JobContainer";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfessionalReferralJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{
    total?: number;
    page?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  } | null>(null);

  useEffect(() => {
    fetchReferralJobs(page);
  }, [page]);

  async function fetchReferralJobs(pageNumber: number) {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/api/student-dashboard/referral-jobs?page=${pageNumber}&limit=10`,
      );
      setJobs(response.data?.data || []);
      setMeta(response.data?.meta || null);
    } catch (error) {
      console.error("Failed to fetch referral jobs", error);
      setJobs([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }

  const handleAskForReferral = () => {
    router.push("/professional/referral-jobs");
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col bg-[#0F172A]">
      {/* Header */}
      <div className="mb-0 flex flex-wrap items-center justify-between gap-3 ml-4 mr-4 p-3 px-4">
        <div>
          <h1 className="text-lg font-bold text-white">Referral Jobs</h1>
          <p className="text-xs text-zinc-400">
            Manage and track all referral opportunities.
          </p>
        </div>

        <button
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

      {/* Pagination */}
      {meta && jobs.length > 0 && (
        <div className="mt-4 flex items-center justify-center gap-3 rounded-lg border border-[#1e293b] bg-[#111827] p-2">
          <button
            disabled={!meta.hasPrev}
            onClick={() => setPage((prev) => prev - 1)}
            className="rounded-md border border-[#1e293b] px-3 py-1 text-xs text-gray-400 transition-all hover:border-slate-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-xs text-gray-400">
            Page {meta.page} of {meta.totalPages}
          </span>

          <button
            disabled={!meta.hasNext}
            onClick={() => setPage((prev) => prev + 1)}
            className="rounded-md border border-[#1e293b] px-3 py-1 text-xs text-gray-400 transition-all hover:border-slate-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}