// app/professional/my-referrals/page.tsx
"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2, Sparkles, CheckCircle, XCircle, Info, X, Bell, Users, Briefcase, Search, Building2, UserPlus } from "lucide-react";
import { AlumniProfile } from "@/types/referrals";
import { AskReferralModal } from "@/components/AskReferralModal";
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
      }, 5000);
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
    }
  };

  const handleAlumniReferralRequest = async (url: string, alumniUserId: string) => {
    try {
      setReferralRequestLoading(true);
      
      const requestUrl = url || careerPageUrl;
      
      const response = await axiosInstance.post(
        "/api/company-jobs/career-page-referral/send",
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
            title: 'Referral Request Sent',
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
    <div className="min-h-screen bg-[#0a0f1a]">
      {/* Notification Toast */}
      {notification?.show && (
        <div className="fixed top-4 right-4 z-[200] max-w-sm animate-slide-in">
          <div 
            className={`
              relative overflow-hidden rounded-xl border backdrop-blur-xl shadow-2xl
              ${notification.type === 'success' 
                ? 'bg-[#111827] border-green-500/30' 
                : notification.type === 'warning'
                ? 'bg-[#111827] border-amber-500/30'
                : 'bg-[#111827] border-red-500/30'
              }
            `}
          >
            <div className="absolute top-0 left-0 h-0.5 animate-shrink rounded-full"
              style={{
                width: '100%',
                background: notification.type === 'success' 
                  ? '#22c55e' 
                  : notification.type === 'warning'
                  ? '#f59e0b'
                  : '#ef4444',
                animation: 'shrink 5s linear forwards'
              }}
            />
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                  ${notification.type === 'success'
                    ? 'bg-green-500/10'
                    : notification.type === 'warning'
                    ? 'bg-amber-500/10'
                    : 'bg-red-500/10'
                  }
                `}>
                  {notification.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : notification.type === 'warning' ? (
                    <Bell className="w-4 h-4 text-amber-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-semibold ${
                    notification.type === 'success'
                      ? 'text-green-400'
                      : notification.type === 'warning'
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}>
                    {notification.title}
                  </h3>
                  <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
                    {notification.message}
                  </p>
                  {notification.details && notification.details.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-700/50">
                      <div className="space-y-1">
                        {notification.details.map((detail, index) => (
                          <div key={index} className="flex items-center justify-between gap-2">
                            <span className="text-[10px] text-gray-500">{detail.label}</span>
                            <span className="text-[10px] font-medium text-gray-300 text-right">
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
                  className="p-1 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 transition-all flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-green-400" />
              Referrals
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Find alumni and request referrals
            </p>
          </div>
          
          <button
            onClick={() => setIsAskReferralModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-500/50 transition-all text-sm font-medium"
          >
            <Search className="w-4 h-4" />
            Find Alumni
          </button>
        </div>

        {/* Loading State */}
        {loadingAlumni && (
          <div className="mt-12 flex items-center justify-center">
            <div className="text-center">
              <div className="relative mx-auto w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-gray-700/30"></div>
                <div className="absolute inset-0 rounded-full border-2 border-t-green-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                <div className="absolute inset-3 rounded-full bg-[#111827] border border-gray-700/30 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-green-400 animate-pulse" />
                </div>
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-300">
                Finding Alumni
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Searching through our network...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {searchError && !loadingAlumni && (
          <div className="mt-8 max-w-md mx-auto">
            <div className="bg-[#111827] rounded-xl border border-gray-700/50 p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-300 mb-1">
                No Alumni Found
              </h3>
              <p className="text-sm text-gray-400 mb-1">{searchError}</p>
              <p className="text-xs text-gray-500 mb-4">
                Try searching with a different job URL
              </p>
              <button
                onClick={() => {
                  setSearchError(null);
                  setIsAskReferralModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 transition-all text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Try Another URL
              </button>
            </div>
          </div>
        )}

        {/* Alumni Results */}
        {!loadingAlumni && !searchError && (
          <div className="mt-4">
            {hasAlumni ? (
              <AlumniSection
                alumni={alumni}
                companyName={alumniCompanyName}
                onViewProfile={setSelectedAlumni}
                onAskReferral={handleAlumniReferralRequest}
                careerPageUrl={careerPageUrl}
              />
            ) : (
              <div className="mt-12">
                <div className="max-w-sm mx-auto bg-[#111827] rounded-xl border border-gray-700/50 p-8 text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                    <Building2 className="w-7 h-7 text-green-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-300 mb-1">
                    No Alumni Found
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Enter a job URL to find alumni who can refer you
                  </p>
                  <button
                    onClick={() => setIsAskReferralModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-500/50 transition-all text-sm font-medium"
                  >
                    <Search className="w-4 h-4" />
                    Find Alumni
                  </button>
                </div>
              </div>
            )}
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