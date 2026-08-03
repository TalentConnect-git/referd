// components/professional/IncomingRequests.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RefreshCw, Bell, ChevronRight, Users } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import IncomingRequestCard from "./IncomingRequestCard";
import { Application } from "@/types/applications";

interface IncomingRequestsProps {
  limit?: number;
}

const IncomingRequests: React.FC<IncomingRequestsProps> = ({ limit = 3 }) => {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchApplications();
  }, [page]);

  const fetchApplications = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        `/application/all-referrals?page=${page}&limit=10`,
      );

      console.log("all referrals", response.data);

      if (response.data && response.data.success) {
        const data = response.data.data || [];
        setApplications(data);
        setTotalPages(response.data.totalPages || 1);
      } else if (Array.isArray(response.data)) {
        setApplications(response.data);
      } else {
        setApplications([]);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load applications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (applicationId: string, status: string): void => {
    setApplications((prev) =>
      prev.map((app) =>
        app._id === applicationId ? { ...app, currentStatus: status } : app,
      ),
    );
  };

  const handleRefresh = (): void => {
    fetchApplications();
  };

  if (loading) {
    return (
      <div className="mt-3 rounded-2xl border border-theme bg-card overflow-hidden shadow-lg shadow-black/20 sm:mt-4">
        <div className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div>
            <div className="h-4 w-32 animate-pulse rounded bg-shimmer-start sm:w-40" />
            <div className="mt-1 h-3 w-40 animate-pulse rounded bg-shimmer-start sm:mt-1.5 sm:w-48" />
          </div>
          <div className="h-7 w-16 animate-pulse rounded-lg bg-shimmer-start sm:h-8 sm:w-20" />
        </div>
        <div className="space-y-2 px-3 pb-3 sm:space-y-2.5 sm:px-4 sm:pb-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-14 animate-pulse rounded-lg bg-shimmer-start sm:h-16"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-3 rounded-2xl border border-danger-border bg-danger-soft p-3 sm:mt-4 sm:p-4">
        <p className="text-center text-xs text-danger sm:text-sm">{error}</p>
        <button
          onClick={handleRefresh}
          className="mx-auto mt-2 block rounded-lg bg-danger-soft px-3 py-1 text-xs text-danger transition-colors hover:bg-danger-soft/80 sm:mt-3 sm:px-4 sm:py-1.5 sm:text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  const displayApplications = applications.slice(0, limit);
  const hasMoreApplications = applications.length > limit;

  return (
    <div className="mt-3 rounded-2xl border border-theme bg-card overflow-hidden shadow-lg shadow-black/5 sm:mt-4">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-divider bg-background-soft/50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-4 sm:py-4">
        <div className="flex items-start gap-1.5 sm:items-center">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--info-border)] bg-[var(--info-soft)]">
            <Bell className="h-3.5 w-3.5 text-[var(--info)]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-primary sm:text-sm">
              Incoming Referral Requests
            </h2>
            <p className="text-xs text-muted sm:text-[10px]">
              {applications.length > 0
                ? `${applications.length} application${applications.length > 1 ? "s" : ""} received`
                : "No applications received yet"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRefresh}
            className="rounded-lg bg-background-soft p-1.5 text-muted transition-colors hover:bg-card-hover hover:text-secondary sm:p-2"
          >
            <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
          <Link
            href="/professional/applications"
            className="btn-primary inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-sm"
          >
            <span className="hidden xs:inline">View All</span>
            <span className="xs:hidden">View</span>
            <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </Link>
        </div>
      </div>

      {/* Applications List */}
      <div className="divide-y divide-divider">
        {displayApplications.length > 0 ? (
          <>
            {displayApplications.map((application) => (
              <IncomingRequestCard
                key={application._id}
                application={application}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}

            {hasMoreApplications && (
              <div className="bg-gradient-to-r from-background via-background-soft to-background px-3 py-3 text-center sm:px-4 sm:py-4">
                <Link
                  href="/professional/applications"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-all duration-200 hover:text-primary-hover hover:underline sm:text-sm"
                >
                  + {applications.length - limit} more
                  <span className="hidden xs:inline">
                    application{applications.length - limit > 1 ? "s" : ""}{" "}
                    waiting
                  </span>
                  <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="px-3 py-8 text-center sm:px-4 sm:py-12">
            <div className="mx-auto mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-background-soft sm:mb-3 sm:h-14 sm:w-14">
              <Users className="h-5 w-5 text-muted sm:h-6 sm:w-6" />
            </div>
            <h3 className="text-sm font-medium text-primary sm:text-base">
              No applications yet
            </h3>
            <p className="mx-auto mt-1 max-w-xs text-xs text-muted sm:mt-1.5 sm:max-w-sm sm:text-sm">
              You haven't received any referral applications. Share your
              referral links to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomingRequests;
