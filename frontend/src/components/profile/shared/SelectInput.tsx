import React from 'react';

export type Option = { value: string; label: string };

type SelectInputProps = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  onFocus?: () => void;
  allowCustom?: boolean;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
};

export function SelectInput({ 
  label, 
  value, 
  options, 
  onChange, 
  onFocus, 
  allowCustom = false,
  placeholder = `Select ${label}`,
  disabled = false,
  required = false,
  error,
  helperText,
  className = "",
}: SelectInputProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Label with required indicator */}
      {label && (
        <div className="mb-2 flex items-center justify-between">
          <label className="text-[13px] font-medium text-[var(--text-primary)]">
            {label}
            {required && (
              <span className="ml-1 text-red-500">*</span>
            )}
          </label>
        </div>
      )}

      <div className="space-y-2">
        {/* Select dropdown */}
        <div className={`relative rounded-xl transition-all duration-200 ${
          error 
            ? 'border-2 border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' 
            : 'border border-[#2a3a52] hover:border-[var(--primary-light)] focus-within:border-[var(--primary)] focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.1)]'
        }`}>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            disabled={disabled}
            className={`w-full rounded-xl bg-[#0f172a] px-4 text-[14px] text-[var(--text-primary)] 
              outline-none transition-colors duration-200 appearance-none
              disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--background-secondary)]
              h-12
              ${error ? 'pr-10' : 'pr-10'}`}
            style={{
              fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            }}
          >
            <option value="" className="bg-[#0f172a] text-[var(--text-muted)]">
              {placeholder || `Select ${label}`}
            </option>
            {options.map((opt) => (
              <option 
                key={`${opt.value}-${opt.label}`} 
                value={opt.value}
                className="bg-[#0f172a] text-[var(--text-primary)]"
              >
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom dropdown arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--text-muted)]">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Error icon */}
          {error && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-red-500">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Custom input (if allowed) */}
        {allowCustom && (
          <div className={`relative rounded-xl transition-all duration-200 ${
            error 
              ? 'border-2 border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' 
              : 'border border-[#2a3a52] hover:border-[var(--primary-light)] focus-within:border-[var(--primary)] focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.1)]'
          }`}>
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`Or type custom ${label.toLowerCase()}`}
              disabled={disabled}
              className={`w-full rounded-xl bg-[#0f172a] px-4 text-[13px] text-[var(--text-primary)] 
                outline-none transition-colors duration-200
                disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--background-secondary)]
                placeholder:text-[var(--text-muted)]
                h-11
                ${error ? 'pr-10' : ''}`}
              style={{
                fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              }}
            />
            
            {/* Error icon for custom input */}
            {error && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        )}

        {/* Helper text or error message */}
        {(helperText || error) && (
          <div className={`flex items-start gap-1.5 text-[12px] ${
            error ? 'text-red-500' : 'text-[var(--text-muted)]'
          }`}>
            {error ? (
              <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            )}
            <span>{error || helperText}</span>
          </div>
        )}
      </div>
    </div>
  );
}