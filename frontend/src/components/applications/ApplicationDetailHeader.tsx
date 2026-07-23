"use client";

import { ApplicationDetailHeaderProps } from "@/types/applications";
import { updateApplicationStatus } from "@/services/application.service";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import ResumeModal from "@/components/profile/ResumeModal";
import {
  FileText,
  Building2,
  Briefcase,
  GraduationCap,
  Eye,
  ExternalLink,
  Send,
  UserX,
} from "lucide-react";

export default function ApplicationDetailHeader({
  applicant,
  application,
}: ApplicationDetailHeaderProps) {
  const router = useRouter();
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);

  const currentEducation = applicant?.educations?.[0];
  const currentExperience =
    applicant?.experiences?.find((exp: any) => exp.isCurrent) ||
    applicant?.experiences?.[0];

  const { role } = useAuth();

  const handleStatusUpdate = async (
    status: "Referred To Company" | "Rejected"
  ) => {
    setIsStatusUpdating(true);
    try {
      await updateApplicationStatus(application._id, status);
      const statusMessages = {
        "Referred To Company": "Application referred to company successfully! 🎉",
        Rejected: "Application rejected",
      };
      toast.success(statusMessages[status] || `Application ${status} successfully`);
    } catch (error) {
      console.error("Failed to update application status:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsStatusUpdating(false);
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
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );

  // GitHub SVG Icon
  const GitHubIcon = () => (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );

  return (
    <>
      <div
        className="
          rounded-2xl
          border
          border-[#2a3a52]
          bg-gradient-to-br from-[#0F172A] via-[#1a2332] to-[#111827]
          p-5
          shadow-2xl
          shadow-black/30
          backdrop-blur-sm
          relative
          overflow-hidden
        "
      >
        {/* Background Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* Header Row - Avatar, Name, View Profile, Refer & Reject Buttons */}
          <div className="flex items-start justify-between gap-3">
            {/* Left - Avatar and Name */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Avatar */}
              {applicant?.profileImage ? (
                <img
                  src={applicant.profileImage}
                  alt={applicant?.name || "Applicant"}
                  className="
                    h-12
                    w-12
                    rounded-xl
                    object-cover
                    border-2
                    border-green-500/30
                    shadow-lg
                    shadow-green-500/10
                    cursor-pointer
                    transition-all
                    duration-300
                    hover:scale-105
                    hover:border-green-500/50
                    hover:shadow-green-500/20
                    flex-shrink-0
                  "
                  onClick={handleViewProfile}
                />
              ) : (
                <div
                  className="
                    h-12
                    w-12
                    rounded-xl
                    bg-gradient-to-br from-green-500 to-emerald-600
                    flex
                    items-center
                    justify-center
                    text-lg
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-green-500/20
                    cursor-pointer
                    transition-all
                    duration-300
                    hover:scale-105
                    hover:shadow-green-500/40
                    flex-shrink-0
                  "
                  onClick={handleViewProfile}
                >
                  {applicant?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              {/* Name and Role */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-medium text-white tracking-tight truncate">
                    {applicant?.name || "Unknown Applicant"}
                  </h2>
                  <button
                    onClick={handleViewProfile}
                    className="
                      inline-flex
                      items-center
                      gap-1
                      px-2.5
                      py-0.5
                      text-[10px]
                      font-medium
                      rounded-lg
                      border
                      border-blue-500/30
                      text-blue-400
                      bg-blue-500/5
                      transition-all
                      duration-200
                      hover:bg-blue-500/20
                      hover:border-blue-500/50
                      hover:scale-105
                      active:scale-95
                      whitespace-nowrap
                      flex-shrink-0
                    "
                  >
                    <Eye className="w-3 h-3" />
                    View Profile
                  </button>
                </div>

                {/* Current Role and Company */}
                {currentExperience?.role && (
                  <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-slate-300">
                    <Briefcase className="w-3 h-3 text-blue-400 flex-shrink-0" />
                    <span className="font-medium text-white text-xs">
                      {currentExperience.role}
                    </span>
                    {(currentExperience?.company_display ||
                      currentExperience?.company ||
                      applicant?.currentCompany) && (
                      <>
                        <span className="text-slate-500 text-xs">@</span>
                        <span className="text-blue-300 font-medium text-xs">
                          {currentExperience?.company_display ||
                            currentExperience?.company ||
                            applicant?.currentCompany}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right - Refer & Reject Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Refer Button */}
              <button
                onClick={() => handleStatusUpdate("Referred To Company")}
                disabled={isStatusUpdating}
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  px-3
                  py-1.5
                  text-[11px]
                  font-medium
                  rounded-lg
                  border
                  border-blue-500/30
                  text-blue-400
                  bg-blue-500/5
                  transition-all
                  duration-200
                  hover:bg-blue-500/20
                  hover:border-blue-500/50
                  hover:scale-105
                  hover:shadow-lg
                  hover:shadow-blue-500/10
                  active:scale-95
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  disabled:hover:scale-100
                  whitespace-nowrap
                "
              >
                <Send className="w-3.5 h-3.5" />
                Refer
              </button>

              {/* Reject Button */}
              <button
                onClick={() => handleStatusUpdate("Rejected")}
                disabled={isStatusUpdating}
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  px-3
                  py-1.5
                  text-[11px]
                  font-medium
                  rounded-lg
                  border
                  border-red-500/30
                  text-red-400
                  bg-red-500/5
                  transition-all
                  duration-200
                  hover:bg-red-500/20
                  hover:border-red-500/50
                  hover:scale-105
                  hover:shadow-lg
                  hover:shadow-red-500/10
                  active:scale-95
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  disabled:hover:scale-100
                  whitespace-nowrap
                "
              >
                <UserX className="w-3.5 h-3.5" />
                Reject
              </button>
            </div>
          </div>

          {/* Education */}
          {(currentEducation?.college_display ||
            currentEducation?.college ||
            currentEducation?.degree) && (
            <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-300 bg-slate-800/30 px-2.5 py-1 rounded-lg border border-slate-700/30 w-fit">
              <GraduationCap className="w-3 h-3 text-slate-500 flex-shrink-0" />
              <span className="text-xs">
                {currentEducation?.college_display || currentEducation?.college}
                {currentEducation?.degree && (
                  <>
                    <span className="text-slate-500 mx-1.5">•</span>
                    {currentEducation.degree}
                  </>
                )}
                {currentEducation?.specialization && (
                  <>
                    <span className="text-slate-500 mx-1.5">•</span>
                    <span className="text-slate-400 text-xs">
                      {currentEducation.specialization}
                    </span>
                  </>
                )}
              </span>
            </div>
          )}

          {/* Skills / Technologies */}
          {applicant?.skills && applicant.skills.length > 0 && (
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-slate-500 font-medium mr-0.5">
                Skills:
              </span>
              {applicant.skills.slice(0, 6).map((skill: string, index: number) => (
                <span
                  key={index}
                  className="
                    px-2
                    py-0.5
                    text-[10px]
                    font-medium
                    rounded-full
                    bg-green-500/10
                    border
                    border-green-500/20
                    text-green-400
                  "
                >
                  {skill}
                </span>
              ))}
              {applicant.skills.length > 6 && (
                <span className="text-[10px] text-slate-500">
                  +{applicant.skills.length - 6}
                </span>
              )}
            </div>
          )}

          {/* Social Links */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-3.5 border-t border-slate-700/30">
            {applicant?.resume && (
              <button
                onClick={handleOpenResume}
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  px-2.5
                  py-1.5
                  rounded-lg
                  border
                  border-green-500/30
                  text-green-400
                  bg-green-500/5
                  text-[11px]
                  font-medium
                  transition-all
                  duration-200
                  hover:bg-green-500/20
                  hover:border-green-500/50
                  hover:scale-105
                  hover:shadow-lg
                  hover:shadow-green-500/10
                  active:scale-95
                "
              >
                <FileText className="w-3 h-3" />
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
                  py-1.5
                  rounded-lg
                  border
                  border-blue-500/30
                  text-blue-400
                  bg-blue-500/5
                  text-[11px]
                  font-medium
                  transition-all
                  duration-200
                  hover:bg-blue-500/20
                  hover:border-blue-500/50
                  hover:scale-105
                  hover:shadow-lg
                  hover:shadow-blue-500/10
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
                  py-1.5
                  rounded-lg
                  border
                  border-purple-500/30
                  text-purple-400
                  bg-purple-500/5
                  text-[11px]
                  font-medium
                  transition-all
                  duration-200
                  hover:bg-purple-500/20
                  hover:border-purple-500/50
                  hover:scale-105
                  hover:shadow-lg
                  hover:shadow-purple-500/10
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