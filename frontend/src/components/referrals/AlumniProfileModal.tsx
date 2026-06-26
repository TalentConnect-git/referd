// components/referrals/AlumniProfileModal.tsx
"use client";

import {
  Briefcase,
  GraduationCap,
  Mail,
  Globe,
  Calendar,
  UserPlus,
  Loader2,
  X,
  Clock,
  Phone,
  Award,
  ChevronRight,
  Building2,
  ExternalLink,
} from "lucide-react";
import { AlumniProfile } from "@/types/referrals";

interface AlumniProfileModalProps {
  alumni: AlumniProfile;
  onClose: () => void;
  onRequestReferral: () => void;
  requestLoading: boolean;
}

export function AlumniProfileModal({
  alumni,
  onClose,
  onRequestReferral,
  requestLoading,
}: AlumniProfileModalProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!alumni) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-[var(--radius-xl)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-[var(--background-soft)] border border-[var(--border)] text-[var(--text-primary)] hover:text-[var(--text-secondary)] hover:bg-[var(--card-hover)] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-[var(--border)]">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {alumni.profileImage ? (
                <img
                  src={alumni.profileImage}
                  alt={alumni.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[var(--border)]"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl primary-gradient flex items-center justify-center">
                  <span className="text-2xl font-bold text-black">
                    {getInitials(alumni.name)}
                  </span>
                </div>
              )}
              {alumni.isCurrentEmployee && (
                <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md bg-[var(--primary)] border-2 border-[var(--card)]">
                  <span className="text-[10px] font-bold text-black">ACTIVE</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-secondary)]">
                {alumni.name}
              </h2>
              
              <div className="flex items-center gap-2 mt-1.5">
                <Building2 className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
                <p className="text-[var(--text-primary)] font-medium truncate">
                  {alumni.currentCompany || "Professional"}
                </p>
              </div>
              
              {alumni.jobRoles?.[0] && (
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  {alumni.jobRoles[0]}
                </p>
              )}
              
              {/* Stats Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {alumni.totalYearsOfExperience && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary-soft)] border border-[var(--primary)]/10">
                    <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span className="text-xs font-medium text-[var(--primary)]">
                      {alumni.totalYearsOfExperience} Experience
                    </span>
                  </div>
                )}
                
                {alumni.college && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--background-soft)] border border-[var(--border)]">
                    <GraduationCap className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span className="text-xs font-medium text-[var(--text-primary)] truncate max-w-[150px]">
                      {alumni.college}
                    </span>
                  </div>
                )}
                
                {alumni.isAlumni && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--background-soft)] border border-[var(--border)]">
                    <Award className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span className="text-xs font-medium text-[var(--text-primary)]">Alumni</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-1.5 mt-4">
                {alumni.linkedin && (
                  <a
                    href={alumni.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[var(--background-soft)] border border-[var(--border)] text-[var(--text-primary)] hover:text-[var(--text-secondary)] hover:border-[var(--border-strong)] transition-all"
                    title="LinkedIn Profile"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                )}
                {alumni.github && (
                  <a
                    href={alumni.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[var(--background-soft)] border border-[var(--border)] text-[var(--text-primary)] hover:text-[var(--text-secondary)] hover:border-[var(--border-strong)] transition-all"
                    title="GitHub Profile"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                )}
                {alumni.portfolio && (
                  <a
                    href={alumni.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[var(--background-soft)] border border-[var(--border)] text-[var(--text-primary)] hover:text-[var(--text-secondary)] hover:border-[var(--border-strong)] transition-all"
                    title="Portfolio"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                {alumni.email && (
                  <a
                    href={`mailto:${alumni.email}`}
                    className="p-2 rounded-lg bg-[var(--background-soft)] border border-[var(--border)] text-[var(--text-primary)] hover:text-[var(--text-secondary)] hover:border-[var(--border-strong)] transition-all"
                    title="Send Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* About */}
          {alumni.about && (
            <div>
              <h3 className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-[var(--primary)]" />
                About
              </h3>
              <div className="p-4 rounded-xl bg-[var(--background-soft)] border border-[var(--border)]">
                <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                  {alumni.about}
                </p>
              </div>
            </div>
          )}

          {/* Experience */}
          {alumni.experiences && alumni.experiences.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-[var(--primary)]" />
                Work Experience
              </h3>
              <div className="space-y-2.5">
                {alumni.experiences.map((exp, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-[var(--background-soft)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[var(--text-secondary)] text-sm">
                          {exp.role}
                        </h4>
                        <p className="text-sm text-[var(--text-primary)] mt-0.5">
                          {exp.company}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 justify-end">
                          <Calendar className="w-3 h-3" />
                          <span>{exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}</span>
                        </p>
                        {exp.isCurrent && (
                          <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-medium rounded-md bg-[var(--primary-soft)] text-[var(--primary)] border border-[var(--primary)]/20">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                    {exp.description && (
                      <p className="mt-3 text-xs text-[var(--text-muted)] leading-relaxed border-t border-[var(--border)] pt-3">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {alumni.educations && alumni.educations.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-[var(--primary)]" />
                Education
              </h3>
              <div className="space-y-2.5">
                {alumni.educations.map((edu, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-[var(--background-soft)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[var(--text-secondary)] text-sm">
                          {edu.college}
                        </h4>
                        <p className="text-sm text-[var(--text-primary)] mt-0.5">
                          {edu.degree}{edu.specialization ? ` in ${edu.specialization}` : ''}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-[var(--text-muted)]">
                          Graduated {edu.yearOfGraduation}
                        </p>
                        {edu.cgpa && (
                          <p className="text-xs text-[var(--primary)] font-medium mt-1">
                            CGPA: {edu.cgpa}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {alumni.jobRoles && alumni.jobRoles.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-[var(--primary)]" />
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {alumni.jobRoles.map((role, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] border border-[var(--primary)]/10 hover:border-[var(--primary)]/30 transition-all"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          {(alumni.email || alumni.phone) && (
            <div>
              <h3 className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-[var(--primary)]" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {alumni.email && (
                  <a
                    href={`mailto:${alumni.email}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background-soft)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[var(--primary-soft)] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-[var(--primary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Email</p>
                      <p className="text-sm text-[var(--text-primary)] truncate group-hover:text-[var(--text-secondary)] transition-colors">
                        {alumni.email}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                  </a>
                )}
                {alumni.phone && (
                  <a
                    href={`tel:${alumni.phone}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background-soft)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[var(--primary-soft)] flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-[var(--primary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Phone</p>
                      <p className="text-sm text-[var(--text-primary)] truncate group-hover:text-[var(--text-secondary)] transition-colors">
                        {alumni.phone}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 sm:p-8 border-t border-[var(--border)]">
          <button
            onClick={onRequestReferral}
            disabled={requestLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--primary)] text-black font-semibold hover:bg-[var(--primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {requestLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending Request...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Request Referral from {alumni.name}
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};