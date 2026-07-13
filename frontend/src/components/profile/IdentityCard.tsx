// IdentityCard.tsx
import { ShieldCheck, CheckCircle2, ExternalLink, FileText, Camera, Loader2 } from "lucide-react";
import Badge from "./Badge";
import { ProfileData } from "@/types/profile";
import { useState, useRef } from "react";
import ResumeModal from "./ResumeModal";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

// LinkedIn SVG Icon
const LinkedInIcon = ({ className = "h-3.5 w-3.5" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// GitHub SVG Icon
const GitHubIcon = ({ className = "h-3.5 w-3.5" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.399s2.04.132 3 .399c2.292-1.552 3.3-1.23 3.3-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.694.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

interface IdentityCardProps {
  profile: ProfileData;
  initials?: string;
  headline: string;
  currentRoleLine: string;
  onProfileUpdate?: (updatedProfile: ProfileData) => void;
}

const getInitials = (name?: string) => {
  if (!name) return "U";

  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 0) return "U";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
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
  const [profileImage, setProfileImage] = useState(profile.profileImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const displayName = profile.fullName || profile.name || "User";
  const profileInitials = initials || getInitials(displayName);

  const handleSocialLink = (url: string | undefined, platform: string) => {
    if (!url) {
      console.warn(`${platform} URL not available`);
      return;
    }
    
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(formattedUrl, '_blank', 'noopener,noreferrer');
  };

  const handleViewResume = () => {
    if (profile.resume) {
      setIsResumeModalOpen(true);
    } else {
      console.warn("No resume available");
    }
  };

  const handleCloseResumeModal = () => {
    setIsResumeModalOpen(false);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await axiosInstance.put('/api/onboarding/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // FIX: Properly handle the response data
      if (response.data?.success || response.data?.message) {
        // Get the updated profile data from response
        const updatedProfile = response.data.data || response.data.message || response.data;
        
        // Update local state with new image URL
        if (updatedProfile?.profileImage) {
          setProfileImage(updatedProfile.profileImage);
        } else if (response.data?.profileImage) {
          setProfileImage(response.data.profileImage);
        }
        
        toast.success('Profile image updated successfully');
        
        // Notify parent component about the update
        if (onProfileUpdate && updatedProfile) {
          onProfileUpdate(updatedProfile);
        } else if (onProfileUpdate && response.data) {
          onProfileUpdate(response.data);
        }
      } else {
        throw new Error(response.data?.msg || 'Failed to update profile image');
      }
    } catch (error: any) {
      console.error('Error uploading profile image:', error);
      toast.error(error?.response?.data?.msg || 'Failed to update profile image');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <div className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 transition-all duration-300 hover:border-[var(--primary)]/30 hover:shadow-xl hover:shadow-[var(--primary)]/5">
        <div className="flex items-start gap-6 sm:items-center">
          {/* Avatar with ring effect - Clickable for upload */}
          <div className="relative shrink-0">
            <div 
              className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full ring-4 ring-[var(--primary-soft)] ring-offset-2 ring-offset-[var(--card)] transition-all duration-300 group-hover:ring-[var(--primary)]/40 cursor-pointer"
              onClick={handleImageClick}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={displayName}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <span className="bg-gradient-to-br from-[var(--primary-soft)] to-[var(--primary)]/20 text-3xl font-bold text-[var(--primary)]">
                  {profileInitials}
                </span>
              )}
              
              {/* Upload overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 hover:opacity-100">
                {isUploading ? (
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                ) : (
                  <Camera className="h-8 w-8 text-white" />
                )}
              </div>
            </div>
            
            {/* Status dot */}
            <div className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-[var(--card)] bg-emerald-400"></div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-[24px] font-bold text-white transition-colors group-hover:text-[var(--primary)]">
                {displayName}
              </h2>
              {/* Verified badge inline */}
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--primary)] border border-[var(--primary)]/20">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </span>
            </div>

            <p className="mt-2 text-[15px] text-[var(--text-primary)] leading-relaxed">
              {headline}
            </p>

            {currentRoleLine && (
              <p className="mt-1 text-[14px] text-[var(--text-primary)]/80 font-medium">
                {currentRoleLine}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {/* Social Links - GitHub */}
              {profile.github && (
                <button
                  onClick={() => handleSocialLink(profile.github, 'GitHub')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] transition-all duration-200 hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]/10 hover:text-[var(--primary)] hover:scale-105"
                  title="View GitHub Profile"
                >
                  <GitHubIcon className="h-3.5 w-3.5" />
                  GitHub
                  <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </button>
              )}

              {/* Social Links - LinkedIn */}
              {profile.linkedin && (
                <button
                  onClick={() => handleSocialLink(profile.linkedin, 'LinkedIn')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] transition-all duration-200 hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]/10 hover:text-[var(--primary)] hover:scale-105"
                  title="View LinkedIn Profile"
                >
                  <LinkedInIcon className="h-3.5 w-3.5" />
                  LinkedIn
                  <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </button>
              )}

              {/* View Resume Button */}
              {profile.resume && (
                <button
                  onClick={handleViewResume}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3 py-1.5 text-xs font-medium text-[var(--primary)] transition-all duration-200 hover:bg-[var(--primary)] hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-[var(--primary)]/20"
                  title="View Resume"
                >
                  <FileText className="h-3.5 w-3.5" />
                  View Resume
                  <ExternalLink className="h-2.5 w-2.5" />
                </button>
              )}

              {/* Email Verified Badge */}
              <Badge
                icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                text={
                  profile.emailVerified
                    ? "Email verified"
                    : "Email not verified"
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resume Modal */}
      {isResumeModalOpen && profile.resume && (
        <ResumeModal
          resumeUrl={profile.resume}
          onClose={handleCloseResumeModal}
        />
      )}
    </>
  );
}