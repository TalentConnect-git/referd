"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ElementType,
} from "react";
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
} from "lucide-react";

import axiosInstance from "@/lib/axiosInstance";
import type { Experience } from "@/types/profile";

type ApiType = "company" | "jobRole";

type AutocompleteItem = {
  _id?: string;
  id?: string;

  label?: string;
  value?: string;
  name?: string;
  title?: string;

  company?: string;
  companyName?: string;
  displayName?: string;

  canonicalId?: string;
  canonical_id?: string;
  companyCanonicalId?: string;
  company_canonical_id?: string;

  isCustom?: boolean | string;
};

type AutocompleteInputProps = {
  value: string;
  onChange: (value: string, item?: AutocompleteItem) => void;
  apiType: ApiType;
  placeholder?: string;
  label?: string;
  icon?: ElementType;
  required?: boolean;
  error?: string;
};

type ExperienceEditorProps = {
  experiences: Experience[];
  userType: "student" | "fresher" | "professional";
  onUpdate: (
    index: number,
    key: keyof Experience,
    value: Experience[keyof Experience],
  ) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;

  companyEmail: string;
  noticePeriod: string;
  onCompanyEmailChange: (value: string) => void;
  onNoticePeriodChange: (value: string) => void;

  statusType: string;
  statusSince: string;
  statusNote: string;
  statusExpectedReturn: string;
  onStatusTypeChange: (value: string) => void;
  onStatusSinceChange: (value: string) => void;
  onStatusNoteChange: (value: string) => void;
  onStatusExpectedReturnChange: (value: string) => void;

  /** Lets the parent disable Save/Continue when an experience is invalid. */
  onValidationChange?: (isValid: boolean) => void;
};



type ExperienceValidationError = {
  company?: string;
  endDate?: string;
};

type StatusValidationError = {
  statusType?: string;
  statusSince?: string;
  statusExpectedReturn?: string;
};

function trimString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function isCompletelyEmptyExperience(experience: Experience): boolean {
  return !Boolean(
    trimString(experience.company) ||
      trimString(experience.role) ||
      trimString(experience.startDate) ||
      trimString(experience.endDate) ||
      (Array.isArray(experience.description)
        ? experience.description.some((item) => trimString(item).length > 0)
        : trimString(experience.description)) ||
      trimString((experience as Experience & { experienceCertificate?: string })
        .experienceCertificate) ||
      experience.isCurrent,
  );
}

export function validateExperience(
  experience: Experience,
): ExperienceValidationError {
  if (isCompletelyEmptyExperience(experience)) {
    return {};
  }

  const errors: ExperienceValidationError = {};
  const company = trimString(experience.company);
  const startDate = trimString(experience.startDate);
  const endDate = trimString(experience.endDate);

  // Company is the anchor field for every experience. This prevents
  // saving rows that contain only start/end dates or other partial values.
  if (!company) {
    errors.company = experience.isCurrent
      ? "Company name is required for current employment"
      : "Enter a company name or remove this incomplete experience";
  }

  if (!experience.isCurrent && startDate && endDate && endDate < startDate) {
    errors.endDate = "End date cannot be earlier than start date";
  }

  return errors;
}

export function prepareExperiencesForPayload(
  experiences: Experience[],
): Experience[] {
  return experiences
    .filter((experience) => !isCompletelyEmptyExperience(experience))
    .map((experience) => {
      const description = Array.isArray(experience.description)
        ? experience.description
            .map((item) => trimString(item))
            .filter(Boolean)
        : trimString(experience.description);

      const cleaned = {
        ...experience,
        company: trimString(experience.company),
        role: trimString(experience.role),
        startDate: trimString(experience.startDate),
        endDate: experience.isCurrent ? "" : trimString(experience.endDate),
        description,
      } as Experience;

      // Remove empty optional values so they are not included in the payload.
      Object.keys(cleaned as object).forEach((key) => {
        const value = (cleaned as Record<string, unknown>)[key];

        if (value === "" || value === undefined || value === null) {
          delete (cleaned as Record<string, unknown>)[key];
        }

        if (Array.isArray(value) && value.length === 0) {
          delete (cleaned as Record<string, unknown>)[key];
        }
      });

      return cleaned;
    });
}

export function validateExperiencesBeforeSave(experiences: Experience[]): {
  isValid: boolean;
  errors: ExperienceValidationError[];
  payload: Experience[];
} {
  const errors = experiences.map(validateExperience);
  const isValid = errors.every((error) => Object.keys(error).length === 0);

  return {
    isValid,
    errors,
    payload: isValid ? prepareExperiencesForPayload(experiences) : [],
  };
}


