"use client";

import { useMemo, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import {
  Award as AwardIcon,
  Briefcase,
  ExternalLink,
  FileText,
  GraduationCap,
  Globe,
  Loader2,
  Trophy,
  User,
  AlertCircle,
  CheckCircle2,
  XCircle,
  X,
} from "lucide-react";

import ProfileHeader from "@/components/profile/ProfileHeader";
import IdentityCard from "@/components/profile/IdentityCard";
import ProfileSection from "@/components/profile/ProfileSection";
import InfoItem from "@/components/profile/InfoItem";
import TagList from "@/components/profile/TagList";
import Empty from "@/components/profile/Empty";
import Sidebar from "@/components/profile/Sidebar";
import ResumeModal from "@/components/profile/ResumeModal";
import { SwitchToProfessionalModal } from "@/components/profile/SwitchToProfessionalModal";

import type { ProfileData, Experience } from "@/types/profile";

import {
  getInitials,
  formatDateRange,
  getDescription,
  toArray,
} from "@/helper/index";

import { useAuth } from "@/context/AuthContext";

// ---------- Types ----------
type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// ---------- Helpers ----------
function hasAwardData(item: any) {
  return Boolean(
    item?.title ||
    item?.organization ||
    item?.startDate ||
    item?.endDate ||
    item?.description,
  );
}

function hasPublicationData(item: any) {
  return Boolean(item?.title || item?.url);
}

function formatMonthYear(value?: string | null) {
  if (!value) return "";

  if (/^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split("-");
    const date = new Date(Number(year), Number(month) - 1);

    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    }
  }

  return value;
}

function formatAwardDateRange(startDate?: string, endDate?: string) {
  const start = formatMonthYear(startDate);
  const end = formatMonthYear(endDate);

  if (start && end) return `${start} - ${end}`;
  if (start) return start;
  if (end) return end;

  return "";
}

function getSafePublicationUrl(url?: string | null) {
  if (!url) return "";

  const trimmedUrl = url.trim();

  if (!trimmedUrl) return "";

  if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
    return trimmedUrl;
  }

  return `https://${trimmedUrl}`;
}

