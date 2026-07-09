// components/professional/IncomingRequests.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
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
      <div className="mt-6 mx-5 rounded-2xl border border-[#1e293b] bg-[#0d1324] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="h-5 w-48 animate-pulse rounded bg-white/10" />
            <div className="mt-2 h-4 w-56 animate-pulse rounded bg-white/10" />
          </div>
          <div className="h-10 w-24 animate-pulse rounded-lg bg-white/10" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-lg bg-white/5"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 mx-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
        <p className="text-red-400 text-center">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 mx-auto block px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const displayApplications = applications.slice(0, limit);
  const hasMoreApplications = applications.length > limit;

  return (
    <div className="mt-6 mx-5 rounded-2xl border border-[#1e293b] bg-[#0d1324] overflow-hidden shadow-lg shadow-black/20">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#1e293b] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-[#0f172a]/50">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <svg
              className="w-5 h-5 text-[#31aa40]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            Incoming Referral Requests
          </h2>
          <p className="text-sm text-[#94a3b8] mt-0.5">
            {applications.length > 0 
              ? `${applications.length} application${applications.length > 1 ? 's' : ''} received` 
              : 'No applications received yet'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 bg-[#1a2332] text-[#94a3b8] rounded-lg hover:bg-[#1e293b] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/professional/applications"
            className="px-4 py-2 bg-[#31aa40] text-black text-sm font-medium rounded-lg hover:bg-[#16a34a] hover:shadow-lg hover:shadow-[#31aa40]/25 transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
          >
            View All
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Applications List */}
      <div className="divide-y divide-[#1e293b]">
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
              <div className="px-6 py-4 text-center bg-gradient-to-r from-[#0a0e17] via-[#0f172a] to-[#0a0e17]">
                <Link
                  href="/professional/applications"
                  className="text-[#31aa40] hover:text-[#16a34a] text-sm font-medium transition-all duration-200 hover:underline inline-flex items-center gap-1"
                >
                  + {applications.length - limit} more application{applications.length - limit > 1 ? 's' : ''} waiting
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1a2332] mb-4">
              <svg
                className="h-8 w-8 text-[#64748b]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-white">
              No applications yet
            </h3>
            <p className="mt-1 text-sm text-[#64748b] max-w-sm mx-auto">
              You haven't received any referral applications. Share your referral links to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomingRequests;