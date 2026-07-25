"use client";

import Link from "next/link";
import { Briefcase, Send, UserCheck } from "lucide-react";

type EmptyStateStepperProps = {
  count: number;
  userType: string;
  variant?: "applications" | "savedJobs";
};

const steps = [
  {
    title: "Browse referral jobs",
    description: "Start with roles where alumni can help you get noticed.",
    href: "referral-jobs",
    icon: Briefcase,
  },
  {
    title: "Find alumni",
    description: "Shortlist people from your college or target companies.",
    href: "alumani-network",
    icon: UserCheck,
  },
  {
    title: "Request a referral",
    description: "Send a focused request and track it from your dashboard.",
    href: "applications",
    icon: Send,
  },
];

export default function EmptyStateStepper({
  count,
  userType,
  variant = "applications",
}: EmptyStateStepperProps) {
  if (count > 0) return null;

  const heading =
    variant === "savedJobs"
      ? "Build your saved jobs list"
      : "Start your first referral";

  return (
    <div className="surface-card mx-4 mt-4 rounded-2xl p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">
            Get started
          </p>
          <h3 className="mt-1 text-base font-semibold text-[var(--text-primary)]">
            {heading}
          </h3>
        </div>
        <Link
          href={`/${userType}/referral-jobs`}
          className="btn-primary inline-flex h-9 items-center rounded-full px-4 text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Browse jobs
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <Link
              key={step.title}
              href={`/${userType}/${step.href}`}
              className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all duration-200 hover:border-[var(--primary-border)] hover:bg-[var(--card-hover)] hover:shadow-sm"
            >
              {/* Background number */}
              <span className="absolute right-3 top-2 select-none font-mono text-[42px] font-bold leading-none text-[var(--text-primary)] opacity-[0.04]">
                {String(index + 1).padStart(2, "0")}
              </span>
              
              <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] transition-transform duration-200 group-hover:scale-110">
                <Icon className="h-4 w-4" />
              </div>
              
              <h4 className="relative z-10 mt-3 text-sm font-semibold text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--primary)]">
                {step.title}
              </h4>
              
              <p className="relative z-10 mt-1 text-xs leading-5 text-[var(--text-secondary)]">
                {step.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}