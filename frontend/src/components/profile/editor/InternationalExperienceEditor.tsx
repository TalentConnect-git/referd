"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Plus, Trash2, Briefcase, Building2, User, Calendar, Search, X, Loader2, Globe } from "lucide-react";
import type { InternationalExperience } from "@/types/profile";
import axiosInstance from "@/lib/axiosInstance";
import countries from "world-countries";

type InternationalExperienceEditorProps = {
  items: InternationalExperience[];
  onUpdate: (
    index: number,
    key: keyof InternationalExperience,
    value: string,
  ) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

// Country data formatted for autocomplete
const countryOptions = countries.map(country => ({
  value: country.name.common,
  label: country.name.common,
  flag: country.flag,
  region: country.region,
}));

// Helper function to extract items from API response
function extractItems(responseData: unknown): any[] {
  if (Array.isArray(responseData)) {
    return responseData;
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
    return response.data;
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
      return nestedData.data;
    }
    if (Array.isArray(nestedData.items)) {
      return nestedData.items;
    }
    if (Array.isArray(nestedData.companies)) {
      return nestedData.companies;
    }
    if (Array.isArray(nestedData.results)) {
      return nestedData.results;
    }
  }

  if (Array.isArray(response.items)) {
    return response.items;
  }
  if (Array.isArray(response.companies)) {
    return response.companies;
  }
  if (Array.isArray(response.results)) {
    return response.results;
  }

  return [];
}

