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

  // ✅ Status props
  statusType: string;
  statusSince: string;
  statusNote: string;
  statusExpectedReturn: string;
  onStatusTypeChange: (value: string) => void;
  onStatusSinceChange: (value: string) => void;
  onStatusNoteChange: (value: string) => void;
  onStatusExpectedReturnChange: (value: string) => void;
};

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
        <label className="mb-1.5 flex items-center gap-1 text-xs font-medium text-gray-300">
          {label}
          {required && <span className="text-red-400">*</span>}
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
          className={`w-full rounded-lg border bg-[#0f172a] px-10 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-[#2a3a52] focus:border-green-500 focus:ring-green-500"
          }`}
        />

        {Icon ? (
          <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        ) : null}

        {searchTerm ? (
          <button
            type="button"
            onClick={clearInput}
            aria-label="Clear input"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}

      {showDropdown ? (
        <div className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-[#2a3a52] bg-[#111827] shadow-xl">
          {loading ? (
            <div className="flex items-center justify-center px-4 py-3 text-sm text-gray-400">
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
                    className="group flex w-full items-center justify-between border-b border-[#2a3a52] px-4 py-2.5 text-left text-sm text-white transition-colors last:border-0 hover:bg-green-500/10"
                  >
                    <span>{displayValue}</span>

                    {isCustomItem(item) ? (
                      <span className="text-[10px] text-gray-500 group-hover:text-green-400">
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
                  className="flex w-full items-center gap-2 border-t border-[#2a3a52] px-4 py-2.5 text-left text-sm text-green-400 transition-colors hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-60"
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
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-green-400 transition-colors hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-60"
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
              <p className="text-sm text-gray-400">No options found</p>
              <p className="mt-1 text-xs text-gray-500">
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
  // ✅ Status props
  statusType = "",
  statusSince = "",
  statusNote = "",
  statusExpectedReturn = "",
  onStatusTypeChange,
  onStatusSinceChange,
  onStatusNoteChange,
  onStatusExpectedReturnChange,
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

  // ✅ Get user type for status options
  const [userType, setUserType] = useState<"student" | "fresher" | "professional">("professional");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = localStorage.getItem("selectedRole") || user?.userType || "professional";
    setUserType(role as "student" | "fresher" | "professional");
  }, []);

  // ✅ Status options based on user type
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

  // ✅ Check if any experience has isCurrent: true
  const hasAnyCurrentExperience = experiences.some(
    (exp) => exp.isCurrent === true,
  );

  // ✅ Handle status change - Directly call the parent handlers
  const handleStatusChange = (value: string) => {
    const today = new Date().toISOString().split("T")[0];
    
    // ✅ Update status type in parent
    onStatusTypeChange(value);
    
    // ✅ Update status since to today in parent
    onStatusSinceChange(today);
    
    // ✅ Clear expected return if not career break in parent
    if (value !== "career_break") {
      onStatusExpectedReturnChange("");
    }
  };

  // ✅ Safely get status note with fallback
  const safeStatusNote = statusNote || "";

  // ✅ Log current status for debugging
  console.log("Current statusType in ExperienceEditor:", statusType);

  return (
    <div className="space-y-6">
      {experiences.map((experience, index) => {
        const hasCompanyError = experience.isCurrent && !experience.company?.trim();
        
        return (
          <div
            key={experience._id || `experience-${index}`}
            className={`group rounded-xl border bg-[#111827] p-5 transition-all duration-300 ${
              hasCompanyError
                ? "border-red-500/50 hover:border-red-500/70"
                : "border-[#2a3a52] hover:border-green-500/30"
            } hover:shadow-lg hover:shadow-green-500/5`}
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                  hasCompanyError
                    ? "border-red-500/20 bg-red-500/10 text-red-400"
                    : "border-green-500/20 bg-green-500/10 text-green-400"
                }`}>
                  <Briefcase className="h-4 w-4" />
                </div>

                <h4 className="text-sm font-semibold text-white">
                  Experience {index + 1}
                </h4>

                {hasCompanyError && (
                  <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] text-red-400">
                    Required
                  </span>
                )}

                {!experience.company &&
                !experience.role &&
                !experience.startDate ? (
                  <span className="rounded-full bg-gray-800/50 px-2 py-0.5 text-[10px] text-gray-500">
                    Optional
                  </span>
                ) : null}
              </div>

              {experiences.length > 1 ? (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:border-red-500/50 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-300">
                  <Building2 className="h-3.5 w-3.5 text-gray-500" />
                  Company
                  {experience.isCurrent && (
                    <span className="ml-1 text-red-400">*</span>
                  )}
                </label>

                <AutocompleteInput
                  apiType="company"
                  value={experience.company || ""}
                  onChange={(value, item) =>
                    handleCompanyChange(index, value, item)
                  }
                  placeholder="Search or type company name..."
                  icon={Search}
                  required={experience.isCurrent || false}
                  error={hasCompanyError ? "Company name is required for current employment" : ""}
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-300">
                  <User className="h-3.5 w-3.5 text-gray-500" />
                  Role / Title
                </label>

                <AutocompleteInput
                  apiType="jobRole"
                  value={experience.role || ""}
                  onChange={(value) =>
                    onUpdate(index, "role", value)
                  }
                  placeholder="Search or type job role..."
                  icon={Search}
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-300">
                  <Calendar className="h-3.5 w-3.5 text-gray-500" />
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
                  className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-300">
                  <Calendar className="h-3.5 w-3.5 text-gray-500" />
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
                  className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
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
                    className="h-4 w-4 rounded border-[#2a3a52] bg-[#0f172a] text-green-500 focus:ring-2 focus:ring-green-500/20 focus:ring-offset-0"
                  />

                  <span className="text-sm font-medium text-gray-300 transition-colors group-hover:text-white">
                    Currently working here
                  </span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-medium text-gray-300">
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
                  className="w-full resize-none rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#2a3a52] bg-[#111827] py-4 text-sm font-medium text-gray-400 transition hover:border-green-500/50 hover:bg-green-500/5 hover:text-green-400"
      >
        <Plus className="h-4 w-4" />
        Add more experience
      </button>

      {/* ✅ Candidate Status Section - Only show when NO current company */}
      {!hasAnyCurrentExperience && (
        <div className="space-y-4 rounded-xl border border-[#2a3a52] bg-[#111827] p-5">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-400" />
            <h4 className="text-sm font-semibold text-white">Candidate Status</h4>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-300">
                Current Status <span className="text-red-400">*</span>
              </label>
              <select
                value={statusType}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  console.log("Dropdown selected value:", selectedValue);
                  handleStatusChange(selectedValue);
                }}
                className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="">Select your status...</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ✅ Expected Return Date (only for career break) */}
            {statusType === "career_break" && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-300">
                  Expected Return Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={statusExpectedReturn}
                  onChange={(e) => onStatusExpectedReturnChange(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  When do you plan to return to work?
                </p>
              </div>
            )}

            {/* ✅ Note (optional) */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-300">
                Note (Optional)
              </label>
              <textarea
                value={safeStatusNote}
                onChange={(e) => onStatusNoteChange(e.target.value.slice(0, 500))}
                placeholder="Add any additional details about your status..."
                rows={2}
                maxLength={500}
                className="w-full resize-none rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <div className="mt-1 flex justify-between text-xs">
                <span className="text-gray-500">Optional</span>
                <span className={`${safeStatusNote.length > 450 ? 'text-yellow-400' : 'text-gray-500'}`}>
                  {safeStatusNote.length}/500
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Show employed status message when user has current company */}
      {hasAnyCurrentExperience && (
        <div className="space-y-4 rounded-xl border border-green-500/20 bg-green-500/5 p-5">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-green-400" />
            <h4 className="text-sm font-semibold text-white">Employment Status</h4>
            <span className="ml-auto rounded-full bg-green-500/20 px-2.5 py-0.5 text-[10px] font-medium text-green-400">
              Auto-Managed
            </span>
          </div>
          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/20">
                <Briefcase className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Currently Employed</p>
                <p className="text-xs text-gray-400">
                  Your status is automatically set to &quot;Employed&quot; since you have a current job.
                  This will be managed by the system.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasAnyCurrentExperience ? (
        <div className="space-y-4 rounded-xl border border-green-500/20 bg-green-500/5 p-5">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-green-400" />
            <h4 className="text-sm font-semibold text-white">
              Current Employment Details
            </h4>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="noticePeriod"
                className="text-xs font-medium text-gray-300"
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
                className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="companyEmail"
                className="text-xs font-medium text-gray-300"
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
                className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}