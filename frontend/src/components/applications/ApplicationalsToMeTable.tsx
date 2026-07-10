"use client";

import { ApplicationalsToMeTableProps } from "@/types/applications";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star, MessageSquare, Calendar, Briefcase, GraduationCap } from "lucide-react";

export default function ProfessionalAppTable({
  applications,
}: ApplicationalsToMeTableProps) {
  const router = useRouter();

  const getStatusColor = (status?: string): string => {
    const statusMap: Record<string, string> = {
      "Application Sent": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "Applied": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "Referred To Company": "bg-green-500/20 text-green-400 border-green-500/30",
      "Accepted": "bg-green-500/20 text-green-400 border-green-500/30",
      "Approved": "bg-green-500/20 text-green-400 border-green-500/30",
      "Rejected": "bg-red-500/20 text-red-400 border-red-500/30",
      "Interview Scheduled": "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "Waitlist": "bg-orange-500/20 text-orange-400 border-orange-500/30",
    };
    return statusMap[status || ""] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const renderStars = (rating?: number): React.ReactNode => {
    const numRating = Number(rating) || 0;
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= numRating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
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

  return (
    <div className="rounded-xl border border-[#1e293b] overflow-hidden bg-[#111827]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#0f172a]">
            <tr className="text-left text-gray-400 border-b border-[#1e293b]">
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider">Applicant</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider">Role</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider">College</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider">Match</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider">Rating</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider">Comment</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider">Applied</th>
            </tr>
          </thead>

          <tbody>
            {applications.length > 0 ? (
              applications.map((application: any) => (
                <tr
                  key={application._id}
                  onClick={() =>
                    router.push(
                      `/professional/applications/to-me/${application._id}`
                    )
                  }
                  className="border-b border-[#1e293b] hover:bg-[#1a2332] cursor-pointer transition-colors"
                >
                  {/* Applicant */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Image
                        src={
                          application?.applicant?.profileImage ||
                          "/images/default-user.png"
                        }
                        alt={application?.applicant?.name || "Applicant"}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover border border-[#1e293b]"
                      />
                      <span className="font-medium text-white text-sm">
                        {application?.applicant?.name || "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-gray-300 text-sm">
                        {application?.job?.jobTitle?.[0] || "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* College */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-gray-300 text-sm">
                        {application?.applicant?.educations?.[0]?.college || "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* Match Score */}
                  <td className="px-4 py-3">
                    <span className={`font-bold text-sm ${getMatchScoreColor(application?.matchScore)}`}>
                      {application?.matchScore ?? 0}%
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        application?.currentStatus
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
                      <span className="text-gray-500 text-xs">—</span>
                    )}
                  </td>

                  {/* Comment */}
                  <td className="px-4 py-3">
                    {application?.adminComment ? (
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-3 h-3 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-400 text-xs truncate max-w-[120px]">
                          {application.adminComment}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-xs">—</span>
                    )}
                  </td>

                  {/* Applied Date */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-gray-400 text-xs">
                        {application?.createdAt
                          ? new Date(application.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
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
                    <p className="text-sm">No applications received yet.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}