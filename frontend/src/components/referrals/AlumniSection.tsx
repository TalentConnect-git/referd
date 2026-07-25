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
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-card-soft rounded-2xl border border-theme">
          <div className="w-16 h-16 rounded-full bg-background-soft flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-primary mb-2">
            No Alumni or Employees Found
          </h3>
          <p className="text-sm text-muted max-w-md">
            We couldn't find any alumni or current employees from {companyName} in our network.
          </p>
          {careerPageUrl && (
            <a
              href={careerPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 bg-primary-soft text-primary text-sm font-medium hover:bg-primary-soft transition-all"
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
          <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            {companyName}
            <span className="text-primary font-normal">
              {title}
            </span>
            {!isAlumni && (
              <span className="badge badge-info text-[10px] font-medium px-2 py-0.5 rounded-full border border-info/20 ml-2">
                Current Employees
              </span>
            )}
          </h2>
          <p className="text-sm text-primary mt-1">
            {description}
          </p>
          {!isAlumni && (
            <p className="text-xs text-muted mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              These are current employees who can help with referrals
            </p>
          )}
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
          isAlumni 
            ? 'bg-primary-soft border-primary/20' 
            : 'bg-info-soft border-info/20'
        }`}>
          <Users className={`w-4 h-4 ${isAlumni ? 'text-primary' : 'text-info'}`} />
          <span className={`text-sm font-semibold ${isAlumni ? 'text-primary' : 'text-info'}`}>
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
              className="card rounded-xl p-5 hover:border-strong transition-all duration-300 group"
            >
              {/* Profile Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  {person.profileImage ? (
                    <img
                      src={person.profileImage}
                      alt={person.name}
                      className="w-14 h-14 rounded-xl object-cover ring-2 ring-border"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl primary-gradient flex items-center justify-center">
                      <span className="text-lg font-bold text-inverse">
                        {getInitials(person.name)}
                      </span>
                    </div>
                  )}
                  {isCurrentEmployee && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-info border-2 border-card flex items-center justify-center">
                      <span className="text-[8px]">💼</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-secondary text-lg truncate">
                    {person.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Briefcase className="w-3.5 h-3.5 text-muted flex-shrink-0" />
                    <p className="text-sm text-primary truncate">
                      {person.currentCompany || "Professional"}
                    </p>
                  </div>
                  {person.jobRoles?.[0] && (
                    <p className="text-xs text-muted mt-1 truncate">
                      {person.jobRoles[0]}
                    </p>
                  )}
                  {isCurrentEmployee && (
                    <span className="badge badge-info inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full border border-info/20 text-[8px]">
                      <span className="w-1 h-1 rounded-full bg-info animate-pulse" />
                      Current Employee
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-2 mb-4">
                {person.totalYearsOfExperience && (
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <Clock className="w-3.5 h-3.5 text-muted" />
                    <span>{person.totalYearsOfExperience} experience</span>
                  </div>
                )}
                {person.college && (
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <GraduationCap className="w-3.5 h-3.5 text-muted" />
                    <span className="truncate">{person.college}</span>
                  </div>
                )}
                {person.email && (
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <Mail className="w-3.5 h-3.5 text-muted" />
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
                      className="badge px-2.5 py-1 text-xs rounded-lg bg-background-soft text-primary border border-theme"
                    >
                      {role}
                    </span>
                  ))}
                  {person.jobRoles.length > 3 && (
                    <span className="badge px-2.5 py-1 text-xs rounded-lg bg-background-soft text-muted border border-theme">
                      +{person.jobRoles.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-divider">
                <button
                  onClick={() => onViewProfile(person)}
                  className="btn-secondary flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-theme text-sm font-medium text-primary hover:bg-card-hover hover:text-secondary hover:border-strong transition-all"
                >
                  View Profile
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onAskReferral(careerPageUrl, person.userId)}
                  className="btn-primary flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-sm font-semibold text-inverse hover:bg-primary-hover transition-all"
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