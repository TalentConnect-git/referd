"use client";
import { AlumniWhoCanHelpProps, alumniWhoCanHelp } from "@/types/dashboard";
import { getAlumniWhoCanHelp } from "@/services/alumani.services";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User, Briefcase, MessageCircle, ExternalLink, Users, Building2, Mail } from "lucide-react";
import Image from "next/image";

export default function AlumniWhoCanHelp({ job }: AlumniWhoCanHelpProps) {
  const [alumni, setAlumni] = useState<alumniWhoCanHelp[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const { role: userType } = useAuth();

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const company = job.candidatePosted?.currentCompany || job.companyName || "";
        const response = await getAlumniWhoCanHelp(job.candidatePosted.userId, company);
        setAlumni(response.data || []);
      } catch (err) {
        console.error("Error fetching alumni:", err);
        setAlumni([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, [job]);

  const handleMessage = (e: React.MouseEvent, userId: string, name: string, profileImage?: string) => {
    e.stopPropagation();
    const encodedName = encodeURIComponent(name);
    const encodedImage = profileImage ? encodeURIComponent(profileImage) : "";
    
    router.push(
      `/${userType}/message/${userId}?userName=${encodedName}&profileImage=${encodedImage}`
    );
  };

  const handleProfileClick = (userId: string) => {
    router.push(`/${userType}/profile/${userId}`);
  };

  const handleImageError = (userId: string) => {
    setImageErrors((prev) => ({ ...prev, [userId]: true }));
  };

  if (loading) {
    return (
      <div className="surface-card rounded-xl p-4">
        <div className="flex items-center justify-center gap-3 py-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--primary-border)] border-t-[var(--primary)]" />
          <span className="text-sm text-[var(--text-secondary)]">Loading alumni...</span>
        </div>
      </div>
    );
  }

  if (alumni.length === 0) {
    return (
      <div className="surface-card rounded-xl p-4">
        <div className="mb-3 flex items-center gap-2">
          <Users size={16} className="text-[var(--text-muted)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Alumni Who Can Help</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="mb-3 rounded-full bg-[var(--background-soft)] p-3">
            <Users size={20} className="text-[var(--text-muted)]" />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">No alumni found for this company</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">Check back later for updates</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-[var(--primary)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Alumni Who Can Help</h3>
          <span className="rounded-full border border-[var(--primary-border)] bg-[var(--primary-soft)] px-2 py-0.5 text-[10px] text-[var(--primary)]">
            {alumni.length}
          </span>
        </div>
        <span className="text-[10px] text-[var(--text-muted)]">Click to view profile</span>
      </div>

      {/* Alumni List */}
      <div className="space-y-2.5">
        {alumni.map((person) => {
          const initials = person.name?.charAt(0)?.toUpperCase() || "A";
          const jobsCount = person.referralJobs?.length || 0;
          const hasImageError = imageErrors[person.userId];

          return (
            <div
              key={person.userId}
              onClick={() => handleProfileClick(person.userId)}
              className="group flex cursor-pointer items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 transition-all duration-200 hover:border-[var(--primary-border)] hover:bg-[var(--card-hover)]"
            >
              {/* Left Section */}
              <div className="flex min-w-0 items-center gap-3">
                {/* Avatar with Profile Image */}
                <div className="relative h-10 w-10 flex-shrink-0 sm:h-12 sm:w-12">
                  {person.profileImage && !hasImageError ? (
                    <Image
                      src={person.profileImage}
                      alt={person.name}
                      fill
                      className="rounded-full border-2 border-[var(--border)] object-cover transition-all duration-200 group-hover:border-[var(--primary-border)]"
                      onError={() => handleImageError(person.userId)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--primary-soft)] transition-all duration-200 group-hover:border-[var(--primary-border)]">
                      <span className="text-sm font-bold text-[var(--primary)] sm:text-base">
                        {initials}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--primary)]">
                    {person.name}
                  </h4>

                  <div className="mt-0.5 flex flex-wrap items-center gap-2">
                    {person.currentCompany && (
                      <div className="flex items-center gap-1">
                        <Building2 size={11} className="text-[var(--text-muted)]" />
                        <span className="max-w-[100px] truncate text-[10px] text-[var(--text-secondary)] sm:max-w-[150px]">
                          {person.currentCompany}
                        </span>
                      </div>
                    )}

                    {jobsCount > 0 && (
                      <>
                        <span className="text-[10px] text-[var(--text-muted)]">•</span>
                        <div className="flex items-center gap-1">
                          <Briefcase size={11} className="text-[var(--text-muted)]" />
                          <span className="text-[10px] text-[var(--text-secondary)]">
                            {jobsCount} job{jobsCount > 1 ? "s" : ""}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="ml-2 flex flex-shrink-0 items-center gap-2">
                {/* Hiring Status */}
                <span
                  className={`hidden rounded-full border px-2 py-1 text-[9px] font-medium sm:inline-block ${
                    person.isHiring
                      ? "border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--primary)]"
                      : "border-[var(--border)] bg-[var(--background-soft)] text-[var(--text-muted)]"
                  }`}
                >
                  {person.isHiring ? "● Hiring" : "○ Not Hiring"}
                </span>

                {/* Message Button */}
                <button
                  onClick={(e) => handleMessage(e, person.userId, person.name, person.profileImage)}
                  className="btn-primary group/btn flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <MessageCircle size={13} className="transition-transform duration-200 group-hover/btn:scale-110" />
                  <span className="hidden sm:inline">Message</span>
                </button>

                {/* View Profile Icon - Mobile */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProfileClick(person.userId);
                  }}
                  className="rounded-lg border border-[var(--border)] p-1.5 text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] sm:hidden"
                >
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {alumni.length > 3 && (
        <div className="mt-3 border-t border-[var(--border)] pt-3">
          <button
            onClick={() => router.push(`/${userType}/alumni-network`)}
            className="w-full text-center text-xs font-medium text-[var(--primary)] transition-colors hover:text-[var(--primary-hover)]"
          >
            View all {alumni.length} alumni →
          </button>
        </div>
      )}
    </div>
  );
}