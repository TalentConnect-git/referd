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
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

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
      <div className="card relative overflow-hidden rounded-xl p-5 border border-theme bg-card shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="pr-0 md:pr-72">
            <p className="text-sm font-semibold text-primary">
              Referral Network
            </p>

            <h1 className="mt-2 text-2xl font-bold text-secondary">
              Find referrals from alumni and employees
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-primary">
              Search a company, discover matching jobs from the official career
              page, and request referrals for the best matched roles.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 md:absolute md:right-5 md:top-5">
            <button
              type="button"
              onClick={onPostReferralClick}
              className="btn-secondary inline-flex items-center gap-2 rounded-xl border border-strong bg-background-soft/50 px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-card-hover"
            >
              <PlusCircle size={16} />
              Post Referral
            </button>


            <button
             onClick={openAskModal}
            className="btn-primary inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary-soft px-4 py-2.5 font-medium text-primary transition-all duration-200 hover:bg-primary-soft hover:border-primary/50"
          >
            <UserPlus className="h-5 w-5" />
            <span>Ask for Referral</span>
          </button>

           
          </div>
        </div>
      </div>

      {isAskModalOpen && (
        <div className="modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-overlay px-4 backdrop-blur-sm">
          <div className="modal-content w-full max-w-xl rounded-xl border border-theme bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-divider px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-secondary">
                  Ask For Referral
                </h2>
                <p className="mt-1 text-xs text-primary">
                  Enter company name to discover referral jobs.
                </p>
              </div>

              <button
                type="button"
                onClick={closeAskModal}
                className="btn-ghost rounded-lg p-2 text-primary transition hover:bg-card-hover hover:text-secondary"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              <div>
                <label className="form-label mb-2 block text-sm font-semibold">
                  Company Name
                </label>

                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Example: Razorpay Private Limited"
                    className="input-field w-full rounded-xl py-3 pl-10 pr-4 text-sm"
                  />
                </div>

                <p className="form-helper mt-2 text-xs leading-5">
                  Suggestion: write full company name if you know it, like{" "}
                  <span className="font-semibold text-secondary">
                    Razorpay Private Limited
                  </span>
                  . Short names like{" "}
                  <span className="font-semibold text-secondary">
                    Razorpay
                  </span>{" "}
                  can also work.
                </p>
              </div>

              <div>
                <label className="form-label mb-2 block text-sm font-semibold">
                  Company Career Page URL
                  <span className="ml-1 text-xs font-normal text-muted">
                    optional
                  </span>
                </label>

                <div className="relative">
                  <LinkIcon
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    type="url"
                    value={companyCareerPageUrl}
                    onChange={(e) => setCompanyCareerPageUrl(e.target.value)}
                    placeholder="Example: https://careers.airbnb.com/jobs"
                    className="input-field w-full rounded-xl py-3 pl-10 pr-4 text-sm"
                  />
                </div>

                <p className="form-helper mt-2 text-xs leading-5">
                  Paste company career page URL here. Functionality for this URL
                  will be added later.
                </p>
              </div>

              {error && (
                <div className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
                  {error}
                </div>
              )}

              {cacheMessage && (
                <div className="rounded-xl border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-warning">
                  {cacheMessage}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeAskModal}
                  disabled={loading || refreshLoading}
                  className="btn-secondary rounded-xl border border-theme px-4 py-2 text-sm font-semibold text-primary transition hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => discoverJobs(true)}
                  disabled={loading || refreshLoading}
                  className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl border border-primary/35 bg-primary-soft px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary-soft/80 disabled:cursor-not-allowed disabled:opacity-60"
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
                  className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-inverse transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
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