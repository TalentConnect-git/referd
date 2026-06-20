"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import {useRouter} from "next/navigation";
import { ArrowLeft } from "lucide-react";

import JobsTabs from "@/components/jobs/JobTabs";
import JobsContainer from "@/components/jobs/JobContainer";

export default function OffCampusPage() {
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
    fetchOffCampusJobs(page);
  }, [page]);

  async function fetchOffCampusJobs(pageNumber: number) {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        `/api/student-dashboard/off-campus?page=${pageNumber}&limit=10`
      );

      setJobs(response.data?.data || []);
      setMeta(response.data?.meta || null);
    } catch (error) {
      console.error("Failed to fetch off-campus jobs", error);

      setJobs([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col">
      <JobsTabs />

        <div className="flex-1">
        <JobsContainer
        jobs={jobs}
        loading={loading}
        type="offcampus"
      />
        </div>
      

      {meta && jobs.length > 0 && (
        <div className=" mt-auto flex items-center justify-center gap-4">
          <button
            disabled={!meta.hasPrev}
            onClick={() => setPage((prev) => prev - 1)}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>

          <span>
            Page {meta.page} of {meta.totalPages}
          </span>

          <button
            disabled={!meta.hasNext}
            onClick={() => setPage((prev) => prev + 1)}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}