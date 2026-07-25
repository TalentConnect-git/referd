"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Building2, User, Calendar, Search, X, Loader2, Globe, Award } from "lucide-react";
import { TextArea } from "../shared/TextArea";
import { TextInput } from "../shared/TextInput";
import type { Leadership } from "@/types/profile";
import axiosInstance from "@/lib/axiosInstance";

type LeadershipEditorProps = {
  items: Leadership[];
  onUpdate: (index: number, key: keyof Leadership, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

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

// Autocomplete Component for Organization (Company)
const OrganizationAutocomplete = ({
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
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  const fetchData = async () => {
    if (hasFetchedRef.current || loading) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/company');
      const items = extractItems(response.data);
      
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
      {label && (
        <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
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
          className="input-field pl-10 text-sm"
        />
        {Icon && <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />}
        {searchTerm && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="surface-card absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-[var(--border)] shadow-xl">
          {loading ? (
            <div className="flex items-center justify-center px-4 py-3 text-sm text-[var(--text-muted)]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading companies...
            </div>
          ) : filteredData.length > 0 ? (
            <>
              {filteredData.slice(0, 15).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full border-b border-[var(--border)] px-4 py-2.5 text-left text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--primary-soft)] last:border-0"
                >
                  {item}
                </button>
              ))}
              {searchTerm.trim() && !exactMatchExists && (
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="flex w-full items-center gap-2 border-t border-[var(--border)] px-4 py-2.5 text-left text-sm text-[var(--primary)] transition-colors hover:bg-[var(--primary-soft)]"
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
            <div className="px-4 py-3 text-sm text-[var(--text-muted)]">
              {searchTerm.length > 0 ? (
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="flex w-full items-center gap-2 text-[var(--primary)] hover:text-[var(--primary-hover)]"
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
                  <p className="text-[var(--text-muted)]">Type to search companies...</p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">No companies found</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Autocomplete Component for Role using Company Master Data API
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
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  const fetchData = async () => {
    if (hasFetchedRef.current || loading) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/company-master-data', {
        params: { type: "JOB_ROLE" }
      });
      const items = extractItems(response.data);
      const values = items
        .map((item: any) => String(item.value || item.label || ""))
        .filter((value: string) => value && value.trim() !== '');
      setData([...new Set(values)]);
      hasFetchedRef.current = true;
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleCreate = async () => {
    const valueToCreate = searchTerm.trim();
    if (!valueToCreate || isCreating) return;

    try {
      setIsCreating(true);
      const response = await axiosInstance.post('/api/company-master-data', {
        type: "JOB_ROLE",
        value: valueToCreate
      });

      if (response?.data?.success) {
        const items = extractItems(response.data);
        const createdItem = items[0] || response.data?.data;
        const createdValue = String(createdItem?.value || valueToCreate);
        
        setData(prev => {
          const exists = prev.some(item => item.toLowerCase() === createdValue.toLowerCase());
          return exists ? prev : [...prev, createdValue];
        });
        
        onChange(createdValue);
        setSearchTerm(createdValue);
        setIsOpen(false);
        inputRef.current?.blur();
      } else {
        if (!data.includes(valueToCreate)) {
          setData(prev => [...prev, valueToCreate]);
        }
        onChange(valueToCreate);
        setSearchTerm(valueToCreate);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error creating role:", error);
      if (!data.includes(valueToCreate)) {
        setData(prev => [...prev, valueToCreate]);
      }
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
      {label && (
        <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
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
          className="input-field pl-10 text-sm"
        />
        {Icon && <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />}
        {searchTerm && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="surface-card absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-[var(--border)] shadow-xl">
          {loading ? (
            <div className="flex items-center justify-center px-4 py-3 text-sm text-[var(--text-muted)]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading roles...
            </div>
          ) : filteredData.length > 0 ? (
            <>
              {filteredData.slice(0, 15).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full border-b border-[var(--border)] px-4 py-2.5 text-left text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--primary-soft)] last:border-0"
                >
                  {item}
                </button>
              ))}
              {searchTerm.trim() && !exactMatchExists && (
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="flex w-full items-center gap-2 border-t border-[var(--border)] px-4 py-2.5 text-left text-sm text-[var(--primary)] transition-colors hover:bg-[var(--primary-soft)]"
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
            <div className="px-4 py-3 text-sm text-[var(--text-muted)]">
              {searchTerm.length > 0 ? (
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="flex w-full items-center gap-2 text-[var(--primary)] hover:text-[var(--primary-hover)]"
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
                  <p className="text-[var(--text-muted)]">Type to search roles...</p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">No roles found</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export function LeadershipEditor({
  items,
  onUpdate,
  onAdd,
  onRemove,
}: LeadershipEditorProps) {
  return (
    <div className="space-y-6">
      {items.map((item, idx) => (
        <div
          key={item._id || idx}
          className="surface-card group rounded-xl border border-[var(--border)] p-5 transition-all duration-300 hover:border-[var(--primary-border)] hover:shadow-md"
        >
          {/* Card Header */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--primary)]">
                <Award className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                Leadership {idx + 1}
              </h4>
              {!item.organization && !item.role && (
                <span className="badge rounded-full bg-[var(--background-soft)] px-2 py-0.5 text-[10px] text-[var(--text-muted)]">
                  Optional
                </span>
              )}
            </div>

            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="btn-danger flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Organization */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                <Building2 className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                Organization
              </label>
              <OrganizationAutocomplete
                value={item.organization || ""}
                onChange={(value: string) => onUpdate(idx, "organization", value)}
                placeholder="Search or type organization..."
                icon={Search}
              />
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                <User className="h-3.5 w-3.5 text-[var(--text-muted)]" />
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
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                <Calendar className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                Start Date
              </label>
              <input
                type="month"
                value={item.startDate || ""}
                onChange={(e) => onUpdate(idx, "startDate", e.target.value)}
                className="input-field"
              />
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                <Calendar className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                End Date
              </label>
              <input
                type="month"
                value={item.endDate || ""}
                onChange={(e) => onUpdate(idx, "endDate", e.target.value)}
                className="input-field"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-[var(--text-secondary)]">
                Description
              </label>
              <textarea
                value={item.description || ""}
                onChange={(e) => onUpdate(idx, "description", e.target.value)}
                placeholder="Describe your responsibilities and achievements..."
                rows={3}
                className="textarea-field resize-none"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add Button */}
      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] py-4 text-sm font-medium text-[var(--text-muted)] transition hover:border-[var(--primary-border)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
      >
        <Plus className="h-4 w-4" />
        Add Leadership
      </button>
    </div>
  );
}