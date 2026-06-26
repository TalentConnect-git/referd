// app/professional/my-referrals/page.tsx
"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2, Sparkles, CheckCircle, XCircle, Info, X, Bell } from "lucide-react";
import { AlumniProfile } from "@/types/referrals";
import ReferralHeader from "@/components/referrals/ReferralHeader";
import { AskReferralModal } from "@/components/AskReferralModal";
import { Tabs, TabType } from "@/components/referrals/Tabs";
import { AlumniSection } from "@/components/referrals/AlumniSection";
import { AlumniProfileModal } from "@/components/referrals/AlumniProfileModal";
import { EmptyState } from "@/components/referrals/EmptyState";
import axiosInstance from "@/lib/axiosInstance";

interface ReferralResponseData {
  companyName: string;
  careerPageUrl: string;
  totalSelected: number;
  totalCreated: number;
  totalSkipped: number;
  created: Array<{
    receiverUserId: string;
    referralId: string;
    message: string;
  }>;
  skipped: Array<{
    receiverUserId: string;
    reason: string;
  }>;
}

export default function ReferralsPage() {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [alumniCompanyName, setAlumniCompanyName] = useState("");
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniProfile | null>(null);
  const [referralRequestLoading, setReferralRequestLoading] = useState(false);
  const [careerPageUrl, setCareerPageUrl] = useState<string>("");

  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("alumni-results");
  const [isAskReferralModalOpen, setIsAskReferralModalOpen] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [loadingAlumni, setLoadingAlumni] = useState(false);

  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'warning' | 'error';
    title: string;
    message: string;
    details?: Array<{ label: string; value: string }>;
  } | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (notification?.show) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAlumniFound = (alumniData: AlumniProfile[], companyName: string, url: string) => {
    setSearchError(null);
    setAlumniCompanyName(companyName);
    setCareerPageUrl(url);
    
    if (alumniData.length === 0) {
      setSearchError(
        `No alumni found for "${companyName}". Try a different job URL.`
      );
      setAlumni([]);
      setAlumniCompanyName("");
    } else {
      setAlumni(alumniData);
      setActiveTab("alumni-results");
    }
  };

  const handleAlumniReferralRequest = async (url: string, alumniUserId: string) => {
    try {
      setReferralRequestLoading(true);
      
      const requestUrl = url || careerPageUrl;
      
      const response = await axiosInstance.post(
        "http://localhost:5000/api/company-jobs/career-page-referral/send",
        {
          careerPageUrl: requestUrl,
          receiverUserIds: [alumniUserId],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const data: ReferralResponseData = response.data.data;
        
        if (data.totalCreated > 0) {
          setNotification({
            show: true,
            type: 'success',
            title: 'Referral Request Sent Successfully',
            message: `Your referral request has been sent to the alumni at ${data.companyName}.`,
            details: [
              { label: 'Status', value: 'Request Created' },
              { label: 'Company', value: data.companyName },
              { label: 'Created', value: `${data.totalCreated} request(s)` },
            ]
          });
        } else if (data.totalSkipped > 0) {
          setNotification({
            show: true,
            type: 'warning',
            title: 'Request Already Exists',
            message: `You have already sent a referral request for this position.`,
            details: [
              { label: 'Status', value: 'Request Skipped' },
              { label: 'Company', value: data.companyName },
              { label: 'Reason', value: data.skipped[0]?.reason || 'Already sent' },
            ]
          });
        }
        
        setSelectedAlumni(null);
      } else {
        throw new Error(response.data.message || "Failed to send referral request");
      }
    } catch (error: any) {
      console.error("Alumni referral request error:", error);
      setNotification({
        show: true,
        type: 'error',
        title: 'Failed to Send Request',
        message: error.response?.data?.message || "Something went wrong. Please try again.",
        details: [
          { label: 'Error', value: 'Request could not be completed' },
        ]
      });
    } finally {
      setReferralRequestLoading(false);
    }
  };

  const hasAlumni = alumni.length > 0;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReferralHeader onAskForReferral={() => setIsAskReferralModalOpen(true)} />

        {/* Enhanced Notification Toast */}
        {notification?.show && (
          <div className="fixed top-4 right-4 z-[200] max-w-md animate-slide-in">
            <div 
              className={`
                relative overflow-hidden rounded-[var(--radius-xl)] border backdrop-blur-xl shadow-2xl
                ${notification.type === 'success' 
                  ? 'bg-[var(--background-soft)] border-[var(--primary)]/30' 
                  : notification.type === 'warning'
                  ? 'bg-[var(--background-soft)] border-amber-500/30'
                  : 'bg-[var(--background-soft)] border-red-500/30'
                }
              `}
            >
              {/* Progress bar */}
              <div className="absolute top-0 left-0 h-1 animate-shrink rounded-full"
                style={{
                  width: '100%',
                  background: notification.type === 'success' 
                    ? 'var(--primary)' 
                    : notification.type === 'warning'
                    ? '#f59e0b'
                    : '#ef4444',
                  animation: 'shrink 6s linear forwards'
                }}
              />

              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                    ${notification.type === 'success'
                      ? 'bg-[var(--primary-soft)]'
                      : notification.type === 'warning'
                      ? 'bg-amber-500/10'
                      : 'bg-red-500/10'
                    }
                  `}>
                    {notification.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-[var(--primary)]" />
                    ) : notification.type === 'warning' ? (
                      <Bell className="w-5 h-5 text-amber-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-bold ${
                      notification.type === 'success'
                        ? 'text-[var(--primary)]'
                        : notification.type === 'warning'
                        ? 'text-amber-300'
                        : 'text-red-300'
                    }`}>
                      {notification.title}
                    </h3>
                    <p className="text-sm text-[var(--text-primary)] mt-1 leading-relaxed">
                      {notification.message}
                    </p>
                    
                    {notification.details && notification.details.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[var(--border)]">
                        <div className="space-y-2">
                          {notification.details.map((detail, index) => (
                            <div key={index} className="flex items-center justify-between gap-3">
                              <span className="text-xs text-[var(--text-muted)]">{detail.label}</span>
                              <span className="text-xs font-medium text-[var(--text-secondary)] text-right">
                                {detail.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setNotification(null)}
                    className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--card-hover)] transition-all flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loadingAlumni && (
          <div className="mt-16 flex items-center justify-center">
            <div className="text-center">
              <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 rounded-full border-2 border-[var(--border)] opacity-30"></div>
                <div className="absolute inset-0 rounded-full border-2 border-t-[var(--primary)] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                <div className="absolute inset-4 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[var(--primary)] animate-pulse" />
                </div>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-[var(--text-secondary)]">
                Finding Alumni for this Job
              </h3>
              <p className="mt-2 text-sm text-[var(--text-primary)]">
                Searching through our network for the best matches...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {searchError && !loadingAlumni && (
          <div className="mt-8 max-w-xl mx-auto">
            <div className="glass-card rounded-[var(--radius-xl)] p-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--primary-soft)] border border-[var(--primary)]/20 flex items-center justify-center mb-5">
                  <AlertCircle className="w-8 h-8 text-[var(--primary)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-2">
                  No Alumni Found
                </h3>
                <p className="text-sm text-[var(--text-primary)] mb-2">{searchError}</p>
                <p className="text-xs text-[var(--text-muted)] mb-6">
                  Try searching with a different job URL or check if the URL is correct.
                </p>
                <button
                  onClick={() => {
                    setSearchError(null);
                    setIsAskReferralModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-black font-semibold hover:bg-[var(--primary-dark)] transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Try Another URL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {!loadingAlumni && !searchError && (
          <div className="mt-8">
            <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="mt-6">
              {activeTab === "alumni-results" && (
                <>
                  {hasAlumni ? (
                    <AlumniSection
                      alumni={alumni}
                      companyName={alumniCompanyName}
                      onViewProfile={setSelectedAlumni}
                      onAskReferral={handleAlumniReferralRequest}
                      careerPageUrl={careerPageUrl}
                    />
                  ) : (
                    <EmptyState
                      activeTab="alumni-results"
                      onTryAgain={() => setIsAskReferralModalOpen(true)}
                      onTryCompany={() => setIsAskReferralModalOpen(true)}
                    />
                  )}
                </>
              )}

              {activeTab === "all-jobs" && (
                <EmptyState
                  activeTab="all-jobs"
                  onTryAgain={() => setIsAskReferralModalOpen(true)}
                  onTryCompany={() => setIsAskReferralModalOpen(true)}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AskReferralModal
        isOpen={isAskReferralModalOpen}
        onClose={() => setIsAskReferralModalOpen(false)}
        token={token}
        onAlumniFound={handleAlumniFound}
      />

      {selectedAlumni && (
        <AlumniProfileModal
          alumni={selectedAlumni}
          onClose={() => setSelectedAlumni(null)}
          onRequestReferral={() => {
            handleAlumniReferralRequest(careerPageUrl, selectedAlumni.userId);
          }}
          requestLoading={referralRequestLoading}
        />
      )}
    </div>
  );
}