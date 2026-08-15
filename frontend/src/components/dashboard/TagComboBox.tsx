// components/TagComboBox.tsx
import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { X, Check, Loader2 } from "lucide-react";

interface SuggestionItem {
  id: string;
  label: string;
}

interface TagComboBoxProps {
  selected: string[];
  suggestions: SuggestionItem[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onToggleSuggestion: (item: SuggestionItem) => void;
  onCreate: (value: string) => void | Promise<void>;
  onRemoveChip: (value: string) => void;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  allowCreate?: boolean;
  error?: string;
  label?: string;
  labelIcon?: React.ReactNode;
  required?: boolean;
  helperText?: string;
}

export default function TagComboBox({
  selected,
  suggestions,
  inputValue,
  onInputChange,
  onToggleSuggestion,
  onCreate,
  onRemoveChip,
  loading = false,
  disabled = false,
  placeholder = "Type and press Enter...",
  allowCreate = true,
  error,
  label,
  labelIcon,
  required = false,
  helperText,
}: TagComboBoxProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input value (case-insensitive substring match)
  const filteredSuggestions = suggestions.filter((item) => {
    const searchTerm = inputValue.trim().toLowerCase();
    if (!searchTerm) return true;
    return item.label.toLowerCase().includes(searchTerm);
  });

  // Check if a suggestion is selected
  const isSelected = (label: string) => selected.includes(label);

  // Handle Enter key
  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const trimmedValue = inputValue.trim();

      // Check if input matches an existing suggestion exactly (case-insensitive)
      const exactMatch = suggestions.find(
        (item) => item.label.toLowerCase() === trimmedValue.toLowerCase()
      );

      if (exactMatch) {
        // Select existing item
        if (!isSelected(exactMatch.label)) {
          onToggleSuggestion(exactMatch);
        }
        onInputChange("");
        return;
      }

      // If no exact match and creation is allowed
      if (allowCreate) {
        await onCreate(trimmedValue);
        onInputChange("");
      }
    }

    // Backspace on empty input removes last selected chip
    if (e.key === "Backspace" && inputValue === "" && selected.length > 0) {
      e.preventDefault();
      const lastItem = selected[selected.length - 1];
      onRemoveChip(lastItem);
    }
  };

  // Handle clicking on a suggestion
  const handleSuggestionClick = (item: SuggestionItem) => {
    onToggleSuggestion(item);
    onInputChange("");
    // Focus back to input after selection
    inputRef.current?.focus();
  };

  // Handle removing a chip
  const handleRemoveChip = (value: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onRemoveChip(value);
  };

  // Click outside to blur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine badge class based on context (can be overridden via props if needed)
  const getBadgeClass = (isSelected: boolean) => {
    return isSelected ? "badge-primary" : "badge";
  };

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
          {labelIcon && <span className="mr-1.5 inline">{labelIcon}</span>}
          {label}
          {required && <span className="text-[var(--danger)]"> *</span>}
          {helperText && (
            <span className="ml-2 text-xs text-[var(--text-muted)]">
              {helperText}
            </span>
          )}
        </label>
      )}

      {/* Input container with chips */}
      <div
        className={`relative flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-lg border bg-[var(--bg-primary)] px-2 py-1.5 transition-colors ${
          error
            ? "border-[var(--danger)]"
            : isFocused
            ? "border-[var(--primary)] ring-1 ring-[var(--primary)]"
            : "border-[var(--border)]"
        } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-text"}`}
        onClick={() => {
          if (!disabled) {
            inputRef.current?.focus();
          }
        }}
      >
        {/* Selected chips */}
        {selected.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)] px-2.5 py-0.5 text-xs font-medium text-white"
          >
            {item}
            <button
              type="button"
              onClick={(e) => handleRemoveChip(item, e)}
              className="ml-0.5 rounded-full hover:bg-white/20 transition-colors"
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            onInputChange(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          placeholder={selected.length === 0 ? placeholder : ""}
          disabled={disabled || loading}
          className="min-w-[80px] flex-1 bg-transparent py-0.5 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] disabled:cursor-not-allowed"
        />

        {/* Loading spinner */}
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin text-[var(--primary)]" />
        )}
      </div>

      {/* Error message */}
      {error && <p className="form-error mt-1">{error}</p>}

      {/* Suggestions */}
      {!loading && filteredSuggestions.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-xs font-medium text-[var(--text-muted)]">
            {inputValue.trim() ? "Search Results:" : "Suggested:"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {filteredSuggestions.slice(0, 15).map((item) => {
              const selectedItem = isSelected(item.label);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSuggestionClick(item)}
                  disabled={disabled}
                  className={`badge ${getBadgeClass(selectedItem)} cursor-pointer ${
                    disabled ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  {selectedItem ? (
                    <>
                      <Check className="h-3 w-3" />
                      {item.label}
                    </>
                  ) : (
                    item.label
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* No results message */}
      {!loading && inputValue.trim() && filteredSuggestions.length === 0 && (
        <div className="mt-3">
          <p className="text-xs text-[var(--text-muted)]">
            {allowCreate
              ? `No matching items found. Type a new one and press Enter to create it.`
              : `No matching items found.`}
          </p>
        </div>
      )}

      {/* Empty state for suggestions */}
      {!loading && !inputValue.trim() && suggestions.length === 0 && (
        <div className="mt-3">
          <p className="text-xs text-[var(--text-muted)]">
            {allowCreate
              ? "No items available. Type a new one and press Enter to create."
              : "No items available."}
          </p>
        </div>
      )}
    </div>
  );
}