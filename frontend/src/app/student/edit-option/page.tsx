"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeft,
  Briefcase,
  Globe,
  GraduationCap,
  Loader2,
  Settings,
  Trophy,
  User,
  Users,
} from "lucide-react";

// ---------- Custom SVG Icons ----------
import { AwardSvgIcon } from "@/components/profile/icons/AwardSvgIcon";
import { PublicationSvgIcon } from "@/components/profile/icons/PublicationSvgIcon";

// ---------- Shared Components ----------
import { NavOption } from "@/components/profile/shared/NavOption";
import { EditAccordion } from "@/components/profile/shared/EditAccordion";
import { SectionActions } from "@/components/profile/shared/SectionActions";

// ---------- Editor Components ----------
import { BasicInfoEditor } from "@/components/profile/editor/BasicInfoEditor";
import { EducationEditor } from "@/components/profile/editor/EducationEditor";
import { ExperienceEditor } from "@/components/profile/editor/ExperienceEditor";
import { SkillsEditor } from "@/components/profile/editor/SkillsEditor";
import { CareerDetailsEditor } from "@/components/profile/editor/CareerDetailsEditor";
import { JobPreferencesEditor } from "@/components/profile/editor/JobPreferencesEditor";
import { ToolsAndLanguagesEditor } from "@/components/profile/editor/ToolsAndLanguagesEditor";
import { InternationalExperienceEditor } from "@/components/profile/editor/InternationalExperienceEditor";
import { LeadershipEditor } from "@/components/profile/editor/LeadershipEditor";
import { AchievementEditor } from "@/components/profile/editor/AchievementEditor";
import { AwardEditor } from "@/components/profile/editor/AwardEditor";
import { PublicationEditor } from "@/components/profile/editor/PublicationEditor";

// ---------- Types ----------
import type {
  Option,
  ProfileData,
  EditForm,
  Education,
  Experience,
  InternationalExperience,
  Leadership,
  Achievement,
  Award,
  Publication,
  MasterData,
  Status,
} from "@/types/profile";

// ---------- Constants ----------
const emptyEducation: Education = {
  college: "",
  degree: "",
  specialization: "",
  semester: "",
  cgpa: "",
  yearOfGraduation: "",
  startDate: "",
  endDate: "",
  educationType: "bachelors",
  isCurrent: false,
};

const emptyExperience: Experience = {
  company: "",
  company_canonical_id: "",
  company_display: "",
  role: "",
  startDate: "",
  endDate: "",
  description: "",
  experienceCertificate: "",
  isCurrent: false,
};

const emptyInternationalExperience: InternationalExperience = {
  country: "",
  organization: "",
  role: "",
  startDate: "",
  endDate: "",
  description: "",
};

const emptyLeadership: Leadership = {
  company: "",
  organization: "",
  role: "",
  startDate: "",
  endDate: "",
  description: "",
};

const emptyAchievement: Achievement = {
  title: "",
  event: "",
  date: "",
  description: "",
};

const emptyAward: Award = {
  title: "",
  organization: "",
  startDate: "",
  endDate: "",
  description: "",
};

const emptyPublication: Publication = {
  title: "",
  url: "",
};

