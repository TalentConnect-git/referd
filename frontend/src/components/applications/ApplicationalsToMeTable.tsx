"use client";

import { ApplicationalsToMeTableProps } from "@/types/applications";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Star,
  MessageSquare,
  Calendar,
  Briefcase,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function ProfessionalAppTable({
  applications,
  page = 1,
  meta,
  onPageChange,
  totalPages: propTotalPages,
}: ApplicationalsToMeTableProps & { totalPages?: number }) {
  const router = useRouter();
  const { profile } = useAuth();
  const role = profile?.profileType || "professional";
  const [currentPage, setCurrentPage] = useState(page);

  // Calculate pagination values
  const totalItems = meta?.total || applications.length;
  const totalPages = propTotalPages || meta?.totalPages || 1;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  // Calculate start and end index for display
  const itemsPerPage = meta?.limit || 10;
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const getStatusColor = (status?: string): string => {
    const statusMap: Record<string, string> = {
      "Application Sent": "badge-info",
      Applied: "badge-warning",
      "Referred To Company": "badge-success",
      Accepted: "badge-success",
      Approved: "badge-success",
      Rejected: "badge-danger",
      "Interview Scheduled": "badge-primary",
      Waitlist: "badge-warning",
    };
    return (
      statusMap[status || ""] || "badge"
    );
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const renderStars = (rating?: number): React.ReactNode => {
    const numRating = Number(rating) || 0;
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-2.5 h-2.5 ${
              star <= numRating
                ? "fill-warning text-warning"
                : "text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  const getMatchScoreColor = (score?: number): string => {
    const numericScore = Number(score) || 0;
    if (numericScore >= 75) return "text-success";
    if (numericScore >= 40) return "text-warning";
    return "text-danger";
  };

  // Truncate comment
  const truncateComment = (text: string, maxLength: number = 4): string => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "....";
  };

  // Handle profile click
  const handleProfileClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    if (userId) {
      router.push(`/${role}/profile/${userId}`);
    }
  };

  // Handle role click - navigate to application details

  
  const handleRoleClick = (e: React.MouseEvent, applicationId: string) => {
    e.stopPropagation();
    if (applicationId) {
      router.push(`/${role}/applications/to-me/${applicationId}`);
    }
  };

  // Generate page numbers
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }

      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }

      if (startPage > 2) {
        pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="card rounded-xl border border-theme ml-4 mr-4 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background">
            <tr className="text-left text-muted border-b border-divider">
              <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider">
                Applicant
              </th>
              <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider">
                College
              </th>
              <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider">
                Match
              </th>
              <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider">
                Rating
              </th>
              <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider">
                Comment
              </th>
              <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider">
                Applied
              </th>
            </tr>
          </thead>

          <tbody>
            {applications.length > 0 ? (
              applications.map((application: any) => (
                <tr
                  key={application._id}
                  onClick={() =>
                    router.push(
                      `/professional/applications/to-me/${application._id}`,
                    )
                  }
                  className="border-b border-divider hover:bg-card-hover cursor-pointer transition-colors"
                >
                  {/* Applicant - Click on name/profile redirects to profile */}
                  <td className="px-4 py-3">
                    <div
                      className="flex items-center gap-2.5 cursor-pointer"
                      onClick={(e) =>
                        handleProfileClick(e, application?.applicant?.userId)
                      }
                    >
                      <Image
                        src={
                          application?.applicant?.profileImage ||
                          "/images/default-user.png"
                        }
                        alt={application?.applicant?.name || "Applicant"}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover border border-theme hover:border-info/50 transition-colors"
                      />
                      <span className="font-medium text-primary text-[13px] hover:text-info transition-colors">
                        {application?.applicant?.name || "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* Role - Click redirects to application details */}
                  <td className="px-4 py-3">
                    <div
                      className="flex items-center gap-1.5 cursor-pointer"
                      onClick={(e) => handleRoleClick(e, application._id)}
                    >
                      <Briefcase className="w-3.5 h-3.5 text-muted" />
                      <span className="text-secondary text-[13px] hover:text-info transition-colors">
                        {application?.job?.jobTitle?.[0] || "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* College */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-muted" />
                      <span className="text-secondary text-[13px]">
                        {application?.applicant?.educations?.[0]?.college ||
                          "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* Match Score */}
                  <td className="px-4 py-3">
                    <span
                      className={`font-semibold text-[13px] ${getMatchScoreColor(application?.matchScore)}`}
                    >
                      {application?.matchScore ?? 0}%
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`badge inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(
                        application?.currentStatus,
                      )}`}
                    >
                      {application?.currentStatus || "Pending"}
                    </span>
                  </td>

                  {/* Rating */}
                  <td className="px-4 py-3">
                    {application?.rating && application.rating > 0 ? (
                      renderStars(application.rating)
                    ) : (
                      <span className="text-muted text-[11px]">—</span>
                    )}
                  </td>

                  {/* Comment - Truncated to 4 characters */}
                  <td className="px-4 py-3">
                    {application?.adminComment ? (
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-3 h-3 text-muted flex-shrink-0" />
                        <span className="text-muted text-[11px] truncate max-w-[60px]">
                          {truncateComment(application.adminComment)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted text-[11px]">—</span>
                    )}
                  </td>

                  {/* Applied Date */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-muted" />
                      <span className="text-muted text-[11px]">
                        {application?.createdAt
                          ? new Date(application.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "N/A"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center text-muted py-12">
                  <div className="flex flex-col items-center gap-2">
                    <Briefcase className="w-10 h-10 text-muted" />
                    <p className="text-base font-medium text-secondary">
                      No applications received yet.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 border-t border-divider bg-background">
          <div className="text-[11px] text-muted order-2 sm:order-1">
            Showing {startIndex} to {endIndex} of {totalItems} results
          </div>
          <div className="flex items-center gap-1.5 order-1 sm:order-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPrev}
              className="btn-secondary px-3 py-1 rounded-md border border-theme text-[11px] font-medium text-muted hover:bg-card-hover hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((pageNum, index) => (
              <button
                key={index}
                onClick={() => {
                  if (typeof pageNum === "number") {
                    handlePageChange(pageNum);
                  }
                }}
                disabled={typeof pageNum !== "number"}
                className={`
          min-w-[28px] h-7 rounded-md text-[11px] font-medium transition-colors
          ${typeof pageNum === "number" ? "hover:bg-card-hover hover:text-primary cursor-pointer" : "cursor-default"}
          ${currentPage === pageNum ? "badge-primary text-primary border border-primary/30" : "text-muted"}
          ${typeof pageNum !== "number" ? "text-muted" : ""}
        `}
              >
                {pageNum}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNext}
              className="btn-secondary px-3 py-1 rounded-md border border-theme text-[11px] font-medium text-muted hover:bg-card-hover hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}