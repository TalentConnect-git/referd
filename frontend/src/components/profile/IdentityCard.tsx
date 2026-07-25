"use client";

import {
  BriefcaseBusiness,
  Camera,
  FileText,
  Globe2,
  Loader2,
  ShieldCheck,
  UserRound,
  MapPin,
  Award,
  BadgeCheck,
  Sparkles,
  TrendingUp,
  Briefcase,
  User,
  Calendar,
  Heart,
  GraduationCap,
  School,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "@/lib/axiosInstance";
import type { ProfileData } from "@/types/profile";

import ResumeModal from "./ResumeModal";

interface SocialIconProps {
  className?: string;
}

const GitHubIcon = ({ className = "h-4 w-4" }: SocialIconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 .297C5.373.297 0 5.67 0 12.297c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 013-.399c1.02 0 2.04.132 3 .399 2.292-1.552 3.3-1.23 3.3-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.694.825.57C20.565 22.092 24 17.592 24 12.297 24 5.67 18.627.297 12 .297z" />
    </svg>
  );
};

const LinkedInIcon = ({ className = "h-4 w-4" }: SocialIconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
};

// Status configuration
const STATUS_CONFIG: Record<string, {
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
}> = {
  open_to_work: {
    label: "Open to Work",
    icon: <TrendingUp className="h-3.5 w-3.5" />,
    color: "text-[var(--success)]",
    bgColor: "bg-[var(--success-soft)]",
    borderColor: "border-[var(--success-border)]",
    glowColor: "shadow-[var(--success)]/20",
  },
  career_break: {
    label: "Career Break",
    icon: <Heart className="h-3.5 w-3.5" />,
    color: "text-[var(--warning)]",
    bgColor: "bg-[var(--warning-soft)]",
    borderColor: "border-[var(--warning-border)]",
    glowColor: "shadow-[var(--warning)]/20",
  },
  freelancing: {
    label: "Freelancing",
    icon: <Briefcase className="h-3.5 w-3.5" />,
    color: "text-[var(--info)]",
    bgColor: "bg-[var(--info-soft)]",
    borderColor: "border-[var(--info-border)]",
    glowColor: "shadow-[var(--info)]/20",
  },
  building: {
    label: "Building Something",
    icon: <Sparkles className="h-3.5 w-3.5" />,
    color: "text-[var(--primary)]",
    bgColor: "bg-[var(--primary-soft)]",
    borderColor: "border-[var(--primary-border)]",
    glowColor: "shadow-[var(--primary)]/20",
  },
  not_looking: {
    label: "Not Looking",
    icon: <User className="h-3.5 w-3.5" />,
    color: "text-[var(--text-muted)]",
    bgColor: "bg-[var(--background-soft)]",
    borderColor: "border-[var(--border)]",
    glowColor: "shadow-[var(--text-muted)]/20",
  },
  looking_internship: {
    label: "Looking for Internship",
    icon: <Award className="h-3.5 w-3.5" />,
    color: "text-[var(--info)]",
    bgColor: "bg-[var(--info-soft)]",
    borderColor: "border-[var(--info-border)]",
    glowColor: "shadow-[var(--info)]/20",
  },
  looking_job: {
    label: "Looking for Job",
    icon: <BriefcaseBusiness className="h-3.5 w-3.5" />,
    color: "text-[var(--success)]",
    bgColor: "bg-[var(--success-soft)]",
    borderColor: "border-[var(--success-border)]",
    glowColor: "shadow-[var(--success)]/20",
  },
  preparing_exams: {
    label: "Preparing for Exams",
    icon: <Calendar className="h-3.5 w-3.5" />,
    color: "text-[var(--warning)]",
    bgColor: "bg-[var(--warning-soft)]",
    borderColor: "border-[var(--warning-border)]",
    glowColor: "shadow-[var(--warning)]/20",
  },
  employed: {
    label: "Currently Employed",
    icon: <BadgeCheck className="h-3.5 w-3.5" />,
    color: "text-[var(--success)]",
    bgColor: "bg-[var(--success-soft)]",
    borderColor: "border-[var(--success-border)]",
    glowColor: "shadow-[var(--success)]/20",
  },
};

interface IdentityCardProps {
  profile: ProfileData;
  initials?: string;
  headline?: string;
  currentRoleLine?: string;
  onProfileUpdate?: (updatedProfile: ProfileData) => void;
}