// ---------- Helpers ----------
function getBackendUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_API_URL is missing");
  }
  return url;
}

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || "";
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getResponseData(data: unknown): ProfileData {
  const response = data as {
    data?: ProfileData | { data?: ProfileData; profile?: ProfileData };
    profile?: ProfileData;
    user?: ProfileData;
  };

  if (response?.data && typeof response.data === "object") {
    const nested = response.data as {
      data?: ProfileData;
      profile?: ProfileData;
    };

    return nested.data || nested.profile || (response.data as ProfileData);
  }

  return response?.profile || response?.user || (data as ProfileData) || {};
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.details ||
      error.message ||
      fallback
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

function toArray(value?: string[] | string): string[] {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map(String);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item: string) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeOptions(items: unknown): Option[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((item: any): Option => {
      const value =
        item?._id ||
        item?.id ||
        item?.value ||
        item?.name ||
        item?.label ||
        item?.title ||
        "";
      const label =
        item?.name ||
        item?.label ||
        item?.value ||
        item?.title ||
        item?.college ||
        item?.collegeName ||
        value ||
        "";
      return {
        value: String(value),
        label: String(label),
      };
    })
    .filter((item: Option) => item.value.length > 0 && item.label.length > 0);
}

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

const VALID_STATUS_TYPES = new Set([
  "open_to_work",
  "career_break",
  "freelancing",
  "building",
  "not_looking",
  "looking_internship",
  "looking_job",
  "preparing_exams",
  "employed",
]);

function hasValidCurrentExperience(experiences: Experience[]): boolean {
  return (
    Array.isArray(experiences) &&
    experiences.some(
      (experience) =>
        experience?.isCurrent === true &&
        cleanText(experience.company).length > 0,
    )
  );
}

function normalizeStatus(
  status: Status | null,
  experiences: Experience[],
): Status | null {
  const hasCurrentCompany = hasValidCurrentExperience(experiences);

  if (hasCurrentCompany) {
    const currentExperience = experiences.find(
      (experience) =>
        experience?.isCurrent === true &&
        cleanText(experience.company).length > 0,
    );

    return {
      type: "employed",
      since:
        cleanText(currentExperience?.startDate) ||
        new Date().toISOString().split("T")[0],
      note: "",
      expectedReturn: null,
    };
  }

  if (!status || typeof status !== "object") {
    return null;
  }

  const type = cleanText(status.type);

  if (!type || !VALID_STATUS_TYPES.has(type) || type === "employed") {
    return null;
  }

  return {
    type,
    since: cleanText(status.since) || new Date().toISOString().split("T")[0],
    note: cleanText(status.note).slice(0, 500),
    expectedReturn:
      type === "career_break" ? cleanText(status.expectedReturn) || null : null,
  };
}

function profileToForm(profile: ProfileData): EditForm {
  return {
    fullName: profile.fullName || profile.name || "",
    name: profile.name || profile.fullName || "",
    email: profile.email || "",
    phone: profile.phone || "",
    about: profile.about || "",
    visaStatus: profile.visaStatus || "",
    gender: profile.gender || "",
    dob: profile.dob ? String(profile.dob).slice(0, 10) : "",
    ethnicity: profile.ethnicity || "",
    maritalStatus: profile.maritalStatus || "",
    linkedin: profile.linkedin || "",
    github: profile.github || "",
    portfolio: profile.portfolio || "",
    profileImage: profile.profileImage || "",
    resume: profile.resume || "",
    educations:
      profile.educations?.length || profile.education?.length
        ? profile.educations || profile.education || []
        : [{ ...emptyEducation }],
    experiences:
      profile.experiences?.length || profile.experience?.length
        ? profile.experiences || profile.experience || []
        : [{ ...emptyExperience }],
    internationalExperience: profile.internationalExperience?.length
      ? profile.internationalExperience
      : [{ ...emptyInternationalExperience }],
    leadership: profile.leadership?.length
      ? profile.leadership
      : [{ ...emptyLeadership }],
    achievements: profile.achievements?.length
      ? profile.achievements
      : [{ ...emptyAchievement }],
    award: profile.awards?.length ? profile.awards : [{ ...emptyAward }],
    publications: profile.publications?.length
      ? profile.publications
      : [{ ...emptyPublication }],
    skills: toArray(profile.skills),
    toolsAndPlatforms: toArray(profile.toolsAndPlatforms),
    languagesKnown: toArray(profile.languagesKnown),
    domainKnowledge: toArray(profile.domainKnowledge),
    jobRoles: toArray(profile.jobRoles),
    locations: toArray(profile.locations),
    employmentType: toArray(profile.employmentType),
    lookingFor: toArray(profile.lookingFor),
    industry: toArray(profile.industry),
    currentCompany: profile.currentCompany || "",
    currentCompany_display: profile.currentCompany_display || "",
    companyEmail: profile.companyEmail || "",
    totalYearsOfExperience: profile.totalYearsOfExperience || "",
    noticePeriod: profile.noticePeriod || "",
    noticePeriodStartDate: profile.noticePeriodStartDate || "",
    servingNoticePeriod: profile.servingNoticePeriod || false,
    openToShift: profile.openToShift || "",
    shiftPreferences: profile.shiftPreferences || {
      Day: false,
      Night: false,
      Rotational: false,
      Any: false,
    },
    currentSalaryCurrency: profile.currentSalaryCurrency || "₹",
    currentSalaryAmount: profile.currentSalaryAmount || "",
    expectedSalaryCurrency: profile.expectedSalaryCurrency || "₹",
    expectedSalaryAmount: profile.expectedSalaryAmount || "",
    status:
      profile.status &&
      cleanText(profile.status.type) &&
      VALID_STATUS_TYPES.has(cleanText(profile.status.type))
        ? profile.status
        : null,
  };
}

type PayloadRecord = Record<string, unknown>;

type ToastState = {
  type: "success" | "error";
  message: string;
} | null;

function hasMeaningfulValue(value: unknown): boolean {
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return true;
  if (Array.isArray(value)) return value.some(hasMeaningfulValue);

  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some(
      hasMeaningfulValue,
    );
  }

  return false;
}

function hasMeaningfulRow(
  row: Record<string, unknown>,
  ignoredKeys: string[] = ["_id", "__v"],
): boolean {
  return Object.entries(row).some(
    ([key, value]) => !ignoredKeys.includes(key) && hasMeaningfulValue(value),
  );
}

function cleanStringArray(values: unknown): string[] {
  if (!Array.isArray(values)) return [];

  return Array.from(
    new Set(
      values
        .map((value) => cleanText(value))
        .filter((value) => value.length > 0),
    ),
  );
}

function cleanObjectArray<T extends Record<string, unknown>>(
  values: T[] | undefined,
): T[] {
  if (!Array.isArray(values)) return [];

  return values
    .filter((item) => item && typeof item === "object")
    .filter((item) => hasMeaningfulRow(item))
    .map((item) => {
      const cleaned = { ...item };

      Object.entries(cleaned).forEach(([key, value]) => {
        if (typeof value === "string") {
          (cleaned as Record<string, unknown>)[key] = value.trim();
        }
      });

      return cleaned;
    });
}

function getEnteredEducationRows(
  educations: Education[],
): Record<string, unknown>[] {
  if (!Array.isArray(educations)) return [];

  return (educations as unknown as Record<string, unknown>[]).filter((item) =>
    hasMeaningfulRow(item, ["_id", "__v", "educationType", "isCurrent"]),
  );
}

function cleanEducations(educations: Education[]): Education[] {
  return getEnteredEducationRows(educations)
    .filter(
      (item) =>
        cleanText(item.college).length > 0 && cleanText(item.degree).length > 0,
    )
    .map((item) => {
      const cleaned = { ...item };

      Object.entries(cleaned).forEach(([key, value]) => {
        if (typeof value === "string") {
          cleaned[key] = value.trim();
        }
      });

      return cleaned as unknown as Education;
    });
}

function getEnteredExperienceRows(
  experiences: Experience[],
): Record<string, unknown>[] {
  if (!Array.isArray(experiences)) return [];

  return (experiences as unknown as Record<string, unknown>[]).filter((item) =>
    hasMeaningfulRow(item, [
      "_id",
      "__v",
      "company_canonical_id",
      "company_display",
      "company_master_id",
      "isCurrent",
    ]),
  );
}

