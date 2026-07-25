"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  FileText,
  Loader2,
  Shield,
} from "lucide-react";

import { submitOnboardingProfile } from "@/services/onboardingService";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import TermsModal from "@/components/common/TermsModal/TermsModal";
import PrivacyModal from "@/components/common/PrivacyModal/PrivacyModal";

type AccountType = "student" | "fresher" | "professional";

type AnyObject = Record<string, unknown>;

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

type ExperienceInfo = {
  _id?: string;
  company?: string;
  company_canonical_id?: string;
  company_display?: string;
  company_master_id?: string | null;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string | string[];
  experienceCertificate?: string;
  isCurrent?: boolean;
};

type StatusData = {
  type: string;
  since: string;
  note: string;
  expectedReturn: string | null;
};

type ExperienceStepData = {
  experiences?: ExperienceInfo[];
  companyEmail?: string;
  noticePeriod?: string;
  currentCompany?: string;
  currentCompany_display?: string;
  lastUpdated?: string;
  status?: StatusData | string;
};

function safeJsonParse<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return (JSON.parse(value) as T) || fallback;
  } catch (error) {
    console.error(`Unable to parse localStorage key "${key}":`, error);
    return fallback;
  }
}

function isAccountType(value: unknown): value is AccountType {
  return (
    value === "student" ||
    value === "fresher" ||
    value === "professional"
  );
}

function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === "string" && value.trim() === "") {
    return true;
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  return false;
}

function cleanObject<T extends Record<string, unknown>>(
  object: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) => !isEmptyValue(value),
    ),
  ) as Partial<T>;
}

function normalizeEducation(
  education: EducationInfo,
): Partial<EducationInfo> {
  return cleanObject({
    college:
      education.college ||
      education.collegeName ||
      education.institution ||
      education.schoolName ||
      "",
    degree: education.degree || "",
    specialization:
      education.specialization ||
      education.fieldOfStudy ||
      "",
    semester: education.semester || "",
    cgpa: education.cgpa || "",
    yearOfGraduation:
      education.yearOfGraduation ||
      education.graduationYear ||
      "",
    degreeCertificate: education.degreeCertificate || "",
    startDate: education.startDate || "",
    endDate: education.isCurrent
      ? ""
      : education.endDate || "",
    educationType: education.educationType || "bachelors",
    isCurrent: Boolean(education.isCurrent),
  });
}

