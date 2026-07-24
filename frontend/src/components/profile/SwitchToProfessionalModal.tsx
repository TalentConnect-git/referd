// components/profile/SwitchToProfessionalModal.tsx
"use client";

import { useState, useEffect, useMemo, useRef, ChangeEvent, ElementType } from "react";
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
  CheckCircle2,
  XCircle,
} from "lucide-react";
import axios from "axios";
import type { Experience } from "@/types/profile";
import { useAuth } from "@/context/AuthContext";

// ============= Autocomplete Types =============
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

// ============= Helper Functions =============
function extractItems(responseData: unknown): AutocompleteItem[] {
  if (Array.isArray(responseData)) return responseData as AutocompleteItem[];
  if (!responseData || typeof responseData !== "object") return [];

  const response = responseData as {
    data?: unknown;
    item?: unknown;
    items?: unknown;
    companies?: unknown;
    results?: unknown;
  };

  const directCollections = [response.data, response.items, response.companies, response.results];
  for (const collection of directCollections) {
    if (Array.isArray(collection)) return collection as AutocompleteItem[];
  }

  if (response.data && typeof response.data === "object" && !Array.isArray(response.data)) {
    const nested = response.data as { data?: unknown; item?: unknown; items?: unknown; companies?: unknown; results?: unknown };
    const nestedCollections = [nested.data, nested.items, nested.companies, nested.results];
    for (const collection of nestedCollections) {
      if (Array.isArray(collection)) return collection as AutocompleteItem[];
    }
    if (nested.item && typeof nested.item === "object") return [nested.item as AutocompleteItem];
    return [response.data as AutocompleteItem];
  }

  if (response.item && typeof response.item === "object") return [response.item as AutocompleteItem];
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
      ""
  ).trim();
}

function getItemKey(item: AutocompleteItem, index: number): string {
  return String(item._id ?? item.id ?? item.value ?? item.name ?? item.label ?? `item-${index}`);
}

function isCustomItem(item: AutocompleteItem): boolean {
  return item.isCustom === true || item.isCustom === "true";
}

function getCanonicalId(item?: AutocompleteItem): string | undefined {
  const canonicalId = String(
    item?.company_canonical_id ??
      item?.companyCanonicalId ??
      item?.canonicalId ??
      item?.canonical_id ??
      ""
  ).trim();
  return canonicalId || undefined;
}

function getCompanyDisplayName(item: AutocompleteItem | undefined, fallback: string): string {
  return String(
    item?.displayName ??
      item?.label ??
      item?.name ??
      item?.companyName ??
      item?.company ??
      fallback
  ).trim();
}

function getCreatedItem(responseData: unknown, fallback: string) {
  const items = extractItems(responseData);
  if (items.length > 0) return items[0];
  return {
    name: fallback,
    value: fallback,
    label: fallback,
    displayName: fallback,
    isCustom: true,
  } satisfies AutocompleteItem;
}

