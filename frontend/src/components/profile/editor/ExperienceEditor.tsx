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
    items?: unknown;
    companies?: unknown;
    results?: unknown;
  };

  if (Array.isArray(response.data)) {
    return response.data as AutocompleteItem[];
  }

  if (
    response.data &&
    typeof response.data === "object" &&
    !Array.isArray(response.data)
  ) {
    const nestedData = response.data as {
      data?: unknown;
      items?: unknown;
      companies?: unknown;
      results?: unknown;
    };

    if (Array.isArray(nestedData.data)) {
      return nestedData.data as AutocompleteItem[];
    }

    if (Array.isArray(nestedData.items)) {
      return nestedData.items as AutocompleteItem[];
    }

    if (Array.isArray(nestedData.companies)) {
      return nestedData.companies as AutocompleteItem[];
    }

    if (Array.isArray(nestedData.results)) {
      return nestedData.results as AutocompleteItem[];
    }
  }

  if (Array.isArray(response.items)) {
    return response.items as AutocompleteItem[];
  }

  if (Array.isArray(response.companies)) {
    return response.companies as AutocompleteItem[];
  }

  if (Array.isArray(response.results)) {
    return response.results as AutocompleteItem[];
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
      `autocomplete-item-${index}`,
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
    if (hasFetchedRef.current || loading) return;

    try {
      setLoading(true);

      const response =
        apiType === "company"
          ? await axiosInstance.get("/dropdown/companiesName")
          : await axiosInstance.get("/api/company-master-data", {
              params: {
                type: "COMPANY_DESIGNATION",
              },
            });

      setData(extractItems(response.data));
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
    onChange(nextValue);
    setIsOpen(true);
  }

  function handleSelect(selectedValue: string) {
    setSearchTerm(selectedValue);
    onChange(selectedValue);
    setIsOpen(false);
    inputRef.current?.blur();
  }

  function clearInput() {
    setSearchTerm("");
    onChange("");
    setIsOpen(false);
    inputRef.current?.focus();
  }

  async function handleCreate() {
    const valueToCreate = searchTerm.trim();

    if (!valueToCreate || isCreating) return;

    try {
      setIsCreating(true);

      const response =
        apiType === "company"
          ? await axiosInstance.post("/api/company", {
              name: valueToCreate,
            })
          : await axiosInstance.post("/api/company-master-data", {
              type: "COMPANY_DESIGNATION",
              value: valueToCreate,
            });

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
          name: valueToCreate,
          label: valueToCreate,
          isCustom: true,
        };

      const createdValue = getDisplayValue(createdItem) || valueToCreate;

      setData((previous) => {
        const alreadyExists = previous.some(
          (item) =>
            getDisplayValue(item).toLowerCase() === createdValue.toLowerCase(),
        );

        return alreadyExists ? previous : [...previous, createdItem];
      });

      setSearchTerm(createdValue);
      onChange(createdValue);
      setIsOpen(false);
      inputRef.current?.blur();
    } catch (error) {
      console.error(`Error creating ${apiType}:`, error);

      /*
       * Keep manually entered text in the form even when the optional
       * master-data creation endpoint fails.
       */
      onChange(valueToCreate);
      setSearchTerm(valueToCreate);
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
        <label className="mb-1.5 block text-xs font-medium text-gray-300">
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
          className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-10 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
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

                if (!displayValue) return null;

                return (
                  <button
                    key={getItemKey(item, index)}
                    type="button"
                    onClick={() => handleSelect(displayValue)}
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
}: ExperienceEditorProps) {
  function handleCurrentlyWorkingChange(index: number, checked: boolean) {
    onUpdate(index, "isCurrent", checked);

    if (!checked) {
      return;
    }

    onUpdate(index, "endDate", "");

    /*
     * Only one experience can be marked as current.
     * Do not clear companyEmail or noticePeriod here because they are
     * top-level onboarding fields and should only change through their inputs.
     */
    experiences.forEach((experience, experienceIndex) => {
      if (experienceIndex !== index && experience.isCurrent) {
        onUpdate(experienceIndex, "isCurrent", false);
      }
    });
  }

  const hasCurrentExperience = experiences.some(
    (experience) => Boolean(experience.isCurrent),
  );

  return (
    <div className="space-y-6">
      

      {experiences.map((experience, index) => (
        <div
          key={experience._id || `experience-${index}`}
          className="group rounded-xl border border-[#2a3a52] bg-[#111827] p-5 transition-all duration-300 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/5"
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-green-500/20 bg-green-500/10 text-green-400">
                <Briefcase className="h-4 w-4" />
              </div>

              <h4 className="text-sm font-semibold text-white">
                Experience {index + 1}
              </h4>

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
              </label>

              <AutocompleteInput
                apiType="company"
                value={experience.company || ""}
                onChange={(value) => onUpdate(index, "company", value)}
                placeholder="Search or type company name..."
                icon={Search}
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
                onChange={(value) => onUpdate(index, "role", value)}
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
                  onUpdate(index, "startDate", event.target.value)
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
                onChange={(event) =>
                  onUpdate(index, "endDate", event.target.value)
                }
                className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50"
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
                  onUpdate(index, "description", event.target.value)
                }
                placeholder="Describe your responsibilities and achievements..."
                rows={3}
                className="w-full resize-none rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#2a3a52] bg-[#111827] py-4 text-sm font-medium text-gray-400 transition hover:border-green-500/50 hover:bg-green-500/5 hover:text-green-400"
      >
        <Plus className="h-4 w-4" />
        Add more experience
      </button>

      {hasCurrentExperience ? (
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