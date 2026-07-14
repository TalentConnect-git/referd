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
      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gray-700/50 animate-pulse" />
          <div className="flex-1">
            <div className="h-4 w-32 bg-gray-700/50 rounded animate-pulse mb-1.5" />
            <div className="h-3 w-24 bg-gray-700/50 rounded animate-pulse" />
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
    <div className="bg-gradient-to-br from-[#0F172A] to-[#1a2332] rounded-2xl border border-slate-800 p-5 transition-all duration-300 hover:border-green-500/40 hover:shadow-xl hover:shadow-green-500/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {profile.isHiring !== undefined && (
            <span
              className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${
                profile.isHiring
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-gray-500/10 text-gray-400 border-gray-500/20"
              }`}
            >
              {profile.isHiring ? "● Hiring" : "○ Not Hiring"}
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Section - Profile Info */}
        <div className="flex items-center gap-4 min-w-0">
          {/* Avatar with Profile Image */}
          <div className="relative flex-shrink-0">
            {profile.profileImage && !imageError ? (
              <Image
                src={profile.profileImage}
                alt={profile.name || "User"}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover border-2 border-green-500/30 hover:border-green-500/60 transition-all duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border-2 border-green-500/30 hover:border-green-500/60 transition-all duration-300">
                <span className="text-lg font-bold text-green-400">
                  {getInitials(profile.name)}
                </span>
              </div>
            )}
          </div>

          {/* Profile Details */}
          <div className="min-w-0 flex-1">
            <h3
              className="text-base font-semibold text-white hover:text-green-400 transition-colors cursor-pointer truncate"
              onClick={handleViewProfile}
            >
              {profile.name || "Unknown User"}
            </h3>

            {/* Role and Company */}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {companyName && companyName !== "Not specified" && (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Building2 className="w-3 h-3 text-gray-500" />
                  <span>{companyName}</span>
                </div>
              )}
            </div>

            {/* Additional Info - Compact */}
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
              {profile.totalYearsOfExperience && (
                <>
                  <span className="text-gray-700">|</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{profile.totalYearsOfExperience} yrs exp</span>
                  </div>
                </>
              )}
              {profile.educations && profile.educations.length > 0 && (
                <>
                  <span className="text-gray-700">|</span>
                  <div className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>{profile.educations[0]?.degree || "Graduate"}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Message Button */}
          <button
            onClick={handleMessage}
            className="
              flex items-center gap-2
              rounded-lg border border-slate-700 
              px-3.5 py-2
              text-xs font-medium text-gray-300
              transition-all duration-200
              hover:bg-slate-800/50 hover:border-slate-600 hover:text-white
              hover:shadow-lg hover:shadow-slate-800/20
              group
            "
          >
            <MessageCircle className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
            <span>Message</span>
          </button>

          {/* View Profile Button */}
          <button
            onClick={handleViewProfile}
            className="
              flex items-center gap-2
              rounded-lg bg-gradient-to-r from-green-500 to-emerald-500
              px-4 py-2
              text-xs font-medium text-black
              transition-all duration-200
              hover:from-green-400 hover:to-emerald-400
              hover:shadow-lg hover:shadow-green-500/25
              group
            "
          >
            <span>View Profile</span>
            <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}