function hasUsefulEducationData(
  education: Partial<EducationInfo>,
): boolean {
  const usefulKeys: Array<keyof EducationInfo> = [
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

  return usefulKeys.some(
    (key) => !isEmptyValue(education[key]),
  );
}

function normalizeExperiences(
  experiences: ExperienceInfo[],
): ExperienceInfo[] {
  if (!Array.isArray(experiences)) {
    return [];
  }

  return experiences
    .filter(
      (experience) =>
        Boolean(experience.company?.trim()) ||
        Boolean(experience.role?.trim()) ||
        Boolean(experience.startDate),
    )
    .map((experience) => ({
      company: experience.company?.trim() || "",
      company_canonical_id:
        experience.company_canonical_id?.trim() || "",
      company_display:
        experience.company_display?.trim() ||
        experience.company?.trim() ||
        "",
      company_master_id:
        experience.company_master_id || null,
      role: experience.role?.trim() || "",
      startDate: experience.startDate || "",
      endDate: experience.isCurrent
        ? ""
        : experience.endDate || "",
      description: Array.isArray(experience.description)
        ? experience.description.join("\n")
        : experience.description || "",
      experienceCertificate:
        experience.experienceCertificate || "",
      isCurrent: Boolean(experience.isCurrent),
    }));
}

function appendValueToFormData(
  formData: FormData,
  key: string,
  value: unknown,
): void {
  if (isEmptyValue(value)) {
    return;
  }

  if (value instanceof File) {
    formData.append(key, value, value.name);
    return;
  }

  if (Array.isArray(value)) {
    formData.append(key, JSON.stringify(value));
    return;
  }

  if (typeof value === "object" && value !== null) {
    formData.append(key, JSON.stringify(value));
    return;
  }

  formData.append(key, String(value));
}

function normalizeStatusForUpdate(
  status: StatusData | null,
): StatusData | null {
  if (!status?.type || status.type === "employed") {
    return null;
  }

  return {
    type: status.type,
    since: status.since || new Date().toISOString(),
    note: status.note?.trim() || "",
    expectedReturn:
      status.type === "career_break"
        ? status.expectedReturn || null
        : null,
  };
}

async function syncStatusAfterOnboarding(
  status: StatusData | null,
  token?: string,
): Promise<void> {
  const normalizedStatus = normalizeStatusForUpdate(status);

  // Current-company users are handled automatically by the backend.
  if (!normalizedStatus) return;

  await axiosInstance.put(
    "/api/onboarding/update",
    { status: normalizedStatus },
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined,
  );
}

export default function ConfirmationPage() {
  const router = useRouter();
  const { refreshUser, login } = useAuth();

  const [accountType, setAccountType] =
    useState<AccountType>("student");
  const [showTermsModal, setShowTermsModal] =
    useState(false);
  const [showPrivacyModal, setShowPrivacyModal] =
    useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = safeJsonParse<{
      userType?: unknown;
    }>("user", {});

    const storedRole =
      localStorage.getItem("selectedRole") ||
      storedUser.userType;

    if (isAccountType(storedRole)) {
      setAccountType(storedRole);
    }
  }, []);

  function buildOnboardingFormData(): FormData {
    const formData = new FormData();

    const parsedResume = safeJsonParse<AnyObject>(
      "parsedResume",
      {},
    );
    const basicInfo = safeJsonParse<AnyObject>(
      "basicInfo",
      {},
    );
    const educationInfo = safeJsonParse<
      EducationInfo | EducationInfo[]
    >("educationInfo", {});
    const careerPreferences = safeJsonParse<AnyObject>(
      "careerPreferences",
      {},
    );
    const skillsAchievements = safeJsonParse<AnyObject>(
      "skillsAchievements",
      {},
    );

    const experienceStepData =
      safeJsonParse<ExperienceStepData>(
        "onboarding_experiences",
        {},
      );

    const legacyExperiences =
      safeJsonParse<ExperienceInfo[]>(
        "experiences_data",
        [],
      );

    const internationalExperience =
      safeJsonParse<AnyObject[]>(
        "internationalExperience",
        [],
      );

    const leadership = safeJsonParse<AnyObject[]>(
      "leadership",
      [],
    );

    const experienceSource =
      Array.isArray(experienceStepData.experiences) &&
      experienceStepData.experiences.length > 0
        ? experienceStepData.experiences
        : legacyExperiences;

    const normalizedExperiences =
      normalizeExperiences(experienceSource);

    const currentExperience =
      normalizedExperiences.find(
        (experience) => experience.isCurrent,
      );

    const normalizedEducations = Array.isArray(
      educationInfo,
    )
      ? educationInfo.map(normalizeEducation)
      : [normalizeEducation(educationInfo)];

    const filteredEducations =
      normalizedEducations.filter(
        hasUsefulEducationData,
      );

    // Extract and parse status from experienceStepData
    let statusData: StatusData | null = null;
    
    if (experienceStepData.status) {
      if (typeof experienceStepData.status === 'object' && !Array.isArray(experienceStepData.status)) {
        statusData = experienceStepData.status as StatusData;
      } 
      else if (typeof experienceStepData.status === 'string') {
        try {
          const parsed = JSON.parse(experienceStepData.status);
          if (typeof parsed === 'object' && parsed !== null) {
            statusData = parsed as StatusData;
          }
        } catch {
          console.warn('Failed to parse status from localStorage');
        }
      }
    }

    const finalData: AnyObject = {
      ...parsedResume,
      ...basicInfo,
      ...careerPreferences,
      ...skillsAchievements,

      profileType: accountType,

      experiences: normalizedExperiences,

      companyEmail:
        experienceStepData.companyEmail
          ?.trim()
          .toLowerCase() || "",

      noticePeriod:
        experienceStepData.noticePeriod?.trim() || "",

      currentCompany:
        experienceStepData.currentCompany?.trim() ||
        currentExperience?.company ||
        "",

      currentCompany_display:
        experienceStepData.currentCompany_display?.trim() ||
        currentExperience?.company_display ||
        currentExperience?.company ||
        "",
    };

    // Add status data as an object if it exists
    if (statusData && typeof statusData === 'object') {
      finalData.status = statusData;
    }

    if (filteredEducations.length > 0) {
      finalData.educations = filteredEducations;
    }

    if (internationalExperience.length > 0) {
      finalData.internationalExperience =
        internationalExperience;
    }

    if (leadership.length > 0) {
      finalData.leadership = leadership;
    }

    delete finalData.emailVerified;
    delete finalData.lastUpdated;

    console.log(
      "Final onboarding payload before FormData:",
      finalData,
    );

    console.log("Employment fields being submitted:", {
      experiences: finalData.experiences,
      companyEmail: finalData.companyEmail,
      noticePeriod: finalData.noticePeriod,
      currentCompany: finalData.currentCompany,
      currentCompany_display:
        finalData.currentCompany_display,
      status: finalData.status,
    });

    Object.entries(finalData).forEach(
      ([key, value]) => {
        appendValueToFormData(formData, key, value);
      },
    );

    return formData;
  }

  function getStoredStatus(): StatusData | null {
    const experienceStepData = safeJsonParse<ExperienceStepData>(
      "onboarding_experiences",
      {},
    );

    if (!experienceStepData.status) return null;

    if (
      typeof experienceStepData.status === "object" &&
      !Array.isArray(experienceStepData.status)
    ) {
      return normalizeStatusForUpdate(
        experienceStepData.status as StatusData,
      );
    }

    if (typeof experienceStepData.status === "string") {
      try {
        const parsed = JSON.parse(experienceStepData.status) as unknown;
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return normalizeStatusForUpdate(parsed as StatusData);
        }
      } catch (error) {
        console.error("Unable to parse stored candidate status:", error);
      }
    }

    return null;
  }

  function clearOnboardingStorage(): void {
    const onboardingKeys = [
      "basicInfo",
      "educationInfo",
      "careerPreferences",
      "skillsAchievements",
      "parsedResume",
      "onboarding_experiences",
      "onboarding_experiences_backup",
      "experiences_data",
      "internationalExperience",
      "leadership",
    ];

    onboardingKeys.forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  async function handleSubmit(): Promise<void> {
    if (!agreed) {
      setError(
        "Please agree to the Terms & Conditions and Privacy Policy.",
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const statusToSync = getStoredStatus();
      const formData = buildOnboardingFormData();

      console.log("FormData entries:");
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response =
        await submitOnboardingProfile(formData);

      const responseAccountType =
        response?.profileType ||
        response?.user?.userType;

      const createdAccountType = isAccountType(
        responseAccountType,
      )
        ? responseAccountType
        : accountType;

      localStorage.setItem(
        "selectedRole",
        createdAccountType,
      );

      if (response?.user && response?.token) {
        login(response.user, response.token);
      }

      // Frontend-only status synchronization using the existing JSON update API.
      await syncStatusAfterOnboarding(
        statusToSync,
        response?.token,
      );

      await refreshUser();

      clearOnboardingStorage();

      router.replace(
        `/${createdAccountType}/dashboard`,
      );
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong while submitting onboarding.";

      console.error(
        "Onboarding submission error:",
        submissionError,
      );

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-[var(--background)] px-4 py-6 text-[var(--text-primary)] sm:px-5 sm:py-8">
        <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-2xl items-center justify-center">
          <div className="surface-card relative w-full overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl sm:p-8 lg:p-10">
            {/* Background Glow Effects */}
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[var(--primary)]/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[var(--primary)]/10 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-6 text-center sm:mb-8">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--primary-border)] bg-[var(--primary-soft)] sm:mb-4 sm:h-20 sm:w-20">
                  <Shield className="h-8 w-8 text-[var(--primary)] sm:h-10 sm:w-10" />
                </div>

                <h1 className="text-2xl font-bold tracking-[-0.05em] text-[var(--text-primary)] sm:text-[30px]">
                  Almost There!
                </h1>

                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)] sm:mt-3 sm:text-sm">
                  Review and accept the terms to
                  complete your profile setup.
                </p>
              </div>

              {error ? (
                <div className="mb-4 rounded-xl border border-[var(--danger-border)] bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger)]">
                  {error}
                </div>
              ) : null}

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-soft)] p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  {/* Fixed Checkbox - Now visible in both light and dark modes */}
                  <button
                    type="button"
                    onClick={() =>
                      setAgreed(
                        (previous) => !previous,
                      )
                    }
                    className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200 ${
                      agreed
                        ? "border-[var(--primary)] bg-[var(--primary)] shadow-sm shadow-[var(--primary)]/20"
                        : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary-border)] hover:bg-[var(--primary-soft)]"
                    }`}
                    aria-label="Accept terms and privacy policy"
                  >
                    {agreed ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : null}
                  </button>

                  <p className="text-sm leading-6 text-[var(--text-secondary)]">
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() =>
                        setShowTermsModal(true)
                      }
                      className="font-semibold text-[var(--primary)] underline underline-offset-4 transition hover:opacity-80"
                    >
                      Terms & Conditions
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      onClick={() =>
                        setShowPrivacyModal(true)
                      }
                      className="font-semibold text-[var(--primary)] underline underline-offset-4 transition hover:opacity-80"
                    >
                      Privacy Policy
                    </button>
                    .
                  </p>
                </div>

                <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--background)]/20 p-4 sm:mt-6">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-[var(--primary)]" />

                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                        Profile Type
                      </p>

                      <p className="text-sm font-semibold capitalize text-[var(--text-primary)] sm:text-[15px]">
                        {accountType} Account
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="btn-secondary h-10 flex-1 rounded-lg text-sm font-semibold disabled:opacity-60"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => void handleSubmit()}
                  disabled={!agreed || loading}
                  className="btn-primary flex h-10 flex-1 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all duration-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Complete Profile"
                  )}
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