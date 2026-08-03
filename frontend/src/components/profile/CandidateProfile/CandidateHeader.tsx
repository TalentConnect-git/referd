"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Code2,
  FileText,
  GraduationCap,
  MapPin,
  Trophy,
  CheckCircle,
  Mail,
  Phone,
  MessageCircle,
  Clock,
} from "lucide-react";

import { ProfileData } from "@/types/profile";
import ResumeModal from "@/components/profile/ResumeModal";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

type EducationItem = {
  college?: string;
  college_display?: string;
  degree?: string;
  specialization?: string;
  semester?: string;
  cgpa?: string;
  yearOfGraduation?: string;
  educationType?: string;
  isCurrent?: boolean;
};

type ExperienceItem = {
  company?: string;
  company_display?: string;
  role?: string;
  isCurrent?: boolean;
};

type CandidateHeaderProfile = ProfileData & {
  educations?: EducationItem[];
  experiences?: ExperienceItem[];
  profileType?: string;
  currentCompany?: string;
  currentCompany_display?: string;
  clientLocation?: string;
  totalYearsOfExperience?: string | number;
  resume?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  profileImage?: string;
  jobRoles?: string[];
  locations?: string[];
  isVerified?: boolean;
  email?: string;
  phone?: string;
};

interface CandidateHeaderProps {
  profile: CandidateHeaderProfile;
}

const safeText = (value?: string | null, fallback = "N/A") => {
  if (!value || !String(value).trim()) return fallback;
  return String(value).trim();
};

const getFirstLetter = (name?: string | null) => {
  if (!name || !name.trim()) return "U";
  return name.trim().charAt(0).toUpperCase();
};

const normalizeUrl = (url?: string | null) => {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const toNumber = (value?: string | number | null) => {
  if (value === null || value === undefined || value === "") return 0;
  const parsed = Number.parseFloat(String(value));
  if (Number.isNaN(parsed)) return 0;
  return parsed;
};

const STATUS_LABELS: Record<string, string> = {
  open_to_work: "Open to Work",
  career_break: "Career Break",
  freelancing: "Freelancing",
  building: "Building Something",
  not_looking: "Not Looking",
  looking_internship: "Looking for Internship",
  looking_job: "Looking for Job",
  preparing_exams: "Preparing for Exams",
  employed: "Employed",
};

const ResumeSvgIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 2H7.5A2.5 2.5 0 0 0 5 4.5v15A2.5 2.5 0 0 0 7.5 22h9a2.5 2.5 0 0 0 2.5-2.5V7l-5-5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M14 2v5h5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 12h7M8.5 15h7M8.5 18h4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const GithubSvgIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.52.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.694.825.57C20.565 22.092 24 17.592 24 12.297 24 5.67 18.627.297 12 .297z" />
  </svg>
);

const LinkedInSvgIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
  </svg>
);

