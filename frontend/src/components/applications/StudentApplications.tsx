"use client";
import { useState, useEffect } from "react";
import ApplicationTabs from "./ApplicationsTabs";
import ApplicationsList from "./ApplicationsList";
import ApplicationStats from "./ApplicationStats";
import { getCandidateApplications } from "@/services/application.service";
import { ApplicationType } from "@/types/applications";

export default function StudentApplications() {
  const [activeTab, setActiveTab] = useState<ApplicationType>("Referral");
  const [applications, setApplications] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await getCandidateApplications(activeTab, page, limit);

        setApplications(response.data || []);
        setMeta(response.meta || null);
      } catch (error) {
        console.error("Failed to fetch applications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [activeTab, page, limit]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <div className="mx-2 flex min-h-[calc(100vh-120px)] flex-col items-center justify-center sm:mx-5">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
          <p className="text-sm text-[var(--text-muted)]">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-2 flex min-h-[calc(100vh-120px)] flex-col sm:mx-1">
      <div className="mb-4">
        <ApplicationStats
          applicationType={activeTab}
          applications={applications}
        />
      </div>

      <div className="mb-4">
        <ApplicationTabs activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Applications List */}
      <ApplicationsList
        applicationType={activeTab}
        applications={applications}
        page={page}
        meta={meta}
        onPageChange={handlePageChange}
      />
    </div>
  );
}