// ============= AutocompleteInput Component =============
function AutocompleteInput({
  value,
  onChange,
  apiType,
  placeholder,
  label,
  icon: Icon,
  required = false,
  error = "",
}: {
  value: string;
  onChange: (value: string, item?: AutocompleteItem) => void;
  apiType: ApiType;
  placeholder?: string;
  label?: string;
  icon?: ElementType;
  required?: boolean;
  error?: string;
}) {
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchData() {
    if (hasFetchedRef.current || loading) return;
    try {
      setLoading(true);
      if (apiType === "company") {
        const response = await axios.get("/api/company", {
          baseURL: process.env.NEXT_PUBLIC_API_URL,
          withCredentials: true,
        });
        const items = extractItems(response.data).map((item) => {
          const displayValue = getDisplayValue(item);
          return { ...item, label: displayValue, value: item.value || displayValue, name: item.name || displayValue, displayName: item.displayName || displayValue };
        });
        setData(items);
      } else {
        const response = await axios.get("/api/company-master-data", {
          baseURL: process.env.NEXT_PUBLIC_API_URL,
          params: { type: "JOB_ROLE" },
          withCredentials: true,
        });
        const items = extractItems(response.data).map((item) => {
          const displayValue = getDisplayValue(item);
          return { ...item, label: displayValue, value: displayValue };
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
    if (!selectedValue) return;
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
    if (!valueToCreate || isCreating) return;

    try {
      setIsCreating(true);
      const response = apiType === "company"
        ? await axios.post("/api/company", 
            { name: valueToCreate },
            { baseURL: process.env.NEXT_PUBLIC_API_URL, withCredentials: true }
          )
        : await axios.post("/api/company-master-data", 
            { type: "JOB_ROLE", value: valueToCreate },
            { baseURL: process.env.NEXT_PUBLIC_API_URL, withCredentials: true }
          );

      const createdItem = getCreatedItem(response.data, valueToCreate);
      const createdValue = getDisplayValue(createdItem) || valueToCreate;
      const normalizedCreatedItem: AutocompleteItem = {
        ...createdItem,
        label: createdValue,
        value: createdItem.value || createdValue,
        name: createdItem.name || createdValue,
        displayName: createdItem.displayName || createdValue,
      };

      setData((prev) => {
        const exists = prev.some((item) => getDisplayValue(item).toLowerCase() === createdValue.toLowerCase());
        return exists ? prev : [...prev, normalizedCreatedItem];
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
    if (!normalizedSearch) return data;
    return data.filter((item) => getDisplayValue(item).toLowerCase().includes(normalizedSearch));
  }, [data, searchTerm]);

  const exactMatchExists = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return false;
    return data.some((item) => getDisplayValue(item).toLowerCase() === normalizedSearch);
  }, [data, searchTerm]);

  const showDropdown = isOpen && (loading || searchTerm.trim().length > 0 || data.length > 0);

  return (
    <div ref={dropdownRef} className="relative">
      {label && (
        <label className="mb-1.5 flex items-center gap-1 text-xs font-medium text-gray-300">
          {label}
          {required && <span className="text-red-400">*</span>}
        </label>
      )}
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
        {Icon && <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />}
        {searchTerm && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}

      {showDropdown && (
        <div className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-[#2a3a52] bg-[#111827] shadow-xl">
          {loading ? (
            <div className="flex items-center justify-center px-4 py-3 text-sm text-gray-400">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
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
                    onClick={() => handleSelect(item)}
                    className="group flex w-full items-center justify-between border-b border-[#2a3a52] px-4 py-2.5 text-left text-sm text-white transition-colors last:border-0 hover:bg-green-500/10"
                  >
                    <span>{displayValue}</span>
                    {isCustomItem(item) && (
                      <span className="text-[10px] text-gray-500 group-hover:text-green-400">Custom</span>
                    )}
                  </button>
                );
              })}
              {searchTerm.trim() && !exactMatchExists && (
                <button
                  type="button"
                  onClick={() => void handleCreate()}
                  disabled={isCreating}
                  className="flex w-full items-center gap-2 border-t border-[#2a3a52] px-4 py-2.5 text-left text-sm text-green-400 transition-colors hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" /> Create "{searchTerm.trim()}"
                    </>
                  )}
                </button>
              )}
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
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Create "{searchTerm.trim()}"
                </>
              )}
            </button>
          ) : (
            <div className="px-4 py-3 text-center">
              <p className="text-sm text-gray-400">No options found</p>
              <p className="mt-1 text-xs text-gray-500">Type a value to create one</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============= Main Modal Component =============
interface SwitchToProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    experiences: Experience[];
    statusType: string;
    statusSince: string;
    statusNote: string;
    statusExpectedReturn: string;
    noticePeriod: string;
    companyEmail: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export function SwitchToProfessionalModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: SwitchToProfessionalModalProps) {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [companyEmail, setCompanyEmail] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [statusType, setStatusType] = useState("");
  const [statusSince, setStatusSince] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [statusExpectedReturn, setStatusExpectedReturn] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Get user type from auth context
  const userType = user?.userType ||  "student";

  // Initialize with one empty experience
  useEffect(() => {
    if (isOpen && experiences.length === 0) {
      setExperiences([
        {
          company: "",
          role: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          description: "",
          company_canonical_id: "",
          company_display: "",
        },
      ]);
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setExperiences([]);
      setCompanyEmail("");
      setNoticePeriod("");
      setStatusType("");
      setStatusSince("");
      setStatusNote("");
      setStatusExpectedReturn("");
      setErrors({});
      setTouched({});
    }
  }, [isOpen]);

  // Check if any experience has isCurrent: true
  const hasAnyCurrentExperience = experiences.some((exp) => exp.isCurrent === true);

  // Get current experience that is marked as current
  const currentExperience = experiences.find((exp) => exp.isCurrent === true);

  // Status options based on user type (only used when NO current experience)
  const statusOptions = useMemo(() => {
    // Status options based on user type
    if (userType === "student" || userType === "fresher") {
      return [
        { value: "looking_internship", label: "Looking for Internship" },
        { value: "looking_job", label: "Looking for Job" },
        { value: "preparing_exams", label: "Preparing for Exams" },
        { value: "not_looking", label: "Not Looking" },
      ];
    }

    // Professional status options
    return [
      { value: "open_to_work", label: "Open to Work" },
      { value: "career_break", label: "Career Break" },
      { value: "freelancing", label: "Freelancing" },
      { value: "building", label: "Building Something" },
      { value: "not_looking", label: "Not Looking" },
    ];
  }, [userType]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Only validate if there are experiences with data
    const hasAnyData = experiences.some(
      (exp) => exp.company?.trim() || exp.role?.trim() || exp.startDate
    );

    if (!hasAnyData) {
      // No data to validate, allow submission
      return true;
    }

    // Validate at least one experience has required fields if they added data
    const hasValidExperience = experiences.some(
      (exp) => exp.company?.trim() && exp.role?.trim() && exp.startDate
    );

    if (!hasValidExperience) {
      newErrors.experiences = "Please complete at least one experience with company, role, and start date";
    }

    // Validate current experience has company
    if (hasAnyCurrentExperience && currentExperience) {
      if (!currentExperience.company?.trim()) {
        newErrors.company = "Company name is required for current employment";
      }
    }

    // Validate status only if no current experience AND user has added experience data
    if (!hasAnyCurrentExperience && hasAnyData && !statusType) {
      newErrors.status = "Please select your current status";
    }

    // Validate expected return date for career break
    if (statusType === "career_break" && !statusExpectedReturn) {
      newErrors.expectedReturn = "Expected return date is required for career break";
    }

    // Validate notice period if currently employed
    if (hasAnyCurrentExperience && noticePeriod && isNaN(Number(noticePeriod))) {
      newErrors.noticePeriod = "Notice period must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Filter out empty experiences - only include those with at least some data
    const validExperiences = experiences.filter(
      (exp) => exp.company?.trim() || exp.role?.trim() || exp.startDate
    );

    // If no valid experiences, send empty array
    const payload = {
      experiences: validExperiences.map((exp) => ({
        ...exp,
        company: exp.company?.trim() || "",
        role: exp.role?.trim() || "",
        description: exp.description || "",
        company_display: exp.company_display || exp.company?.trim() || "",
        company_canonical_id: exp.company_canonical_id || "",
        startDate: exp.startDate || "",
        endDate: exp.isCurrent ? "" : (exp.endDate || ""),
        isCurrent: exp.isCurrent || false,
      })),
      // If no valid experiences, don't send status
      statusType: validExperiences.length === 0 ? "" : (hasAnyCurrentExperience ? "employed" : (statusType || "")),
      statusSince: validExperiences.length === 0 ? "" : (statusSince || new Date().toISOString().split("T")[0]),
      statusNote: validExperiences.length === 0 ? "" : (statusNote || ""),
      statusExpectedReturn: validExperiences.length === 0 ? "" : (statusType === "career_break" ? statusExpectedReturn : ""),
      noticePeriod: hasAnyCurrentExperience && validExperiences.length > 0 ? (noticePeriod || "") : "",
      companyEmail: hasAnyCurrentExperience && validExperiences.length > 0 ? companyEmail : "",
    };

    await onConfirm(payload);
  };

  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        description: "",
        company_canonical_id: "",
        company_display: "",
      },
    ]);
    setTouched({});
  };

  const handleRemoveExperience = (index: number) => {
    if (experiences.length <= 1) {
      setErrors({ experiences: "You must have at least one experience" });
      return;
    }
    const newExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(newExperiences);
    setErrors({});
  };

  const handleUpdateExperience = (
    index: number,
    key: keyof Experience,
    value: Experience[keyof Experience]
  ) => {
    const newExperiences = [...experiences];
    newExperiences[index] = { ...newExperiences[index], [key]: value };

    // If setting isCurrent to true, clear endDate and other current flags
    if (key === "isCurrent" && value === true) {
      newExperiences[index].endDate = "";
      newExperiences.forEach((exp, i) => {
        if (i !== index) {
          exp.isCurrent = false;
        }
      });
      // Clear status fields when marking as current
      setStatusType("");
      setStatusSince("");
      setStatusNote("");
      setStatusExpectedReturn("");
    }

    setExperiences(newExperiences);
    setErrors({});
  };

  const handleCompanyChange = (index: number, value: string, item?: AutocompleteItem) => {
    const normalizedCompany = value.trimStart();
    const newExperiences = [...experiences];
    newExperiences[index].company = normalizedCompany;

    if (item) {
      const canonicalId = getCanonicalId(item);
      const displayName = getCompanyDisplayName(item, normalizedCompany);
      newExperiences[index].company_canonical_id = canonicalId || "";
      newExperiences[index].company_display = displayName;
    } else {
      newExperiences[index].company_canonical_id = "";
      newExperiences[index].company_display = normalizedCompany;
    }

    setExperiences(newExperiences);
    setErrors({});
  };

  const handleStatusChange = (value: string) => {
    setStatusType(value);
    setStatusSince(new Date().toISOString().split("T")[0]);
    if (value !== "career_break") {
      setStatusExpectedReturn("");
    }
    setErrors({});
  };

  const handleTouch = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  // Check if there's any data in experiences
  const hasAnyData = experiences.some(
    (exp) => exp.company?.trim() || exp.role?.trim() || exp.startDate
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0f172a] border border-[#2a3a52] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#2a3a52] bg-[#0f172a] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
              <Briefcase className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Switch to Professional Account
              </h2>
              <p className="text-sm text-gray-400">
                Add your work experience to complete the switch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-[#1a2533] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Experience List */}
          <div className="space-y-6">
            {experiences.map((experience, index) => {
              const hasCompanyError = experience.isCurrent && !experience.company?.trim();
              const isCurrent = experience.isCurrent === true;

              return (
                <div
                  key={experience._id || `experience-${index}`}
                  className={`group rounded-xl border bg-[#111827] p-5 transition-all duration-300 ${
                    hasCompanyError
                      ? "border-red-500/50 hover:border-red-500/70"
                      : isCurrent
                      ? "border-green-500/30 hover:border-green-500/50"
                      : "border-[#2a3a52] hover:border-green-500/30"
                  } hover:shadow-lg hover:shadow-green-500/5`}
                >
                  {/* Header */}
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                          hasCompanyError
                            ? "border-red-500/20 bg-red-500/10 text-red-400"
                            : isCurrent
                            ? "border-green-500/20 bg-green-500/10 text-green-400"
                            : "border-[#2a3a52] bg-[#1a2533] text-gray-400"
                        }`}
                      >
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-white">
                        Experience {index + 1}
                      </h4>
                      {isCurrent && (
                        <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-medium text-green-400">
                          Current
                        </span>
                      )}
                      {hasCompanyError && (
                        <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] text-red-400">
                          Required
                        </span>
                      )}
                    </div>

                    {experiences.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveExperience(index)}
                        className="flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:border-red-500/50 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Form Fields */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Company */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-300">
                        <Building2 className="h-3.5 w-3.5 text-gray-500" />
                        Company
                        {experience.isCurrent && <span className="ml-1 text-red-400">*</span>}
                      </label>
                      <AutocompleteInput
                        apiType="company"
                        value={experience.company || ""}
                        onChange={(value, item) => handleCompanyChange(index, value, item)}
                        placeholder="Search or type company name..."
                        icon={Search}
                        required={experience.isCurrent || false}
                        error={hasCompanyError ? "Company name is required for current employment" : ""}
                      />
                    </div>

                    {/* Role */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-300">
                        <User className="h-3.5 w-3.5 text-gray-500" />
                        Role / Title
                      </label>
                      <AutocompleteInput
                        apiType="jobRole"
                        value={experience.role || ""}
                        onChange={(value) => handleUpdateExperience(index, "role", value)}
                        placeholder="Search or type job role..."
                        icon={Search}
                      />
                    </div>

                    {/* Start Date */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-300">
                        <Calendar className="h-3.5 w-3.5 text-gray-500" />
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={experience.startDate || ""}
                        onChange={(e) => handleUpdateExperience(index, "startDate", e.target.value)}
                        className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>

                    {/* End Date */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-300">
                        <Calendar className="h-3.5 w-3.5 text-gray-500" />
                        End Date
                      </label>
                      <input
                        type="date"
                        value={experience.endDate || ""}
                        disabled={experience.isCurrent}
                        min={experience.startDate || undefined}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value) {
                            handleUpdateExperience(index, "endDate", value);
                          } else {
                            handleUpdateExperience(index, "endDate", "");
                          }
                        }}
                        className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    {/* Currently Working */}
                    <div className="md:col-span-2">
                      <label className="group flex cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={experience.isCurrent || false}
                          onChange={(e) => handleUpdateExperience(index, "isCurrent", e.target.checked)}
                          className="h-4 w-4 rounded border-[#2a3a52] bg-[#0f172a] text-green-500 focus:ring-2 focus:ring-green-500/20 focus:ring-offset-0"
                        />
                        <span className="text-sm font-medium text-gray-300 transition-colors group-hover:text-white">
                          Currently working here
                        </span>
                      </label>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-gray-300">Description</label>
                      <textarea
                        value={
                          Array.isArray(experience.description)
                            ? experience.description.join("\n")
                            : experience.description || ""
                        }
                        onChange={(e) => handleUpdateExperience(index, "description", e.target.value)}
                        placeholder="Describe your responsibilities and achievements..."
                        rows={3}
                        className="w-full resize-none rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add Experience Button */}
            <button
              type="button"
              onClick={handleAddExperience}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#2a3a52] bg-[#111827] py-4 text-sm font-medium text-gray-400 transition hover:border-green-500/50 hover:bg-green-500/5 hover:text-green-400"
            >
              <Plus className="h-4 w-4" />
              Add more experience
            </button>

            {/* Status Section - Only show when NO current company */}
            {!hasAnyCurrentExperience && (
              <div className="space-y-4 rounded-xl border border-[#2a3a52] bg-[#111827] p-5">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-400" />
                  <h4 className="text-sm font-semibold text-white">Candidate Status</h4>
                  <span className="ml-auto rounded-full bg-yellow-500/20 px-2.5 py-0.5 text-[10px] font-medium text-yellow-400">
                    Optional
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-300">
                      Current Status <span className="text-gray-500">(Optional)</span>
                    </label>
                    <select
                      value={statusType}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      onBlur={() => handleTouch("status")}
                      className={`w-full rounded-lg border bg-[#0f172a] px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 ${
                        errors.status && touched.status
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-[#2a3a52] focus:border-green-500 focus:ring-green-500"
                      }`}
                    >
                      <option value="">Select your status (Optional)</option>
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.status && touched.status && (
                      <p className="mt-1 text-xs text-red-400">{errors.status}</p>
                    )}
                  </div>

                  {/* Expected Return Date */}
                  {statusType === "career_break" && (
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-300">
                        Expected Return Date <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="date"
                        value={statusExpectedReturn}
                        onChange={(e) => setStatusExpectedReturn(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        When do you plan to return to work?
                      </p>
                      {errors.expectedReturn && (
                        <p className="mt-1 text-xs text-red-400">{errors.expectedReturn}</p>
                      )}
                    </div>
                  )}

                  {/* Note */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-300">
                      Note (Optional)
                    </label>
                    <textarea
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value.slice(0, 500))}
                      placeholder="Add any additional details about your status..."
                      rows={2}
                      maxLength={500}
                      className="w-full resize-none rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                    <div className="mt-1 flex justify-between text-xs">
                      <span className="text-gray-500">Optional</span>
                      <span className={statusNote.length > 450 ? "text-yellow-400" : "text-gray-500"}>
                        {statusNote.length}/500
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Current Employment Details - Only show when HAS current company */}
            {hasAnyCurrentExperience && (
              <>
                {/* Employment Status Banner */}
                <div className="space-y-4 rounded-xl border border-green-500/20 bg-green-500/5 p-5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
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
                          Your status is automatically set to "Employed" since you have a current job.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notice Period & Company Email */}
                <div className="space-y-4 rounded-xl border border-green-500/20 bg-green-500/5 p-5">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-green-400" />
                    <h4 className="text-sm font-semibold text-white">Current Employment Details</h4>
                    <span className="ml-auto rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-medium text-blue-400">
                      Optional
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <label htmlFor="noticePeriod" className="text-xs font-medium text-gray-300">
                        Notice Period (days) <span className="text-gray-500">(Optional)</span>
                      </label>
                      <input
                        id="noticePeriod"
                        type="number"
                        min="0"
                        step="1"
                        value={noticePeriod}
                        onChange={(e) => setNoticePeriod(e.target.value)}
                        placeholder="e.g., 30, 60, 90"
                        className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                      {errors.noticePeriod && (
                        <p className="mt-1 text-xs text-red-400">{errors.noticePeriod}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="companyEmail" className="text-xs font-medium text-gray-300">
                        Official Company Email <span className="text-gray-500">(Optional)</span>
                      </label>
                      <input
                        id="companyEmail"
                        type="email"
                        value={companyEmail}
                        onChange={(e) => setCompanyEmail(e.target.value)}
                        onBlur={(e) => setCompanyEmail(e.target.value.trim().toLowerCase())}
                        placeholder="yourname@company.com"
                        autoComplete="email"
                        className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Error Display */}
          {Object.keys(errors).length > 0 && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
              {Object.entries(errors).map(([key, error]) => (
                <p key={key} className="text-sm text-red-400">
                  • {error}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-between border-t border-[#2a3a52] bg-[#0f172a] px-6 py-4">
          <div className="text-xs text-gray-500">
            <span className="hidden sm:inline">Fields with </span>
            <span className="text-red-400">*</span>
            <span className="hidden sm:inline"> are required</span>
            <span className="hidden sm:inline ml-2">•</span>
            <span className="hidden sm:inline ml-2">You can skip adding experience</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-[#2a3a52] px-4 py-2 text-sm font-medium text-gray-400 transition hover:bg-[#1a2533] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-2 text-sm font-medium text-black transition hover:from-green-400 hover:to-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Switching...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Save & Switch
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}