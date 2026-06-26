// components/AskReferralModal.tsx
"use client";

import React, { useState } from "react";
import {
  X,
  LinkIcon,
  Loader2,
  Search,
  AlertCircle,
  Briefcase,
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
    careerPageUrl: string
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
        {
          careerPageUrl: normalizedUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
        setError(response.data.message || "Failed to find alumni.");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to find alumni. Please try again with a valid job URL."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg">
        <div className="glass-card rounded-[var(--radius-xl)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border)]">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-black" />
                  </div>

                  <h2 className="text-xl font-bold text-[var(--text-secondary)]">
                    Find Alumni for Job
                  </h2>
                </div>

                <p className="text-sm text-[var(--text-primary)]">
                  Paste any direct job posting URL. Backend will validate it and
                  extract the company name.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-xl p-2 text-[var(--text-primary)] hover:text-[var(--text-secondary)] hover:bg-[var(--card-hover)] transition-all disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Job Posting URL <span className="text-red-400">*</span>
              </label>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                  <LinkIcon size={18} />
                </div>

                <input
                  type="url"
                  value={careerPageUrl}
                  onChange={(e) => {
                    setCareerPageUrl(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loading) {
                      searchByUrl();
                    }
                  }}
                  placeholder="https://www.linkedin.com/jobs/view/12345"
                  className="w-full rounded-xl bg-[var(--background-soft)] border border-[var(--border)] pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-[var(--text-muted)] outline-none transition-all focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>

              <div className="mt-2 space-y-1">
                <p className="text-xs text-[var(--text-muted)]">
                  Examples: LinkedIn, Naukri, Unstop, Indeed, Wellfound,
                  Greenhouse, Lever, Workday, Ashby, etc.
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Company homepages like www.zomato.com will be rejected by the
                  backend.
                </p>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300 whitespace-pre-line">
                    {error}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
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
                className="flex-1 rounded-xl bg-[var(--primary)] px-4 py-3.5 text-sm font-semibold text-black hover:bg-[var(--primary-dark)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};