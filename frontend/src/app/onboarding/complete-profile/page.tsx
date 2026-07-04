"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, FileText, Shield } from "lucide-react";

import { submitOnboardingProfile } from "@/services/onboardingService";
import { useAuth } from "@/context/AuthContext";
import TermsModal from "@/components/common/TermsModal/TermsModal";
import PrivacyModal from "@/components/common/TermsModal/TermsModal";

type AccountType = "student" | "fresher" | "professional";

type EducationInfo = {
  college?: string;
  collegeName?: string;
  institution?: string;
  schoolName?: string;
  degree?: string;
  specialization?: string;
  fieldOfStudy?: string;
  semester?: string;
  cgpa?: string;
  yearOfGraduation?: string;
  graduationYear?: string;
  degreeCertificate?: string;
  startDate?: string;
  endDate?: string;
  educationType?: string;
  isCurrent?: boolean;
};

type AnyObject = Record<string, any>;

export default function ConfirmationPage() {
  const router = useRouter();
  const { refreshUser, login } = useAuth();

  const [accountType, setAccountType] = useState<AccountType>("student");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = safeJsonParse<AnyObject>("user", {});

    const role =
      localStorage.getItem("selectedRole") || user?.userType || "student";

    setAccountType(role as AccountType);
  }, []);

  const safeJsonParse = <T,>(key: string, fallback: T): T => {
    try {
      const value = localStorage.getItem(key);

      if (!value) return fallback;

      return JSON.parse(value) || fallback;
    } catch {
      return fallback;
    }
  };

  const isEmptyValue = (value: unknown) => {
    if (value === null || value === undefined || value === "") return true;

    if (typeof value === "string" && value.trim() === "") return true;

    if (Array.isArray(value) && value.length === 0) return true;

    return false;
  };

  const cleanObject = (obj: AnyObject) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => !isEmptyValue(value)),
    );
  };

  const hasUsefulEducationData = (edu: AnyObject) => {
    const usefulKeys = [
      "college",
      "degree",
      "specialization",
      "semester",
      "cgpa",
      "yearOfGraduation",
      "degreeCertificate",
      "startDate",
      "endDate",
    ];

    return usefulKeys.some((key) => !isEmptyValue(edu[key]));
  };

  const normalizeEducation = (edu: EducationInfo) => {
    const normalized = {
      college:
        edu.college ||
        edu.collegeName ||
        edu.institution ||
        edu.schoolName ||
        "",

      degree: edu.degree || "",

      specialization: edu.specialization || edu.fieldOfStudy || "",

      semester: edu.semester || "",

      cgpa: edu.cgpa || "",

      yearOfGraduation: edu.yearOfGraduation || edu.graduationYear || "",

      degreeCertificate: edu.degreeCertificate || "",

      startDate: edu.startDate || "",

      endDate: edu.endDate || "",

      educationType: edu.educationType || "bachelors",

      isCurrent: Boolean(edu.isCurrent),
    };

    return cleanObject(normalized);
  };

  const buildOnboardingFormData = () => {
    const dataToSend = new FormData();

    const parsedResume = safeJsonParse<AnyObject>("parsedResume", {});
    const basicInfo = safeJsonParse<AnyObject>("basicInfo", {});
    const educationInfo = safeJsonParse<EducationInfo | EducationInfo[]>(
      "educationInfo",
      {},
    );
    const careerPreferences = safeJsonParse<AnyObject>("careerPreferences", {});
    const skillsAchievements = safeJsonParse<AnyObject>(
      "skillsAchievements",
      {},
    );

    const normalizedEducations = Array.isArray(educationInfo)
      ? educationInfo.map(normalizeEducation)
      : [normalizeEducation(educationInfo)];

    const filteredEducations = normalizedEducations.filter(
      hasUsefulEducationData,
    );

    console.log("info", basicInfo);

    const finalData: AnyObject = {
      ...parsedResume,
      ...basicInfo,
      ...careerPreferences,
      ...skillsAchievements,
      profileType: accountType,
    };

    if (filteredEducations.length > 0) {
      finalData.educations = filteredEducations;
    }

    console.log("Final data sending:", finalData);

    Object.entries(finalData).forEach(([key, value]) => {
      if (isEmptyValue(value)) return;

      if (value instanceof File) {
        dataToSend.append(key, value, value.name);
        return;
      }

      if (Array.isArray(value) || typeof value === "object") {
        dataToSend.append(key, JSON.stringify(value));
        return;
      }

      dataToSend.append(key, String(value));
    });

    return dataToSend;
  };

  const handleSubmit = async () => {
    if (!agreed) {
      setError("Please agree to the Terms & Conditions and Privacy Policy.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = buildOnboardingFormData();

      formData.append("emailVerified", "true");

      const response = await submitOnboardingProfile(formData);
      const createdAccountType =
        response?.profileType || response?.user?.userType || accountType;

      localStorage.setItem("selectedRole", createdAccountType);

      if (response?.user && response?.token) {
        login(response.user, response.token);
      }

      await refreshUser();

      router.replace(`/${createdAccountType}/dashboard`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-black px-5 py-8 text-white">
        <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-2xl items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--background)] p-8 shadow-2xl lg:p-10">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[var(--primary)]/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[var(--primary)]/10 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--primary-soft)]">
                  <Shield className="h-10 w-10 text-[var(--primary)]" />
                </div>

                <h1 className="text-[30px] font-bold tracking-[-0.05em] text-white">
                  Almost There!
                </h1>

                <p className="mt-3 text-[14px] leading-6 text-[var(--text-primary)]">
                  Review and accept the terms to complete your profile setup.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-[13px] text-red-300">
                  {error}
                </div>
              )}

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-start gap-4">
                  <button
                    type="button"
                    onClick={() => setAgreed((prev) => !prev)}
                    className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition ${
                      agreed
                        ? "border-[var(--primary)] bg-[var(--primary)]"
                        : "border-white/20 bg-white/[0.03]"
                    }`}
                    aria-label="Accept terms and privacy policy"
                  >
                    {agreed && <CheckCircle className="h-4 w-4 text-black" />}
                  </button>

                  <p className="text-[13px] leading-6 text-[var(--text-primary)]">
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="font-semibold text-[var(--primary)] underline underline-offset-4 transition hover:opacity-80"
                    >
                      Terms & Conditions
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      onClick={() => setShowPrivacyModal(true)}
                      className="font-semibold text-[var(--primary)] underline underline-offset-4 transition hover:opacity-80"
                    >
                      Privacy Policy
                    </button>
                    .
                  </p>
                </div>

                <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-[var(--primary)]" />

                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-primary)]">
                        Profile Type
                      </p>

                      <p className="text-[15px] font-semibold capitalize text-white">
                        {accountType} Account
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="h-10 flex-1 rounded-lg border border-white/10 text-[13px] font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!agreed || loading}
                  className="button-color h-10 flex-1 rounded-lg text-[13px] font-semibold text-black transition-all duration-300 hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Complete Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAgree={() => setAgreed(true)}
      />

      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </>
  );
}
