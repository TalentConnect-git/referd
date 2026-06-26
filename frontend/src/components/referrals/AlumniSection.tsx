// components/referrals/AlumniSection.tsx
"use client";

import { 
  Briefcase, 
  GraduationCap, 
  UserPlus, 
  Clock, 
  Mail,
  ArrowRight,
  Users,
  Building2
} from "lucide-react";
import { AlumniProfile } from "@/types/referrals";

interface AlumniSectionProps {
  alumni: AlumniProfile[];
  companyName: string;
  onViewProfile: (alumni: AlumniProfile) => void;
  onAskReferral: (careerPageUrl: string, alumniUserId: string) => void;
  careerPageUrl: string;
}

export function AlumniSection({
  alumni,
  companyName,
  onViewProfile,
  onAskReferral,
  careerPageUrl,
}: AlumniSectionProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-secondary)] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[var(--primary)]" />
            {companyName}
            <span className="text-[var(--text-primary)] font-normal">Alumni</span>
          </h2>
          <p className="text-sm text-[var(--text-primary)] mt-1">
            {alumni.length} {alumni.length === 1 ? "alumni" : "alumni"} found who can refer you
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary-soft)] border border-[var(--primary)]/20">
          <Users className="w-4 h-4 text-[var(--primary)]" />
          <span className="text-sm font-semibold text-[var(--primary)]">{alumni.length} Found</span>
        </div>
      </div>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alumni.map((person) => (
          <div
            key={person._id}
            className="glass-card rounded-[var(--radius-xl)] p-5 hover:border-[var(--border-strong)] transition-all duration-300 group"
          >
            {/* Profile Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="relative">
                {person.profileImage ? (
                  <img
                    src={person.profileImage}
                    alt={person.name}
                    className="w-14 h-14 rounded-xl object-cover ring-2 ring-[var(--border)]"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl primary-gradient flex items-center justify-center">
                    <span className="text-lg font-bold text-black">
                      {getInitials(person.name)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[var(--text-secondary)] text-lg truncate">
                  {person.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <Briefcase className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" />
                  <p className="text-sm text-[var(--text-primary)] truncate">
                    {person.currentCompany || "Professional"}
                  </p>
                </div>
                {person.jobRoles?.[0] && (
                  <p className="text-xs text-[var(--text-muted)] mt-1 truncate">
                    {person.jobRoles[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-2 mb-4">
              {person.totalYearsOfExperience && (
                <div className="flex items-center gap-2 text-xs text-[var(--text-primary)]">
                  <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span>{person.totalYearsOfExperience} year experience</span>
                </div>
              )}
              {person.college && (
                <div className="flex items-center gap-2 text-xs text-[var(--text-primary)]">
                  <GraduationCap className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span className="truncate">{person.college}</span>
                </div>
              )}
              {person.email && (
                <div className="flex items-center gap-2 text-xs text-[var(--text-primary)]">
                  <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span className="truncate">{person.email}</span>
                </div>
              )}
            </div>

            {/* Skills Tags */}
            {person.jobRoles && person.jobRoles.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {person.jobRoles.slice(0, 3).map((role, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs rounded-lg bg-[var(--background-soft)] text-[var(--text-primary)] border border-[var(--border)]"
                  >
                    {role}
                  </span>
                ))}
                {person.jobRoles.length > 3 && (
                  <span className="px-2.5 py-1 text-xs rounded-lg bg-[var(--background-soft)] text-[var(--text-muted)] border border-[var(--border)]">
                    +{person.jobRoles.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
              <button
                onClick={() => onViewProfile(person)}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--card-hover)] hover:text-[var(--text-secondary)] hover:border-[var(--border-strong)] transition-all"
              >
                View Profile
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onAskReferral(careerPageUrl, person.userId)}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-sm font-semibold text-black hover:bg-[var(--primary-dark)] transition-all"
              >
                <UserPlus className="w-4 h-4" />
                Ask Referral
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}