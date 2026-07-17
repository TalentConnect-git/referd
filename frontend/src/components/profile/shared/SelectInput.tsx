// components/profile/shared/SelectInput.tsx
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, X, Plus, Loader2 } from "lucide-react";

// ✅ Export the Option type
export type Option = {
  value: string;
  label: string;
  id?: string;
};

type SelectInputProps = {
  label?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  allowCustom?: boolean;
  disabled?: boolean;
  onFocus?: () => void;
  onCreate?: (value: string) => Promise<void>;
  loading?: boolean;
  className?: string;
};

export function SelectInput({
  label,
  value,
  options,
  onChange,
  placeholder = "Select an option",
  allowCustom = false,
  disabled = false,
  onFocus,
  onCreate,
  loading = false,
  className = "",
}: SelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync search term with value when value changes
  useEffect(() => {
    if (value && !searchTerm) {
      setSearchTerm(value);
    }
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setSearchTerm(selectedValue);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleCreate = async () => {
    if (!onCreate || !searchTerm.trim()) return;
    
    try {
      setIsCreating(true);
      await onCreate(searchTerm.trim());
      onChange(searchTerm.trim());
      setSearchTerm(searchTerm.trim());
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating item:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) {
      return options;
    }
    const term = searchTerm.toLowerCase().trim();
    return options.filter((option) =>
      option.label.toLowerCase().includes(term) ||
      option.value.toLowerCase().includes(term)
    );
  }, [options, searchTerm]);

  const exactMatchExists = options.some(
    (option) => option.label.toLowerCase() === searchTerm.toLowerCase().trim()
  );

  const showCreateOption = allowCustom && 
    searchTerm.trim() && 
    !exactMatchExists && 
    onCreate;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="mb-1.5 block text-xs font-medium text-gray-300">
          {label}
        </label>
      )}

      <div
        className={`relative flex min-h-11 w-full cursor-pointer items-center rounded-lg border ${
          disabled
            ? "border-[#2a3a52] bg-[#0a0f1a] opacity-60"
            : "border-[#2a3a52] bg-[#0f172a] hover:border-[#3a4a5a]"
        } transition-all focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500`}
        onClick={() => !disabled && setIsOpen(true)}
      >
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (e.target.value !== value) {
              onChange(e.target.value);
            }
          }}
          onFocus={() => {
            setIsOpen(true);
            if (onFocus) onFocus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchTerm.trim() && showCreateOption) {
              e.preventDefault();
              handleCreate();
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 disabled:cursor-not-allowed"
        />

        <div className="flex items-center gap-1 pr-2">
          {(searchTerm || value) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="rounded-full p-0.5 text-gray-500 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-[#2a3a52] bg-[#111827] shadow-xl">
          {options.length === 0 && !searchTerm ? (
            <div className="px-4 py-3 text-center text-sm text-gray-400">
              No options available
            </div>
          ) : filteredOptions.length > 0 ? (
            <>
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-green-500/10 transition-colors border-b border-[#2a3a52] last:border-0"
                >
                  {option.label}
                </button>
              ))}
            </>
          ) : (
            <div className="px-4 py-3 text-center text-sm text-gray-400">
              No matching options found
            </div>
          )}

          {showCreateOption && (
            <button
              type="button"
              onClick={handleCreate}
              disabled={isCreating || loading}
              className="w-full px-4 py-2.5 text-left text-sm text-green-400 hover:bg-green-500/10 transition-colors flex items-center gap-2 border-t border-[#2a3a52] disabled:opacity-50"
            >
              {isCreating || loading ? (
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
        </div>
      )}
    </div>
  );
}