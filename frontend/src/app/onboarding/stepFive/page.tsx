"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ElementType,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Building2,
  Calendar,
  Loader2,
  Plus,
  Search,
  Trash2,
  User,
  X,
  Clock,
  AlertCircle,
} from "lucide-react";

import axiosInstance from "@/lib/axiosInstance";
import type { Experience } from "@/types/profile";

type ApiType = "company" | "jobRole";

type AutocompleteItem = {
  _id?: string;
  id?: string;
  value?: string;
  label?: string;
  name?: string;
  title?: string;
  company?: string;
  companyName?: string;
  displayName?: string;
  isCustom?: boolean | string;
};

type AutocompleteInputProps = {
  value: string;
  onChange: (value: string) => void;
  apiType: ApiType;
  placeholder?: string;
  label?: string;
  icon?: ElementType;
};

type StoredExperienceStep = {
  experiences: Experience[];
  companyEmail: string;
  noticePeriod: string;
  currentCompany: string;
  lastUpdated: string;
  status?: {
    type: string;
    since: string;
    note: string;
    expectedReturn: string | null;
  };
};

type ToastState = {
  type: "success" | "error";
  message: string;
} | null;

type StatusType = 
  | "open_to_work"
  | "career_break"
  | "freelancing"
  | "building"
  | "not_looking"
  | "looking_internship"
  | "looking_job"
  | "preparing_exams";

interface StatusData {
  type: string;
  since: string;
  note: string;
  expectedReturn: string | null;
}

const generateId = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

const createEmptyExperience = (): Experience => ({
  _id: generateId(),
  company: "",
  company_canonical_id: "",
  company_display: "",
  role: "",
  startDate: "",
  endDate: "",
  description: "",
  experienceCertificate: "",
  isCurrent: false,
});

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function hasMeaningfulExperienceData(experience: Experience): boolean {
  const description = Array.isArray(experience.description)
    ? experience.description.join("\n").trim()
    : cleanText(experience.description);

  return Boolean(
    cleanText(experience.company) ||
      cleanText(experience.role) ||
      cleanText(experience.startDate) ||
      cleanText(experience.endDate) ||
      description ||
      cleanText(experience.experienceCertificate) ||
      experience.isCurrent === true,
  );
}

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return (JSON.parse(value) as T) || fallback;
  } catch {
    return fallback;
  }
}

function extractItems(responseData: unknown): AutocompleteItem[] {
  if (Array.isArray(responseData)) {
    return responseData as AutocompleteItem[];
  }
  if (!responseData || typeof responseData !== "object") {
    return [];
  }
  const response = responseData as {
    data?: unknown;
    items?: unknown;
    companies?: unknown;
    results?: unknown;
  };
  const candidates = [
    response.data,
    response.items,
    response.companies,
    response.results,
  ];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as AutocompleteItem[];
    }
    if (candidate && typeof candidate === "object") {
      const nested = candidate as {
        data?: unknown;
        items?: unknown;
        companies?: unknown;
        results?: unknown;
      };
      const nestedCandidates = [
        nested.data,
        nested.items,
        nested.companies,
        nested.results,
      ];
      for (const nestedCandidate of nestedCandidates) {
        if (Array.isArray(nestedCandidate)) {
          return nestedCandidate as AutocompleteItem[];
        }
      }
    }
  }
  return [];
}

function getDisplayValue(item: AutocompleteItem): string {
  return String(
    item.label ||
      item.displayName ||
      item.value ||
      item.name ||
      item.companyName ||
      item.company ||
      item.title ||
      "",
  ).trim();
}

function getItemKey(item: AutocompleteItem, index: number): string {
  return String(
    item._id ||
      item.id ||
      item.value ||
      item.name ||
      item.label ||
      `option-${index}`,
  );
}

function isCustomItem(item: AutocompleteItem): boolean {
  return item.isCustom === true || item.isCustom === "true";
}

