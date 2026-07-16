import React from 'react';

type TextInputProps = {
  label?: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  onEnter?: () => void;
};

export function TextInput({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  disabled = false,
  placeholder = "",
  className = "",
  error,
  helperText,
  required = false,
  icon,
  iconPosition = 'left',
  size = 'md',
  onEnter,
}: TextInputProps) {
  const sizeClasses = {
    sm: 'h-10 text-[13px] px-3',
    md: 'h-12 text-[14px] px-4',
    lg: 'h-14 text-[15px] px-5',
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter) {
      onEnter();
    }
  };

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

      {/* Input wrapper with focus effects */}
      <div className={`relative rounded-xl transition-all duration-200 ${
        error 
          ? 'border-2 border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' 
          : 'border border-[#2a3a52] hover:border-[var(--primary-light)] focus-within:border-[var(--primary)] focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.1)]'
      }`}>
        {/* Left icon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            {icon}
          </div>
        )}

        <input
          type={type}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full rounded-xl bg-[#0f172a] text-[var(--text-primary)] 
            outline-none transition-colors duration-200
            disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--background-secondary)]
            placeholder:text-[var(--text-muted)]
            ${sizeClasses[size]}
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${error ? 'pr-10' : ''}`}
          style={{
            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
        />

        {/* Right icon */}
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            {icon}
          </div>
        )}

        {/* Error icon */}
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
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
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          )}
          <span>{error || helperText}</span>
        </div>
      )}
    </div>
  );
}