"use client";

import { useEffect, useState, useRef } from "react";
import { Award as AwardIcon, Calendar, Plus, Trash2, Building2, Search, X, Loader2 } from "lucide-react";

import { TextInput } from "../shared/TextInput";
import { TextArea } from "../shared/TextArea";
import type { Award } from "@/types/profile";
import axiosInstance from "@/lib/axiosInstance";

type AwardEditorProps = {
  awards: Award[];
  onUpdate: (index: number, key: keyof Award, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

const emptyAward: Award = {
  title: "",
  organization: "",
  startDate: "",
  endDate: "",
  description: "",
};

function normalizeMonthValue(value?: string | null) {
  if (!value) return "";

  if (/^\d{4}-\d{2}$/.test(value)) return value;

  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 7);
  }

  return "";
}

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

// Organization Autocomplete Component - FIXED: Uses /api/company
const OrganizationAutocomplete = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || "");
  const [data, setData] = useState<string[]>([]);
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
      
      // Extract company names
      const companyNames = items
        .map((item) => String(item.name || item.value || item.label || ""))
        .filter((name) => name && name.trim() !== '');
      
      setData([...new Set(companyNames)]);
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

  // Create new company - FIXED: Uses /api/company POST
  const handleCreate = async () => {
    const valueToCreate = searchTerm.trim();
    if (!valueToCreate || isCreating) return;

    try {
      setIsCreating(true);
      const response = await axiosInstance.post('/api/company', {
        name: valueToCreate,
      });

      const items = extractItems(response.data);
      const createdItem = items[0] || response.data?.data;
      const createdValue = String(createdItem?.name || valueToCreate);

      setData(prev => {
        const exists = prev.some(item => item.toLowerCase() === createdValue.toLowerCase());
        return exists ? prev : [...prev, createdValue];
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

  const filteredData = data.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exactMatchExists = data.some(
    item => item.toLowerCase() === searchTerm.toLowerCase()
  );

  const showDropdown = isOpen && (loading || searchTerm.length > 0 || data.length > 0);

  return (
    <div className="relative" ref={dropdownRef}>
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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
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
              Loading companies...
            </div>
          ) : filteredData.length > 0 ? (
            <>
              {filteredData.slice(0, 15).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-green-500/10 transition-colors border-b border-[#2a3a52] last:border-0"
                >
                  {item}
                </button>
              ))}
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

export function AwardEditor({
  awards,
  onUpdate,
  onAdd,
  onRemove,
}: AwardEditorProps) {
  const [localAwards, setLocalAwards] = useState<Award[]>(awards || []);

  useEffect(() => {
    setLocalAwards(awards || []);
  }, [awards]);

  const handleUpdate = (index: number, key: keyof Award, value: string) => {
    setLocalAwards((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              [key]: value,
            }
          : item,
      ),
    );

    onUpdate(index, key, value);
  };

  const handleAdd = () => {
    setLocalAwards((prev) => [...prev, { ...emptyAward }]);
    onAdd();
  };

  const handleRemove = (index: number) => {
    setLocalAwards((prev) => prev.filter((_, idx) => idx !== index));
    onRemove(index);
  };

  return (
    <div className="space-y-6">
      {localAwards.length === 0 && (
        <div className="rounded-xl border border-dashed border-[#2a3a52] bg-[#111827] p-8 text-center hover:border-green-500/30 transition-all duration-300">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20">
            <AwardIcon className="h-7 w-7 text-green-400" />
          </div>

          <h3 className="text-base font-semibold text-white">
            No awards added yet
          </h3>

          <p className="mt-1 text-sm text-gray-400 max-w-sm mx-auto">
            Add your achievements, recognitions, certificates, or competition awards here.
          </p>

          <button
            type="button"
            onClick={handleAdd}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/30 px-4 py-2 text-sm font-medium text-green-400 hover:bg-green-500/20 hover:border-green-500/50 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Award
          </button>
        </div>
      )}

      {localAwards.map((item, idx) => (
        <div
          key={item._id || `award-${idx}`}
          className="group rounded-xl border border-[#2a3a52] bg-[#111827] p-5 hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5"
        >
          {/* Card Header */}
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 border border-green-500/20">
                <AwardIcon className="h-5 w-5 text-green-400" />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white">
                  Award {idx + 1}
                </h4>
                {!item.title && !item.organization && (
                  <span className="text-[10px] text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full">Optional</span>
                )}
              </div>
            </div>

            {localAwards.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:border-red-500/50 hover:bg-red-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <AwardIcon className="h-3.5 w-3.5 text-gray-500" />
                Title
              </label>
              <input
                type="text"
                value={item.title ?? ""}
                onChange={(e) => handleUpdate(idx, "title", e.target.value)}
                placeholder="Enter award title"
                className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
              />
            </div>

            {/* Organization - Using Company API */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-gray-500" />
                Organization
              </label>
              <OrganizationAutocomplete
                value={item.organization ?? ""}
                onChange={(value: string) => handleUpdate(idx, "organization", value)}
                placeholder="Search or type organization..."
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
                value={normalizeMonthValue(item.startDate)}
                onChange={(e) => handleUpdate(idx, "startDate", e.target.value)}
                className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
              />
            </div>

            {/* Description - Full width */}
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-gray-300">
                Description
              </label>
              <textarea
                value={item.description ?? ""}
                onChange={(e) => handleUpdate(idx, "description", e.target.value)}
                placeholder="Describe your achievement..."
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
        onClick={handleAdd}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#2a3a52] bg-[#111827] py-4 text-sm font-medium text-gray-400 transition hover:border-green-500/50 hover:text-green-400 hover:bg-green-500/5"
      >
        <Plus className="h-4 w-4" />
        Add Award
      </button>
    </div>
  );
}