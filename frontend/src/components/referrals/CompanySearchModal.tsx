// components/referrals/CompanySearchModal.tsx
import React, { useState } from 'react';
import { X, Search, Building2, Loader2 } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { Job } from '@/types/referrals';

interface CompanySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
  onJobsFound: (jobs: Job[], companyName: string, companySlug: string) => void; // Added companySlug
}

export const CompanySearchModal: React.FC<CompanySearchModalProps> = ({
  isOpen,
  onClose,
  token,
  onJobsFound,
}) => {
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const searchByCompany = async () => {
    const companyname = companyName.trim();
    
    if (!companyname) {
      setError("Please enter a company name.");
      return;
    }
    
    if (!token) {
      setError("Login token not found. Please login again.");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      // First, discover and store jobs (POST request)
      const discoverResponse = await axiosInstance.post('/api/company-jobs/discover', {
        companyName: companyname,
      });
      
      const companySlug = discoverResponse.data?.companySlug || companyname.toLowerCase().replace(/\s+/g, '-');
      
      // Then, fetch the stored jobs (GET request)
      const getResponse = await axiosInstance.get(`/api/company-jobs/discovered/${companySlug}`);
      const foundJobs: Job[] = getResponse.data?.jobs || [];
      
      onJobsFound(foundJobs, companyname, companySlug);
      onClose();
      setCompanyName("");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to discover jobs. Please try again."
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
              Ask For Referral
            </h2>
            <p className="mt-1 text-xs text-[var(--text-primary)]">
              Enter a company name to discover matching jobs.
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
              Company Name
            </label>
            <div className="relative">
              <Building2
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchByCompany()}
                placeholder="Example: Airbnb, Razorpay, Google"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background-soft)] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]"
                autoFocus
              />
            </div>
            <p className="mt-2 text-xs leading-5 text-[var(--text-primary)]">
              Enter company name like{" "}
              <span className="font-semibold text-[var(--text-secondary)]">
                Airbnb
              </span>
              ,{" "}
              <span className="font-semibold text-[var(--text-secondary)]">
                Google
              </span>
              , or{" "}
              <span className="font-semibold text-[var(--text-secondary)]">
                Microsoft
              </span>
            </p>
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
              onClick={searchByCompany}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Discovering Jobs...
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
  );
};