"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

import JobsContainer from "@/components/jobs/JobContainer";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {UserPlus} from "lucide-react"

export default function ProfessionalReferralJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router=useRouter();

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
    <div className="flex min-h-[calc(100vh-120px)] flex-col">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 px-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Referral Jobs</h1>
          <p className="mt-2 text-zinc-400">
            Manage and track all referral opportunities.
          </p>
        </div>
        

        <button
            onClick={handleAskForReferral}
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-transparent px-4 py-2.5 font-medium text-white transition-all duration-200 hover:border-white hover:bg-white/10"
          >
            <UserPlus className="h-5 w-5" />
            <span>Ask for Referral</span>
          </button>
        
      </div>

      <div className="flex-1">
        <JobsContainer jobs={jobs} loading={loading} type="referral" />
      </div>

      {meta && jobs.length > 0 && (
        <div className="mt-auto flex items-center justify-center gap-4">
          <button
            disabled={!meta.hasPrev}
            onClick={() => setPage((prev) => prev - 1)}
            className="rounded-lg border border-[var(--border)] px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>

          <span>
            Page {meta.page} of {meta.totalPages}
          </span>

          <button
            disabled={!meta.hasNext}
            onClick={() => setPage((prev) => prev + 1)}
            className="rounded-lg border border-[var(--border)] px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
