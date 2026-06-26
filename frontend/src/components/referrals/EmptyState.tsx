// components/referrals/EmptyState.tsx
"use client";

import { Briefcase, Search, LinkIcon, Users } from "lucide-react";
import { TabType } from "./Tabs";

interface EmptyStateProps {
  activeTab: TabType;
  onTryAgain: () => void;
  onTryCompany: () => void;
  lastSearchedCompany?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  activeTab,
  onTryAgain,
  onTryCompany,
  lastSearchedCompany,
}) => {
  if (activeTab === "all-jobs") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-3xl bg-[var(--background-soft)] border border-[var(--border)] flex items-center justify-center">
            <Briefcase className="w-12 h-12 text-[var(--text-muted)]" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[var(--primary-soft)] border border-[var(--primary)]/30 flex items-center justify-center">
            <Search className="w-4 h-4 text-[var(--primary)]" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-[var(--text-secondary)] mb-2">
          No Referral Jobs Yet
        </h3>
        
        <p className="text-[var(--text-primary)] text-center max-w-md mb-2">
          You haven't found any referral jobs yet. Search for a company to discover job opportunities.
        </p>
        
        <p className="text-[var(--text-muted)] text-sm text-center max-w-md mb-8">
          Find alumni at your target companies who can refer you for open positions.
        </p>

        <button
          onClick={onTryAgain}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-black font-semibold hover:bg-[var(--primary-dark)] transition-all"
        >
          <Search className="w-5 h-5" />
          Search for Jobs
        </button>
      </div>
    );
  }

  // Alumni Results Empty State
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl bg-[var(--background-soft)] border border-[var(--border)] flex items-center justify-center">
          <Users className="w-12 h-12 text-[var(--text-muted)]" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[var(--primary-soft)] border border-[var(--primary)]/30 flex items-center justify-center">
          <LinkIcon className="w-4 h-4 text-[var(--primary)]" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-[var(--text-secondary)] mb-2">
        No Alumni Found Yet
      </h3>
      
      <p className="text-[var(--text-primary)] text-center max-w-md mb-2">
        {lastSearchedCompany 
          ? `No alumni found for "${lastSearchedCompany}". Try a different company.`
          : "Search for alumni by pasting a career page URL to find people who can refer you."}
      </p>
      
      <p className="text-[var(--text-muted)] text-sm text-center max-w-md mb-8">
        Paste a URL like careers.company.com or jobs.lever.co/company to find alumni.
      </p>

      <button
        onClick={onTryAgain}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-black font-semibold hover:bg-[var(--primary-dark)] transition-all"
      >
        <LinkIcon className="w-5 h-5" />
        Search by URL
      </button>
    </div>
  );
};