export function validateCandidateStatus({
  hasCurrentExperience,
  statusType,
  statusSince,
  statusExpectedReturn,
}: {
  hasCurrentExperience: boolean;
  statusType: string;
  statusSince: string;
  statusExpectedReturn: string;
}): StatusValidationError {
  // Current employment manages the candidate status automatically.
  if (hasCurrentExperience) {
    return {};
  }

  const errors: StatusValidationError = {};
  const cleanedStatusType = trimString(statusType);
  const cleanedStatusSince = trimString(statusSince);
  const cleanedExpectedReturn = trimString(statusExpectedReturn);
  const today = new Date().toISOString().split("T")[0];

  if (!cleanedStatusType) {
    errors.statusType =
      "Select your current status if you do not want to add experience";
  }

  if (!cleanedStatusSince) {
    errors.statusSince = "Select the date from which this status applies";
  } else if (cleanedStatusSince > today) {
    errors.statusSince = "Since date cannot be in the future";
  }

  return errors;
}

export function prepareStatusForPayload({
  hasCurrentExperience,
  statusType,
  statusSince,
  statusNote,
  statusExpectedReturn,
}: {
  hasCurrentExperience: boolean;
  statusType: string;
  statusSince: string;
  statusNote: string;
  statusExpectedReturn: string;
}) {
  if (hasCurrentExperience) {
    return undefined;
  }

  const cleaned = {
    statusType: trimString(statusType),
    statusSince: trimString(statusSince),
    statusNote: trimString(statusNote),
  };

  return Object.fromEntries(
    Object.entries(cleaned).filter(([, value]) => value !== ""),
  );
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
    item?: unknown;
    items?: unknown;
    companies?: unknown;
    results?: unknown;
  };

  const directCollections = [
    response.data,
    response.items,
    response.companies,
    response.results,
  ];

  for (const collection of directCollections) {
    if (Array.isArray(collection)) {
      return collection as AutocompleteItem[];
    }
  }

  if (
    response.data &&
    typeof response.data === "object" &&
    !Array.isArray(response.data)
  ) {
    const nested = response.data as {
      data?: unknown;
      item?: unknown;
      items?: unknown;
      companies?: unknown;
      results?: unknown;
    };

    const nestedCollections = [
      nested.data,
      nested.items,
      nested.companies,
      nested.results,
    ];

    for (const collection of nestedCollections) {
      if (Array.isArray(collection)) {
        return collection as AutocompleteItem[];
      }
    }

    if (nested.item && typeof nested.item === "object") {
      return [nested.item as AutocompleteItem];
    }

    return [response.data as AutocompleteItem];
  }

  if (response.item && typeof response.item === "object") {
    return [response.item as AutocompleteItem];
  }

  return [];
}

function getDisplayValue(item: AutocompleteItem): string {
  return String(
    item.label ??
      item.displayName ??
      item.name ??
      item.value ??
      item.companyName ??
      item.company ??
      item.title ??
      "",
  ).trim();
}

function getItemKey(item: AutocompleteItem, index: number): string {
  return String(
    item._id ??
      item.id ??
      item.value ??
      item.name ??
      item.label ??
      `autocomplete-item-${index}`,
  );
}

function isCustomItem(item: AutocompleteItem): boolean {
  return item.isCustom === true || item.isCustom === "true";
}

function getMasterId(item?: AutocompleteItem): string | undefined {
  const id = String(item?._id ?? item?.id ?? "").trim();
  return id || undefined;
}

function getCanonicalId(item?: AutocompleteItem): string | undefined {
  const canonicalId = String(
    item?.company_canonical_id ??
      item?.companyCanonicalId ??
      item?.canonicalId ??
      item?.canonical_id ??
      "",
  ).trim();

  return canonicalId || undefined;
}

function getCompanyDisplayName(
  item: AutocompleteItem | undefined,
  fallback: string,
): string {
  return String(
    item?.displayName ??
      item?.label ??
      item?.name ??
      item?.companyName ??
      item?.company ??
      fallback,
  ).trim();
}

function getCreatedItem(responseData: unknown, fallback: string) {
  const items = extractItems(responseData);

  if (items.length > 0) {
    return items[0];
  }

  return {
    name: fallback,
    value: fallback,
    label: fallback,
    displayName: fallback,
    isCustom: true,
  } satisfies AutocompleteItem;
}

