"use client";
import { PostedByReferrerProps } from "@/types/dashboard";
import { getAlumniDetails } from "@/services/alumani.services";
import { Alumni } from "@/types/alumni";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Briefcase,
  Mail,
  ExternalLink,
  Loader2,
  Building2,
  MapPin,
  Calendar,
  MessageCircle,
  Share2,
  Award,
  Clock,
} from "lucide-react";
import Image from "next/image";

export default function PostedByReferrer({
  candidateId,
}: PostedByReferrerProps) {
  const router = useRouter();
  const { profile: authProfile } = useAuth();
  const userType = authProfile?.profileType;
  const [profile, setProfile] = useState<Alumni | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  console.log("profile", profile);

  const handleViewProfile = () => {
    if (!candidateId || !userType) return;
    router.push(`/${userType}/profile/${candidateId}`);
  };

  const handleMessage = () => {
    if (!candidateId || !profile) return;
    const userName = encodeURIComponent(profile.name || "User");
    const profileImage = profile.profileImage || "";
    const encodedImage = encodeURIComponent(profileImage);
    
    router.push(
      `/${userType}/message/${candidateId}?userName=${userName}&profileImage=${encodedImage}`
    );
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getAlumniDetails(candidateId);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (candidateId) {
      fetchProfile();
    }
  }, [candidateId]);

  if (loading) {
    return (
      <div className="surface-card rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="skeleton h-12 w-12 rounded-full" />
          <div className="flex-1">
            <div className="skeleton mb-1.5 h-4 w-32 rounded" />
            <div className="skeleton h-3 w-24 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format company and location
  const companyName =
    profile?.currentCompany_display ||
    profile?.currentCompany ||
    "Not specified";
  const location = profile?.locations?.[0] || "";

  return (
    <div className="surface-card rounded-2xl p-5 transition-all duration-300 hover:border-[var(--primary-border)] hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {profile.isHiring !== undefined && (
            <span
              className={`badge ${profile.isHiring ? 'badge-success' : 'badge'}`}
            >
              {profile.isHiring ? "● Hiring" : "○ Not Hiring"}
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left Section - Profile Info */}
        <div className="flex min-w-0 items-center gap-4">
          {/* Avatar with Profile Image */}
          <div className="relative flex-shrink-0">
            {profile.profileImage && !imageError ? (
              <Image
                src={profile.profileImage}
                alt={profile.name || "User"}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full border-2 border-[var(--border)] object-cover transition-all duration-300 hover:border-[var(--primary-border)]"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--primary-soft)] transition-all duration-300 hover:border-[var(--primary-border)]">
                <span className="text-lg font-bold text-[var(--primary)]">
                  {getInitials(profile.name)}
                </span>
              </div>
            )}
          </div>

          {/* Profile Details */}
          <div className="min-w-0 flex-1">
            <h3
              className="cursor-pointer truncate text-base font-semibold text-[var(--text-primary)] transition-colors hover:text-[var(--primary)]"
              onClick={handleViewProfile}
            >
              {profile.name || "Unknown User"}
            </h3>

            {/* Role and Company */}
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {companyName && companyName !== "Not specified" && (
                <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                  <Building2 className="h-3 w-3 text-[var(--text-muted)]" />
                  <span>{companyName}</span>
                </div>
              )}
            </div>

            {/* Additional Info - Compact */}
            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
              {profile.totalYearsOfExperience && (
                <>
                  <span className="text-[var(--text-muted)]">|</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{profile.totalYearsOfExperience} yrs exp</span>
                  </div>
                </>
              )}
              {profile.educations && profile.educations.length > 0 && (
                <>
                  <span className="text-[var(--text-muted)]">|</span>
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    <span>{profile.educations[0]?.degree || "Graduate"}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex flex-shrink-0 items-center gap-2">
          {/* Message Button */}
          <button
            onClick={handleMessage}
            className="btn-secondary group flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <MessageCircle className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
            <span>Message</span>
          </button>

          {/* View Profile Button */}
          <button
            onClick={handleViewProfile}
            className="btn-primary group flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <span>View Profile</span>
            <ExternalLink className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}