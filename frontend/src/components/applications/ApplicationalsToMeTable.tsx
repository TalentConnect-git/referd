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
      "Application Sent": "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Applied: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      "Referred To Company":
        "bg-green-500/10 text-green-400 border-green-500/20",
      Accepted: "bg-green-500/10 text-green-400 border-green-500/20",
      Approved: "bg-green-500/10 text-green-400 border-green-500/20",
      Rejected: "bg-red-500/10 text-red-400 border-red-500/20",
      "Interview Scheduled":
        "bg-purple-500/10 text-purple-400 border-purple-500/20",
      Waitlist: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    };
    return (
      statusMap[status || ""] ||
      "bg-gray-500/10 text-gray-400 border-gray-500/20"
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
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  const getMatchScoreColor = (score?: number): string => {
    const numericScore = Number(score) || 0;
    if (numericScore >= 75) return "text-green-400";
    if (numericScore >= 40) return "text-orange-400";
    return "text-red-400";
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
      router.push(`/${role}/applications/${applicationId}`);
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
    <div className="rounded-xl border border-slate-800 ml-4 mr-4 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0f172a]">
            <tr className="text-left text-gray-400 border-b border-slate-800">
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
                  className="border-b border-slate-800 hover:bg-slate-800/30 cursor-pointer transition-colors"
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
                        className="h-8 w-8 rounded-full object-cover border border-slate-700 hover:border-blue-500/50 transition-colors"
                      />
                      <span className="font-medium text-white text-[13px] hover:text-blue-400 transition-colors">
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
                      <Briefcase className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-gray-300 text-[13px] hover:text-blue-400 transition-colors">
                        {application?.job?.jobTitle?.[0] || "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* College */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-gray-300 text-[13px]">
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
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(
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
                      <span className="text-gray-500 text-[11px]">—</span>
                    )}
                  </td>

                  {/* Comment - Truncated to 4 characters */}
                  <td className="px-4 py-3">
                    {application?.adminComment ? (
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-3 h-3 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-400 text-[11px] truncate max-w-[60px]">
                          {truncateComment(application.adminComment)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-[11px]">—</span>
                    )}
                  </td>

                  {/* Applied Date */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-gray-400 text-[11px]">
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
                <td colSpan={8} className="text-center text-gray-400 py-12">
                  <div className="flex flex-col items-center gap-2">
                    <Briefcase className="w-10 h-10 text-gray-600" />
                    <p className="text-base font-medium text-gray-300">
                      No applications received yet.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 border-t border-slate-800 bg-[#0F172A]">
          <div className="text-[11px] text-gray-400 order-2 sm:order-1">
            Showing {startIndex} to {endIndex} of {totalItems} results
          </div>
          <div className="flex items-center gap-1.5 order-1 sm:order-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPrev}
              className="px-3 py-1 rounded-md border border-slate-700 text-[11px] font-medium text-gray-400 hover:bg-slate-700/30 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
          ${typeof pageNum === "number" ? "hover:bg-slate-700/30 hover:text-white cursor-pointer" : "cursor-default"}
          ${currentPage === pageNum ? "bg-green-500/20 text-green-400 border border-green-500/30" : "text-gray-400"}
          ${typeof pageNum !== "number" ? "text-gray-500" : ""}
        `}
              >
                {pageNum}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNext}
              className="px-3 py-1 rounded-md border border-slate-700 text-[11px] font-medium text-gray-400 hover:bg-slate-700/30 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
