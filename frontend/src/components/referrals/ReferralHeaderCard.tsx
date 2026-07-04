"use client";

import { X, Search, Send, PlusCircle, Loader2, RefreshCw, LinkIcon,UserPlus } from "lucide-react";
import { useState } from "react";
import axios from "axios";

type Job = {
  _id?: string;
  title?: string;
  companyName?: string;
  companySlug?: string;
  companyNormalized?: string;
  location?: string;
  workMode?: string;
  department?: string;
  matchScore?: number;
  alumniCount?: number;
  jobUrl?: string;
  applyUrl?: string;
  requiredSkills?: string[];
  matchedSkills?: string[];
  missingSkills?: string[];
  experienceRequired?: string;
  description?: string;
  jdSnippet?: string;
  atsSource?: string;
  jobId?: string;
};

type ReferralHeaderCardProps = {
  token: string | null;
  onJobsFound?: (jobs: Job[]) => void;
  onPostReferralClick?: () => void;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function ReferralHeaderCard({
  token,
  onJobsFound,
  onPostReferralClick,
}: ReferralHeaderCardProps) {
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [companyCareerPageUrl, setCompanyCareerPageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);

  const [error, setError] = useState("");
  const [cacheMessage, setCacheMessage] = useState("");

  const openAskModal = () => {
    setError("");
    setCacheMessage("");
    setIsAskModalOpen(true);
  };

  const closeAskModal = () => {
    if (loading || refreshLoading) return;

    setIsAskModalOpen(false);
    setCompanyName("");
    setCompanyCareerPageUrl("");
    setError("");
    setCacheMessage("");
  };

  const discoverJobs = async (forceRefresh: boolean) => {
    try {
      setError("");
      setCacheMessage("");

      const trimmedCompanyName = companyName.trim();

      if (!trimmedCompanyName) {
        setError("Please enter company name.");
        return;
      }

      if (!token) {
        setError("Login token not found. Please login again.");
        return;
      }

      if (forceRefresh) {
        setRefreshLoading(true);
      } else {
        setLoading(true);
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/company-jobs/discover`,
        {
          companyName: trimmedCompanyName,
          
          // companyCareerPageUrl is only UI for now.
          // Backend functionality can be added later.
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const foundJobs: Job[] = response.data?.jobs || [];

      if (response.data?.fromCache) {
        setCacheMessage("Showing cached jobs. Click Refresh Jobs to fetch latest jobs.");
      }

      onJobsFound?.(foundJobs);

      setIsAskModalOpen(false);
      setCompanyName("");
      setCompanyCareerPageUrl("");
    } catch (err: any) {
      console.error("Discover jobs error:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to discover jobs. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshLoading(false);
    }
  };

  return (
    <>
      <div className="glass-card relative overflow-hidden rounded-[var(--radius-xl)] p-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="pr-0 md:pr-72">
            <p className="text-sm font-semibold text-[var(--primary)]">
              Referral Network
            </p>

            <h1 className="mt-2 text-2xl font-bold text-[var(--text-secondary)]">
              Find referrals from alumni and employees
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-primary)]">
              Search a company, discover matching jobs from the official career
              page, and request referrals for the best matched roles.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 md:absolute md:right-5 md:top-5">
            <button
              type="button"
              onClick={onPostReferralClick}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[rgba(148,163,184,0.08)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--card-hover)]"
            >
              <PlusCircle size={16} />
              Post Referral
            </button>


            <button
             onClick={openAskModal}
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-transparent px-4 py-2.5 font-medium text-white transition-all duration-200 hover:border-white hover:bg-white/10"
          >
            <UserPlus className="h-5 w-5" />
            <span>Ask for Referral</span>
          </button>

           
          </div>
        </div>
      </div>

      {isAskModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--card)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-secondary)]">
                  Ask For Referral
                </h2>
                <p className="mt-1 text-xs text-[var(--text-primary)]">
                  Enter company name to discover referral jobs.
                </p>
              </div>

              <button
                type="button"
                onClick={closeAskModal}
                className="rounded-lg p-2 text-[var(--text-primary)] transition hover:bg-[var(--card-hover)] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--text-secondary)]">
                  Company Name
                </label>

                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                  />

                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Example: Razorpay Private Limited"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background-soft)] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]"
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-[var(--text-primary)]">
                  Suggestion: write full company name if you know it, like{" "}
                  <span className="font-semibold text-[var(--text-secondary)]">
                    Razorpay Private Limited
                  </span>
                  . Short names like{" "}
                  <span className="font-semibold text-[var(--text-secondary)]">
                    Razorpay
                  </span>{" "}
                  can also work.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--text-secondary)]">
                  Company Career Page URL
                  <span className="ml-1 text-xs font-normal text-[var(--text-muted)]">
                    optional
                  </span>
                </label>

                <div className="relative">
                  <LinkIcon
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                  />

                  <input
                    type="url"
                    value={companyCareerPageUrl}
                    onChange={(e) => setCompanyCareerPageUrl(e.target.value)}
                    placeholder="Example: https://careers.airbnb.com/jobs"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background-soft)] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]"
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-[var(--text-primary)]">
                  Paste company career page URL here. Functionality for this URL
                  will be added later.
                </p>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {cacheMessage && (
                <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
                  {cacheMessage}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeAskModal}
                  disabled={loading || refreshLoading}
                  className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--card-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => discoverJobs(true)}
                  disabled={loading || refreshLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(49,170,64,0.35)] bg-[var(--primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--primary)] transition hover:bg-[rgba(34,197,94,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {refreshLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={16} />
                      Refresh Jobs
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => discoverJobs(false)}
                  disabled={loading || refreshLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      Search Jobs
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}