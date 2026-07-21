// components/AskReferralModal.tsx
"use client";

import React, { useState } from "react";
import {
  X,
  LinkIcon,
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

        onAlumniFound(alumniData, companyName, returnedUrl);
        setCareerPageUrl("");
        setError("");
        onClose();
      } else {
        const errorMessage = `No alumni or current employee found for ${response.data.data.companyName}`;

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl">
        <div className="glass-card rounded-[var(--radius-xl)] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-6 border-b border-[var(--border)] bg-[var(--background-soft)]/50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center shadow-lg">
                    <Building2 className="w-5 h-5 text-black" />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-secondary)]">
                    Find Alumni for Referrals
                  </h2>
                </div>
                <p className="text-sm text-[var(--text-primary)] max-w-md">
                  Paste the URL of a job posting to discover alumni working at
                  that company. They can refer you and boost your chances of
                  landing an interview.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-xl p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--card-hover)] transition-all disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Input */}
            <div>
              <label
                htmlFor="job-url"
                className="block text-sm font-semibold text-[var(--text-secondary)] mb-2"
              >
                Job Posting URL <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                  <LinkIcon size={18} />
                </div>
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
                  className="w-full rounded-xl bg-[var(--background-soft)] border border-[var(--border)] pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-[var(--text-muted)] outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                  autoFocus
                />
              </div>

              {/* Examples & tips */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                <span className="font-medium text-[var(--text-primary)]">
                  Supported:
                </span>
                <span className="px-2 py-1 rounded-md bg-[var(--background-soft)] border border-[var(--border)]">
                  LinkedIn
                </span>
                <span className="px-2 py-1 rounded-md bg-[var(--background-soft)] border border-[var(--border)]">
                  Naukri
                </span>
                <span className="px-2 py-1 rounded-md bg-[var(--background-soft)] border border-[var(--border)]">
                  Unstop
                </span>
                <span className="px-2 py-1 rounded-md bg-[var(--background-soft)] border border-[var(--border)]">
                  Indeed
                </span>
                <span className="px-2 py-1 rounded-md bg-[var(--background-soft)] border border-[var(--border)]">
                  Wellfound
                </span>
                <span className="px-2 py-1 rounded-md bg-[var(--background-soft)] border border-[var(--border)]">
                  Greenhouse
                </span>
                <span className="px-2 py-1 rounded-md bg-[var(--background-soft)] border border-[var(--border)]">
                  Lever
                </span>
                <span className="px-2 py-1 rounded-md bg-[var(--background-soft)] border border-[var(--border)]">
                  Workday
                </span>
                <span className="px-2 py-1 rounded-md bg-[var(--background-soft)] border border-[var(--border)]">
                  Ashby
                </span>
                <span className="px-2 py-1 rounded-md bg-[var(--background-soft)] border border-[var(--border)]"></span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300 whitespace-pre-line">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 rounded-xl border border-[var(--border)] px-4 py-3.5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--card-hover)] hover:text-[var(--text-secondary)] transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={searchByUrl}
                disabled={loading}
                className="flex-1 rounded-xl bg-[var(--primary)] px-4 py-3.5 text-sm font-semibold text-black hover:bg-[var(--primary-dark)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
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
            <div className="pt-2 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--text-muted)] text-center">
                💡 We’ll match the URL to the company and show you alumni who
                can refer you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