function AutocompleteInput({
  value,
  onChange,
  apiType,
  placeholder,
  label,
  icon: Icon,
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || "");
  const [data, setData] = useState<AutocompleteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchData = async () => {
    if (loading || hasFetchedRef.current) return;
    try {
      setLoading(true);
      if (apiType === "company") {
        const response = await axiosInstance.get("/api/company");
        const items = extractItems(response.data);
        const transformedItems = items.map((item) => ({
          ...item,
          value: item.name || item.value || "",
          label: item.name || item.value || "",
        }));
        setData(transformedItems);
      } else {
        const response = await axiosInstance.get("/api/company-master-data", {
          params: { type: "JOB_ROLE" },
        });
        const items = extractItems(response.data).map((item) => {
          const displayValue = getDisplayValue(item);
          return {
            ...item,
            value: displayValue,
            label: displayValue,
          };
        });
        setData(items);
      }
      hasFetchedRef.current = true;
    } catch (error) {
      console.error(`Error fetching ${apiType} options:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
    void fetchData();
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setSearchTerm(nextValue);
    onChange(nextValue);
    setIsOpen(true);
  };

  const handleSelect = (selectedValue: string) => {
    setSearchTerm(selectedValue);
    onChange(selectedValue);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const clearInput = () => {
    setSearchTerm("");
    onChange("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleCreate = async () => {
    const valueToCreate = searchTerm.trim();
    if (!valueToCreate || isCreating) return;
    try {
      setIsCreating(true);
      let response;
      if (apiType === "company") {
        response = await axiosInstance.post("/api/company", {
          name: valueToCreate,
        });
      } else {
        response = await axiosInstance.post("/api/company-master-data", {
          type: "JOB_ROLE",
          value: valueToCreate,
        });
      }
      const responseItems = extractItems(response.data);
      const responseObject =
        response.data &&
        typeof response.data === "object" &&
        !Array.isArray(response.data)
          ? (response.data as {
              data?: AutocompleteItem;
              item?: AutocompleteItem;
            })
          : undefined;
      const createdItem =
        responseItems[0] ||
        responseObject?.data ||
        responseObject?.item || {
          value: valueToCreate,
          label: valueToCreate,
          name: valueToCreate,
          isCustom: true,
        };
      const createdValue = getDisplayValue(createdItem) || valueToCreate;
      setData((previous) => {
        const exists = previous.some(
          (item) =>
            getDisplayValue(item).toLowerCase() === createdValue.toLowerCase(),
        );
        return exists ? previous : [...previous, createdItem];
      });
      setSearchTerm(createdValue);
      onChange(createdValue);
      setIsOpen(false);
      inputRef.current?.blur();
    } catch (error) {
      console.error(`Error creating ${apiType}:`, error);
      setSearchTerm(valueToCreate);
      onChange(valueToCreate);
      setIsOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  const filteredData = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return data;
    return data.filter((item) =>
      getDisplayValue(item).toLowerCase().includes(normalizedSearch),
    );
  }, [data, searchTerm]);

  const exactMatchExists = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return false;
    return data.some(
      (item) => getDisplayValue(item).toLowerCase() === normalizedSearch,
    );
  }, [data, searchTerm]);

  const showDropdown =
    isOpen && (loading || searchTerm.trim().length > 0 || data.length > 0);

  return (
    <div ref={dropdownRef} className="relative">
      {label ? (
        <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          autoComplete="off"
          className="input-field pl-10 text-sm"
        />
        {Icon ? (
          <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
        ) : null}
        {searchTerm ? (
          <button
            type="button"
            onClick={clearInput}
            aria-label="Clear input"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      {showDropdown ? (
        <div className="surface-card absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-[var(--border)] shadow-xl">
          {loading ? (
            <div className="flex items-center justify-center px-4 py-3 text-sm text-[var(--text-muted)]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-[var(--primary)]" />
              Loading...
            </div>
          ) : filteredData.length > 0 ? (
            <>
              {filteredData.slice(0, 15).map((item, index) => {
                const displayValue = getDisplayValue(item);
                if (!displayValue) return null;
                return (
                  <button
                    key={getItemKey(item, index)}
                    type="button"
                    onClick={() => handleSelect(displayValue)}
                    className="group flex w-full items-center justify-between border-b border-[var(--border)] px-4 py-2.5 text-left text-sm text-[var(--text-primary)] transition-colors last:border-0 hover:bg-[var(--primary-soft)]"
                  >
                    <span>{displayValue}</span>
                    {isCustomItem(item) ? (
                      <span className="text-[10px] text-[var(--text-muted)] group-hover:text-[var(--primary)]">
                        Custom
                      </span>
                    ) : null}
                  </button>
                );
              })}
              {searchTerm.trim() && !exactMatchExists ? (
                <button
                  type="button"
                  onClick={() => void handleCreate()}
                  disabled={isCreating}
                  className="flex w-full items-center gap-2 border-t border-[var(--border)] px-4 py-2.5 text-left text-sm text-[var(--primary)] transition-colors hover:bg-[var(--primary-soft)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-[var(--primary)]" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create &quot;{searchTerm.trim()}&quot;
                    </>
                  )}
                </button>
              ) : null}
            </>
          ) : searchTerm.trim() ? (
            <button
              type="button"
              onClick={() => void handleCreate()}
              disabled={isCreating}
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-[var(--primary)] transition-colors hover:bg-[var(--primary-soft)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-[var(--primary)]" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create &quot;{searchTerm.trim()}&quot;
                </>
              )}
            </button>
          ) : (
            <div className="px-4 py-3 text-center">
              <p className="text-sm text-[var(--text-muted)]">No options found</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Type a value to create one
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default function StepFivePage() {
  const router = useRouter();

  const [experiences, setExperiences] = useState<Experience[]>([
    createEmptyExperience(),
  ]);
  const [companyEmail, setCompanyEmail] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  // Status State
  const [statusType, setStatusType] = useState<string>("");
  const [statusSince, setStatusSince] = useState<string>("");
  const [statusNote, setStatusNote] = useState<string>("");
  const [statusExpectedReturn, setStatusExpectedReturn] = useState<string>("");
  const [previousStatusType, setPreviousStatusType] = useState<string>("");

  // Get user type from localStorage or context
  const [userType, setUserType] = useState<string>("professional");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = localStorage.getItem("selectedRole") || user?.userType || "professional";
    setUserType(role);
  }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    window.setTimeout(() => {
      setToast((current) =>
        current?.type === type && current.message === message ? null : current,
      );
    }, 3500);
  };

  useEffect(() => {
    const storedStep = safeJsonParse<Partial<StoredExperienceStep>>(
      localStorage.getItem("onboarding_experiences"),
      {},
    );

    const legacyExperiences = safeJsonParse<Experience[]>(
      localStorage.getItem("experiences_data"),
      [],
    );

    const savedExperiences =
      Array.isArray(storedStep.experiences) &&
      storedStep.experiences.length > 0
        ? storedStep.experiences
        : legacyExperiences;

    if (savedExperiences.length > 0) {
      setExperiences(
        savedExperiences.map((experience) => ({
          ...createEmptyExperience(),
          ...experience,
          _id: experience._id || generateId(),
          isCurrent: Boolean(experience.isCurrent),
        })),
      );
    }

    setCompanyEmail(storedStep.companyEmail || "");
    setNoticePeriod(storedStep.noticePeriod || "");

    // Restore status if exists
    if (storedStep.status) {
      setStatusType(storedStep.status.type || "");
      setStatusSince(storedStep.status.since || "");
      setStatusNote(storedStep.status.note || "");
      setStatusExpectedReturn(storedStep.status.expectedReturn || "");
      setPreviousStatusType(storedStep.status.type || "");
    }
  }, []);

  // Status options based on user type
  const statusOptions = useMemo(() => {
    if (userType === "student" || userType === "fresher") {
      return [
        { value: "looking_internship", label: "Looking for Internship" },
        { value: "looking_job", label: "Looking for Job" },
        { value: "preparing_exams", label: "Preparing for Exams" },
      ];
    }
    return [
      { value: "open_to_work", label: "Open to Work" },
      { value: "career_break", label: "Career Break" },
      { value: "freelancing", label: "Freelancing" },
      { value: "building", label: "Building Something" },
      { value: "not_looking", label: "Not Looking" },
    ];
  }, [userType]);

  // Check if user has current employment (isCurrent: true AND company name exists)
  const hasCurrentCompany = experiences.some(
    (experience) => experience.isCurrent && cleanText(experience.company),
  );

  // Get current experience start date
  const getCurrentExperienceStartDate = (): string => {
    const currentExp = experiences.find(
      (exp) => exp.isCurrent && cleanText(exp.company),
    );
    return currentExp?.startDate || new Date().toISOString().split("T")[0];
  };

  // Handle status change
  const handleStatusChange = (value: string) => {
    const today = new Date().toISOString().split("T")[0];
    setStatusType(value);
    // Don't auto-set statusSince - let user select it
    // setStatusSince(today);
    
    // Clear expected return if not career break
    if (value !== "career_break") {
      setStatusExpectedReturn("");
    }
  };

  const handleUpdate = <K extends keyof Experience>(
    index: number,
    key: K,
    value: Experience[K],
  ) => {
    setExperiences((previous) =>
      previous.map((experience, experienceIndex) =>
        experienceIndex === index
          ? {
              ...experience,
              [key]: value,
            }
          : experience,
      ),
    );
  };

  const handleAdd = () => {
    setExperiences((previous) => [...previous, createEmptyExperience()]);
  };

  const handleRemove = (index: number) => {
    setExperiences((previous) => {
      if (previous.length <= 1) {
        return previous;
      }
      return previous.filter(
        (_experience, experienceIndex) => experienceIndex !== index,
      );
    });
  };

  const handleCurrentlyWorkingChange = (index: number, checked: boolean) => {
    setExperiences((previous) =>
      previous.map((experience, experienceIndex) => {
        if (experienceIndex === index) {
          return {
            ...experience,
            isCurrent: checked,
            endDate: checked ? "" : experience.endDate,
          };
        }
        if (checked && experience.isCurrent) {
          return {
            ...experience,
            isCurrent: false,
          };
        }
        return experience;
      }),
    );

    // If unchecked (removing current company), clear status and make it required
    if (!checked) {
      // Find if this was the only current company
      const otherCurrent = experiences.some(
        (exp, idx) => idx !== index && exp.isCurrent && cleanText(exp.company),
      );
      if (!otherCurrent) {
        setStatusType("");
        setStatusSince("");
        setStatusNote("");
        setStatusExpectedReturn("");
      }
    }
  };

  const getCleanedExperiences = (): Experience[] => {
    return experiences
      .filter(hasMeaningfulExperienceData)
      .map((experience) => {
        const rawExperience = experience as Experience & Record<string, unknown>;
        const {
          _id: _temporaryId,
          company_canonical_id: _companyCanonicalId,
          company_display: _companyDisplay,
          company_master_id: _companyMasterId,
          canonicalId: _canonicalId,
          displayName: _displayName,
          masterId: _masterId,
          ...allowedFields
        } = rawExperience;

        return {
          company: cleanText(allowedFields.company),
          role: cleanText(allowedFields.role),
          startDate: cleanText(allowedFields.startDate),
          endDate:
            allowedFields.isCurrent === true
              ? ""
              : cleanText(allowedFields.endDate),
          description: Array.isArray(allowedFields.description)
            ? allowedFields.description.join("").trim()
            : cleanText(allowedFields.description),
          experienceCertificate: cleanText(
            allowedFields.experienceCertificate,
          ),
          isCurrent: allowedFields.isCurrent === true,
        } as Experience;
      });
  };

  const validateExperiences = (): string | null => {
    const enteredExperiences = experiences.filter(hasMeaningfulExperienceData);

    for (let index = 0; index < enteredExperiences.length; index += 1) {
      const experience = enteredExperiences[index];
      const companyName = cleanText(experience.company);

      if (!companyName) {
        if (experience.isCurrent === true) {
          return `Experience ${index + 1}: please enter the company name before saving Currently Working.`;
        }
        return `Experience ${index + 1}: company name is required.`;
      }
    }

    return null;
  };

  // Validate status - only if no current company
  const validateStatus = (): string | null => {
    // If user has current company, status is auto-managed - no validation needed
    if (hasCurrentCompany) {
      return null;
    }

    // Status is required when no current company
    

    

    // Note max length
    if (statusNote && statusNote.length > 500) {
      return "Status note cannot exceed 500 characters.";
    }

    return null;
  };

  const persistExperienceStep = (
    cleanedExperiences: Experience[],
  ): StoredExperienceStep => {
    const currentExperience = cleanedExperiences.find(
      (experience) => experience.isCurrent,
    );

    const normalizedEmail = currentExperience
      ? companyEmail.trim().toLowerCase()
      : "";

    const normalizedNoticePeriod = currentExperience
      ? noticePeriod.trim()
      : "";

    // Build status data - only if there's no current company
    let statusData: StatusData | undefined;
    
    if (hasCurrentCompany) {
      // Auto-managed employed status - backend will handle this
      statusData = undefined;
    } else if (statusType) {
      statusData = {
        type: statusType,
        since: statusSince || new Date().toISOString().split("T")[0],
        note: statusNote.trim(),
        expectedReturn: statusType === "career_break" && statusExpectedReturn
          ? statusExpectedReturn
          : null,
      };
    }

    const onboardingData: StoredExperienceStep = {
      experiences: cleanedExperiences,
      companyEmail: normalizedEmail,
      noticePeriod: normalizedNoticePeriod,
      currentCompany: cleanText(currentExperience?.company),
      lastUpdated: new Date().toISOString(),
      ...(statusData ? { status: statusData } : {}),
    };

    localStorage.setItem(
      "onboarding_experiences",
      JSON.stringify(onboardingData),
    );

    localStorage.setItem(
      "experiences_data",
      JSON.stringify(cleanedExperiences),
    );

    return onboardingData;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateExperiences();

    if (validationError) {
      setError(validationError);
      showToast("error", validationError);
      return;
    }

    // Validate status only if no current company
    const statusError = validateStatus();
    if (statusError) {
      setError(statusError);
      showToast("error", statusError);
      return;
    }

    try {
      setError(null);
      setIsLoading(true);

      const cleanedExperiences = getCleanedExperiences();
      const currentExperience = cleanedExperiences.find(
        (experience) => experience.isCurrent,
      );

      if (currentExperience && companyEmail.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(companyEmail.trim())) {
          const message = "Please enter a valid official company email.";
          setError(message);
          showToast("error", message);
          return;
        }
      }

      persistExperienceStep(cleanedExperiences);

      router.push("/onboarding/stepSix");
    } catch (submissionError) {
      console.error("Error saving signup experience data:", submissionError);
      const message = "Failed to save experience details. Please try again.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    const cleanedExperiences = getCleanedExperiences();
    persistExperienceStep(cleanedExperiences);
    router.push("/onboarding/stepFour");
  };

  // A company counts as current only when both company name and isCurrent exist.
  const hasAnyCurrentExperience = hasCurrentCompany;

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-4xl space-y-6 bg-[var(--background)] p-4 sm:p-6"
    >
      {toast ? (
        <div
          role="alert"
          aria-live="assertive"
          className={`fixed right-4 top-4 z-[100] max-w-sm rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur ${
            toast.type === "success"
              ? "border-[var(--success-border)] bg-[var(--success-soft)] text-[var(--success)]"
              : "border-[var(--danger-border)] bg-[var(--danger-soft)] text-[var(--danger)]"
          }`}
        >
          {toast.message}
        </div>
      ) : null}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl border border-[var(--primary-border)] bg-[var(--primary-soft)] p-2">
          <Briefcase className="h-5 w-5 text-[var(--primary)]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Work Experience</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Add your work experience details
          </p>
        </div>
        <span className="ml-auto text-sm text-[var(--text-muted)]">Step 5 of 6</span>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-lg border border-[var(--danger-border)] bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger)]">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      ) : null}

      <div className="space-y-5">
        {experiences.map((experience, index) => (
          <div
            key={experience._id || `experience-${index}`}
            className="surface-card rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all duration-300 hover:border-[var(--primary-border)] hover:shadow-md sm:p-5"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--primary)]">
                  <Briefcase className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  Experience {index + 1}
                </h3>
                
              </div>
              {experiences.length > 1 ? (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="btn-danger flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                  <Building2 className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                  Company
                </label>
                <AutocompleteInput
                  apiType="company"
                  value={experience.company || ""}
                  onChange={(value) =>
                    handleUpdate(index, "company", value)
                  }
                  placeholder="Search or type company name..."
                 
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                  <User className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                  Role / Title
                </label>
                <AutocompleteInput
                  apiType="jobRole"
                  value={experience.role || ""}
                  onChange={(value) =>
                    handleUpdate(index, "role", value)
                  }
                  placeholder="Search or type job role..."
                 
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                  <Calendar className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={experience.startDate || ""}
                  onChange={(event) =>
                    handleUpdate(index, "startDate", event.target.value)
                  }
                  className="input-field"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                  <Calendar className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                  End Date
                </label>
                <input
                  type="date"
                  value={experience.endDate || ""}
                  disabled={Boolean(experience.isCurrent)}
                  min={experience.startDate || undefined}
                  onChange={(event) =>
                    handleUpdate(index, "endDate", event.target.value)
                  }
                  className="input-field disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="group flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={Boolean(experience.isCurrent)}
                    onChange={(event) =>
                      handleCurrentlyWorkingChange(index, event.target.checked)
                    }
                    className="h-4 w-4 rounded border-[var(--border)] bg-[var(--background-soft)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-0"
                  />
                  <span className="text-sm font-medium text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text-primary)]">
                    Currently working here
                  </span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Description
                </label>
                <textarea
                  value={
                    Array.isArray(experience.description)
                      ? experience.description.join("\n")
                      : experience.description || ""
                  }
                  onChange={(event) =>
                    handleUpdate(index, "description", event.target.value)
                  }
                  placeholder="Describe your responsibilities and achievements..."
                  rows={3}
                  className="textarea-field resize-none"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAdd}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] py-4 text-sm font-medium text-[var(--text-muted)] transition hover:border-[var(--primary-border)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
        >
          <Plus className="h-4 w-4" />
          Add more experience
        </button>
      </div>

      {/* Candidate Status Section - Only show when NO current company */}
      {!hasAnyCurrentExperience && (
        <div className="surface-card space-y-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[var(--primary)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Candidate Status</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                Current Status
              </label>
              <select
                value={statusType}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="select-field"
              >
                <option value="">Select your status...</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Since Date - User can select custom date */}
            {statusType && (
              <div>
                
                <input
                  type="date"
                  value={statusSince}
                  onChange={(e) => setStatusSince(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="input-field"
                />
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Select the date since when this status applies
                </p>
              </div>
            )}

            {/* Expected Return Date (only for career break) */}
            {statusType === "career_break" && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                  Expected Return Date <span className="text-[var(--danger)]">*</span>
                </label>
                <input
                  type="date"
                  value={statusExpectedReturn}
                  onChange={(e) => setStatusExpectedReturn(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="input-field"
                />
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  When do you plan to return to work?
                </p>
              </div>
            )}

            {/* Note (optional) */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                Note (Optional)
              </label>
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value.slice(0, 500))}
                placeholder="Add any additional details about your status..."
                rows={2}
                maxLength={500}
                className="textarea-field resize-none"
              />
              <div className="mt-1 flex justify-between text-xs">
               
                <span className={`${statusNote.length > 450 ? 'text-[var(--warning)]' : 'text-[var(--text-muted)]'}`}>
                  {statusNote.length}/500
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show employed status message when user has current company */}
      {hasAnyCurrentExperience && (
        <div className="space-y-4 rounded-xl border border-[var(--success-border)] bg-[var(--success-soft)] p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[var(--success)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Employment Status</h3>
            <span className="badge badge-success ml-auto rounded-full px-2.5 py-0.5 text-[10px] font-medium">
              Auto-Managed
            </span>
          </div>
          <div className="rounded-lg border border-[var(--success-border)] bg-[var(--success-soft)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--success-soft)]">
                <Briefcase className="h-4 w-4 text-[var(--success)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Currently Employed</p>
                <p className="text-xs text-[var(--text-muted)]">
                  Your status is automatically set to "Employed" since you have a current job.
                  This will be managed by the system.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasAnyCurrentExperience ? (
        <div className="space-y-4 rounded-xl border border-[var(--success-border)] bg-[var(--success-soft)] p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[var(--success)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Current Employment Details
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="noticePeriod"
                className="text-xs font-medium text-[var(--text-secondary)]"
              >
                Notice Period (days)
              </label>
              <input
                id="noticePeriod"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={noticePeriod}
                onChange={(event) =>
                  setNoticePeriod(event.target.value)
                }
                placeholder="e.g., 30, 60, 90"
                className="input-field"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="companyEmail"
                className="text-xs font-medium text-[var(--text-secondary)]"
              >
                Official Company Email
              </label>
              <input
                id="companyEmail"
                type="email"
                value={companyEmail}
                onChange={(event) =>
                  setCompanyEmail(event.target.value)
                }
                onBlur={(event) =>
                  setCompanyEmail(
                    event.target.value.trim().toLowerCase(),
                  )
                }
                placeholder="yourname@company.com"
                autoComplete="email"
                className="input-field"
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex gap-4 border-t border-[var(--border)] pt-4">
        <button
          type="button"
          onClick={handleBack}
          disabled={isLoading}
          className="btn-secondary flex-1 rounded-lg py-2.5 text-sm font-medium"
        >
          Back
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Continue →"}
        </button>
      </div>
    </form>
  );
}