function cleanExperiences(experiences: Experience[]): Experience[] {
  return getEnteredExperienceRows(experiences)
    .filter((item) => cleanText(item.company).length > 0)
    .map((item) => {
      const {
        company_canonical_id: _companyCanonicalId,
        company_display: _companyDisplay,
        company_master_id: _companyMasterId,
        ...experience
      } = item;

      Object.entries(experience).forEach(([key, value]) => {
        if (typeof value === "string") {
          experience[key] = value.trim();
        }
      });

      return experience as unknown as Experience;
    });
}

function validateSection(sectionName: string, form: EditForm): string | null {
  if (sectionName === "Basic Information") {
    if (!cleanText(form.name || form.fullName)) {
      return "Please enter your name.";
    }

    if (!cleanText(form.email)) {
      return "Please enter your email address.";
    }

    if (!cleanText(form.phone)) {
      return "Please enter your phone number.";
    }
  }

  if (sectionName === "Education") {
    const allRows = Array.isArray(form.educations)
      ? (form.educations as unknown as Record<string, unknown>[])
      : [];

    for (let index = 0; index < allRows.length; index += 1) {
      const education = allRows[index];
      const college = cleanText(education.college);
      const degree = cleanText(education.degree);
      const isCurrent = education.isCurrent === true;

      const containsOtherEducationData = hasMeaningfulRow(education, [
        "_id",
        "__v",
        "college",
        "degree",
        "educationType",
        "isCurrent",
      ]);

      const hasStartedEducation =
        Boolean(college) ||
        Boolean(degree) ||
        isCurrent ||
        containsOtherEducationData;

      if (!hasStartedEducation) continue;

      if (!college && !degree) {
        return `Education ${index + 1}: college name and degree name are required.`;
      }

      if (!college) {
        return `Education ${index + 1}: college name is required.`;
      }

      if (!degree) {
        return `Education ${index + 1}: degree name is required.`;
      }
    }
  }

  if (sectionName === "Experience") {
    const allRows = Array.isArray(form.experiences)
      ? (form.experiences as unknown as Record<string, unknown>[])
      : [];

    for (let index = 0; index < allRows.length; index += 1) {
      const experience = allRows[index];
      const company = cleanText(experience.company);
      const isCurrent = experience.isCurrent === true;
      const containsOtherExperienceData = hasMeaningfulRow(experience, [
        "_id",
        "__v",
        "company",
        "company_canonical_id",
        "company_display",
        "company_master_id",
        "isCurrent",
      ]);

      if (isCurrent && !company) {
        return `Experience ${index + 1}: please enter the company name before saving Currently Working.`;
      }

      if (containsOtherExperienceData && !company) {
        return `Experience ${index + 1}: company name is required.`;
      }
    }

    const hasCurrentCompany = hasValidCurrentExperience(form.experiences);
    const normalizedStatus = normalizeStatus(form.status, form.experiences);

    if (!hasCurrentCompany && !normalizedStatus) {
      return "Please select your current status.";
    }

    if (
      normalizedStatus?.type === "career_break" &&
      !normalizedStatus.expectedReturn
    ) {
      return "Please select the expected return date for your career break.";
    }
  }

  return null;
}

function assignIfNotEmpty(
  payload: PayloadRecord,
  key: string,
  value: unknown[],
): void {
  if (value.length > 0) payload[key] = value;
}

