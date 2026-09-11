"use client";

import { useState } from "react";
import {
  Briefcase,
  GraduationCap,
  UserPlus,
  Clock,
  Mail,
  ArrowRight,
  Users,
  Building2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { AlumniProfile } from "@/types/referrals";

interface AlumniSectionProps {
  alumni: AlumniProfile[];
  companyName: string;
  onViewProfile: (alumni: AlumniProfile) => void;
  onAskReferral: (careerPageUrl: string, alumniUserId: string) => void | Promise<void>;
  careerPageUrl: string;
  alumniFound?: boolean;
  totalAlumniFound?: number;
}

export function AlumniSection({
  alumni,
  companyName,
  onViewProfile,
  onAskReferral,
  careerPageUrl,
  alumniFound = true,
  totalAlumniFound = 0,
}: AlumniSectionProps) {
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAskReferral = async (userId: string) => {
    if (loadingUserId) return;
    try {
      setLoadingUserId(userId);
      await onAskReferral(careerPageUrl, userId);
    } finally {
      setLoadingUserId(null);
    }
  };

  if (alumni.length === 0) {
    return (
      <div className="mt-6 space-y-6">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] px-4 py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--background-soft)]">
            <Building2 className="h-8 w-8 text-[var(--text-muted)]" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
            No Alumni or Employees Found
          </h3>
          <p className="max-w-md text-sm text-[var(--text-muted)]">
            We couldn&rsquo;t find any alumni or current employees from{" "}
            {companyName} in our network.
          </p>
          {careerPageUrl && (
            <a
              href={careerPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-4 inline-flex items-center gap-2
                rounded-lg
                border border-[var(--primary-border)]
                bg-[var(--primary-soft)]
                px-3.5 py-2
                text-[13px] font-medium
                text-[var(--primary)]
                transition-colors duration-200
                hover:border-[var(--primary)]
                hover:bg-[var(--primary)]
                hover:text-[var(--text-on-primary)]
              "
            >
              <Briefcase className="h-3.5 w-3.5" />
              Visit Career Page
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    );
  }

  const isAlumni = alumniFound === true;
  const title = isAlumni ? "Alumni" : "Current Employees";
  const description = isAlumni
    ? `${alumni.length} ${alumni.length === 1 ? "alumni" : "alumni"} found who can refer you`
    : `${alumni.length} ${
        alumni.length === 1 ? "employee" : "employees"
      } from ${companyName} in our network`;

  return (
    <div className="mt-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--text-primary)]">
            <Building2 className="h-5 w-5 text-[var(--primary)]" />
            {companyName}
            <span className="font-normal text-[var(--primary)]">{title}</span>
            {!isAlumni && (
              <span
                className="
                  ml-2 rounded-full
                  border border-[var(--info-border)]
                  bg-[var(--info-soft)]
                  px-2 py-0.5
                  text-[10px] font-medium
                  text-[var(--info)]
                "
              >
                Current Employees
              </span>
            )}
          </h2>
          <p className="mt-1 text-sm text-[var(--text-primary)]">
            {description}
          </p>
          {!isAlumni && (
            <p className="mt-1 flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <AlertCircle className="h-3 w-3" />
              These are current employees who can help with referrals
            </p>
          )}
        </div>

        <div
          className={`
            flex items-center gap-2
            rounded-xl
            border
            px-3.5 py-2
            ${
              isAlumni
                ? "border-[var(--primary-border)] bg-[var(--primary-soft)]"
                : "border-[var(--info-border)] bg-[var(--info-soft)]"
            }
          `}
        >
          <Users
            className={`h-3.5 w-3.5 ${
              isAlumni ? "text-[var(--primary)]" : "text-[var(--info)]"
            }`}
          />
          <span
            className={`text-[13px] font-semibold ${
              isAlumni ? "text-[var(--primary)]" : "text-[var(--info)]"
            }`}
          >
            {alumni.length} {isAlumni ? "Alumni" : "Employees"}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {alumni.map((person) => {
          const isCurrentEmployee = (person as any).isCurrentEmployee === true;
          const isThisLoading = loadingUserId === person.userId;

          return (
            <div
              key={person._id}
              className="
                group rounded-xl
                border border-[var(--border)]
                bg-[var(--card)]
                p-4
                transition-all duration-300
                hover:border-[var(--border-strong)]
                hover:shadow-[var(--shadow-md)]
              "
            >
              {/* Profile Header */}
              <div className="mb-3.5 flex items-start gap-3">
                <div className="relative">
                  {person.profileImage ? (
                    <img
                      src={person.profileImage}
                      alt={person.name}
                      className="h-12 w-12 rounded-xl object-cover ring-2 ring-[var(--border)]"
                    />
                  ) : (
                    <div
                      className="
                        flex h-12 w-12 items-center justify-center
                        rounded-xl
                        bg-gradient-to-br
                        from-[var(--primary-light)]
                        via-[var(--primary)]
                        to-[var(--primary-dark)]
                      "
                    >
                      <span className="text-base font-bold text-[var(--text-on-primary)]">
                        {getInitials(person.name)}
                      </span>
                    </div>
                  )}
                  {isCurrentEmployee && (
                    <div
                      className="
                        absolute -top-1 -right-1
                        flex h-4 w-4
                        items-center justify-center
                        rounded-full
                        border-2 border-[var(--card)]
                        bg-[var(--info)]
                      "
                    >
                      <span className="text-[8px]">💼</span>
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[15px] font-bold text-[var(--text-primary)]">
                    {person.name}
                  </h3>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <Briefcase className="h-3 w-3 flex-shrink-0 text-[var(--text-muted)]" />
                    <p className="truncate text-[12.5px] text-[var(--text-primary)]">
                      {person.currentCompany || "Professional"}
                    </p>
                  </div>
                  {person.jobRoles?.[0] && (
                    <p className="mt-0.5 truncate text-[11px] text-[var(--text-muted)]">
                      {person.jobRoles[0]}
                    </p>
                  )}
                  {isCurrentEmployee && (
                    <span
                      className="
                        mt-1 inline-flex items-center gap-1
                        rounded-full
                        border border-[var(--info-border)]
                        bg-[var(--info-soft)]
                        px-1.5 py-0.5
                        text-[8px] font-medium
                        text-[var(--info)]
                      "
                    >
                      <span className="h-1 w-1 animate-pulse rounded-full bg-[var(--info)]" />
                      Current Employee
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="mb-3.5 space-y-1.5">
                {person.totalYearsOfExperience && (
                  <div className="flex items-center gap-2 text-[11.5px] text-[var(--text-secondary)]">
                    <Clock className="h-3 w-3 text-[var(--text-muted)]" />
                    <span>{person.totalYearsOfExperience} experience</span>
                  </div>
                )}
                {person.college && (
                  <div className="flex items-center gap-2 text-[11.5px] text-[var(--text-secondary)]">
                    <GraduationCap className="h-3 w-3 text-[var(--text-muted)]" />
                    <span className="truncate">{person.college}</span>
                  </div>
                )}
                {person.email && (
                  <div className="flex items-center gap-2 text-[11.5px] text-[var(--text-secondary)]">
                    <Mail className="h-3 w-3 text-[var(--text-muted)]" />
                    <span className="truncate">{person.email}</span>
                  </div>
                )}
              </div>

              {/* Skills */}
              {person.jobRoles && person.jobRoles.length > 0 && (
                <div className="mb-3.5 flex flex-wrap gap-1.5">
                  {person.jobRoles.slice(0, 3).map((role, i) => (
                    <span
                      key={i}
                      className="
                        rounded-md
                        border border-[var(--border)]
                        bg-[var(--background-soft)]
                        px-2 py-0.5
                        text-[10.5px]
                        text-[var(--text-primary)]
                      "
                    >
                      {role}
                    </span>
                  ))}
                  {person.jobRoles.length > 3 && (
                    <span
                      className="
                        rounded-md
                        border border-[var(--border)]
                        bg-[var(--background-soft)]
                        px-2 py-0.5
                        text-[10.5px]
                        text-[var(--text-muted)]
                      "
                    >
                      +{person.jobRoles.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Actions — flex row, compact */}
              <div className="flex flex-row items-stretch gap-1.5 border-t border-[var(--divider)] pt-3">
                <button
                  onClick={() => onViewProfile(person)}
                  disabled={isThisLoading}
                  className="
                    flex flex-1 items-center justify-center gap-1
                    rounded-lg
                    border border-[var(--border)]
                    bg-[var(--card)]
                    px-2.5 py-1.5
                    text-[11px] font-medium
                    text-[var(--text-primary)]
                    transition-colors duration-200
                    hover:border-[var(--border-strong)]
                    hover:bg-[var(--card-hover)]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  View Profile
                  <ArrowRight className="h-3 w-3 shrink-0" />
                </button>

                <button
                  onClick={() => handleAskReferral(person.userId)}
                  disabled={isThisLoading || loadingUserId !== null}
                  className="
                    flex flex-1 items-center justify-center gap-1
                    rounded-lg
                    bg-[var(--primary)]
                    px-2.5 py-1.5
                    text-[11px] font-medium
                    text-[var(--text-on-primary)]
                    transition-colors duration-200
                    hover:bg-[var(--primary-hover)]
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {isThisLoading ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin shrink-0" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-3 w-3 shrink-0" />
                      <span>Ask Referral</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}