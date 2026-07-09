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

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col">
      <div className="ml-5 mr-5">
        <ApplicationStats
          applicationType={activeTab}
          applications={applications}
        />
      </div>

      <div className="pt-6 mt-5 ml-5 mb-5">
        <ApplicationTabs activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Applications List - Replaces ApplicationTable */}
      <ApplicationsList
        applicationType={activeTab}
        applications={applications}
        page={page}
        meta={meta}
        onPageChange={handlePageChange}
      />

      {/* Application Stats */}
    </div>
  );
}