function buildSectionPayload(
  sectionName: string,
  form: EditForm,
): PayloadRecord {
  switch (sectionName) {
    case "Basic Information":
      return {
        name: cleanText(form.name || form.fullName),
        fullName: cleanText(form.fullName || form.name),
        email: cleanText(form.email).toLowerCase(),
        phone: cleanText(form.phone),
        about: cleanText(form.about),
        visaStatus: cleanText(form.visaStatus),
        gender: cleanText(form.gender),
        dob: cleanText(form.dob),
        ethnicity: cleanText(form.ethnicity),
        maritalStatus: cleanText(form.maritalStatus),
        linkedin: cleanText(form.linkedin),
        github: cleanText(form.github),
        portfolio: cleanText(form.portfolio),
        profileImage: cleanText(form.profileImage),
        resume: cleanText(form.resume),
      };

    case "Education": {
      const payload: PayloadRecord = {};
      assignIfNotEmpty(payload, "educations", cleanEducations(form.educations));
      return payload;
    }

    case "Experience": {
      const payload: PayloadRecord = {};
      assignIfNotEmpty(
        payload,
        "experiences",
        cleanExperiences(form.experiences),
      );

      const companyEmail = cleanText(form.companyEmail).toLowerCase();
      const noticePeriod = cleanText(form.noticePeriod);
      if (companyEmail) payload.companyEmail = companyEmail;
      if (noticePeriod) payload.noticePeriod = noticePeriod;

      const normalizedStatus = normalizeStatus(form.status, form.experiences);

      if (normalizedStatus) {
        payload.status = normalizedStatus;
      }

      return payload;
    }

    case "Skills": {
      const payload: PayloadRecord = {};
      assignIfNotEmpty(payload, "skills", cleanStringArray(form.skills));
      return payload;
    }

    case "Career Details":
      return {
        currentCompany: cleanText(form.currentCompany),
        currentCompany_display: cleanText(form.currentCompany_display),
        companyEmail: cleanText(form.companyEmail).toLowerCase(),
        totalYearsOfExperience: cleanText(form.totalYearsOfExperience),
        noticePeriod: cleanText(form.noticePeriod),
        noticePeriodStartDate: cleanText(form.noticePeriodStartDate),
        servingNoticePeriod: Boolean(form.servingNoticePeriod),
        currentSalaryCurrency: cleanText(form.currentSalaryCurrency) || "₹",
        currentSalaryAmount: cleanText(form.currentSalaryAmount),
      };

    case "Job Preferences": {
      const payload: PayloadRecord = {
        openToShift: cleanText(form.openToShift),
        shiftPreferences: form.shiftPreferences,
        currentSalaryCurrency: cleanText(form.currentSalaryCurrency) || "₹",
        currentSalaryAmount: cleanText(form.currentSalaryAmount),
        expectedSalaryCurrency: cleanText(form.expectedSalaryCurrency) || "₹",
        expectedSalaryAmount: cleanText(form.expectedSalaryAmount),
      };
      assignIfNotEmpty(payload, "jobRoles", cleanStringArray(form.jobRoles));
      assignIfNotEmpty(payload, "locations", cleanStringArray(form.locations));
      assignIfNotEmpty(
        payload,
        "employmentType",
        cleanStringArray(form.employmentType),
      );
      assignIfNotEmpty(
        payload,
        "lookingFor",
        cleanStringArray(form.lookingFor),
      );
      assignIfNotEmpty(payload, "industry", cleanStringArray(form.industry));
      return payload;
    }

    case "Tools & Languages": {
      const payload: PayloadRecord = {};
      assignIfNotEmpty(
        payload,
        "toolsAndPlatforms",
        cleanStringArray(form.toolsAndPlatforms),
      );
      assignIfNotEmpty(
        payload,
        "languagesKnown",
        cleanStringArray(form.languagesKnown),
      );
      assignIfNotEmpty(
        payload,
        "domainKnowledge",
        cleanStringArray(form.domainKnowledge),
      );
      return payload;
    }

    case "International Experience": {
      const payload: PayloadRecord = {};
      assignIfNotEmpty(
        payload,
        "internationalExperience",
        cleanObjectArray(
          form.internationalExperience as unknown as Record<string, unknown>[],
        ),
      );
      return payload;
    }

    case "Leadership": {
      const payload: PayloadRecord = {};
      assignIfNotEmpty(
        payload,
        "leadership",
        cleanObjectArray(
          form.leadership as unknown as Record<string, unknown>[],
        ),
      );
      return payload;
    }

    case "Achievements": {
      const payload: PayloadRecord = {};
      assignIfNotEmpty(
        payload,
        "achievements",
        cleanObjectArray(
          form.achievements as unknown as Record<string, unknown>[],
        ),
      );
      return payload;
    }

    case "Awards": {
      const payload: PayloadRecord = {};
      assignIfNotEmpty(
        payload,
        "awards",
        cleanObjectArray(form.award as unknown as Record<string, unknown>[]),
      );
      return payload;
    }

    case "Publications": {
      const payload: PayloadRecord = {};
      assignIfNotEmpty(
        payload,
        "publications",
        cleanObjectArray(
          form.publications as unknown as Record<string, unknown>[],
        ),
      );
      return payload;
    }

    default:
      return {};
  }
}