// Country Autocomplete Component
const CountryAutocomplete = ({
  value,
  onChange,
  placeholder,
  label,
  icon: Icon,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ElementType;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || "");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync searchTerm with value
  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onChange(val);
    setIsOpen(true);
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setSearchTerm(selectedValue);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const clearInput = () => {
    setSearchTerm("");
    onChange("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const filteredCountries = countryOptions.filter(country =>
    country.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.region?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showDropdown = isOpen && (searchTerm.length > 0 || filteredCountries.length > 0);

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="text-xs font-medium text-gray-300 mb-1.5 block">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleFocus}
          placeholder={placeholder || "Search country..."}
          className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 pl-10 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
        />
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />}
        {searchTerm && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-[#2a3a52] bg-[#111827] shadow-xl">
          {filteredCountries.length > 0 ? (
            <div className="py-1">
              {filteredCountries.slice(0, 20).map((country) => (
                <button
                  key={country.value}
                  type="button"
                  onClick={() => handleSelect(country.value)}
                  className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-green-500/10 transition-colors flex items-center gap-3 border-b border-[#2a3a52] last:border-0"
                >
                  <span className="text-lg">{country.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{country.label}</span>
                    {country.region && (
                      <span className="text-xs text-gray-500">{country.region}</span>
                    )}
                  </div>
                </button>
              ))}
              
              {searchTerm.trim() && !countryOptions.some(c => 
                c.label.toLowerCase() === searchTerm.toLowerCase()
              ) && (
                <button
                  type="button"
                  onClick={() => handleSelect(searchTerm.trim())}
                  className="w-full px-4 py-2.5 text-left text-sm text-green-400 hover:bg-green-500/10 transition-colors flex items-center gap-2 border-t border-[#2a3a52]"
                >
                  <Plus className="h-4 w-4" />
                  Use "{searchTerm.trim()}"
                </button>
              )}
            </div>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400">
              {searchTerm.length > 0 ? (
                <button
                  type="button"
                  onClick={() => handleSelect(searchTerm.trim())}
                  className="text-green-400 hover:text-green-300 flex items-center gap-2 w-full"
                >
                  <Plus className="h-4 w-4" />
                  Use "{searchTerm.trim()}"
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400">Type to search countries...</p>
                  <p className="text-xs text-gray-500 mt-1">No countries found</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Company Autocomplete Component - FIXED: Uses /api/company
const CompanyAutocomplete = ({
  value,
  onChange,
  placeholder,
  label,
  icon: Icon,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ElementType;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || "");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasFetchedRef = useRef(false);

  // Sync searchTerm with value
  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  // Fetch data from API - FIXED: Uses /api/company
  const fetchData = async () => {
    if (hasFetchedRef.current || loading) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/company');
      const items = extractItems(response.data);
      
      // Transform items to have consistent structure
      const transformedItems = items.map((item) => ({
        ...item,
        value: item.name || item.value || "",
        label: item.name || item.value || "",
      }));
      
      setData(transformedItems);
      hasFetchedRef.current = true;
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = () => {
    setIsOpen(true);
    fetchData();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onChange(val);
    setIsOpen(true);
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setSearchTerm(selectedValue);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const clearInput = () => {
    setSearchTerm("");
    onChange("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Create new company - FIXED: Uses /api/company
  const handleCreate = async () => {
    const valueToCreate = searchTerm.trim();
    if (!valueToCreate || isCreating) return;

    try {
      setIsCreating(true);
      const response = await axiosInstance.post('/api/company', {
        name: valueToCreate,
      });

      const items = extractItems(response.data);
      const responseObject = response.data && typeof response.data === "object" && !Array.isArray(response.data)
        ? (response.data as { data?: any; item?: any })
        : undefined;

      const createdItem = items[0] || responseObject?.data || responseObject?.item || {
        value: valueToCreate,
        name: valueToCreate,
        label: valueToCreate,
        isCustom: true,
      };

      const createdValue = createdItem.name || createdItem.value || valueToCreate;

      setData(prev => {
        const exists = prev.some(item => 
          (item.name || item.value || "").toLowerCase() === createdValue.toLowerCase()
        );
        return exists ? prev : [...prev, createdItem];
      });

      onChange(createdValue);
      setSearchTerm(createdValue);
      setIsOpen(false);
      inputRef.current?.blur();
    } catch (error) {
      console.error("Error creating company:", error);
      // Keep the typed value even if API fails
      onChange(valueToCreate);
      setSearchTerm(valueToCreate);
      setIsOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  const getDisplayValue = (item: any): string => {
    return item?.label || item?.value || item?.name || "";
  };

  const filteredData = data.filter(item => {
    const displayValue = getDisplayValue(item).toLowerCase();
    return displayValue.includes(searchTerm.toLowerCase());
  });

  const exactMatchExists = data.some(item => 
    getDisplayValue(item).toLowerCase() === searchTerm.toLowerCase()
  );

  const showDropdown = isOpen && (loading || searchTerm.length > 0 || data.length > 0);

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="text-xs font-medium text-gray-300 mb-1.5 block">
          {label}
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
          className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 pl-10 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
        />
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />}
        {searchTerm && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-[#2a3a52] bg-[#111827] shadow-xl">
          {loading ? (
            <div className="flex items-center justify-center px-4 py-3 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading...
            </div>
          ) : filteredData.length > 0 ? (
            <>
              {filteredData.slice(0, 15).map((item, index) => {
                const displayValue = getDisplayValue(item);
                return (
                  <button
                    key={item._id || item.id || index}
                    type="button"
                    onClick={() => handleSelect(displayValue)}
                    className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-green-500/10 transition-colors flex items-center justify-between group border-b border-[#2a3a52] last:border-0"
                  >
                    <span>{displayValue}</span>
                    {item.isCustom && (
                      <span className="text-[10px] text-gray-500 group-hover:text-green-400">Custom</span>
                    )}
                  </button>
                );
              })}
              
              {searchTerm.trim() && !exactMatchExists && (
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="w-full px-4 py-2.5 text-left text-sm text-green-400 hover:bg-green-500/10 transition-colors flex items-center gap-2 border-t border-[#2a3a52]"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create "{searchTerm.trim()}"
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400">
              {searchTerm.length > 0 ? (
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="text-green-400 hover:text-green-300 flex items-center gap-2 w-full"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create "{searchTerm.trim()}"
                    </>
                  )}
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400">Type to search companies...</p>
                  <p className="text-xs text-gray-500 mt-1">No companies found</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Role Autocomplete Component - Uses /api/company-master-data
const RoleAutocomplete = ({
  value,
  onChange,
  placeholder,
  label,
  icon: Icon,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ElementType;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || "");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasFetchedRef = useRef(false);

  // Sync searchTerm with value
  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  // Fetch data from API
  const fetchData = async () => {
    if (hasFetchedRef.current || loading) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/company-master-data', {
        params: { type: "JOB_ROLE" }
      });
      const items = extractItems(response.data);
      const transformedItems = items.map((item: any) => ({
        ...item,
        value: item.value || item.label || "",
        label: item.value || item.label || "",
      }));
      setData(transformedItems);
      hasFetchedRef.current = true;
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = () => {
    setIsOpen(true);
    fetchData();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onChange(val);
    setIsOpen(true);
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setSearchTerm(selectedValue);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const clearInput = () => {
    setSearchTerm("");
    onChange("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Create new role
  const handleCreate = async () => {
    const valueToCreate = searchTerm.trim();
    if (!valueToCreate || isCreating) return;

    try {
      setIsCreating(true);
      const response = await axiosInstance.post('/api/company-master-data', {
        type: "JOB_ROLE",
        value: valueToCreate
      });

      const items = extractItems(response.data);
      const responseObject = response.data && typeof response.data === "object" && !Array.isArray(response.data)
        ? (response.data as { data?: any; item?: any })
        : undefined;

      const createdItem = items[0] || responseObject?.data || responseObject?.item || {
        value: valueToCreate,
        label: valueToCreate,
        isCustom: true,
      };

      const createdValue = createdItem.value || createdItem.label || valueToCreate;

      setData(prev => {
        const exists = prev.some(item => 
          (item.value || item.label || "").toLowerCase() === createdValue.toLowerCase()
        );
        return exists ? prev : [...prev, createdItem];
      });

      onChange(createdValue);
      setSearchTerm(createdValue);
      setIsOpen(false);
      inputRef.current?.blur();
    } catch (error) {
      console.error("Error creating role:", error);
      // Keep the typed value even if API fails
      onChange(valueToCreate);
      setSearchTerm(valueToCreate);
      setIsOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  const getDisplayValue = (item: any): string => {
    return item?.label || item?.value || "";
  };

  const filteredData = data.filter(item => {
    const displayValue = getDisplayValue(item).toLowerCase();
    return displayValue.includes(searchTerm.toLowerCase());
  });

  const exactMatchExists = data.some(item => 
    getDisplayValue(item).toLowerCase() === searchTerm.toLowerCase()
  );

  const showDropdown = isOpen && (loading || searchTerm.length > 0 || data.length > 0);

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="text-xs font-medium text-gray-300 mb-1.5 block">
          {label}
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
          className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 pl-10 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
        />
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />}
        {searchTerm && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-[#2a3a52] bg-[#111827] shadow-xl">
          {loading ? (
            <div className="flex items-center justify-center px-4 py-3 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading...
            </div>
          ) : filteredData.length > 0 ? (
            <>
              {filteredData.slice(0, 15).map((item, index) => {
                const displayValue = getDisplayValue(item);
                return (
                  <button
                    key={item._id || item.id || index}
                    type="button"
                    onClick={() => handleSelect(displayValue)}
                    className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-green-500/10 transition-colors flex items-center justify-between group border-b border-[#2a3a52] last:border-0"
                  >
                    <span>{displayValue}</span>
                    {item.isCustom && (
                      <span className="text-[10px] text-gray-500 group-hover:text-green-400">Custom</span>
                    )}
                  </button>
                );
              })}
              
              {searchTerm.trim() && !exactMatchExists && (
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="w-full px-4 py-2.5 text-left text-sm text-green-400 hover:bg-green-500/10 transition-colors flex items-center gap-2 border-t border-[#2a3a52]"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create "{searchTerm.trim()}"
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400">
              {searchTerm.length > 0 ? (
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="text-green-400 hover:text-green-300 flex items-center gap-2 w-full"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create "{searchTerm.trim()}"
                    </>
                  )}
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400">Type to search roles...</p>
                  <p className="text-xs text-gray-500 mt-1">No roles found</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export function InternationalExperienceEditor({
  items,
  onUpdate,
  onAdd,
  onRemove,
}: InternationalExperienceEditorProps) {
  return (
    <div className="space-y-6">
      {items.map((item, idx) => (
        <div
          key={item._id || idx}
          className="group rounded-xl border border-[#2a3a52] bg-[#111827] p-5 hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5"
        >
          {/* Card Header */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
                <Globe className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">
                International Experience {idx + 1}
              </h4>
              {!item.country && !item.organization && !item.role && (
                <span className="text-[10px] text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full">Optional</span>
              )}
            </div>

            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:border-red-500/50 hover:bg-red-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Country - Using CountryAutocomplete */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-gray-500" />
                Country
              </label>
              <CountryAutocomplete
                value={item.country || ""}
                onChange={(value: string) => onUpdate(idx, "country", value)}
                placeholder="Search country..."
                icon={Search}
              />
            </div>

            {/* Organization - Using Company API */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-gray-500" />
                Organization
              </label>
              <CompanyAutocomplete
                value={item.organization || ""}
                onChange={(value: string) => onUpdate(idx, "organization", value)}
                placeholder="Search or type organization..."
                icon={Search}
              />
            </div>

            {/* Role - Using Company Master Data API */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-gray-500" />
                Role
              </label>
              <RoleAutocomplete
                value={item.role || ""}
                onChange={(value: string) => onUpdate(idx, "role", value)}
                placeholder="Search or type role..."
                icon={Search}
              />
            </div>

            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-gray-500" />
                Start Date
              </label>
              <input
                type="month"
                value={item.startDate || ""}
                onChange={(e) => onUpdate(idx, "startDate", e.target.value)}
                className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
              />
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-gray-500" />
                End Date
              </label>
              <input
                type="month"
                value={item.endDate || ""}
                onChange={(e) => onUpdate(idx, "endDate", e.target.value)}
                className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-gray-300">
                Description
              </label>
              <textarea
                value={item.description || ""}
                onChange={(e) => onUpdate(idx, "description", e.target.value)}
                placeholder="Describe your responsibilities and achievements..."
                rows={3}
                className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 resize-none text-sm"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add Button */}
      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#2a3a52] bg-[#111827] py-4 text-sm font-medium text-gray-400 transition hover:border-green-500/50 hover:text-green-400 hover:bg-green-500/5"
      >
        <Plus className="h-4 w-4" />
        Add International Experience
      </button>
    </div>
  );
}