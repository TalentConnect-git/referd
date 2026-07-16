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

type ExperienceStepData = {
  experiences?: ExperienceInfo[];
  companyEmail?: string;
  noticePeriod?: string;
  currentCompany?: string;
  currentCompany_display?: string;
  lastUpdated?: string;
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

    /*
     * Step Five stores experiences, companyEmail and noticePeriod together
     * in this object.
     */
    const experienceStepData =
      safeJsonParse<ExperienceStepData>(
        "onboarding_experiences",
        {},
      );

    /*
     * Backward compatibility for an older Step Five implementation that
     * only saved the experiences array.
     */
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

    /*
     * Experience-step values are assigned after the other objects are spread.
     * This prevents empty or stale careerPreferences fields from overwriting
     * companyEmail, noticePeriod and currentCompany.
     */
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

    /*
     * Verification state must be controlled by the backend after OTP or
     * company-email verification. Do not force emailVerified=true here.
     */
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
    });

    Object.entries(finalData).forEach(
      ([key, value]) => {
        appendValueToFormData(formData, key, value);
      },
    );

    return formData;
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

      const formData = buildOnboardingFormData();

      /*
       * Useful while testing signup:
       * browser console will show every field actually submitted.
       */
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

      /*
       * Refresh before clearing so the authentication/profile request has
       * already completed successfully.
       */
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
      <div className="min-h-screen bg-black px-5 py-8 text-white">
        <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-2xl items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-3xl border border-[#2a3a52] bg-[#0f172a] p-8 shadow-2xl lg:p-10">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-green-500/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-green-500/10 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10">
                  <Shield className="h-10 w-10 text-green-400" />
                </div>

                <h1 className="text-[30px] font-bold tracking-[-0.05em] text-white">
                  Almost There!
                </h1>

                <p className="mt-3 text-[14px] leading-6 text-gray-400">
                  Review and accept the terms to
                  complete your profile setup.
                </p>
              </div>

              {error ? (
                <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-[13px] text-red-400">
                  {error}
                </div>
              ) : null}

              <div className="rounded-2xl border border-[#2a3a52] bg-white/[0.04] p-5">
                <div className="flex items-start gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setAgreed(
                        (previous) => !previous,
                      )
                    }
                    className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition ${
                      agreed
                        ? "border-green-500 bg-green-500"
                        : "border-[#2a3a52] bg-[#0f172a]"
                    }`}
                    aria-label="Accept terms and privacy policy"
                  >
                    {agreed ? (
                      <CheckCircle className="h-4 w-4 text-black" />
                    ) : null}
                  </button>

                  <p className="text-[13px] leading-6 text-gray-300">
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() =>
                        setShowTermsModal(true)
                      }
                      className="font-semibold text-green-400 underline underline-offset-4 transition hover:opacity-80"
                    >
                      Terms & Conditions
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      onClick={() =>
                        setShowPrivacyModal(true)
                      }
                      className="font-semibold text-green-400 underline underline-offset-4 transition hover:opacity-80"
                    >
                      Privacy Policy
                    </button>
                    .
                  </p>
                </div>

                <div className="mt-6 rounded-xl border border-[#2a3a52] bg-black/20 p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-green-400" />

                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
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
                  className="h-10 flex-1 rounded-lg border border-[#2a3a52] bg-[#0f172a] text-[13px] font-semibold text-gray-300 transition hover:border-green-500/30 hover:bg-green-500/5 hover:text-white disabled:opacity-60"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => void handleSubmit()}
                  disabled={!agreed || loading}
                  className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 text-[13px] font-semibold text-black transition-all duration-300 hover:bg-green-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
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