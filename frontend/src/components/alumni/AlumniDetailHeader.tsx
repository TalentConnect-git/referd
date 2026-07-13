"use client";
import { AlumniDetailProfileProps } from "@/types/alumni";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  GraduationCap,
  BriefcaseBusiness,
  Briefcase,
  MessageSquare,
  User,
  BadgeCheck,
  FileText,
  ExternalLink,
} from "lucide-react";
import defaultUser from "@/../public/images/default-user.png";
import { useAuth } from "@/context/AuthContext";
import ResumeModal from "@/components/profile/ResumeModal";

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

// Portfolio SVG Icon
const PortfolioIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/>
  </svg>
);

export default function AlumniDetailHeader({ profile }: AlumniDetailProfileProps) {
  const router = useRouter();
  const { role: userType } = useAuth();
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const currentExperience =
    profile.experiences?.find(
      (exp) => exp.isCurrent || !exp.endDate
    ) || profile.experiences?.[0];
  
  const currentRole = currentExperience?.role || "Professional";
  const college = profile.educations?.find((e) => e.isCurrent)?.college || 
                  profile.educations?.[0]?.college || 
                  "College not available";

  const handleOpenResume = () => {
    if (profile?.resume) {
      setIsResumeModalOpen(true);
    }
  };

  const handleOpenLink = (url: string) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-[#2a3a52] bg-gradient-to-r from-[#111827] to-[#1a2332] p-4 shadow-xl shadow-black/20 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          {/* Profile Image */}
          <Image 
            src={profile.profileImage || "/images/default-user.png"} 
            alt="User" 
            width={56} 
            height={56} 
            className="h-14 w-14 rounded-2xl object-cover border-2 border-green-500/30 shadow-lg shadow-green-500/10 flex-shrink-0"
          />

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg font-bold text-white tracking-tight truncate">
                    {profile.name}
                  </h1>
                  <BadgeCheck size={16} className="text-green-500 flex-shrink-0" />
                </div>

                <div className="mt-1.5 space-y-1 text-gray-300">
                  <div className="flex items-center gap-2">
                    <GraduationCap size={14} className="text-blue-400 flex-shrink-0" />
                    <span className="text-xs text-slate-300 truncate">{college}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <BriefcaseBusiness size={14} className="text-blue-400 flex-shrink-0" />
                    <span className="text-xs text-slate-300 truncate">
                      {currentRole} {profile.currentCompany ? `@ ${profile.currentCompany}` : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-blue-400 flex-shrink-0" />
                    <span className="text-xs text-slate-300">
                      {profile.totalYearsOfExperience || 0} years experience
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Links - Top Right */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  {/* Resume */}
                  {profile?.resume && (
                    <button
                      onClick={handleOpenResume}
                      className="
                        inline-flex
                        items-center
                        gap-1
                        px-2
                        py-1
                        rounded-lg
                        border
                        border-green-500/30
                        text-green-400
                        bg-green-500/5
                        text-[10px]
                        font-medium
                        transition-all
                        hover:bg-green-500/20
                        hover:border-green-500/50
                        hover:scale-105
                        active:scale-95
                        whitespace-nowrap
                      "
                    >
                      <FileText className="w-3 h-3" />
                      Resume
                    </button>
                  )}

                  {/* LinkedIn */}
                  {profile?.linkedin && (
                    <button
                      onClick={() => handleOpenLink(profile.linkedin as string)}
                      className="
                        inline-flex
                        items-center
                        justify-center
                        p-1.5
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
                      "
                      title="LinkedIn"
                    >
                      <LinkedInIcon />
                    </button>
                  )}

                  {/* GitHub */}
                  {profile?.github && (
                    <button
                      onClick={() => handleOpenLink(profile.github as string)}
                      className="
                        inline-flex
                        items-center
                        justify-center
                        p-1.5
                        rounded-lg
                        border
                        border-purple-500/30
                        text-purple-400
                        bg-purple-500/5
                        transition-all
                        hover:bg-purple-500/20
                        hover:border-purple-500/50
                        hover:scale-105
                        active:scale-95
                      "
                      title="GitHub"
                    >
                      <GitHubIcon />
                    </button>
                  )}

                  {/* Portfolio */}
                  {profile?.portfolio && (
                    <button
                      onClick={() => handleOpenLink(profile.portfolio as string)}
                      className="
                        inline-flex
                        items-center
                        justify-center
                        p-1.5
                        rounded-lg
                        border
                        border-orange-500/30
                        text-orange-400
                        bg-orange-500/5
                        transition-all
                        hover:bg-orange-500/20
                        hover:border-orange-500/50
                        hover:scale-105
                        active:scale-95
                      "
                      title="Portfolio"
                    >
                      <PortfolioIcon />
                    </button>
                  )}
                </div>

                {/* Message & Show Profile Buttons */}
                <div className="flex items-center gap-2 w-full">
                  <button
                    onClick={() =>
                      router.push(
                        `/${userType}/message/${profile.userId}?userName=${profile.name}`
                      )
                    }
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1.5 text-xs font-semibold text-black transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 active:scale-95 whitespace-nowrap"
                  >
                    <MessageSquare size={12} className="text-black" />
                    Message
                  </button>

                  <button
                    onClick={() =>
                      router.push(
                        `/${userType}/profile/${profile.userId}`
                      )
                    }
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-[#22c55e] px-3 py-1.5 text-xs font-semibold text-[#22c55e] transition-all hover:bg-green-500 hover:text-white hover:scale-105 active:scale-95 whitespace-nowrap"
                  >
                    <User size={12} />
                    Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Modal */}
      {isResumeModalOpen && profile?.resume && (
        <ResumeModal
          resumeUrl={profile.resume}
          onClose={() => setIsResumeModalOpen(false)}
        />
      )}
    </>
  );
}