// ---------- Toast Component ----------
function ToastNotification({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-[var(--success)]" />;
      case "error":
        return <XCircle className="h-5 w-5 text-[var(--danger)]" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-[var(--warning)]" />;
      default:
        return <AlertCircle className="h-5 w-5 text-[var(--info)]" />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case "success":
        return "border-[var(--success-border)] bg-[var(--success-soft)]";
      case "error":
        return "border-[var(--danger-border)] bg-[var(--danger-soft)]";
      case "warning":
        return "border-[var(--warning-border)] bg-[var(--warning-soft)]";
      default:
        return "border-[var(--info-border)] bg-[var(--info-soft)]";
    }
  };

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border ${getBgColor()} p-4 shadow-xl backdrop-blur-sm animate-in slide-in-from-right-5 fade-in duration-300`}
    >
      <div className="mt-0.5 flex-shrink-0">{getIcon()}</div>
      <div className="flex-1">
        <p className="text-sm text-[var(--text-primary)]">{toast.message}</p>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ---------- Page Component ----------
export default function ProfilePage() {
  const router = useRouter();
  const pathname = usePathname();

  const { profile, profileLoading, refreshProfile } = useAuth();

  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [switchModalOpen, setSwitchModalOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const editHref = `${pathname.replace(/\/profile\/?$/, "")}/edit-option`;

  // Toast management
  const addToast = (type: ToastType, message: string, duration?: number) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Switch to professional account with experience data
  const handleSwitchToProfessional = async (data: {
    experiences: Experience[];
    statusType: string;
    statusSince: string;
    statusNote: string;
    statusExpectedReturn: string;
    noticePeriod: string;
    companyEmail: string;
  }) => {
    if (!profile) {
      addToast("error", "Profile not found. Please try again.");
      return;
    }

    try {
      setSwitching(true);

      const backendUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem("token");

      if (!backendUrl) {
        throw new Error("API URL not configured");
      }

      if (!token) {
        throw new Error("Authentication token not found");
      }

      addToast("info", "Updating your profile to professional account...");

      const updatePayload = {
        profileType: "professional",
        experiences: data.experiences.map((exp) => ({
          ...exp,
          company: exp.company?.trim() || "",
          role: exp.role?.trim() || "",
          startDate: exp.startDate || "",
          endDate: exp.isCurrent ? "" : exp.endDate || "",
          isCurrent: exp.isCurrent || false,
          description: exp.description || "",
          company_display: exp.company_display || exp.company?.trim() || "",
          company_canonical_id: exp.company_canonical_id || "",
        })),
        ...(data.experiences.length > 0 && {
          status: {
            type: data.statusType || "open_to_work",
            since: data.statusSince || new Date().toISOString().split("T")[0],
            note: data.statusNote || "",
            expectedReturn: data.statusExpectedReturn || undefined,
          },
        }),
        ...(data.experiences.some((exp) => exp.isCurrent) && {
          noticePeriod: data.noticePeriod || "",
          companyEmail: data.companyEmail || "",
        }),
      };

      const response = await axios.put(
        `${backendUrl}/api/onboarding/update`,
        updatePayload,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status !== 200) {
        throw new Error("Failed to update profile");
      }

      await refreshProfile();

      setSwitchModalOpen(false);
      addToast("success", "Successfully switched to professional account! 🎉");

      setTimeout(() => {
        router.push("/professional/home");
      }, 1500);
    } catch (err: any) {
      console.error("Failed to switch to professional:", err);

      let errorMessage =
        "Failed to switch to professional account. Please try again.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      addToast("error", errorMessage);
    } finally {
      setSwitching(false);
    }
  };

  const handleRefreshProfile = async () => {
    try {
      setIsRefreshing(true);
      await refreshProfile();
      addToast("success", "Profile refreshed successfully!");
    } catch (error) {
      addToast("error", "Failed to refresh profile");
    } finally {
      setIsRefreshing(false);
    }
  };

  const computed = useMemo(() => {
    if (!profile) return null;

    const educations = profile.educations || profile.education || [];
    const experiences = profile.experiences || profile.experience || [];

    const fullName = profile.fullName || profile.name || "User";
    const initials = getInitials(fullName);

    const primaryEducation = educations[0];

    const headline = [
      primaryEducation?.degree || profile.profileType || "Candidate",
      primaryEducation?.specialization,
      primaryEducation?.college,
    ]
      .filter(Boolean)
      .join(" · ");

    const currentRoleLine = [
      profile.currentCompany,
      experiences[0]?.role || experiences[0]?.title,
      profile.totalYearsOfExperience
        ? `${profile.totalYearsOfExperience} yrs`
        : "",
    ]
      .filter(Boolean)
      .join(" · ");

    return {
      fullName,
      initials,
      headline,
      currentRoleLine,
      educations,
      experiences,
      gender: profile.gender,
      dob: profile.dob,
      ethnicity: profile.ethnicity,
      maritalStatus: profile.maritalStatus,
      internationalExperience: profile.internationalExperience || [],
      leadership: profile.leadership || [],
      skills: toArray(profile.skills),
      languages: toArray(profile.languagesKnown),
      domains: toArray(profile.domainKnowledge),
      tools: toArray(profile.toolsAndPlatforms),
      awards: (profile.awards || []).filter(hasAwardData),
      publications: (profile.publications || []).filter(hasPublicationData),
    };
  }, [profile]);

  if (profileLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4 text-[var(--text-primary)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
        <p className="mt-4 text-sm text-[var(--text-muted)]">Loading your profile...</p>
      </div>
    );
  }

  if (!profile || !computed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4 text-[var(--text-primary)]">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-[var(--warning)]" />
          <p className="mt-4 text-sm text-[var(--text-muted)]">No profile data found</p>
          <button
            onClick={handleRefreshProfile}
            className="btn-secondary mt-4 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      {/* Toast Container */}
      <div className="fixed right-4 top-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:max-w-md md:max-w-lg lg:w-96">
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            toast={toast}
            onClose={removeToast}
          />
        ))}
      </div>

      {/* Refresh Indicator */}
      {isRefreshing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--overlay)] backdrop-blur-sm">
          <div className="surface-card rounded-xl p-6 shadow-xl">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[var(--primary)]" />
            <p className="mt-3 text-sm text-[var(--text-primary)]">Refreshing profile...</p>
          </div>
        </div>
      )}

      <ProfileHeader
        editHref={editHref}
        profileType={profile.profileType}
        switching={switching}
        userName ={profile.name}
        onSwitchToProfessional={() => setSwitchModalOpen(true)}
        onRefresh={handleRefreshProfile}
      />

      <main className="grid gap-6 px-3 py-4 sm:px-4 sm:py-6 lg:px-6 xl:grid-cols-[1fr_420px] 2xl:px-8">
        {/* Left Column - Main Content */}
        <section className="space-y-4 sm:space-y-6">
          <IdentityCard
            profile={profile}
            initials={computed.initials}
            headline={computed.headline}
            currentRoleLine={computed.currentRoleLine}
          />

          {/* Personal Details */}
          <ProfileSection
            title="Personal Details"
            icon={<User className="h-4 w-4 text-[var(--primary)]" />}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <InfoItem label="Gender" value={computed.gender || "N/A"} />
              <InfoItem label="Date of Birth" value={computed.dob || "N/A"} />
              <InfoItem label="Ethnicity" value={computed.ethnicity || "N/A"} />
              <InfoItem
                label="Marital Status"
                value={computed.maritalStatus || "N/A"}
              />
            </div>
          </ProfileSection>

          {/* Education */}
          <ProfileSection
            title="Education"
            icon={<GraduationCap className="h-4 w-4 text-[var(--primary)]" />}
          >
            {computed.educations.length ? (
              <div className="space-y-4">
                {computed.educations.map((edu, index) => (
                  <div
                    key={edu._id || index}
                    className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-[var(--text-primary)] sm:text-[15px]">
                          {edu.college || "N/A"}
                        </h3>
                        <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm">
                          {[edu.degree, edu.specialization]
                            .filter(Boolean)
                            .join(" · ") || "N/A"}
                        </p>
                      </div>
                      {edu.yearOfGraduation && (
                        <p className="text-xs text-[var(--text-muted)] sm:mt-0 sm:text-sm">
                          {edu.yearOfGraduation}
                        </p>
                      )}
                    </div>
                    {edu.cgpa && (
                      <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
                        CGPA: {edu.cgpa}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Empty>No education added</Empty>
            )}
          </ProfileSection>

          {/* Experience */}
          <ProfileSection
            title="Experience"
            icon={<Briefcase className="h-4 w-4 text-[var(--primary)]" />}
          >
            {computed.experiences.length ? (
              <div className="space-y-4">
                {computed.experiences.map((exp, index) => (
                  <div
                    key={exp._id || index}
                    className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-[var(--text-primary)] sm:text-[15px]">
                          {exp.role || exp.title || "Role"}
                        </h3>
                        <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm">
                          {exp.company || exp.organization || "Company"}
                        </p>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] sm:mt-0 sm:text-sm">
                        {formatDateRange(
                          exp.startDate,
                          exp.endDate,
                          exp.isCurrent,
                        )}
                      </p>
                    </div>

                    {exp.isCurrent && exp.noticePeriod && (
                      <p className="mt-1 text-[11px] text-[var(--text-muted)] sm:text-xs">
                        Notice Period: {exp.noticePeriod} days
                      </p>
                    )}

                    {getDescription(exp.description) && (
                      <p className="mt-2 text-xs leading-6 text-[var(--text-secondary)] sm:text-sm">
                        {getDescription(exp.description)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Empty>No experience added</Empty>
            )}
          </ProfileSection>

          {/* International Experience */}
          {computed.internationalExperience.length > 0 && (
            <ProfileSection
              title="International Experience"
              icon={<Globe className="h-4 w-4 text-[var(--primary)]" />}
            >
              <div className="space-y-4">
                {computed.internationalExperience.map((exp, idx) => (
                  <div
                    key={exp._id || idx}
                    className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-[var(--text-primary)] sm:text-[15px]">
                          {exp.role || "N/A"}
                        </h3>
                        <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm">
                          {exp.organization || "N/A"} • {exp.country || "N/A"}
                        </p>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] sm:mt-0 sm:text-sm">
                        {formatDateRange(exp.startDate, exp.endDate)}
                      </p>
                    </div>
                    {exp.description && (
                      <p className="mt-2 text-xs text-[var(--text-secondary)] sm:text-sm">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ProfileSection>
          )}

          {/* Leadership */}
          {computed.leadership.length > 0 && (
            <ProfileSection
              title="Leadership"
              icon={<Trophy className="h-4 w-4 text-[var(--primary)]" />}
            >
              <div className="space-y-4">
                {computed.leadership.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-[var(--text-primary)] sm:text-[15px]">
                          {item.role || "N/A"}
                        </h3>
                        <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm">
                          {item.organization || item.company || "N/A"}
                        </p>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] sm:mt-0 sm:text-sm">
                        {formatDateRange(item.startDate, item.endDate)}
                      </p>
                    </div>
                    {item.description && (
                      <p className="mt-2 text-xs text-[var(--text-secondary)] sm:text-sm">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ProfileSection>
          )}

          {/* Skills */}
          <ProfileSection
            title="Skills"
            icon={<AwardIcon className="h-4 w-4 text-[var(--primary)]" />}
          >
            {computed.skills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {computed.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="badge badge-success rounded-full px-2.5 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <Empty>No skills added</Empty>
            )}
          </ProfileSection>

          {/* Languages */}
          <ProfileSection
            title="Languages"
            icon={<Globe className="h-4 w-4 text-[var(--primary)]" />}
          >
            {computed.languages.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {computed.languages.map((language, index) => (
                  <span
                    key={index}
                    className="badge badge-success rounded-full px-2.5 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm"
                  >
                    {language}
                  </span>
                ))}
              </div>
            ) : (
              <Empty>No languages added</Empty>
            )}
          </ProfileSection>

          {/* Domains */}
          <ProfileSection
            title="Domains"
            icon={<Briefcase className="h-4 w-4 text-[var(--primary)]" />}
          >
            {computed.domains.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {computed.domains.map((domain, index) => (
                  <span
                    key={index}
                    className="badge badge-success rounded-full px-2.5 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            ) : (
              <Empty>No domains added</Empty>
            )}
          </ProfileSection>

          {/* Tools */}
          <ProfileSection
            title="Tools & Platforms"
            icon={<AwardIcon className="h-4 w-4 text-[var(--primary)]" />}
          >
            {computed.tools.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {computed.tools.map((tool, index) => (
                  <span
                    key={index}
                    className="badge badge-success rounded-full px-2.5 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            ) : (
              <Empty>No tools added</Empty>
            )}
          </ProfileSection>

          {/* About */}
          <ProfileSection
            title="About"
            icon={<User className="h-4 w-4 text-[var(--primary)]" />}
          >
            <p className="text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
              {profile.about || "No about information provided."}
            </p>
          </ProfileSection>

          {/* Achievements */}
          <ProfileSection
            title="Achievements"
            icon={<Trophy className="h-4 w-4 text-[var(--primary)]" />}
          >
            {profile.achievements?.length ? (
              <div className="space-y-4">
                {profile.achievements.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-[var(--text-primary)] sm:text-[15px]">
                          {item.title || "Achievement"}
                        </h3>
                        {item.event && (
                          <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm">
                            {item.event}
                          </p>
                        )}
                      </div>
                      {item.date && (
                        <p className="text-xs text-[var(--text-muted)] sm:mt-0 sm:text-sm">
                          {item.date}
                        </p>
                      )}
                    </div>
                    {item.description && (
                      <p className="mt-2 text-xs text-[var(--text-secondary)] sm:text-sm">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Empty>No achievements added</Empty>
            )}
          </ProfileSection>

          {/* Awards */}
          <ProfileSection
            title="Awards"
            icon={<AwardIcon className="h-4 w-4 text-[var(--primary)]" />}
          >
            {computed.awards.length ? (
              <div className="space-y-4">
                {computed.awards.map((item, index) => {
                  const duration = formatAwardDateRange(
                    item.startDate,
                    item.endDate,
                  );

                  return (
                    <div
                      key={item._id || index}
                      className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-[var(--text-primary)] sm:text-[15px]">
                            {item.title || "Award"}
                          </h3>
                          {item.organization && (
                            <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm">
                              {item.organization}
                            </p>
                          )}
                        </div>
                        {duration && (
                          <p className="text-xs text-[var(--text-muted)] sm:mt-0 sm:text-sm">
                            {duration}
                          </p>
                        )}
                      </div>
                      {item.description && (
                        <p className="mt-2 whitespace-pre-line text-xs leading-6 text-[var(--text-secondary)] sm:text-sm">
                          {item.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <Empty>No awards added</Empty>
            )}
          </ProfileSection>

          {/* Publications */}
          <ProfileSection
            title="Publications"
            icon={<FileText className="h-4 w-4 text-[var(--primary)]" />}
          >
            {computed.publications.length ? (
              <div className="space-y-4">
                {computed.publications.map((item, index) => {
                  const safeUrl = getSafePublicationUrl(item.url);

                  return (
                    <div
                      key={item._id || index}
                      className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <h3 className="text-sm font-semibold text-[var(--text-primary)] sm:text-[15px]">
                          {item.title || "Publication"}
                        </h3>
                        {safeUrl ? (
                          <a
                            href={safeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-2 text-xs text-[var(--primary)] transition-colors hover:text-[var(--primary-hover)] sm:text-sm"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            View Publication
                          </a>
                        ) : (
                          <p className="mt-2 text-xs text-[var(--text-secondary)] sm:text-sm">
                            Publication link not added.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Empty>No publications added</Empty>
            )}
          </ProfileSection>
        </section>

        {/* Right Column - Sidebar */}
        <div className="w-full">
          <Sidebar
            profile={profile}
            resumeModalOpen={resumeModalOpen}
            setResumeModalOpen={setResumeModalOpen}
          />
        </div>
      </main>

      {resumeModalOpen && profile.resume && (
        <ResumeModal
          resumeUrl={profile.resume}
          onClose={() => setResumeModalOpen(false)}
        />
      )}

      {/* Switch to Professional Modal */}
      <SwitchToProfessionalModal
        isOpen={switchModalOpen}
        onClose={() => setSwitchModalOpen(false)}
        onConfirm={handleSwitchToProfessional}
        isLoading={switching}
      />
    </div>
  );
}