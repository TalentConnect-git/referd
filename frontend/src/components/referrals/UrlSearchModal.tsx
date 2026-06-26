// components/referrals/UrlSearchModal.tsx
"use client";

import React, { useState } from "react";
import { X, Search, LinkIcon, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

interface UrlSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAlumniFound: (careerPageUrl: string, companyName: string) => Promise<void>;
}

export const UrlSearchModal: React.FC<UrlSearchModalProps> = ({
  isOpen,
  onClose,
  onAlumniFound,
}) => {
  const [careerPageUrl, setCareerPageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const searchByUrl = async () => {
    const trimmedUrl = careerPageUrl.trim();

    if (!trimmedUrl) {
      setError("Please enter a career page URL.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      
      const response = await axiosInstance.post(
        "/api/company-jobs/career-page-referral",
        { careerPageUrl: trimmedUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const companyName = response.data.data.companyName || "Company";
        await onAlumniFound(trimmedUrl, companyName);
        setCareerPageUrl("");
        onClose();
      } else {
        setError(response.data.message || "Failed to find alumni");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to find alumni. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--card)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-secondary)]">
              Ask for Referral
            </h2>
            <p className="mt-1 text-xs text-[var(--text-primary)]">
              Paste a job or career page URL to find alumni.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--text-primary)] transition hover:bg-[var(--card-hover)] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--text-secondary)]">
              Career Page / Job URL
            </label>

            <div className="relative">
              <LinkIcon
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />

              <input
                type="url"
                value={careerPageUrl}
                onChange={(e) => {
                  setCareerPageUrl(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") searchByUrl();
                }}
                placeholder="Example: https://careers.zomato.com"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background-soft)] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--card-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={searchByUrl}
              disabled={loading}
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
                  Find Alumni
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};