const getInitials = (name?: string): string => {
  if (!name?.trim()) {
    return "U";
  }

  const nameParts = name.trim().split(/\s+/).filter(Boolean);

  if (nameParts.length === 1) {
    return nameParts[0].slice(0, 2).toUpperCase();
  }

  return `${nameParts[0][0]}${
    nameParts[nameParts.length - 1][0]
  }`.toUpperCase();
};

const formatExternalUrl = (url: string): string => {
  const trimmedUrl = url.trim();

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  return `https://${trimmedUrl}`;
};

export default function IdentityCard({
  profile,
  initials,
  headline,
  currentRoleLine,
  onProfileUpdate,
}: IdentityCardProps) {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    profile.profileImage || null,
  );
  const [imageError, setImageError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayName = profile.fullName || profile.name || "User";
  const profileInitials = initials || getInitials(displayName);

  // Check if user has current company
  const hasCurrentCompany = profile.currentCompany && profile.currentCompany.trim().length > 0;

  // Get status config
  const statusType = profile.status?.type || "";
  const statusConfig = STATUS_CONFIG[statusType] || STATUS_CONFIG.not_looking;

  // Get education details
  const education = profile.educations?.[0] || profile.education?.[0] || null;
  const hasEducation = education && (education.college || education.degree || education.specialization);

  useEffect(() => {
    setProfileImage(profile.profileImage || null);
    setImageError(false);
  }, [profile.profileImage]);

  const handleSocialLink = (url?: string) => {
    if (!url?.trim()) {
      return;
    }

    window.open(
      formatExternalUrl(url),
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleImageClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await axiosInstance.put(
        "/api/onboarding/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const responseData = response.data;

      const updatedProfile =
        responseData?.data ||
        responseData?.profile ||
        responseData?.onboarding ||
        responseData;

      const updatedImage =
        updatedProfile?.profileImage ||
        responseData?.profileImage ||
        responseData?.data?.profileImage;

      if (updatedImage) {
        setProfileImage(updatedImage);
        setImageError(false);
        
        if (onProfileUpdate && updatedProfile && typeof updatedProfile === "object") {
          onProfileUpdate(updatedProfile as ProfileData);
        }
        
        toast.success("Profile image updated successfully.");
      } else {
        throw new Error("No image URL returned from server");
      }
    } catch (error: unknown) {
      console.error("Profile image upload error:", error);

      const uploadError = error as {
        response?: {
          data?: {
            msg?: string;
            message?: string;
            error?: string;
            details?: string;
          };
        };
        message?: string;
      };

      const errorMessage = 
        uploadError.response?.data?.msg ||
        uploadError.response?.data?.message ||
        uploadError.response?.data?.error ||
        uploadError.message ||
        "Failed to update profile image.";

      toast.error(errorMessage);
    } finally {
      setIsUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setProfileImage(null);
  };

  // Get status badge class
  const getStatusBadgeClass = (config: typeof statusConfig) => {
    return `inline-flex shrink-0 items-center gap-1.5 rounded-full border ${config.bgColor} ${config.borderColor} ${config.color} px-2.5 py-1 text-[11px] font-medium shadow-lg ${config.glowColor}`;
  };

  // Get employed badge class
  const getEmployedBadgeClass = () => {
    const config = STATUS_CONFIG.employed;
    return `inline-flex shrink-0 items-center gap-1.5 rounded-full border ${config.bgColor} ${config.borderColor} ${config.color} px-2.5 py-1 text-[11px] font-medium shadow-lg ${config.glowColor}`;
  };

  // Format education string
  const getEducationString = () => {
    if (!hasEducation) return null;
    
    const parts = [];
    if (education.degree) parts.push(education.degree);
    if (education.specialization) parts.push(education.specialization);
    if (education.college) parts.push(education.college);
    
    return parts.join(" · ");
  };

  const educationString = getEducationString();

  return (
    <>
      <section className="surface-card group overflow-hidden rounded-2xl bg-[var(--card)] p-4 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          {/* Profile Image */}
          <div className="flex shrink-0 justify-center sm:justify-start">
            <div className="relative">
              <button
                type="button"
                onClick={handleImageClick}
                disabled={isUploading}
                aria-label="Update profile image"
                className="group/avatar relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-2 border-[var(--primary-border)] bg-[var(--card)] shadow-lg shadow-[var(--primary)]/10 transition-all duration-300 hover:scale-[1.03] hover:border-[var(--primary-border)] hover:shadow-xl hover:shadow-[var(--primary)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 disabled:cursor-not-allowed sm:h-24 sm:w-24"
              >
                {profileImage && !imageError ? (
                  <img
                    src={profileImage}
                    alt={`${displayName}'s profile`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover/avatar:scale-105"
                    onError={handleImageError}
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--primary-soft)] to-[var(--primary-soft)] text-2xl font-bold text-[var(--primary)] transition-transform duration-300 group-hover/avatar:scale-105 sm:text-3xl">
                    {profileInitials}
                  </span>
                )}

                {/* Upload Overlay */}
                <span
                  className={`absolute inset-0 flex items-center justify-center bg-[var(--overlay)] backdrop-blur-sm transition-opacity duration-300 ${
                    isUploading
                      ? "opacity-100"
                      : "opacity-0 group-hover/avatar:opacity-100"
                  }`}
                >
                  {isUploading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  ) : (
                    <Camera className="h-6 w-6 text-white transition-transform duration-300 group-hover/avatar:scale-110" />
                  )}
                </span>

                {/* Online Status Dot */}
                <span
                  className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-[3px] border-[var(--card)] bg-[var(--success)] shadow-lg shadow-[var(--success)]/50"
                  aria-label="Online"
                >
                  <span className="absolute inset-0 animate-ping rounded-full bg-[var(--success)] opacity-75" />
                </span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Profile Information */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1 text-center sm:text-left">
                {/* Name & Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h2 className="max-w-full truncate text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
                    {displayName}
                  </h2>

                  <span className="badge badge-success inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--success-border)] bg-[var(--success-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--success)] shadow-lg shadow-[var(--success)]/10">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>

                  {/* Status Badge - Show when no current company */}
                  {!hasCurrentCompany && statusType && statusConfig && (
                    <span className={getStatusBadgeClass(statusConfig)}>
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                  )}

                  {/* Employed Badge - Show when has current company */}
                  {hasCurrentCompany && (
                    <span className={getEmployedBadgeClass()}>
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Employed
                    </span>
                  )}
                </div>

                {/* Headline & Role & Education */}
                <div className="mt-3 space-y-2">
                  {/* Current Role */}
                  {currentRoleLine && (
                    <div className="flex max-w-full items-start justify-center gap-2 text-sm text-[var(--text-secondary)] sm:justify-start">
                      <BriefcaseBusiness className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                      <p className="break-words text-left leading-5">
                        {currentRoleLine}
                      </p>
                    </div>
                  )}

                  {/* Education */}
                  {educationString && (
                    <div className="flex max-w-full items-start justify-center gap-2 text-sm text-[var(--text-secondary)] sm:justify-start">
                      <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                      <p className="break-words text-left leading-5">
                        {educationString}
                      </p>
                    </div>
                  )}

                  {/* Location - Optional */}
                  {profile.location && (
                    <div className="flex max-w-full items-start justify-center gap-2 text-sm text-[var(--text-muted)] sm:justify-start">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                      <p className="break-words text-left leading-5">
                        {profile.location}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start lg:max-w-[220px] lg:justify-end">
                {profile.github && (
                  <button
                    type="button"
                    onClick={() => handleSocialLink(profile.github)}
                    aria-label="Open GitHub profile"
                    title="GitHub"
                    className="sidebar-item inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--primary-border)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
                  >
                    <GitHubIcon className="h-4 w-4" />
                  </button>
                )}

                {profile.linkedin && (
                  <button
                    type="button"
                    onClick={() => handleSocialLink(profile.linkedin)}
                    aria-label="Open LinkedIn profile"
                    title="LinkedIn"
                    className="sidebar-item inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--primary-border)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
                  >
                    <LinkedInIcon className="h-4 w-4" />
                  </button>
                )}

                {profile.portfolio && (
                  <button
                    type="button"
                    onClick={() => handleSocialLink(profile.portfolio)}
                    aria-label="Open portfolio"
                    title="Portfolio"
                    className="sidebar-item inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--primary-border)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
                  >
                    <Globe2 className="h-4 w-4" />
                  </button>
                )}

                {profile.resume && (
                  <button
                    type="button"
                    onClick={() => setIsResumeModalOpen(true)}
                    aria-label="View resume"
                    title="View Resume"
                    className="btn-primary inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--primary-border)] bg-[var(--primary-soft)] px-3 text-xs font-semibold text-[var(--primary)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--primary-border)] hover:bg-[var(--primary-soft)] hover:shadow-lg hover:shadow-[var(--primary)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Resume</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {isResumeModalOpen && profile.resume && (
        <ResumeModal
          resumeUrl={profile.resume}
          onClose={() => setIsResumeModalOpen(false)}
        />
      )}
    </>
  );
}