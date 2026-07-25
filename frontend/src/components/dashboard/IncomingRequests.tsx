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
        `/application/all-referrals?page=${page}&limit=10`
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
    setApplications(prev => 
      prev.map(app => 
        app._id === applicationId 
          ? { ...app, currentStatus: status }
          : app
      )
    );
  };

  const handleRefresh = (): void => {
    fetchApplications();
  };

  if (loading) {
    return (
      <div className="mx-4 mt-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:mx-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="h-5 w-48 animate-pulse rounded bg-[var(--shimmer-start)]" />
            <div className="mt-2 h-4 w-56 animate-pulse rounded bg-[var(--shimmer-start)]" />
          </div>
          <div className="h-10 w-24 animate-pulse rounded-lg bg-[var(--shimmer-start)]" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-lg bg-[var(--shimmer-start)]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-4 mt-4 rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-soft)] p-5 sm:mx-5 sm:p-6">
        <p className="text-center text-[var(--danger)]">{error}</p>
        <button
          onClick={handleRefresh}
          className="mx-auto mt-4 block rounded-lg bg-[var(--danger-soft)] px-4 py-2 text-[var(--danger)] transition-colors hover:bg-[var(--danger-soft)]/80"
        >
          Try Again
        </button>
      </div>
    );
  }

  const displayApplications = applications.slice(0, limit);
  const hasMoreApplications = applications.length > limit;

  return (
    <div className="mx-4 mt-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-lg shadow-black/20 sm:mx-5">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-[var(--border)] bg-[var(--background-soft)]/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)]">
            <Bell className="h-5 w-5 text-[var(--primary)]" />
            Incoming Referral Requests
          </h2>
          <p className="mt-0.5 text-sm text-[var(--text-muted)]">
            {applications.length > 0 
              ? `${applications.length} application${applications.length > 1 ? 's' : ''} received` 
              : 'No applications received yet'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="rounded-lg bg-[var(--background-soft)] p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--card-hover)] hover:text-[var(--text-secondary)]"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <Link
            href="/professional/applications"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-black transition-all duration-200 hover:bg-[var(--primary-dark)] hover:shadow-lg hover:shadow-[var(--primary)]/25"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Applications List */}
      <div className="divide-y divide-[var(--border)]">
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
              <div className="bg-gradient-to-r from-[var(--background)] via-[var(--background-soft)] to-[var(--background)] px-4 py-4 text-center sm:px-6">
                <Link
                  href="/professional/applications"
                  className="inline-flex items-center gap-1 text-sm font-medium text-[var(--primary)] transition-all duration-200 hover:text-[var(--primary-dark)] hover:underline"
                >
                  + {applications.length - limit} more application{applications.length - limit > 1 ? 's' : ''} waiting
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="px-4 py-12 text-center sm:px-6">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--background-soft)]">
              <Users className="h-8 w-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-sm font-medium text-[var(--text-primary)]">
              No applications yet
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-[var(--text-muted)]">
              You haven't received any referral applications. Share your referral links to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomingRequests;