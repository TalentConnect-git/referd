"use client";

import { useEffect, useState } from "react";
import { 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  X, 
  Bell, 
  Users, 
  Briefcase, 
  Search, 
  Building2, 
  UserPlus,
  Building,
  MapPin,
  Mail,
  Phone,
  Globe,
  Award,
  GraduationCap,
  Briefcase as BriefcaseIcon,
  Calendar,
  Clock
} from "lucide-react";
import { AlumniProfile } from "@/types/referrals";
import { AskReferralModal } from "@/components/AskReferralModal";
import { AlumniSection } from "@/components/referrals/AlumniSection";
import { AlumniProfileModal } from "@/components/referrals/AlumniProfileModal";
import { EmptyState } from "@/components/referrals/EmptyState";
import axiosInstance from "@/lib/axiosInstance";

// ✅ LinkedIn SVG Icon Component
const LinkedInIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// ✅ GitHub SVG Icon Component
const GitHubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

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
  const [alumniFound, setAlumniFound] = useState(false);
  const [totalAlumniFound, setTotalAlumniFound] = useState(0);

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

  const handleAlumniFound = (
    alumniData: AlumniProfile[],
    companyName: string,
    url: string,
    found: boolean,
    totalFound: number,
  ) => {
    const safeAlumni = Array.isArray(alumniData) ? alumniData : [];
    const safeCompanyName = companyName?.trim() || "Company";
    const safeTotalFound =
      Number.isFinite(totalFound) && totalFound > 0
        ? totalFound
        : safeAlumni.length;

    setLoadingAlumni(false);
    setSearchError(null);
    setAlumni(safeAlumni);
    setAlumniCompanyName(safeCompanyName);
    setCareerPageUrl(url);
    setAlumniFound(Boolean(found));
    setTotalAlumniFound(safeTotalFound);

    if (safeAlumni.length === 0) {
      setSearchError(
        `No alumni found working at "${safeCompanyName}". Try a different job URL.`,
      );
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
            title: 'Referral Request Sent ✅',
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
  const displayedAlumniCount = totalAlumniFound || alumni.length;

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

        {/* Alumni Results */}
        {!loadingAlumni && !searchError && (
          <div className="mt-4">
            {hasAlumni ? (
              <>
                {/* Alumni result heading */}
                <div className="mb-5 flex flex-col gap-4 rounded-xl border border-green-500/20 bg-gradient-to-r from-green-500/10 to-emerald-500/5 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-green-500/30 bg-green-500/20">
                      <Building className="h-5 w-5 text-green-400" />
                    </div>

                    <div className="min-w-0">
                      {alumniFound ? (
                        <>
                          <h2 className="text-base font-semibold text-white sm:text-lg">
                            {displayedAlumniCount} Alumni Found
                          </h2>
                          <p className="mt-0.5 truncate text-sm text-gray-400">
                            At{" "}
                            <span className="font-medium text-green-400">
                              {alumniCompanyName}
                            </span>
                          </p>
                        </>
                      ) : (
                        <>
                          <h2 className="text-base font-semibold text-white sm:text-lg">
                            {displayedAlumniCount}{" "}
                            {displayedAlumniCount === 1
                              ? "alumni works"
                              : "alumni work"}{" "}
                            at{" "}
                            <span className="text-green-400">
                              {alumniCompanyName}
                            </span>
                          </h2>
                          <p className="mt-0.5 text-sm text-gray-400">
                            These professionals may still be able to help with
                            your referral request.
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-1.5 sm:ml-auto sm:self-auto">
                    <Sparkles className="h-3.5 w-3.5 text-green-400" />
                    <span className="text-xs font-medium text-green-400">
                      {alumniFound ? "Exact Match" : "Company Alumni"}
                    </span>
                  </div>
                </div>

                <AlumniSection
                  alumni={alumni}
                  companyName={alumniCompanyName}
                  onViewProfile={setSelectedAlumni}
                  onAskReferral={handleAlumniReferralRequest}
                  careerPageUrl={careerPageUrl}
                />
              </>
            ) : (
              <div className="mt-12">
                <div className="max-w-sm mx-auto bg-[#111827] rounded-xl border border-gray-700/50 p-8 text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                    <Building2 className="w-7 h-7 text-green-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-300 mb-1">
                    Find Alumni for Referrals
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
              <div className="w-12 h-12 mx-auto rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-400" />
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