function AutocompleteInput({
  value,
  onChange,
  apiType,
  placeholder,
  label,
  icon: Icon,
  required = false,
  error = "",
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
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function fetchData() {
    if (hasFetchedRef.current || loading) {
      return;
    }

    try {
      setLoading(true);

      if (apiType === "company") {
        const response = await axiosInstance.get("/api/company");
        const items = extractItems(response.data).map((item) => {
          const displayValue = getDisplayValue(item);

          return {
            ...item,
            label: displayValue,
            value: item.value || displayValue,
            name: item.name || displayValue,
            displayName: item.displayName || displayValue,
          };
        });

        setData(items);
      } else {
        const response = await axiosInstance.get(
          "/api/company-master-data",
          {
            params: {
              type: "JOB_ROLE",
            },
          },
        );

        const items = extractItems(response.data).map((item) => {
          const displayValue = getDisplayValue(item);

          return {
            ...item,
            label: displayValue,
            value: displayValue,
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
  }

  function handleFocus() {
    setIsOpen(true);
    void fetchData();
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value;

    setSearchTerm(nextValue);
    onChange(nextValue, undefined);
    setIsOpen(true);
  }

  function handleSelect(item: AutocompleteItem) {
    const selectedValue = getDisplayValue(item);

    if (!selectedValue) {
      return;
    }

    setSearchTerm(selectedValue);
    onChange(selectedValue, item);
    setIsOpen(false);
    inputRef.current?.blur();
  }

  function clearInput() {
    setSearchTerm("");
    onChange("", undefined);
    setIsOpen(false);
    inputRef.current?.focus();
  }

  async function handleCreate() {
    const valueToCreate = searchTerm.trim();

    if (!valueToCreate || isCreating) {
      return;
    }

    try {
      setIsCreating(true);

      const response =
        apiType === "company"
          ? await axiosInstance.post("/api/company", {
              name: valueToCreate,
            })
          : await axiosInstance.post("/api/company-master-data", {
              type: "JOB_ROLE",
              value: valueToCreate,
            });

      const createdItem = getCreatedItem(response.data, valueToCreate);
      const createdValue = getDisplayValue(createdItem) || valueToCreate;

      const normalizedCreatedItem: AutocompleteItem = {
        ...createdItem,
        label: createdValue,
        value: createdItem.value || createdValue,
        name: createdItem.name || createdValue,
        displayName: createdItem.displayName || createdValue,
      };

      setData((previous) => {
        const alreadyExists = previous.some(
          (item) =>
            getDisplayValue(item).toLowerCase() ===
            createdValue.toLowerCase(),
        );

        return alreadyExists
          ? previous
          : [...previous, normalizedCreatedItem];
      });

      setSearchTerm(createdValue);
      onChange(createdValue, normalizedCreatedItem);
      setIsOpen(false);
      inputRef.current?.blur();
    } catch (error) {
      console.error(`Error creating ${apiType}:`, error);

      setSearchTerm(valueToCreate);
      onChange(valueToCreate, undefined);
      setIsOpen(false);
    } finally {
      setIsCreating(false);
    }
  }

  const filteredData = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return data;
    }

    return data.filter((item) =>
      getDisplayValue(item).toLowerCase().includes(normalizedSearch),
    );
  }, [data, searchTerm]);

  const exactMatchExists = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return false;
    }

    return data.some(
      (item) =>
        getDisplayValue(item).toLowerCase() === normalizedSearch,
    );
  }, [data, searchTerm]);

  const showDropdown =
    isOpen &&
    (loading || searchTerm.trim().length > 0 || data.length > 0);

  return (
    <div ref={dropdownRef} className="relative">
      {label ? (
        <label className="mb-1.5 flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)]">
          {label}
          {required && <span className="text-[var(--danger)]">*</span>}
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
          className={`input-field pl-10 text-sm ${
            error ? "border-[var(--danger)]" : ""
          }`}
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

      {error && <p className="form-error mt-1">{error}</p>}

      {showDropdown ? (
        <div className="surface-card absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-[var(--border)] shadow-xl">
          {loading ? (
            <div className="flex items-center justify-center px-4 py-3 text-sm text-[var(--text-muted)]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : filteredData.length > 0 ? (
            <>
              {filteredData.slice(0, 15).map((item, index) => {
                const displayValue = getDisplayValue(item);

                if (!displayValue) {
                  return null;
                }

                return (
                  <button
                    key={getItemKey(item, index)}
                    type="button"
                    onClick={() => handleSelect(item)}
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
                      <Loader2 className="h-4 w-4 animate-spin" />
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
                  <Loader2 className="h-4 w-4 animate-spin" />
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

export function ExperienceEditor({
  experiences,
  onUpdate,
  onAdd,
  onRemove,
  companyEmail,
  noticePeriod,
  onCompanyEmailChange,
  onNoticePeriodChange,
  statusType = "",
  statusSince = "",
  statusNote = "",
  statusExpectedReturn = "",
  onStatusTypeChange,
  onStatusSinceChange,
  onStatusNoteChange,
  onStatusExpectedReturnChange,
  onValidationChange,
}: ExperienceEditorProps) {
  function clearOptionalExperienceField(
    index: number,
    key: keyof Experience,
  ) {
    onUpdate(
      index,
      key,
      undefined as Experience[keyof Experience],
    );
  }

  function handleCompanyChange(
    index: number,
    value: string,
    item?: AutocompleteItem,
  ) {
    const normalizedCompany = value.trimStart();

    onUpdate(index, "company", normalizedCompany);

    if (!item) {
      clearOptionalExperienceField(index, "company_canonical_id");

      onUpdate(
        index,
        "company_display",
        normalizedCompany as Experience[keyof Experience],
      );

      return;
    }

    const canonicalId = getCanonicalId(item);
    const displayName = getCompanyDisplayName(
      item,
      normalizedCompany,
    );

    if (canonicalId) {
      onUpdate(
        index,
        "company_canonical_id",
        canonicalId as Experience[keyof Experience],
      );
    } else {
      clearOptionalExperienceField(index, "company_canonical_id");
    }

    onUpdate(
      index,
      "company_display",
      displayName as Experience[keyof Experience],
    );
  }

  function handleCurrentlyWorkingChange(
    index: number,
    checked: boolean,
  ) {
    onUpdate(index, "isCurrent", checked);

    if (checked) {
      clearOptionalExperienceField(index, "endDate");

      experiences.forEach((experience, experienceIndex) => {
        if (
          experienceIndex !== index &&
          Boolean(experience.isCurrent)
        ) {
          onUpdate(experienceIndex, "isCurrent", false);
        }
      });
    }
  }

  const [userType, setUserType] = useState<"student" | "fresher" | "professional">("professional");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = localStorage.getItem("selectedRole") || user?.userType || "professional";
    setUserType(role as "student" | "fresher" | "professional");
  }, []);

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

  const hasAnyCurrentExperience = experiences.some(
    (exp) => exp.isCurrent === true,
  );

  const handleStatusChange = (value: string) => {
    onStatusTypeChange(value);

    // Set today only the first time. The user can change it manually.
    if (value && !statusSince) {
      onStatusSinceChange(new Date().toISOString().split("T")[0]);
    }

    if (!value) {
      onStatusSinceChange("");
      onStatusExpectedReturnChange("");
      return;
    }

    if (value !== "career_break") {
      onStatusExpectedReturnChange("");
    }
  };

  const experienceErrors = useMemo(
    () => experiences.map(validateExperience),
    [experiences],
  );

  const experiencesAreValid = useMemo(
    () => experienceErrors.every((error) => Object.keys(error).length === 0),
    [experienceErrors],
  );

  const statusErrors = useMemo(
    () =>
      validateCandidateStatus({
        hasCurrentExperience: hasAnyCurrentExperience,
        statusType,
        statusSince,
        statusExpectedReturn,
      }),
    [
      hasAnyCurrentExperience,
      statusExpectedReturn,
      statusSince,
      statusType,
    ],
  );

  const statusIsValid = Object.keys(statusErrors).length === 0;
  const formIsValid = experiencesAreValid && statusIsValid;

  useEffect(() => {
    onValidationChange?.(formIsValid);
  }, [formIsValid, onValidationChange]);

  const safeStatusNote = statusNote || "";
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      {experiences.map((experience, index) => {
        const validationError = experienceErrors[index] || {};
        const hasCompanyError = Boolean(validationError.company);
        const hasEndDateError = Boolean(validationError.endDate);
        
        return (
          <div
            key={experience._id || `experience-${index}`}
            className={`surface-card group rounded-xl border p-5 transition-all duration-300 ${
              hasCompanyError
                ? "border-[var(--danger-border)] hover:border-[var(--danger-border)]"
                : "border-[var(--border)] hover:border-[var(--primary-border)]"
            } hover:shadow-md`}
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                  hasCompanyError
                    ? "border-[var(--danger-border)] bg-[var(--danger-soft)] text-[var(--danger)]"
                    : "border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--primary)]"
                }`}>
                  <Briefcase className="h-4 w-4" />
                </div>

                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                  Experience {index + 1}
                </h4>

                {hasCompanyError && (
                  <span className="badge badge-danger rounded-full px-2 py-0.5 text-[10px]">
                    Required
                  </span>
                )}

                
              </div>

              {experiences.length > 1 ? (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
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
                  {experience.isCurrent && (
                    <span className="ml-1 text-[var(--danger)]">*</span>
                  )}
                </label>

                <AutocompleteInput
                  apiType="company"
                  value={experience.company || ""}
                  onChange={(value, item) =>
                    handleCompanyChange(index, value, item)
                  }
                  placeholder="Search or type company name..."
                  
                  required={experience.isCurrent || false}
                  error={validationError.company || ""}
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
                    onUpdate(index, "role", value)
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
                    onUpdate(
                      index,
                      "startDate",
                      event.target.value,
                    )
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
                  onChange={(event) => {
                    const nextEndDate = event.target.value;

                    if (nextEndDate) {
                      onUpdate(index, "endDate", nextEndDate);
                    } else {
                      clearOptionalExperienceField(index, "endDate");
                    }
                  }}
                  className={`input-field disabled:cursor-not-allowed disabled:opacity-50 ${
                    hasEndDateError ? "border-[var(--danger)]" : ""
                  }`}
                />
                {validationError.endDate ? (
                  <p className="form-error mt-1">{validationError.endDate}</p>
                ) : null}
              </div>

              <div className="md:col-span-2">
                <label className="group flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={Boolean(experience.isCurrent)}
                    onChange={(event) =>
                      handleCurrentlyWorkingChange(
                        index,
                        event.target.checked,
                      )
                    }
                    className="h-4 w-4 rounded border-[var(--border)] bg-[var(--background-soft)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:ring-offset-0"
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
                    onUpdate(
                      index,
                      "description",
                      event.target.value,
                    )
                  }
                  placeholder="Describe your responsibilities and achievements..."
                  rows={3}
                  className="textarea-field resize-none"
                />
              </div>
            </div>
          </div>
        );
      })}

      {!experiencesAreValid ? (
        <div className="rounded-lg border border-[var(--danger-border)] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
          Complete or remove the highlighted experience. A row containing only
          start/end dates cannot be saved.
        </div>
      ) : null}

      

      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] py-4 text-sm font-medium text-[var(--text-muted)] transition hover:border-[var(--primary-border)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
      >
        <Plus className="h-4 w-4" />
        Add more experience
      </button>

      {/* Candidate Status Section - Only show when NO current company */}
      {!hasAnyCurrentExperience && (
        <div className="surface-card space-y-4 rounded-xl border border-[var(--border)] p-5">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[var(--primary)]" />
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">
              Candidate Status
            </h4>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                Current Status <span className="text-[var(--danger)]">*</span>
              </label>
              <select
                value={statusType}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  handleStatusChange(selectedValue);
                }}
                className={`select-field ${
                  statusErrors.statusType ? "border-[var(--danger)]" : ""
                }`}
              >
                <option value="">Select your status...</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {statusErrors.statusType ? (
                <p className="form-error mt-1">
                  {statusErrors.statusType}
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                Since <span className="text-[var(--danger)]">*</span>
              </label>
              <input
                type="date"
                value={statusSince}
                max={today}
                onChange={(event) =>
                  onStatusSinceChange(event.target.value)
                }
                className={`input-field ${
                  statusErrors.statusSince ? "border-[var(--danger)]" : ""
                }`}
              />
              {statusErrors.statusSince ? (
                <p className="form-error mt-1">
                  {statusErrors.statusSince}
                </p>
              ) : (
                <p className="form-helper mt-1">
                  Select the date from which this status applies.
                </p>
              )}
            </div>

            {/* Note (optional) */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                Note (Optional)
              </label>
              <textarea
                value={safeStatusNote}
                onChange={(e) => onStatusNoteChange(e.target.value.slice(0, 500))}
                placeholder="Add any additional details about your status..."
                rows={2}
                maxLength={500}
                className="textarea-field resize-none"
              />
              <div className="mt-1 flex justify-between text-xs">
                
                <span className={`${safeStatusNote.length > 450 ? 'text-[var(--warning)]' : 'text-[var(--text-muted)]'}`}>
                  {safeStatusNote.length}/500
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show employed status message when user has current company */}
      {hasAnyCurrentExperience && (
        <div className="space-y-4 rounded-xl border border-[var(--success-border)] bg-[var(--success-soft)] p-5">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[var(--success)]" />
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">Employment Status</h4>
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
        <div className="space-y-4 rounded-xl border border-[var(--success-border)] bg-[var(--success-soft)] p-5">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[var(--success)]" />
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">
              Current Employment Details
            </h4>
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
                  onNoticePeriodChange(event.target.value)
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
                  onCompanyEmailChange(event.target.value)
                }
                onBlur={(event) =>
                  onCompanyEmailChange(
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
    </div>
  );
}