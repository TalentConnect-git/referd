// src/components/alumni/AlumniCard.tsx

"use client";
import { useState } from "react";

import {
  Building2,
  GraduationCap,
  BriefcaseBusiness,
  Users,
  MessageSquare,
  Loader2,
} from "lucide-react";
import type { AlumniProfile } from "@/services/alumani.services";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

type AlumniCardProps = {
  profile: AlumniProfile;
  collegeFallback: string;
  companyFallback: string;
  onMessage: (profile: AlumniProfile) => void;
  isMessageLoading?: boolean;
};

const getInitials = (name?: string) => {
  if (!name) return "NA";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const getCurrentRole = (profile: AlumniProfile) => {
  const currentExperience = profile.experiences?.find(
    (item) => item.isCurrent || !item.endDate,
  );
  return (
    currentExperience?.role ||
    currentExperience?.title ||
    currentExperience?.designation ||
    profile.experiences?.[0]?.role ||
    profile.experiences?.[0]?.title ||
    profile.experiences?.[0]?.designation ||
    "Professional"
  );
};

const getCompany = (profile: AlumniProfile, fallback?: string) => {
  const currentExperience = profile.experiences?.find(
    (item) => item.isCurrent || !item.endDate,
  );
  return (
    profile.currentCompany ||
    currentExperience?.company ||
    currentExperience?.companyName ||
    profile.experiences?.[0]?.company ||
    profile.experiences?.[0]?.companyName ||
    fallback ||
    "Company not available"
  );
};

const getValidImageSrc = (src?: string | null): string => {
  if (!src) return "";

  const clean = src.trim();

  if (!clean) return "";

  // Valid remote URL
  if (/^https?:\/\//i.test(clean)) {
    return clean;
  }

  // Valid local image from /public
  if (
    clean.startsWith("/") &&
    /\.(png|jpg|jpeg|webp|gif|svg|avif)$/i.test(clean)
  ) {
    return clean;
  }

  return "";
};

export function AlumniCard({
  profile,
  collegeFallback = "",
  companyFallback = "",
  onMessage,
  isMessageLoading = false,
}: AlumniCardProps) {
  console.log("profile ", profile);
  const router = useRouter();
  const { role: userType } = useAuth();

  const name = profile.name || "Unknown User";
  const initials = getInitials(name);

  const [imageError, setImageError] = useState(false);

  const imageSrc = getValidImageSrc(profile.profileImage);

  const showImage = imageSrc && !imageError;
  const company = getCompany(profile, companyFallback);
  const role = getCurrentRole(profile);
  const isHiring = Boolean(profile.isHiring);
  const jobsCount = profile.referralJobs?.length || 0;

  // College: use profile.colleges array first, then profile.college, then first education, then fallback
  const collegeDisplay =
    profile.colleges?.join(", ") ||
    profile.college ||
    profile.educations?.find((e) => e.college)?.college ||
    collegeFallback ||
    "College not available";

  // Get the userId for navigation
  const userId = profile.userId || profile._id;

  // Handle card click navigation
  const handleCardClick = () => {
    if (userType && userId) {
      router.push(`/${userType}/alumani-network/${userId}`);
    }
  };

  // Handle message button click
  const handleMessageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMessage?.(profile);
  };

  return (
    <article
      className="card rounded-2xl border border-theme bg-card-soft p-4 shadow-lg transition hover:border-primary/40 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Profile Image with Fallback */}
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-primary-soft">
            {showImage ? (
              <Image
                src={imageSrc}
                alt={name}
                fill
                sizes="40px"
                className="object-cover"
                unoptimized={
                  imageSrc.startsWith("http://") ||
                  imageSrc.startsWith("https://")
                }
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-primary">
                {initials}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-bold leading-tight text-primary">
              {name}
            </h3>
            <p className="mt-0.5 text-xs text-secondary">{role}</p>
          </div>
        </div>

        {isHiring && (
          <span className="badge badge-success rounded-full border border-success/20 px-2 py-0.5 text-[10px] font-medium flex-shrink-0">
            Hiring
          </span>
        )}
      </div>

      <div className="mt-4 space-y-1.5 text-xs text-secondary">
        <div className="flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 text-muted" />
          <span className="truncate">{company}</span>
        </div>

        <div className="flex items-center gap-2">
          <GraduationCap className="h-3.5 w-3.5 text-muted" />
          <span className="truncate">{collegeDisplay}</span>
        </div>

        <div className="flex items-center gap-2">
          <BriefcaseBusiness className="h-3.5 w-3.5 text-muted" />
          <span>
            {jobsCount > 0
              ? `${jobsCount} referral job${jobsCount > 1 ? "s" : ""}`
              : "No referral jobs"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-muted" />
          <span>
            {profile.referralMetrics?.totalReferrals ||
              profile.referralMetrics?.totalReferralsPosted ||
              0}{" "}
            total referrals
          </span>
        </div>
      </div>

      <div className="my-3.5 h-px bg-divider" />

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleMessageClick}
          disabled={isMessageLoading}
          className="btn-secondary flex h-8 items-center justify-center gap-1.5 rounded-lg border border-theme bg-transparent text-xs font-semibold text-primary transition hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isMessageLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <MessageSquare className="h-3.5 w-3.5" />
          )}
          {isMessageLoading ? "Loading..." : "Message"}
        </button>

        <button
          type="button"
          onClick={handleCardClick}
          className="btn-primary flex h-8 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-inverse transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          View Profile
        </button>
      </div>
    </article>
  );
}
