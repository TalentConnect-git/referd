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
    <div className="mx-4 mt-4 rounded-2xl border border-[#1e293b] bg-[#0f172a] ">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">
            Get started
          </p>
          <h3 className="mt-1 text-[16px] font-semibold text-white">
            {heading}
          </h3>
        </div>
        <Link
          href={`/${userType}/referral-jobs`}
          className="inline-flex h-9 items-center rounded-full bg-[var(--primary)] px-4 text-[12px] font-semibold text-black transition hover:bg-[var(--primary-dark)]"
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
              className="group relative overflow-hidden rounded-xl border border-[#1e293b] bg-[#111827] p-4 transition hover:border-[var(--primary)]/70 hover:bg-[#142018]"
            >
              <span className="absolute right-3 top-2 select-none font-mono text-[42px] font-bold leading-none text-white opacity-[0.04]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
                <Icon className="h-4 w-4" />
              </div>
              <h4 className="relative z-10 mt-3 text-[14px] font-semibold text-white">
                {step.title}
              </h4>
              <p className="relative z-10 mt-1 text-[12px] leading-5 text-gray-400">
                {step.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
