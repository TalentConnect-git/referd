"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

import JobsTabs from "@/components/jobs/JobTabs";
import InternshipContainer from "@/components/internships/InternshipContainer";

export default function InternshipPage() {
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    fetchInternships(page);
  }, [page]);

  async function fetchInternships(pageNumber: number) {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        `/api/student-dashboard/internship-postings?page=${pageNumber}&limit=10`
      );
      // setInternships(response.data?.data || []);
      // console.log("ALL INT ",internships.length);

      const data = response.data?.data || [];
      
      setInternships(data);
      

      setMeta(response.data?.meta || null);
    } catch (error) {
      console.error("Failed to fetch internships", error);

      setInternships([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }
  if (loading) {

  return <div>Loading...</div>;

}
  if(internships.length==0)
  {
    return(
      <div className="text-yellow-400">
        <h1>No Interships found</h1>
      </div>
    )
  }
  
    return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col">

<div className="mb-6 px-5">
  <h1 className="text-2xl font-bold text-gray-300">
    Internship Opportunities
  </h1>

  <p className="mt-2 text-zinc-400 text-sm">
    Discover internships tailored to your profile and career goals.
  </p>
</div>

      {internships.length>0 && <div className="flex-1">
        <InternshipContainer
          internships={internships}
          loading={loading}
        />
      </div>}

      {meta && internships.length > 0 && (
        <div className="mt-auto flex items-center justify-center gap-4">
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