// ---------- Page Component ----------
export default function EditProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [form, setForm] = useState<EditForm | null>(null);
  const [openSection, setOpenSection] = useState<string>("basic");
  const [loading, setLoading] = useState<boolean>(true);
  const [savingSection, setSavingSection] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [toast, setToast] = useState<ToastState>(null);

  const [masterData, setMasterData] = useState<MasterData>({
    colleges: [],
    degrees: [],
    streamsByDegree: {},
    industries: [],
    jobRoles: [],
  });

  const userType = useMemo<"student" | "fresher" | "professional">(() => {
    const type = profile?.profileType;
    if (type === "professional" || type === "fresher" || type === "student") {
      return type;
    }
    return "student";
  }, [profile]);

  const displayName = useMemo<string>(() => {
    return (
      form?.fullName ||
      form?.name ||
      profile?.fullName ||
      profile?.name ||
      "User"
    );
  }, [form, profile]);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });

    window.setTimeout(() => {
      setToast((current) =>
        current?.message === message && current.type === type ? null : current,
      );
    }, 3500);
  }

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    try {
      setLoading(true);
      setError("");

      const backendUrl = getBackendUrl();

      const [profileRes, collegesRes, degreesRes, industriesRes, jobRolesRes] =
        await Promise.allSettled([
          axios.get(`${backendUrl}/api/onboarding/me`, {
            withCredentials: true,
            headers: authHeaders(),
          }),
          axios.get(`${backendUrl}/api/colleges/all`, {
            withCredentials: true,
            headers: authHeaders(),
          }),
          axios.get(`${backendUrl}/api/master-data?type=DEGREE`, {
            withCredentials: true,
            headers: authHeaders(),
          }),
          axios.get(
            `${backendUrl}/api/company-master-data?type=INDUSTRY_TYPE`,
            {
              withCredentials: true,
              headers: authHeaders(),
            },
          ),
          axios.get(`${backendUrl}/api/company-master-data?type=JOB_ROLE`, {
            withCredentials: true,
            headers: authHeaders(),
          }),
        ]);

      if (profileRes.status !== "fulfilled") {
        throw profileRes.reason;
      }

      const profileData = getResponseData(profileRes.value.data);

      setProfile(profileData);
      setForm(profileToForm(profileData));

      setMasterData({
        colleges:
          collegesRes.status === "fulfilled"
            ? normalizeOptions(
                collegesRes.value.data?.data ||
                  collegesRes.value.data?.colleges ||
                  collegesRes.value.data ||
                  [],
              )
            : [],
        degrees:
          degreesRes.status === "fulfilled"
            ? normalizeOptions(
                degreesRes.value.data?.data ||
                  degreesRes.value.data?.items ||
                  degreesRes.value.data ||
                  [],
              )
            : [],
        streamsByDegree: {},
        industries:
          industriesRes.status === "fulfilled"
            ? normalizeOptions(
                industriesRes.value.data?.data ||
                  industriesRes.value.data?.items ||
                  industriesRes.value.data ||
                  [],
              )
            : [],
        jobRoles:
          jobRolesRes.status === "fulfilled"
            ? normalizeOptions(
                jobRolesRes.value.data?.data ||
                  jobRolesRes.value.data?.items ||
                  jobRolesRes.value.data ||
                  [],
              )
            : [],
      });
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Failed to load profile"));
    } finally {
      setLoading(false);
    }
  }

  async function loadStreamsForDegree(degreeLabel: string) {
    try {
      if (!degreeLabel) return;

      const selectedDegree = masterData.degrees.find(
        (degree: Option) =>
          degree.label === degreeLabel || degree.value === degreeLabel,
      );

      if (!selectedDegree?.value) return;

      if (masterData.streamsByDegree[selectedDegree.value]) return;

      const backendUrl = getBackendUrl();

      const response = await axios.get(
        `${backendUrl}/api/master-data?type=STREAM&parent=${selectedDegree.value}`,
        {
          withCredentials: true,
          headers: authHeaders(),
        },
      );

      const options = normalizeOptions(
        response.data?.data || response.data?.items || response.data || [],
      );

      setMasterData((prev: MasterData) => ({
        ...prev,
        streamsByDegree: {
          ...prev.streamsByDegree,
          [selectedDegree.value]: options,
        },
      }));
    } catch {
      // Keep specialization custom input usable even if stream API fails.
    }
  }

  // ✅ Use useCallback to prevent recreation on every render
  const updateField = useCallback(
    <K extends keyof EditForm>(field: K, value: EditForm[K]) => {
      setForm((prev: EditForm | null) => {
        if (!prev) return prev;
        return {
          ...prev,
          [field]: value,
        };
      });
    },
    [],
  );

  // ✅ Memoized status update handler
  const handleStatusTypeChange = useCallback((value: string) => {
    const nextType = value.trim();

    setForm((prev: EditForm | null) => {
      if (!prev) return prev;

      if (!nextType) {
        return { ...prev, status: null };
      }

      const today = new Date().toISOString().split("T")[0];
      const prevStatus = prev.status || {
        type: "",
        since: "",
        note: "",
        expectedReturn: null,
      };

      return {
        ...prev,
        status: {
          type: nextType,
          since: today,
          note: prevStatus.note || "",
          expectedReturn:
            nextType === "career_break"
              ? prevStatus.expectedReturn || null
              : null,
        },
      };
    });
  }, []);

  const handleStatusSinceChange = useCallback((value: string) => {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;
      const prevStatus = prev.status || {
        type: "",
        since: "",
        note: "",
        expectedReturn: null,
      };
      return {
        ...prev,
        status: { ...prevStatus, since: value },
      };
    });
  }, []);

  const handleStatusNoteChange = useCallback((value: string) => {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;
      const prevStatus = prev.status || {
        type: "",
        since: "",
        note: "",
        expectedReturn: null,
      };
      return {
        ...prev,
        status: { ...prevStatus, note: value.slice(0, 500) },
      };
    });
  }, []);

  const handleStatusExpectedReturnChange = useCallback((value: string) => {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;
      const prevStatus = prev.status || {
        type: "",
        since: "",
        note: "",
        expectedReturn: null,
      };
      return {
        ...prev,
        status: { ...prevStatus, expectedReturn: value || null },
      };
    });
  }, []);

  function updateEducation<K extends keyof Education>(
    index: number,
    key: K,
    value: Education[K],
  ) {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;
      const next = [...prev.educations];
      next[index] = {
        ...next[index],
        [key]: value,
      };
      if (key === "degree") {
        next[index].specialization = "";
      }
      if (key === "educationType" && value === "school") {
        next[index].semester = "";
      }
      if (key === "isCurrent" && value === true) {
        next[index].endDate = "";
      }
      return {
        ...prev,
        educations: next,
      };
    });
  }

  function addEducation() {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;
      return {
        ...prev,
        educations: [...prev.educations, { ...emptyEducation }],
      };
    });
  }

  function removeEducation(index: number) {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;
      const next = prev.educations.filter(
        (_item: Education, itemIndex: number) => itemIndex !== index,
      );
      return {
        ...prev,
        educations: next.length ? next : [{ ...emptyEducation }],
      };
    });
  }

  function updateExperience<K extends keyof Experience>(
    index: number,
    key: K,
    value: Experience[K],
  ) {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;

      const next = [...prev.experiences];
      next[index] = {
        ...next[index],
        [key]: value,
      };

      if (key === "isCurrent" && value === true) {
        next[index].endDate = "";
      }

      return {
        ...prev,
        experiences: next,
      };
    });
  }

  function addExperience() {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;
      return {
        ...prev,
        experiences: [...prev.experiences, { ...emptyExperience }],
      };
    });
  }

  function removeExperience(index: number) {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;
      const next = prev.experiences.filter(
        (_item: Experience, itemIndex: number) => itemIndex !== index,
      );
      return {
        ...prev,
        experiences: next.length ? next : [{ ...emptyExperience }],
      };
    });
  }

  function updateInternational<K extends keyof InternationalExperience>(
    index: number,
    key: K,
    value: InternationalExperience[K],
  ) {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;
      const next = [...prev.internationalExperience];
      next[index] = {
        ...next[index],
        [key]: value,
      };
      return {
        ...prev,
        internationalExperience: next,
      };
    });
  }

  function addInternational() {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;
      return {
        ...prev,
        internationalExperience: [
          ...prev.internationalExperience,
          { ...emptyInternationalExperience },
        ],
      };
    });
  }

  function removeInternational(index: number) {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;
      const next = prev.internationalExperience.filter(
        (_item: InternationalExperience, itemIndex: number) =>
          itemIndex !== index,
      );
      return {
        ...prev,
        internationalExperience: next.length
          ? next
          : [{ ...emptyInternationalExperience }],
      };
    });
  }

  function updateLeadership<K extends keyof Leadership>(
    index: number,
    key: K,
    value: Leadership[K],
  ) {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;
      const next = [...prev.leadership];
      next[index] = {
        ...next[index],
        [key]: value,
      };
      return {
        ...prev,
        leadership: next,
      };
    });
  }

  function addLeadership() {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;
      return {
        ...prev,
        leadership: [...prev.leadership, { ...emptyLeadership }],
      };
    });
  }

  function removeLeadership(index: number) {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;
      const next = prev.leadership.filter(
        (_item: Leadership, itemIndex: number) => itemIndex !== index,
      );
      return {
        ...prev,
        leadership: next.length ? next : [{ ...emptyLeadership }],
      };
    });
  }

  function updateAchievement<K extends keyof Achievement>(
    index: number,
    key: K,
    value: Achievement[K],
  ) {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;
      const next = [...prev.achievements];
      next[index] = {
        ...next[index],
        [key]: value,
      };
      return {
        ...prev,
        achievements: next,
      };
    });
  }

  function addAchievement() {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;
      return {
        ...prev,
        achievements: [...prev.achievements, { ...emptyAchievement }],
      };
    });
  }

  function removeAchievement(index: number) {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;
      const next = prev.achievements.filter(
        (_item: Achievement, itemIndex: number) => itemIndex !== index,
      );
      return {
        ...prev,
        achievements: next.length ? next : [{ ...emptyAchievement }],
      };
    });
  }

  function updateAward<K extends keyof Award>(
    index: number,
    key: K,
    value: Award[K],
  ) {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;

      const next = [...prev.award];
      next[index] = {
        ...next[index],
        [key]: value,
      };

      return {
        ...prev,
        award: next,
      };
    });
  }

  function addAward() {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;

      return {
        ...prev,
        award: [...prev.award, { ...emptyAward }],
      };
    });
  }

  function removeAward(index: number) {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;

      const next = prev.award.filter(
        (_item: Award, itemIndex: number) => itemIndex !== index,
      );

      return {
        ...prev,
        award: next.length ? next : [{ ...emptyAward }],
      };
    });
  }

  function updatePublication<K extends keyof Publication>(
    index: number,
    key: K,
    value: Publication[K],
  ) {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;
      const next = [...prev.publications];
      next[index] = {
        ...next[index],
        [key]: value,
      };
      return {
        ...prev,
        publications: next,
      };
    });
  }

  function addPublication() {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;
      return {
        ...prev,
        publications: [...prev.publications, { ...emptyPublication }],
      };
    });
  }

  function removePublication(index: number) {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;
      const next = prev.publications.filter(
        (_item: Publication, itemIndex: number) => itemIndex !== index,
      );
      return {
        ...prev,
        publications: next.length ? next : [{ ...emptyPublication }],
      };
    });
  }

  function cancelChanges() {
    if (!profile) return;
    setForm(profileToForm(profile));
    setSuccess("");
    setError("");
  }

  async function saveSection(sectionName: string) {
    if (!form || savingSection) return;

    const validationError = validateSection(sectionName, form);

    if (validationError) {
      setError(validationError);
      setSuccess("");
      showToast("error", validationError);
      return;
    }

    try {
      setSavingSection(sectionName);
      setError("");
      setSuccess("");

      const backendUrl = getBackendUrl();
      const payload = buildSectionPayload(sectionName, form);

      if (Object.keys(payload).length === 0) {
        const message = `No ${sectionName.toLowerCase()} data to save.`;
        setSuccess(message);
        showToast("success", message);
        return;
      }

      const response = await axios.put(
        `${backendUrl}/api/onboarding/update`,
        payload,
        {
          withCredentials: true,
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
        },
      );

      const updatedProfile = getResponseData(response.data);

      const nextProfile =
        Object.keys(updatedProfile).length > 0
          ? updatedProfile
          : ({
              ...profile,
              ...payload,
            } as ProfileData);

      setProfile(nextProfile);
      setForm(profileToForm(nextProfile));

      const message = `${sectionName} saved successfully.`;
      setSuccess(message);
      showToast("success", message);
    } catch (error: unknown) {
      console.error("Save error:", error);

      const message = getErrorMessage(error, "Failed to save profile.");
      setError(message);
      setSuccess("");
      showToast("error", message);
    } finally {
      setSavingSection("");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] text-white">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[var(--primary)]" />
        Loading profile...
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 text-center text-red-400">
        {error}
      </div>
    );
  }

  if (!form) return null;

  // ✅ Status state for ExperienceEditor
  const statusData = form.status || {
    type: "",
    since: "",
    note: "",
    expectedReturn: null,
  };

  // ✅ Add debug log
  console.log("Parent statusData:", statusData);

  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      {toast && (
        <div
          role="alert"
          aria-live="assertive"
          className={`fixed right-4 top-4 z-[100] max-w-sm rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur ${
            toast.type === "success"
              ? "border-emerald-500/40 bg-emerald-950/95 text-emerald-200"
              : "border-red-500/40 bg-red-950/95 text-red-200"
          }`}
        >
          {toast.message}
        </div>
      )}

      <header className="flex min-h-[72px] items-center justify-between border-b border-[var(--border)] px-4 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-white transition hover:bg-[var(--card-hover)]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div>
            <h1 className="text-[16px] font-semibold">Edit Profile</h1>
            <p className="mt-1 text-[12px] text-[var(--text-muted)]">
              Update your information section by section
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={cancelChanges}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[var(--card-hover)]"
        >
          Reset
        </button>
      </header>

      <main className="grid gap-6 px-4 py-7 sm:px-8 lg:grid-cols-[340px_1fr]">
        <aside className="h-fit rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 lg:sticky lg:top-6">
          <div className="mb-6">
            <p className="text-[12px] uppercase tracking-wide text-[var(--text-muted)]">
              Editing
            </p>
            <h2 className="mt-1 text-[20px] font-bold text-white">
              {displayName}
            </h2>
            <p className="mt-1 text-[13px] text-[var(--text-primary)]">
              Click any section to edit
            </p>
          </div>

          <div className="space-y-2">
            <NavOption
              active={openSection === "basic"}
              icon={<User className="h-4 w-4" />}
              title="Basic Information"
              onClick={() => setOpenSection("basic")}
            />

            <NavOption
              active={openSection === "education"}
              icon={<GraduationCap className="h-4 w-4" />}
              title="Education"
              onClick={() => setOpenSection("education")}
            />

            <NavOption
              active={openSection === "experience"}
              icon={<Briefcase className="h-4 w-4" />}
              title="Experience"
              onClick={() => setOpenSection("experience")}
            />

            <NavOption
              active={openSection === "skills"}
              icon={<AwardSvgIcon className="h-4 w-4" />}
              title="Skills"
              onClick={() => setOpenSection("skills")}
            />

            <NavOption
              active={openSection === "career"}
              icon={<Settings className="h-4 w-4" />}
              title="Career Details"
              onClick={() => setOpenSection("career")}
            />

            <NavOption
              active={openSection === "preferences"}
              icon={<Settings className="h-4 w-4" />}
              title="Job Preferences"
              onClick={() => setOpenSection("preferences")}
            />

            <NavOption
              active={openSection === "tools"}
              icon={<AwardSvgIcon className="h-4 w-4" />}
              title="Tools & Languages"
              onClick={() => setOpenSection("tools")}
            />

            <NavOption
              active={openSection === "international"}
              icon={<Globe className="h-4 w-4" />}
              title="International Experience"
              onClick={() => setOpenSection("international")}
            />

            <NavOption
              active={openSection === "leadership"}
              icon={<Users className="h-4 w-4" />}
              title="Leadership"
              onClick={() => setOpenSection("leadership")}
            />

            <NavOption
              active={openSection === "achievements"}
              icon={<Trophy className="h-4 w-4" />}
              title="Achievements"
              onClick={() => setOpenSection("achievements")}
            />

            <NavOption
              active={openSection === "awards"}
              icon={<AwardSvgIcon className="h-4 w-4" />}
              title="Awards"
              onClick={() => setOpenSection("awards")}
            />

            <NavOption
              active={openSection === "publications"}
              icon={<PublicationSvgIcon className="h-4 w-4" />}
              title="Publications"
              onClick={() => setOpenSection("publications")}
            />
          </div>
        </aside>

        <section className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-300">
              {success}
            </div>
          )}

          <EditAccordion
            id="basic"
            openSection={openSection}
            setOpenSection={setOpenSection}
            icon={<User className="h-4 w-4" />}
            title="Basic Information"
            subtitle="Name, contact, about and social links"
          >
            <BasicInfoEditor form={form} updateField={updateField} />

            <SectionActions
              loading={savingSection === "Basic Information"}
              onCancel={cancelChanges}
              onSave={() => saveSection("Basic Information")}
            />
          </EditAccordion>

          <EditAccordion
            id="education"
            openSection={openSection}
            setOpenSection={setOpenSection}
            icon={<GraduationCap className="h-4 w-4" />}
            title="Education"
            subtitle="College, degree, stream, semester and CGPA"
          >
            <EducationEditor
              educations={form.educations}
              masterData={masterData}
              userType={userType}
              onUpdate={updateEducation}
              onAdd={addEducation}
              onRemove={removeEducation}
              onLoadStreams={loadStreamsForDegree}
            />

            <SectionActions
              loading={savingSection === "Education"}
              onCancel={cancelChanges}
              onSave={() => saveSection("Education")}
            />
          </EditAccordion>

          <EditAccordion
            id="experience"
            openSection={openSection}
            setOpenSection={setOpenSection}
            icon={<Briefcase className="h-4 w-4" />}
            title="Experience"
            subtitle="Company, role, dates and description"
          >
            <ExperienceEditor
              experiences={form.experiences}
              userType={userType}
              onUpdate={updateExperience}
              onAdd={addExperience}
              onRemove={removeExperience}
              companyEmail={form.companyEmail || ""}
              noticePeriod={form.noticePeriod || ""}
              onCompanyEmailChange={(value: string) =>
                updateField("companyEmail", value)
              }
              onNoticePeriodChange={(value: string) =>
                updateField("noticePeriod", value)
              }
              statusType={statusData.type || ""}
              statusSince={statusData.since || ""}
              statusNote={statusData.note || ""}
              statusExpectedReturn={statusData.expectedReturn || ""}
              onStatusTypeChange={handleStatusTypeChange}
              onStatusSinceChange={handleStatusSinceChange}
              onStatusNoteChange={handleStatusNoteChange}
              onStatusExpectedReturnChange={handleStatusExpectedReturnChange}
            />

            <SectionActions
              loading={savingSection === "Experience"}
              onCancel={cancelChanges}
              onSave={() => saveSection("Experience")}
            />
          </EditAccordion>

          <EditAccordion
            id="skills"
            openSection={openSection}
            setOpenSection={setOpenSection}
            icon={<AwardSvgIcon className="h-4 w-4" />}
            title="Skills"
            subtitle="Add or remove technical skills"
          >
            <SkillsEditor
              skills={form.skills}
              onChange={(skills: string[]) => updateField("skills", skills)}
            />

            <SectionActions
              loading={savingSection === "Skills"}
              onCancel={cancelChanges}
              onSave={() => saveSection("Skills")}
            />
          </EditAccordion>

          <EditAccordion
            id="career"
            openSection={openSection}
            setOpenSection={setOpenSection}
            icon={<Settings className="h-4 w-4" />}
            title="Career Details"
            subtitle="Company, experience and notice period"
          >
            <CareerDetailsEditor
              currentCompany={form.currentCompany || ""}
              currentCompany_display={form.currentCompany_display || ""}
              companyEmail={form.companyEmail || ""}
              totalYearsOfExperience={form.totalYearsOfExperience || ""}
              noticePeriod={form.noticePeriod || ""}
              servingNoticePeriod={form.servingNoticePeriod || false}
              noticePeriodStartDate={form.noticePeriodStartDate || ""}
              currentSalaryCurrency={form.currentSalaryCurrency || "₹"}
              currentSalaryAmount={form.currentSalaryAmount || ""}
              experiences={form.experiences || []}
              onUpdate={(field: string, value: string | boolean) => {
                updateField(field as keyof EditForm, value as never);
              }}
            />

            <SectionActions
              loading={savingSection === "Career Details"}
              onCancel={cancelChanges}
              onSave={() => saveSection("Career Details")}
            />
          </EditAccordion>

          <EditAccordion
            id="preferences"
            openSection={openSection}
            setOpenSection={setOpenSection}
            icon={<Settings className="h-4 w-4" />}
            title="Job Preferences"
            subtitle="Roles, locations, industry and job type"
          >
            <JobPreferencesEditor
              jobRoles={form.jobRoles}
              industry={form.industry}
              lookingFor={form.lookingFor}
              employmentType={form.employmentType}
              locations={form.locations}
              openToShift={form.openToShift}
              shiftPreferences={form.shiftPreferences}
              currentSalaryCurrency={form.currentSalaryCurrency}
              currentSalaryAmount={form.currentSalaryAmount}
              expectedSalaryCurrency={form.expectedSalaryCurrency}
              expectedSalaryAmount={form.expectedSalaryAmount}
              onUpdate={(field: string, value: unknown) => {
                updateField(field as keyof EditForm, value as never);
              }}
              roleOptions={masterData.jobRoles}
              industryOptions={masterData.industries}
            />

            <SectionActions
              loading={savingSection === "Job Preferences"}
              onCancel={cancelChanges}
              onSave={() => saveSection("Job Preferences")}
            />
          </EditAccordion>

          <EditAccordion
            id="tools"
            openSection={openSection}
            setOpenSection={setOpenSection}
            icon={<AwardSvgIcon className="h-4 w-4" />}
            title="Tools & Languages"
            subtitle="Tools, domains and known languages"
          >
            <ToolsAndLanguagesEditor
              tools={form.toolsAndPlatforms}
              domains={form.domainKnowledge}
              languages={form.languagesKnown}
              onUpdate={(field: string, items: string[]) => {
                updateField(field as keyof EditForm, items as never);
              }}
            />

            <SectionActions
              loading={savingSection === "Tools & Languages"}
              onCancel={cancelChanges}
              onSave={() => saveSection("Tools & Languages")}
            />
          </EditAccordion>

          <EditAccordion
            id="international"
            openSection={openSection}
            setOpenSection={setOpenSection}
            icon={<Globe className="h-4 w-4" />}
            title="International Experience"
            subtitle="Work experience in different countries"
          >
            <InternationalExperienceEditor
              items={form.internationalExperience}
              onUpdate={updateInternational}
              onAdd={addInternational}
              onRemove={removeInternational}
            />

            <SectionActions
              loading={savingSection === "International Experience"}
              onCancel={cancelChanges}
              onSave={() => saveSection("International Experience")}
            />
          </EditAccordion>

          <EditAccordion
            id="leadership"
            openSection={openSection}
            setOpenSection={setOpenSection}
            icon={<Users className="h-4 w-4" />}
            title="Leadership"
            subtitle="Leadership roles and positions"
          >
            <LeadershipEditor
              items={form.leadership}
              onUpdate={updateLeadership}
              onAdd={addLeadership}
              onRemove={removeLeadership}
            />

            <SectionActions
              loading={savingSection === "Leadership"}
              onCancel={cancelChanges}
              onSave={() => saveSection("Leadership")}
            />
          </EditAccordion>

          <EditAccordion
            id="achievements"
            openSection={openSection}
            setOpenSection={setOpenSection}
            icon={<Trophy className="h-4 w-4" />}
            title="Achievements"
            subtitle="Awards, certificates and achievements"
          >
            <AchievementEditor
              achievements={form.achievements}
              onUpdate={updateAchievement}
              onAdd={addAchievement}
              onRemove={removeAchievement}
            />

            <SectionActions
              loading={savingSection === "Achievements"}
              onCancel={cancelChanges}
              onSave={() => saveSection("Achievements")}
            />
          </EditAccordion>

          <EditAccordion
            id="awards"
            openSection={openSection}
            setOpenSection={setOpenSection}
            icon={<AwardSvgIcon className="h-4 w-4" />}
            title="Awards"
            subtitle="Awards and recognitions"
          >
            <AwardEditor
              awards={form.award}
              onUpdate={updateAward}
              onAdd={addAward}
              onRemove={removeAward}
            />

            <SectionActions
              loading={savingSection === "Awards"}
              onCancel={cancelChanges}
              onSave={() => saveSection("Awards")}
            />
          </EditAccordion>

          <EditAccordion
            id="publications"
            openSection={openSection}
            setOpenSection={setOpenSection}
            icon={<PublicationSvgIcon className="h-4 w-4" />}
            title="Publications"
            subtitle="Published works and articles"
          >
            <PublicationEditor
              publications={form.publications}
              onUpdate={updatePublication}
              onAdd={addPublication}
              onRemove={removePublication}
            />

            <SectionActions
              loading={savingSection === "Publications"}
              onCancel={cancelChanges}
              onSave={() => saveSection("Publications")}
            />
          </EditAccordion>
        </section>
      </main>
    </div>
  );
}
