"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle,
  Search,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { AlumniProfile } from "@/types/referrals";
import { AskReferralModal } from "@/components/AskReferralModal";
import { AlumniSection } from "@/components/referrals/AlumniSection";
import { AlumniProfileModal } from "@/components/referrals/AlumniProfileModal";
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

export default function RequestReferralPage() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);

  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [careerPageUrl, setCareerPageUrl] = useState("");

  const [selectedAlumni, setSelectedAlumni] =
    useState<AlumniProfile | null>(null);

  const [isAskReferralModalOpen, setIsAskReferralModalOpen] =
    useState(true);

  const [referralRequestLoading, setReferralRequestLoading] =
    useState(false);

  const [searchError, setSearchError] = useState<string | null>(null);

  const [alumniFound, setAlumniFound] = useState(false);
  const [totalAlumniFound, setTotalAlumniFound] = useState(0);

  const [notification, setNotification] = useState<{
    type: "success" | "warning" | "error";
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification]);

  const handleAlumniFound = (
    alumniData: AlumniProfile[],
    foundCompanyName: string,
    url: string,
    found: boolean,
    totalFound: number,
  ) => {
    const safeAlumni = Array.isArray(alumniData) ? alumniData : [];

    setAlumni(safeAlumni);
    setCompanyName(foundCompanyName?.trim() || "Company");
    setCareerPageUrl(url);
    setAlumniFound(Boolean(found));
    setTotalAlumniFound(
      Number.isFinite(totalFound) && totalFound > 0
        ? totalFound
        : safeAlumni.length,
    );

    if (safeAlumni.length === 0) {
      setSearchError(
        `No alumni found working at "${foundCompanyName}". Try a different job URL.`,
      );
    } else {
      setSearchError(null);
    }
  };

  const handleReferralRequest = async (
    url: string,
    alumniUserId: string,
  ) => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      const redirectUrl = `/request-referal`;
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    try {
      setReferralRequestLoading(true);

      const requestUrl = url || careerPageUrl;

      const response = await axiosInstance.post(
        "/api/company-jobs/career-page-referral/send",
        {
          careerPageUrl: requestUrl,
          receiverUserIds: [alumniUserId],
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        },
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to send referral request",
        );
      }

      const data: ReferralResponseData = response.data.data;

      if (data.totalCreated > 0) {
        setNotification({
          type: "success",
          title: "Referral Request Sent",
          message: `Your referral request has been sent to the alumni at ${data.companyName}.`,
        });
      } else if (data.totalSkipped > 0) {
        setNotification({
          type: "warning",
          title: "Request Already Exists",
          message:
            "You have already sent a referral request for this position.",
        });
      }

      setSelectedAlumni(null);
    } catch (error: any) {
      setNotification({
        type: "error",
        title: "Failed to Send Request",
        message:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setReferralRequestLoading(false);
    }
  };

  const hasAlumni = alumni.length > 0;

  const displayedAlumniCount = totalAlumniFound || alumni.length;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* =====================================================
          NOTIFICATION
      ====================================================== */}
      {notification && (
        <div className="fixed right-4 top-4 z-[200] w-full max-w-sm">
          <div
            className={`rounded-xl border bg-[var(--card)] p-4 shadow-[var(--shadow-lg)] ${
              notification.type === "success"
                ? "border-[var(--success-border)]"
                : notification.type === "warning"
                  ? "border-[var(--warning-border)]"
                  : "border-[var(--danger-border)]"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {notification.type === "success" ? (
                  <CheckCircle className="h-5 w-5 text-[var(--success)]" />
                ) : notification.type === "warning" ? (
                  <AlertCircle className="h-5 w-5 text-[var(--warning)]" />
                ) : (
                  <XCircle className="h-5 w-5 text-[var(--danger)]" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  {notification.title}
                </h3>
                <p className="mt-1 text-xs leading-[1.5] text-[var(--text-secondary)]">
                  {notification.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setNotification(null)}
                className="rounded-lg p-1 text-[var(--text-muted)] transition-colors hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div
              className="
                flex h-11 w-11 shrink-0 items-center justify-center
                rounded-xl
                border border-[var(--primary-border)]
                bg-[var(--primary-soft)]
                text-[var(--primary)]
              "
            >
              <Users className="h-5 w-5" strokeWidth={2} />
            </div>

            <div className="min-w-0">
              <h1 className="text-[22px] font-bold leading-tight tracking-[-0.02em] text-[var(--text-primary)] sm:text-[26px]">
                Request a Referral
              </h1>
              <p className="mt-1 text-[13px] leading-[1.5] text-[var(--text-muted)]">
                Find alumni at a company and request a referral
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSearchError(null);
              setIsAskReferralModalOpen(true);
            }}
            className="
              group/cta
              relative inline-flex h-10 shrink-0 items-center justify-center
              gap-2 overflow-hidden
              whitespace-nowrap
              rounded-lg
              bg-gradient-to-r
              from-[var(--primary-dark)]
              via-[var(--primary)]
              to-[var(--primary-light)]
              bg-[length:200%_auto]
              px-4
              text-sm font-semibold
              text-[var(--text-on-primary)]
              shadow-[var(--shadow-sm)]
              transition-all duration-300
              hover:-translate-y-0.5
              hover:bg-[position:100%_center]
              hover:shadow-[var(--shadow-md)]
              active:scale-[0.97]
            "
          >
            <span
              className="
                pointer-events-none absolute inset-0
                -translate-x-full
                bg-gradient-to-r from-transparent via-white/25 to-transparent
                transition-transform duration-700
                group-hover/cta:translate-x-full
              "
            />
            <Search className="relative h-4 w-4" />
            <span className="relative">Ask for Referral</span>
          </button>
        </header>

        {/* =====================================================
            INITIAL STATE
        ====================================================== */}
        {!hasAlumni && !searchError && (
          <div className="mt-10 flex justify-center sm:mt-14">
            <div
              className="
                w-full max-w-lg
                rounded-2xl
                border border-[var(--border)]
                bg-[var(--card)]
                p-7 text-center
                shadow-[var(--shadow-sm)]
                sm:p-8
              "
            >
              <div
                className="
                  mx-auto mb-5 flex h-14 w-14
                  items-center justify-center
                  rounded-2xl
                  border border-[var(--primary-border)]
                  bg-[var(--primary-soft)]
                  text-[var(--primary)]
                "
              >
                <Building2 className="h-6 w-6" strokeWidth={2} />
              </div>

              <h2 className="text-lg font-bold tracking-[-0.01em] text-[var(--text-primary)] sm:text-xl">
                Find Alumni Who Can Refer You
              </h2>

              <p className="mx-auto mt-2 max-w-md text-[13px] leading-[1.6] text-[var(--text-muted)]">
                Enter a job posting URL and we&rsquo;ll find alumni or current
                employees from that company who may be able to help with your
                referral.
              </p>

              <button
                type="button"
                onClick={() => setIsAskReferralModalOpen(true)}
                className="
                  group/find
                  mt-6 inline-flex h-10 items-center justify-center gap-2
                  rounded-lg
                  border border-[var(--primary-border)]
                  bg-[var(--primary-soft)]
                  px-5
                  text-sm font-semibold
                  text-[var(--primary)]
                  transition-colors duration-200
                  hover:border-[var(--primary)]
                  hover:bg-[var(--primary)]
                  hover:text-[var(--text-on-primary)]
                "
              >
                <Search className="h-4 w-4" />
                Find Alumni
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover/find:translate-x-0.5"
                />
              </button>
            </div>
          </div>
        )}

        {/* =====================================================
            SEARCH ERROR
        ====================================================== */}
        {searchError && !hasAlumni && (
          <div className="mx-auto mt-10 max-w-md sm:mt-14">
            <div
              className="
                rounded-2xl
                border border-[var(--danger-border)]
                bg-[var(--card)]
                p-7 text-center
                shadow-[var(--shadow-sm)]
              "
            >
              <div
                className="
                  mx-auto flex h-12 w-12
                  items-center justify-center
                  rounded-xl
                  bg-[var(--danger-soft)]
                  text-[var(--danger)]
                "
              >
                <AlertCircle className="h-6 w-6" strokeWidth={2} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-[var(--text-primary)]">
                No Alumni Found
              </h3>

              <p className="mt-2 text-[13px] leading-[1.6] text-[var(--text-muted)]">
                {searchError}
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchError(null);
                  setIsAskReferralModalOpen(true);
                }}
                className="
                  mt-5 inline-flex h-10 items-center justify-center
                  rounded-lg
                  border border-[var(--danger-border)]
                  bg-[var(--danger-soft)]
                  px-5
                  text-sm font-semibold
                  text-[var(--danger)]
                  transition-colors duration-200
                  hover:bg-[var(--danger)]
                  hover:text-[var(--text-inverse)]
                "
              >
                Try Another URL
              </button>
            </div>
          </div>
        )}

        {/* =====================================================
            ALUMNI RESULTS
        ====================================================== */}
        {hasAlumni && (
          <div className="mt-8">
            {/* Result summary bar */}
            <div
              className="
                mb-6 flex flex-col gap-4
                rounded-2xl
                border border-[var(--border)]
                bg-[var(--card)]
                p-4
                shadow-[var(--shadow-xs)]
                sm:flex-row sm:items-center sm:p-5
              "
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-xl
                    border border-[var(--border)]
                    bg-[var(--card-soft)]
                    text-[var(--text-secondary)]
                  "
                >
                  <Building2 className="h-5 w-5" strokeWidth={2} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-bold tracking-[-0.01em] text-[var(--text-primary)] sm:text-lg">
                    {displayedAlumniCount}{" "}
                    {displayedAlumniCount === 1 ? "person" : "people"} found
                  </h2>
                  <p className="mt-0.5 text-[12.5px] text-[var(--text-muted)]">
                    At{" "}
                    <span className="font-semibold text-[var(--primary)]">
                      {companyName}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAskReferralModalOpen(true)}
                className="
                  group/search
                  inline-flex h-9 items-center justify-center gap-2
                  rounded-lg
                  border border-[var(--border)]
                  bg-[var(--card-soft)]
                  px-4
                  text-[13px] font-medium
                  text-[var(--text-secondary)]
                  transition-colors duration-200
                  hover:border-[var(--border-strong)]
                  hover:bg-[var(--card-hover)]
                  hover:text-[var(--text-primary)]
                  sm:ml-auto
                "
              >
                <Search className="h-4 w-4" />
                Search Another Job
              </button>
            </div>

            <AlumniSection
              alumni={alumni}
              companyName={companyName}
              careerPageUrl={careerPageUrl}
              alumniFound={alumniFound}
              totalAlumniFound={totalAlumniFound}
              onViewProfile={setSelectedAlumni}
              onAskReferral={handleReferralRequest}
            />
          </div>
        )}
      </div>

      {/* =====================================================
          MODALS
      ====================================================== */}
      <div className="relative z-[9999]">
        <AskReferralModal
          isOpen={isAskReferralModalOpen}
          onClose={() => setIsAskReferralModalOpen(false)}
          token={token}
          onAlumniFound={handleAlumniFound}
        />
      </div>

      {selectedAlumni && (
        <AlumniProfileModal
          alumni={selectedAlumni}
          onClose={() => setSelectedAlumni(null)}
          onRequestReferral={() =>
            handleReferralRequest(careerPageUrl, selectedAlumni.userId)
          }
          requestLoading={referralRequestLoading}
        />
      )}
    </div>
  );
}