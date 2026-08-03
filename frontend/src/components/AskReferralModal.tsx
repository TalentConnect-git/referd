"use client";

import React, { useState } from "react";
import {
  X,
  Loader2,
  Search,
  AlertCircle,
  Building2,
  ExternalLink,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { AlumniProfile } from "@/types/referrals";

interface AskReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
  onAlumniFound: (
    alumni: AlumniProfile[],
    companyName: string,
    careerPageUrl: string,
    alumniFound: boolean,
    totalAlumniFound: number,
  ) => void;
}

export const AskReferralModal: React.FC<AskReferralModalProps> = ({
  isOpen,
  onClose,
  token,
  onAlumniFound,
}) => {
  const [careerPageUrl, setCareerPageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const normalizeInputUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return "";
    if (!/^https?:\/\//i.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  const searchByUrl = async () => {
    const normalizedUrl = normalizeInputUrl(careerPageUrl);

    if (!normalizedUrl) {
      setError("Please enter a job posting URL.");
      return;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      setError("Please enter a valid URL.");
      return;
    }

    if (!token) {
      setError("Please log in to search for referrals.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.post(
        "/api/company-jobs/career-page-referral",
        { careerPageUrl: normalizedUrl },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        const alumniData = response.data.data?.alumni || [];
        const companyName = response.data.data?.companyName || "Company";
        const returnedUrl =
          response.data.data?.careerPageUrl ||
          response.data.data?.userJobUrl ||
          normalizedUrl;
        
        const alumniFound = Boolean(response.data.data?.alumniFound);
        const totalAlumniFound =
          Number(response.data.data?.totalAlumniFound) || alumniData.length;

        onAlumniFound(
          alumniData,
          companyName,
          returnedUrl,
          alumniFound,
          totalAlumniFound,
        );
        setCareerPageUrl("");
        setError("");
        onClose();
      } else {
        const errorMessage = response.data.message || "Failed to find alumni. Please try again.";
        setError(errorMessage);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to find alumni. Please try again with a valid job URL.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--overlay)] p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl">
        <div className="glass-card rounded-[var(--radius-xl)] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="border-b border-[var(--border)] bg-[var(--background-soft)]/50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <div className="primary-gradient flex h-10 w-10 items-center justify-center rounded-xl shadow-lg">
                    <Building2 className="h-5 w-5 text-black" />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">
                    Find Alumni for Referrals
                  </h2>
                </div>
                <p className="max-w-md text-sm text-[var(--text-secondary)]">
                  Paste the URL of a job posting to discover alumni working at
                  that company. They can refer you and boost your chances of
                  landing an interview.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-xl p-2 text-[var(--text-muted)] transition-all hover:bg-[var(--card-hover)] hover:text-[var(--text-secondary)] disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-6 p-6">
            {/* Input */}
            <div>
              <label
                htmlFor="job-url"
                className="mb-2 block text-sm font-semibold text-[var(--text-secondary)]"
              >
                Job Posting URL <span className="text-[var(--danger)]">*</span>
              </label>
              <div className="relative">
                <input
                  id="job-url"
                  type="url"
                  value={careerPageUrl}
                  onChange={(e) => {
                    setCareerPageUrl(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loading) searchByUrl();
                  }}
                  placeholder="https://www.linkedin.com/jobs/view/1234567890"
                  className="input-field w-full rounded-xl px-4 py-3.5 text-sm placeholder:text-[var(--input-placeholder)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--focus-ring)]"
                  autoFocus
                />
              </div>

              {/* Examples & tips */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                <span className="font-medium text-[var(--text-secondary)]">
                  Supported:
                </span>
                <span className="badge">LinkedIn</span>
                <span className="badge">Naukri</span>
                <span className="badge">Unstop</span>
                <span className="badge">Indeed</span>
                <span className="badge">Wellfound</span>
                <span className="badge">Greenhouse</span>
                <span className="badge">Lever</span>
                <span className="badge">Workday</span>
                <span className="badge">Ashby</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200 rounded-xl border border-[var(--danger-border)] bg-[var(--danger-soft)] p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--danger)]" />
                  <p className="whitespace-pre-line text-sm text-[var(--danger)]">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm font-medium text-[var(--text-secondary)] transition-all hover:bg-[var(--background)] hover:text-[var(--text-secondary)] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={searchByUrl}
                disabled={loading}
                className="btn-primary flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold shadow-lg transition-all hover:shadow-xl active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Find Alumni
                    <ExternalLink size={14} className="opacity-70" />
                  </>
                )}
              </button>
            </div>

            {/* Footer note */}
            <div className="border-t border-[var(--border)] pt-2">
              <p className="text-center text-xs text-[var(--text-muted)]">
                💡 We'll match the URL to the company and show you alumni who
                can refer you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};