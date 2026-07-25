"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserPlus } from "lucide-react";

export default function JobTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const { role } = useAuth();

  const handleAskForReferral = () => {
    if (!role) return;
    router.push(`/${role}/referral-jobs`);
  };

  // Helper function to check if a tab is active
  const isTabActive = (path: string) => {
    return pathname.includes(path);
  };

  return (
    <div className="mx-4 mb-4 mt-4 flex flex-col gap-3 border-b border-[var(--border)] sm:flex-row sm:items-center sm:justify-between sm:px-4">
      {/* Left Tabs */}
      <div className="flex gap-6 overflow-x-auto sm:gap-8">
        <Link
          href={`/${role}/jobs/offcampus`}
          className={`whitespace-nowrap pb-2 text-sm font-medium transition-colors ${
            isTabActive("offcampus")
              ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          Off-campus
        </Link>

        <Link
          href={`/${role}/jobs/referral-jobs`}
          className={`whitespace-nowrap pb-2 text-sm font-medium transition-colors ${
            isTabActive("referral-jobs")
              ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          Referral
        </Link>

        <Link
          href={`/${role}/jobs/internships`}
          className={`whitespace-nowrap pb-2 text-sm font-medium transition-colors ${
            isTabActive("internships")
              ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          Internship
        </Link>
      </div>

      {/* Right Button */}
      <button
        onClick={handleAskForReferral}
        className="btn-secondary inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 sm:mb-1"
      >
        <UserPlus className="h-3.5 w-3.5" />
        <span>Ask for Referral</span>
      </button>
    </div>
  );
}