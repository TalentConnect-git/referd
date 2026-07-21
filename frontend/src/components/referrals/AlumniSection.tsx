"use client";

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
} from "lucide-react";
import { AlumniProfile } from "@/types/referrals";

interface AlumniSectionProps {
  alumni: AlumniProfile[];
  companyName: string;
  onViewProfile: (alumni: AlumniProfile) => void;
  onAskReferral: (careerPageUrl: string, alumniUserId: string) => void;
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
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // If no alumni and no employees found
  if (alumni.length === 0) {
    return (
      <div className="space-y-6 mt-6">
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-[#111827] rounded-2xl border border-[#2a3a52]">
          <div className="w-16 h-16 rounded-full bg-[#1a2332] flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            No Alumni or Employees Found
          </h3>
          <p className="text-sm text-gray-400 max-w-md">
            We couldn't find any alumni or current employees from {companyName} in our network.
          </p>
          {careerPageUrl && (
            <a
              href={careerPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-all"
            >
              <Briefcase className="w-4 h-4" />
              Visit Career Page
              <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    );
  }

  // Determine the section title and description based on alumniFound
  const isAlumni = alumniFound === true;
  const title = isAlumni ? "Alumni" : "Current Employees";
  const description = isAlumni 
    ? `${alumni.length} ${alumni.length === 1 ? "alumni" : "alumni"} found who can refer you`
    : `${alumni.length} ${alumni.length === 1 ? "employee" : "employees"} from ${companyName} in our network`;

  return (
    <div className="space-y-6 mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-secondary)] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[var(--primary)]" />
            {companyName}
            <span className="text-[var(--text-primary)] font-normal">
              {title}
            </span>
            {!isAlumni && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 ml-2">
                Current Employees
              </span>
            )}
          </h2>
          <p className="text-sm text-[var(--text-primary)] mt-1">
            {description}
          </p>
          {!isAlumni && (
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              These are current employees who can help with referrals
            </p>
          )}
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
          isAlumni 
            ? 'bg-[var(--primary-soft)] border-[var(--primary)]/20' 
            : 'bg-blue-500/10 border-blue-500/20'
        }`}>
          <Users className={`w-4 h-4 ${isAlumni ? 'text-[var(--primary)]' : 'text-blue-400'}`} />
          <span className={`text-sm font-semibold ${isAlumni ? 'text-[var(--primary)]' : 'text-blue-400'}`}>
            {alumni.length} {isAlumni ? 'Alumni' : 'Employees'}
          </span>
        </div>
      </div>

      {/* Alumni/Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alumni.map((person) => {
          // Check if this person is a current employee (has isCurrentEmployee flag)
          const isCurrentEmployee = (person as any).isCurrentEmployee === true;
          
          return (
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
                  {isCurrentEmployee && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-[#111827] flex items-center justify-center">
                      <span className="text-[8px]">💼</span>
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
                  {isCurrentEmployee && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[8px] text-blue-400">
                      <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
                      Current Employee
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-2 mb-4">
                {person.totalYearsOfExperience && (
                  <div className="flex items-center gap-2 text-xs text-[var(--text-primary)]">
                    <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span>{person.totalYearsOfExperience} experience</span>
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
          );
        })}
      </div>

      {/* Footer with career page link */}
      
    </div>
  );
}