type TextAreaProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  required?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
};

export function TextArea({ 
  label, 
  value, 
  onChange,
  placeholder = "",
  rows = 5,
  className = "",
  disabled = false,
  error,
  helperText,
  required = false,
  showCharCount = false,
  maxLength,
}: TextAreaProps) {
  const charCount = value.length;
  const isNearLimit = maxLength && charCount > maxLength * 0.8;
  
  return (
    <div className={`w-full ${className}`}>
      {/* Label with optional indicators */}
      {label && (
        <div className="mb-2 flex items-center justify-between">
          <label className="text-[13px] font-medium text-[var(--text-primary)]">
            {label}
            {required && (
              <span className="ml-1 text-red-500">*</span>
            )}
          </label>
          {showCharCount && maxLength && (
            <span className={`text-[11px] ${
              isNearLimit ? 'text-amber-500' : 'text-[var(--text-muted)]'
            }`}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}

      {/* Textarea with educational editor styling */}
      <div className={`relative rounded-xl overflow-hidden transition-all duration-200 ${
        error 
          ? 'border-2 border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' 
          : 'border border-[var(--border)] hover:border-[var(--primary-light)] focus-within:border-[var(--primary)] focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.1)]'
      }`}>
        <textarea
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          maxLength={maxLength}
          className={`w-full resize-y rounded-xl bg-[var(--background)] px-4 py-3 text-[14px] leading-relaxed text-[var(--text-primary)] 
            outline-none placeholder:text-[var(--text-muted)] transition-colors duration-200
            disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--background-secondary)]
            ${error ? 'pr-10' : ''}
            min-h-[100px]`}
          style={{
            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
        />
        
        {/* Error icon */}
        {error && (
          <div className="absolute right-3 top-3 text-red-500">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Helper text or error message */}
      {(helperText || error) && (
        <div className={`mt-1.5 flex items-start gap-1.5 text-[12px] ${
          error ? 'text-red-500' : 'text-[var(--text-muted)]'
        }`}>
          {error ? (
            <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          <span>{error || helperText}</span>
        </div>
      )}
    </div>
  );
}