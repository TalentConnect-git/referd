"use client";

import { ApplicationDetailExperienceProps } from "@/types/applications";
import { Briefcase, Calendar, Building2 } from "lucide-react";

export default function ApplicationDetailExperience({
  experiences,
}: ApplicationDetailExperienceProps) {
  return (
    <div className="surface-card rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-lg backdrop-blur-sm">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--text-primary)]">
        <span className="h-6 w-1 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)]"></span>
        Experience
      </h2>

      {experiences?.length ? (    
        <div className="space-y-4">
          {experiences.map((experience: any, index: number) => (
            <div
              key={index}
              className="surface-card group rounded-xl border border-[var(--border)] bg-[var(--background-soft)] p-4 transition-all hover:border-[var(--primary-border)] hover:scale-[1.01]"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)]">
                    <Briefcase className="h-4 w-4 text-[var(--text-muted)]" />
                    {experience?.role || "N/A"}
                  </h3>

                  <p className="flex items-center gap-1.5 text-sm font-medium text-[var(--info)]">
                    <Building2 className="h-3.5 w-3.5" />
                    {experience?.company_display ||
                      experience?.company ||
                      "N/A"}
                  </p>
                </div>

                {experience?.isCurrent && (
                  <span className="badge badge-success flex-shrink-0 ml-2 rounded-full border border-[var(--success-border)] bg-[var(--success-soft)] px-2.5 py-0.5 text-xs font-medium text-[var(--success)]">
                    Current
                  </span>
                )}
              </div>

              <p className="mt-2 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                <Calendar className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                {experience?.startDate
                  ? new Date(
                      experience.startDate
                    ).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
                <span className="mx-1 text-[var(--text-muted)]">•</span>
                {experience?.isCurrent
                  ? "Present"
                  : experience?.endDate
                  ? new Date(
                      experience.endDate
                    ).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>

              {experience?.description && (
                <p className="mt-2 line-clamp-2 text-sm text-[var(--text-secondary)] leading-relaxed transition-all group-hover:line-clamp-none">
                  {experience.description}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="py-4 text-center text-sm text-[var(--text-muted)]">
          No experience added
        </p>
      )}
    </div>
  );
}