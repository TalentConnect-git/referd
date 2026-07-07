"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeft,
  Award,
  Briefcase,
  Globe,
  GraduationCap,
  Loader2,
  Settings,
  Trophy,
  User,
} from "lucide-react";

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
  MasterData,
  ShiftPreferences,
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
  organization: "",
  role: "",
  title: "",
  startDate: "",
  endDate: "",
  description: "",
  isCurrent: false,
  noticePeriod: "",
  officialCompanyEmail: "",
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
    data?: ProfileData;
    profile?: ProfileData;
    user?: ProfileData;
  };
  return response?.data || response?.profile || response?.user || (data as ProfileData) || {};
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

function profileToForm(profile: ProfileData): EditForm {
  return {
    fullName: profile.fullName || profile.name || "",
    name: profile.name || profile.fullName || "",
    email: profile.email || "",
    phone: profile.phone || "",
    about: profile.about || "",
    gender: profile.gender || "",
    dob: profile.dob ? String(profile.dob).slice(0, 10) : "",
    ethnicity: profile.ethnicity || "",
    maritalStatus: profile.maritalStatus || "",
    linkedin: profile.linkedin || "",
    github: profile.github || "",
    portfolio: profile.portfolio || "",
    profileImage: profile.profileImage || "",
    resume: profile.resume || "",
    educations: profile.educations?.length || profile.education?.length
      ? profile.educations || profile.education || []
      : [{ ...emptyEducation }],
    experiences: profile.experiences?.length || profile.experience?.length
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
  };
}

function buildPayload(form: EditForm) {
  return {
    name: form.name || form.fullName,
    fullName: form.fullName || form.name,
    email: form.email,
    phone: form.phone,
    about: form.about,
    gender: form.gender,
    dob: form.dob,
    ethnicity: form.ethnicity,
    maritalStatus: form.maritalStatus,
    linkedin: form.linkedin,
    github: form.github,
    portfolio: form.portfolio,
    profileImage: form.profileImage,
    resume: form.resume,
    educations: form.educations,
    education: form.educations,
    experiences: form.experiences,
    experience: form.experiences,
    internationalExperience: form.internationalExperience,
    leadership: form.leadership,
    achievements: form.achievements,
    skills: form.skills,
    toolsAndPlatforms: form.toolsAndPlatforms,
    languagesKnown: form.languagesKnown,
    domainKnowledge: form.domainKnowledge,
    jobRoles: form.jobRoles,
    locations: form.locations,
    employmentType: form.employmentType,
    lookingFor: form.lookingFor,
    industry: form.industry,
    currentCompany: form.currentCompany,
    currentCompany_display: form.currentCompany_display,
    companyEmail: form.companyEmail,
    totalYearsOfExperience: form.totalYearsOfExperience,
    noticePeriod: form.noticePeriod,
    noticePeriodStartDate: form.noticePeriodStartDate || "",
    servingNoticePeriod: form.servingNoticePeriod || false,
    openToShift: form.openToShift || "",
    shiftPreferences: form.shiftPreferences,
    currentSalaryCurrency: form.currentSalaryCurrency || "₹",
    currentSalaryAmount: form.currentSalaryAmount || "",
    expectedSalaryCurrency: form.expectedSalaryCurrency || "₹",
    expectedSalaryAmount: form.expectedSalaryAmount || "",
  };
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
    return form?.fullName || form?.name || profile?.fullName || profile?.name || "User";
  }, [form, profile]);

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
          axios.get(`${backendUrl}/api/company-master-data?type=INDUSTRY_TYPE`, {
            withCredentials: true,
            headers: authHeaders(),
          }),
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

  function updateField<K extends keyof EditForm>(field: K, value: EditForm[K]) {
    setForm((prev: EditForm | null) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value,
      };
    });
  }

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
      if (key === "isCurrent" && value === false) {
        next[index].noticePeriod = "";
        next[index].officialCompanyEmail = "";
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
        (_item: InternationalExperience, itemIndex: number) => itemIndex !== index,
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

  function cancelChanges() {
    if (!profile) return;
    setForm(profileToForm(profile));
    setSuccess("");
    setError("");
  }

  async function saveSection(sectionName: string) {
    if (!form) return;

    try {
      setSavingSection(sectionName);
      setError("");
      setSuccess("");

      const backendUrl = getBackendUrl();
      const payload = buildPayload(form);

      console.log("Saving payload:", payload);

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
          : {
              ...profile,
              ...payload,
            };

      setProfile(nextProfile);
      setForm(profileToForm(nextProfile));
      setSuccess(`${sectionName} saved successfully`);
    } catch (error: unknown) {
      console.error("Save error:", error);
      setError(getErrorMessage(error, "Failed to save"));
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

  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
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
              icon={<User />}
              title="Basic Information"
              onClick={() => setOpenSection("basic")}
            />

            <NavOption
              active={openSection === "education"}
              icon={<GraduationCap />}
              title="Education"
              onClick={() => setOpenSection("education")}
            />

            <NavOption
              active={openSection === "experience"}
              icon={<Briefcase />}
              title="Experience"
              onClick={() => setOpenSection("experience")}
            />

            <NavOption
              active={openSection === "skills"}
              icon={<Award />}
              title="Skills"
              onClick={() => setOpenSection("skills")}
            />

            <NavOption
              active={openSection === "career"}
              icon={<Settings />}
              title="Career Details"
              onClick={() => setOpenSection("career")}
            />

            <NavOption
              active={openSection === "preferences"}
              icon={<Settings />}
              title="Job Preferences"
              onClick={() => setOpenSection("preferences")}
            />

            <NavOption
              active={openSection === "tools"}
              icon={<Award />}
              title="Tools & Languages"
              onClick={() => setOpenSection("tools")}
            />

            <NavOption
              active={openSection === "international"}
              icon={<Globe />}
              title="International Experience"
              onClick={() => setOpenSection("international")}
            />

            <NavOption
              active={openSection === "leadership"}
              icon={<Trophy />}
              title="Leadership"
              onClick={() => setOpenSection("leadership")}
            />

            <NavOption
              active={openSection === "achievements"}
              icon={<Trophy />}
              title="Achievements"
              onClick={() => setOpenSection("achievements")}
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
            icon={<User />}
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
            icon={<GraduationCap />}
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
            icon={<Briefcase />}
            title="Experience"
            subtitle="Company, role, dates and description"
          >
            <ExperienceEditor
              experiences={form.experiences}
              userType={userType}
              onUpdate={updateExperience}
              onAdd={addExperience}
              onRemove={removeExperience}
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
            icon={<Award />}
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
            icon={<Settings />}
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
            icon={<Settings />}
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
              onUpdate={(field: string, value: any) => {
                console.log(`Updating ${field}:`, value);
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
            icon={<Award />}
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
            icon={<Globe />}
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
            icon={<Trophy />}
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
            icon={<Trophy />}
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
        </section>
      </main>
    </div>
  );
}