const PortfolioSvgIcon = ({
  className = "h-4 w-4",
}: {
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 6h4M9 6.5A2.5 2.5 0 0 1 11.5 4h1A2.5 2.5 0 0 1 15 6.5M4 8.5A2.5 2.5 0 0 1 6.5 6h11A2.5 2.5 0 0 1 20 8.5v9A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-9Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 11h16M9 14h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default function CandidateHeader({ profile }: CandidateHeaderProps) {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const currentExperience = useMemo(() => {
    return (
      profile.experiences?.find((experience) => experience.isCurrent) ||
      profile.experiences?.[0] ||
      null
    );
  }, [profile.experiences]);

  const currentEducation = useMemo(() => {
    return (
      profile.educations?.find((education) => education.isCurrent) ||
      profile.educations?.[0] ||
      null
    );
  }, [profile.educations]);

  const hasCurrentCompany = useMemo(() => {
    const hasCurrentExp = profile.experiences?.some(
      (exp) => exp.isCurrent === true,
    );
    const hasCurrentCompanyField =
      profile.currentCompany && profile.currentCompany.trim().length > 0;
    return hasCurrentExp || hasCurrentCompanyField;
  }, [profile.experiences, profile.currentCompany]);

  const statusType = profile.status?.type || "";
  const statusLabel = STATUS_LABELS[statusType] || "";
  const hasStatus = statusType && statusLabel;

  const name = safeText(profile.name, "Candidate");

  const role = currentExperience?.role || "Professional";

  let companyOrStatusDisplay = "";
  if (hasCurrentCompany) {
    companyOrStatusDisplay = safeText(
      profile.currentCompany_display ||
        profile.currentCompany ||
        currentExperience?.company_display ||
        currentExperience?.company ||
        "Company",
    );
  } else if (hasStatus) {
    companyOrStatusDisplay = statusLabel;
  } else {
    companyOrStatusDisplay = "Not specified";
  }

  const location = profile.locations?.[0] || profile.clientLocation || "N/A";

  const educationName =
    currentEducation?.college_display ||
    currentEducation?.college ||
    currentEducation?.degree ||
    "N/A";

  const companiesCount =
    profile.experiences?.filter(
      (experience) => experience.company || experience.company_display,
    ).length || 0;

  const yearsExperience = toNumber(profile.totalYearsOfExperience);

  const skillsCount = profile.skills?.length || 0;
  const awardsCount = profile.awards?.length || 0;
  const publicationsCount = profile.publications?.length || 0;

  const resumeUrl = normalizeUrl(profile.resume);
  const githubUrl = normalizeUrl(profile.github);
  const linkedInUrl = normalizeUrl(profile.linkedin);
  const portfolioUrl = normalizeUrl(profile.portfolio);

  const isVerified = profile.isVerified || false;

  const stats = [
    { label: "YEARS EXP", value: yearsExperience, icon: BriefcaseBusiness },
    { label: "SKILLS", value: skillsCount, icon: Code2 },
    { label: "AWARDS", value: awardsCount, icon: Trophy },
    { label: "PUBLICATIONS", value: publicationsCount, icon: BookOpen },
  ];

  const socialLinks = [
    {
      name: "LinkedIn",
      url: linkedInUrl,
      icon: LinkedInSvgIcon,
      type: "external",
    },
    {
      name: "GitHub",
      url: githubUrl,
      icon: GithubSvgIcon,
      type: "external",
    },
    {
      name: "Portfolio",
      url: portfolioUrl,
      icon: PortfolioSvgIcon,
      type: "external",
    },
    {
      name: "Resume",
      url: resumeUrl,
      icon: ResumeSvgIcon,
      type: "resume",
    },
  ];

  const handleActionClick = (link: (typeof socialLinks)[number]) => {
    if (!link.url) return;

    if (link.type === "resume") {
      setIsResumeOpen(true);
      return;
    }

    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  const handleMessageClick = () => {
    const userRole = user?.userType || "candidate";
    const userId = profile.userId;
    const name = profile.name;

    router.push(`/${userRole}/message/${userId}?userName=${name}`);
  };

  return (
    <>
      <section className="surface-card relative overflow-hidden rounded-2xl border border-[var(--primary-border)] bg-[var(--card)] px-4 py-4 shadow-xl sm:px-5">
        <div className="relative z-10">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              {/* Profile Image */}
              <div className="relative h-[80px] w-[80px] shrink-0 rounded-full border-[3px] border-[var(--primary)] bg-[var(--background-soft)] p-1 shadow-[0_0_25px_rgba(56,232,120,0.15)]">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={name}
                    className="relative h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="relative flex h-full w-full items-center justify-center rounded-full border border-[var(--primary-border)] bg-[var(--primary-soft)] text-2xl font-bold text-[var(--primary)]">
                    {getFirstLetter(profile.name)}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                {/* Name */}
                <h1 className="max-w-[400px] truncate text-2xl font-bold leading-tight text-[var(--text-primary)] md:text-3xl">
                  {name}
                </h1>

                {/* Role Badge */}
                <div className="mt-2">
                  {/* Role Badge */}
                  <div className="mt-2 inline-flex max-w-full items-center rounded-full border border-[var(--primary-border)] bg-[var(--primary-soft)] px-3 py-1 shadow-[0_0_18px_rgba(56,232,120,0.08)]">
                    {hasCurrentCompany ? (
                      <span className="truncate text-xs font-semibold leading-none text-[var(--primary)]">
                        {safeText(role, "Professional")} @{" "}
                        {companyOrStatusDisplay}
                      </span>
                    ) : hasStatus ? (
                      <span className="flex items-center gap-1.5 truncate text-xs font-semibold leading-none text-[var(--primary)]">
                        {safeText(role, "Professional")} • {statusLabel}
                      </span>
                    ) : (
                      <span className="truncate text-xs font-semibold leading-none text-[var(--primary)]">
                        {safeText(role, "Professional")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Info Row */}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-[var(--text-muted)]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[var(--primary)]" />
                    <span className="text-[var(--text-secondary)]">
                      {safeText(location, "N/A")}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-[var(--primary)]" />
                    <span className="text-[var(--text-secondary)]">
                      {companiesCount === 0
                        ? "No companies"
                        : `Work at ${companiesCount} ${companiesCount === 1 ? "Company" : "Companies"}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-[var(--primary)]" />
                    <span className="max-w-[240px] truncate text-[var(--text-secondary)]">
                      {safeText(educationName, "N/A")}
                    </span>
                  </div>

                  {/* Show status as a separate tag when no current company */}
                  {!hasCurrentCompany && hasStatus && (
                    <div className="flex items-center gap-1.5 rounded-full border border-[var(--primary-border)] bg-[var(--primary-soft)]/50 px-2.5 py-0.5">
                      <Clock className="h-3 w-3 text-[var(--primary)]" />
                      <span className="text-xs text-[var(--text-secondary)]">
                        {statusLabel}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Verified Badge + Social Icons + Contact */}
            <div className="flex flex-col items-end gap-1.5">
              {isVerified && (
                <div className="flex items-center gap-1.5 rounded-full border border-[var(--primary-border)] bg-[var(--primary-soft)]/60 px-2.5 py-1 shadow-[0_0_20px_rgba(56,232,120,0.1)]">
                  <CheckCircle className="h-3.5 w-3.5 text-[var(--primary)]" />
                  <span className="text-[10px] font-bold text-[var(--primary)]">
                    Verified
                  </span>
                </div>
              )}

              {/* Social Links + Message Button */}
              <div className="flex flex-wrap items-center justify-end gap-1.5">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  const hasUrl = Boolean(link.url);

                  return (
                    <button
                      key={link.name}
                      type="button"
                      disabled={!hasUrl}
                      onClick={() => handleActionClick(link)}
                      className={`inline-flex h-[30px] items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-all duration-200 ${
                        link.name === "Resume" && hasUrl
                          ? "btn-primary"
                          : hasUrl
                            ? "btn-secondary"
                            : "cursor-not-allowed border border-[var(--border)] bg-[var(--background-soft)]/60 px-3 text-[var(--text-muted)]"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {link.name}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="btn-secondary inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span className="max-w-[120px] truncate">
                      {profile.email}
                    </span>
                  </a>
                )}
                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="btn-secondary inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>{profile.phone}</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleMessageClick}
                  className="btn-primary inline-flex h-[30px] items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Message
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="group rounded-xl border border-[var(--border)] bg-[var(--background-soft)] px-3 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--primary-border)] hover:bg-[var(--card-hover)] hover:shadow-md"
                >
                  <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--primary)] transition group-hover:border-[var(--primary-border)]">
                    <Icon className="h-3.5 w-3.5" />
                  </div>

                  <p className="text-xl font-bold leading-none text-[var(--text-primary)]">
                    {stat.value}
                  </p>

                  <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Resume Modal */}
      {isResumeOpen && resumeUrl && (
        <ResumeModal
          resumeUrl={resumeUrl}
          onClose={() => setIsResumeOpen(false)}
        />
      )}
    </>
  );
}
