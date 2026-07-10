"use client";

import { useState, useEffect, useCallback } from "react";
import ProfessionalApplicationTabs from "./ProfessionalApplicationTabs";
import ApplicationTable from "./ApplicationTable";
import ApplicationByMe from "./ApplicationByMe";
import ApplicationStats from "./ApplicationStats";
import ApplicationsToMeTable from "./ApplicationalsToMeTable";
import {
  getProfessionalApplications,
  getProfessionalReceivedApplications,
  getReferredByMe,
} from "@/services/application.service";
import { ProfessionalApplicationType } from "@/types/applications";
import { RefreshCw } from "lucide-react";

export default function ProfessionalApplications() {
  const [activeTab, setActiveTab] =
    useState<ProfessionalApplicationType>("Requests Received");

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);
  const [limit] = useState(10);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch applications function
  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let response;

      if (activeTab === "Requests Received") {
        response = await getProfessionalReceivedApplications(page, limit);
      } else if (activeTab === "Applications By Me") {
        response = await getProfessionalApplications(page, limit);
      } else if (activeTab === "Referred By Me") {
        response = await getReferredByMe(page, limit);
      } else {
        // Fallback for any other tabs
        response = await getProfessionalApplications(page, limit);
      }

      setApplications(response?.data || []);
      setMeta(response?.meta || null);

      console.log("Response is ", response);
    } catch (error: any) {
      console.error("Failed to fetch applications", error);
      setError(error?.message || "Failed to load applications");
      setApplications([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, limit]);

  // Fetch applications when dependencies change
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications, refreshTrigger]);

  // Handle status update - refresh the list
  const handleStatusUpdate = useCallback(() => {
    // Trigger a refresh by incrementing the counter
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // Handle tab change
  const handleTabChange = useCallback((tab: ProfessionalApplicationType) => {
    setActiveTab(tab);
    setPage(1); // Reset to first page when changing tabs
    setError(null);
  }, []);

  // Determine which table to render
  const renderTable = () => {
    if (loading) {
      return (
        <div className="ml-5 mr-5 mb-5">
          <div className="rounded-3xl border border-slate-800 p-10 text-center">
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500/30 border-t-green-500"></div>
              <span className="ml-3 text-gray-400">
                Loading applications...
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="ml-5 mr-5 mb-5">
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-10 text-center">
            <p className="text-red-400">Error: {error}</p>
            <button
              onClick={() => fetchApplications()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/20 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      );
    }

    // Return just the table based on active tab
    if (activeTab === "Requests Received") {
      return (
        <ApplicationsToMeTable
          applications={applications}
          page={page}
          meta={meta}
        />
      );
    }

    if (activeTab === "Applications By Me") {
      return (
        <ApplicationByMe
          applicationType="Referral"
          applications={applications}
          page={page}
          meta={meta}
          onPageChange={handlePageChange}
          onStatusUpdate={handleStatusUpdate}
        />
      );
    }

    if (activeTab === "Referred By Me") {
      return (
        <ApplicationTable
          applicationType="Referral"
          applications={applications}
          page={page}
          meta={meta}
          onPageChange={handlePageChange}
          onStatusUpdate={handleStatusUpdate}
        />
      );
    }

    // Show empty state if no applications and no matching tab
    return (
      <div className="ml-5 mr-5 mb-5">
        <div className="rounded-3xl border border-slate-800 p-10 text-center">
          <p className="text-gray-400">No applications found</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col">
      {/* Application Stats - Always at the top */}
      {!loading && !error && applications.length > 0 && (
        <div className="mt-6 mx-5">
          <ApplicationStats
            applicationType={"Referral"}
            applications={applications}
          />
        </div>
      )}

      <div className="pt-6 mt-5 ml-5 mb-5">
        <ProfessionalApplicationTabs
          activeTab={activeTab}
          onChange={handleTabChange}
        />
      </div>

      {/* Render the table */}
      {renderTable()}
    </div>
  );
}