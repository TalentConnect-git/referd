type TextAreaProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  disabled?: boolean;
};

export function TextArea({ 
  label, 
  value, 
  onChange,
  placeholder = "",
  rows = 5,
  className = "",
  disabled = false,
}: TextAreaProps) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-[12px] font-semibold text-[var(--text-primary)]">
          {label}
        </label>
      )}
      <textarea
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[14px] leading-6 text-white outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}