type TextInputProps = {
  label?: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

export function TextInput({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  disabled = false,
  placeholder = "",
  className = "",
}: TextInputProps) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-[12px] font-semibold text-[var(--text-primary)]">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-[14px] text-white outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}