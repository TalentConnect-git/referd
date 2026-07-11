"use client";

import { ApplicationDetailHeaderProps } from "@/types/applications";
import { updateApplicationStatus } from "@/services/application.service";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import ResumeModal from "@/components/profile/ResumeModal";
import { FileText } from "lucide-react";

export default function ApplicationDetailHeader({
  applicant,
  application,
}: ApplicationDetailHeaderProps) {
  const router = useRouter();
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  
  const currentEducation = applicant?.educations?.[0];
  const currentExperience = applicant?.experiences?.find(
    (exp: any) => exp.isCurrent
  ) || applicant?.experiences?.[0];

  const { role } = useAuth();

  const handleStatusUpdate = async (
    status: "Referred To Company" | "Rejected" | "Accepted"
  ) => {
    try {
      await updateApplicationStatus(application._id, status);
      toast.success(`Application ${status} successfully`);
    } catch (error) {
      console.error("Failed to update application status:", error);
      toast.error("Something went wrong");
    }
  };

  const handleViewProfile = () => {
    if (applicant?.userId) {
      router.push(`/${role}/profile/${applicant.userId}`);
    }
  };

  const handleOpenResume = () => {
    if (applicant?.resume) {
      setIsResumeModalOpen(true);
    }
  };

  const handleOpenLink = (url: string) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  // LinkedIn SVG Icon
  const LinkedInIcon = () => (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );

  // GitHub SVG Icon
  const GitHubIcon = () => (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );

  return (
    <>
      <div
        className="
          rounded-2xl
          border
          border-[#2a3a52]
          bg-gradient-to-r from-[#111827] to-[#1a2332]
          p-5
          shadow-xl
          shadow-black/20
          backdrop-blur-sm
        "
      >
        <div className="flex items-start gap-4">
          {/* Avatar */}
          {applicant?.profileImage ? (
            <img
              src={applicant.profileImage}
              alt={applicant?.name || "Applicant"}
              className="
                h-16
                w-16
                rounded-2xl
                object-cover
                border-2
                border-green-500/30
                shadow-lg
                shadow-green-500/10
                cursor-pointer
                transition-all
                hover:scale-105
                hover:border-green-500/50
              "
              onClick={handleViewProfile}
            />
          ) : (
            <div
              className="
                h-16
                w-16
                rounded-2xl
                bg-gradient-to-br from-green-500 to-emerald-600
                flex
                items-center
                justify-center
                text-xl
                font-bold
                text-white
                shadow-lg
                shadow-green-500/20
                cursor-pointer
                transition-all
                hover:scale-105
                hover:shadow-green-500/40
              "
              onClick={handleViewProfile}
            >
              {applicant?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    {applicant?.name || "Unknown Applicant"}
                  </h1>
                  <button
                    onClick={handleViewProfile}
                    className="
                      text-xs
                      text-blue-400
                      hover:text-blue-300
                      font-medium
                      transition-all
                      hover:underline
                      flex-shrink-0
                    "
                  >
                    View Profile →
                  </button>
                </div>
                {applicant?.jobRoles && applicant.jobRoles !== undefined && (
                  <p className="mt-1 text-sm text-slate-400 font-medium">
                    {applicant?.jobRoles?.join(" • ")}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                <button
                  onClick={() => handleStatusUpdate("Rejected")}
                  className="
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    rounded-lg
                    border
                    border-red-500/30
                    text-red-400
                    bg-red-500/5
                    transition-all
                    hover:bg-red-500/20
                    hover:border-red-500/50
                    hover:scale-105
                    active:scale-95
                    whitespace-nowrap
                  "
                >
                  Reject
                </button>

                <button
                  onClick={() => handleStatusUpdate("Referred To Company")}
                  className="
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    rounded-lg
                    border
                    border-green-500/30
                    text-green-400
                    bg-green-500/5
                    transition-all
                    hover:bg-green-500/20
                    hover:border-green-500/50
                    hover:scale-105
                    active:scale-95
                    whitespace-nowrap
                  "
                >
                  Refer
                </button>

                <button
                  onClick={() => handleStatusUpdate("Accepted")}
                  className="
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    rounded-lg
                    border
                    border-blue-500/30
                    text-blue-400
                    bg-blue-500/5
                    transition-all
                    hover:bg-blue-500/20
                    hover:border-blue-500/50
                    hover:scale-105
                    active:scale-95
                    whitespace-nowrap
                  "
                >
                  Approve
                </button>
              </div>
            </div>

            {/* Info Grid - Only show fields with data */}
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {applicant?.email && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Email:</span>
                  <span className="text-slate-300 truncate">{applicant.email}</span>
                </div>
              )}

              {applicant?.phone && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Phone:</span>
                  <span className="text-slate-300">{applicant.phone}</span>
                </div>
              )}

              {(currentExperience?.company_display ||
                currentExperience?.company ||
                applicant?.currentCompany) && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Current Company:</span>
                  <span className="text-slate-300 truncate">
                    {currentExperience?.company_display ||
                      currentExperience?.company ||
                      applicant?.currentCompany}
                  </span>
                </div>
              )}

              {currentExperience?.role && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Current Role:</span>
                  <span className="text-slate-300">
                    {currentExperience?.role}
                  </span>
                </div>
              )}

              {(currentEducation?.college_display ||
                currentEducation?.college) && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">College:</span>
                  <span className="text-slate-300 truncate">
                    {currentEducation?.college_display ||
                      currentEducation?.college}
                  </span>
                </div>
              )}

              {currentEducation?.degree && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Degree:</span>
                  <span className="text-slate-300">
                    {currentEducation?.degree}
                  </span>
                </div>
              )}
            </div>

            {/* Resume, LinkedIn, GitHub Links */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {applicant?.resume && (
                <button
                  onClick={handleOpenResume}
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    px-2.5
                    py-1
                    rounded-lg
                    border
                    border-green-500/30
                    text-green-400
                    bg-green-500/5
                    text-xs
                    font-medium
                    transition-all
                    hover:bg-green-500/20
                    hover:border-green-500/50
                    hover:scale-105
                    active:scale-95
                  "
                >
                  <FileText className="w-3.5 h-3.5" />
                  Resume
                </button>
              )}

              {applicant?.linkedin && (
                <button
                  onClick={() => handleOpenLink(applicant.linkedin as string)}
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    px-2.5
                    py-1
                    rounded-lg
                    border
                    border-blue-500/30
                    text-blue-400
                    bg-blue-500/5
                    text-xs
                    font-medium
                    transition-all
                    hover:bg-blue-500/20
                    hover:border-blue-500/50
                    hover:scale-105
                    active:scale-95
                  "
                >
                  <LinkedInIcon />
                  LinkedIn
                </button>
              )}

              {applicant?.github && (
                <button
                  onClick={() => handleOpenLink(applicant.github as string)}
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    px-2.5
                    py-1
                    rounded-lg
                    border
                    border-purple-500/30
                    text-purple-400
                    bg-purple-500/5
                    text-xs
                    font-medium
                    transition-all
                    hover:bg-purple-500/20
                    hover:border-purple-500/50
                    hover:scale-105
                    active:scale-95
                  "
                >
                  <GitHubIcon />
                  GitHub
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resume Modal */}
      {isResumeModalOpen && applicant?.resume && (
        <ResumeModal
          resumeUrl={applicant.resume}
          onClose={() => setIsResumeModalOpen(false)}
        />
      )}
    </>
  );
}