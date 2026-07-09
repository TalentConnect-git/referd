"use client";

import { useEffect, useState } from "react";
import { getMyReferrals } from "@/services/referral.service";
import ReferralCard from "./ReferralCard";
import { ReferralJob } from "@/types/referral";
import ReferralHeader from "./ReferralHeader";
import ReferralPagination from "./ReferralPagination";
import ResumeReferral from "./ResumeReferral";
import ReferralDetails from "./ReferralDetails";
import { deleteReferral, pauseReferral, reactivateReferral } from "@/services/referral.service";
import toast from "react-hot-toast";
import { Loader2, Inbox, RefreshCw, BarChart3 } from "lucide-react";

export default function ReferralContainer() {
  const [referrals, setReferrals] = useState<ReferralJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isAskReferralOpen, setIsAskReferralOpen] = useState(false);
  const [meta, setMeta] = useState({
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [selectedReferral, setSelectedReferral] = useState<ReferralJob | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeReferralJob, setResumeReferralJob] = useState<ReferralJob | null>(null);

  const fetchReferrals = async () => {
    try {
      setLoading(true);

      const response = await getMyReferrals(page, 10);
      
      setReferrals(response.data || []);

      setMeta({
        totalPages: response.meta?.totalPages || 1,
        hasNext: response.meta?.hasNext || false,
        hasPrev: response.meta?.hasPrev || false,
      });
    } catch (error) {
      console.error("Error fetching referrals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, [page]);

  const handleDelete = async (jobId: string) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this referral?"
      );

      if (!confirmed) return;

      let result = await deleteReferral(jobId);
      if (result?.success) {
        toast.success("Referral deleted successfully");
      }
      fetchReferrals();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete referral");
    }
  };

  const handlePause = async (referral: ReferralJob) => {
    try {
      if (!referral.inactive) {
        await pauseReferral(referral._id);
        toast.success("Referral paused successfully");
      } else {
        setResumeReferralJob(referral);
        setShowResumeModal(true);
      }

      fetchReferrals();
    } catch (error) {
      console.error(error);
      toast.error("Operation failed");
    }
  };

  const handleResume = async (startDate: string, endDate: string) => {
    try {
      if (!resumeReferralJob) return;

      if (!startDate || !endDate) {
        toast.error("Please select start and end date");
        return;
      }

      const result = await reactivateReferral(
        resumeReferralJob._id,
        startDate,
        endDate
      );

      if (result) {
        toast.success("Referral reactivated successfully");
      }

      setShowResumeModal(false);
      setResumeReferralJob(null);

      fetchReferrals();
    } catch (error) {
      console.error(error);
      toast.error("Failed to reactivate referral");
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#111118]">
        <ReferralHeader />
        <div className="flex items-center justify-center h-[50vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-3 border-green-500/20 border-t-green-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-green-500/10"></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 animate-pulse">Loading your referrals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#111118]">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-4">
        <ReferralHeader />
      </div>

      {/* Modals */}
      {selectedReferral && (
        <ReferralDetails
          referral={selectedReferral}
          onClose={() => setSelectedReferral(null)}
        />
      )}

      {showResumeModal && resumeReferralJob && (
        <ResumeReferral
          onClose={() => {
            setShowResumeModal(false);
            setResumeReferralJob(null);
          }}
          onSubmit={handleResume}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-6 py-4">
        {referrals.length > 0 ? (
          <>
            {/* Stats Overview - Reduced Size */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="bg-[#111118] rounded-lg border border-[#1a1a24] p-3 hover:border-green-500/20 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Total Referrals</p>
                    <p className="text-xl font-bold text-white mt-0.5">{referrals.length}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-[#111118] rounded-lg border border-[#1a1a24] p-3 hover:border-green-500/20 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Active</p>
                    <p className="text-xl font-bold text-green-400 mt-0.5">
                      {referrals.filter(r => !r.inactive).length}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="bg-[#111118] rounded-lg border border-[#1a1a24] p-3 hover:border-yellow-500/20 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Paused</p>
                    <p className="text-xl font-bold text-yellow-400 mt-0.5">
                      {referrals.filter(r => r.inactive).length}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Cards */}
            <div className="space-y-0">
              {referrals.map((referral) => (
                <ReferralCard
                  key={referral._id}
                  referral={referral}
                  onViewDetails={() => setSelectedReferral(referral)}
                  handleDelete={() => handleDelete(referral._id)}
                  onPause={() => handlePause(referral)}
                />
              ))}
            </div>

            {/* Pagination */}
            {referrals.length > 0 && (
              <div className="mt-6 pt-4 border-t border-[#1a1a24]">
                <ReferralPagination
                  page={page}
                  totalPages={meta.totalPages}
                  hasNext={meta.hasNext}
                  hasPrev={meta.hasPrev}
                  onPrevious={() => setPage((prev) => prev - 1)}
                  onNext={() => setPage((prev) => prev + 1)}
                />
              </div>
            )}
          </>
        ) : (
          /* Empty State - Reduced Size */
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="max-w-sm w-full">
              <div className="bg-[#111118] rounded-xl border border-[#1a1a24] p-6 sm:p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                  <Inbox className="w-8 h-8 text-green-400/60" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1.5">No Referrals Yet</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  You haven't posted any referrals yet. Start by posting your first referral opportunity.
                </p>
                <button
                  onClick={() => window.location.href = '/professional/post-referral'}
                  className="mt-4 inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Post Your First Referral
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}