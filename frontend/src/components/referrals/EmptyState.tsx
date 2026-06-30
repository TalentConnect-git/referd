// components/referrals/EmptyState.tsx
"use client";

import { Users, LinkIcon, Search, ArrowRight } from "lucide-react";

interface EmptyStateProps {
  /** Called when the user wants to try a new search (e.g., pasting another URL) */
  onTryAgain: () => void;
  /** Called when the user wants to search for a different company (optional) */
  onTryCompany?: () => void;
  /** The name of the company that was searched (optional) */
  lastSearchedCompany?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onTryAgain,
  onTryCompany,
  lastSearchedCompany,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 relative">
      {/* Decorative background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 h-80 rounded-full bg-[var(--primary)]/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-2xl">
        {/* Icon with badge */}
        <div className="relative mb-8">
          <div className="w-28 h-28 rounded-3xl bg-[var(--background-soft)] border border-[var(--border)] flex items-center justify-center shadow-lg">
            <Users className="w-14 h-14 text-[var(--text-muted)]" />
          </div>
          <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-[var(--primary-soft)] border-2 border-[var(--primary)]/30 flex items-center justify-center">
            <LinkIcon className="w-5 h-5 text-[var(--primary)]" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-[var(--text-secondary)] mb-3 text-center">
          {lastSearchedCompany ? (
            <>
              No Alumni Found for{" "}
              <span className="text-[var(--primary)]">“{lastSearchedCompany}”</span>
            </>
          ) : (
            "Discover Alumni at Your Target Companies"
          )}
        </h3>

        <p className="text-[var(--text-primary)] text-center max-w-md mb-2 text-base">
          {lastSearchedCompany ? (
            "We couldn't find any alumni from this company. Try a different company or check the URL."
          ) : (
            "Paste a career page URL to find alumni who can refer you to open roles."
          )}
        </p>

        <p className="text-[var(--text-muted)] text-sm text-center max-w-md mb-8">
          {lastSearchedCompany ? (
            "Double‑check the company name or try a different job posting."
          ) : (
            "Supported URLs: LinkedIn, Naukri, Unstop, Indeed, Wellfound, Greenhouse, Lever, and more."
          )}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={onTryAgain}
            className="group inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl bg-[var(--primary)] text-black font-semibold hover:bg-[var(--primary-dark)] transition-all shadow-lg hover:shadow-xl"
          >
            <LinkIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
            {lastSearchedCompany ? "Try Another URL" : "Paste Job URL"}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {lastSearchedCompany && onTryCompany && (
            <button
              onClick={onTryCompany}
              className="group inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl border border-[var(--border)] text-[var(--text-primary)] font-medium hover:bg-[var(--card-hover)] hover:text-[var(--text-secondary)] transition-all"
            >
              <Search className="w-5 h-5" />
              Search for Another Company
            </button>
          )}
        </div>

        {/* Pro tip */}
        <div className="mt-8 p-4 rounded-xl bg-[var(--background-soft)] border border-[var(--border)] max-w-md">
          <p className="text-xs text-[var(--text-muted)] text-center">
            💡 <span className="font-medium text-[var(--text-primary)]">Pro tip:</span> Use a direct job posting URL from the company’s careers page for the most accurate results.
          </p>
        </div>
      </div>
    </div>
  );
};