type CheckboxInputProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export function CheckboxInput({
  label,
  checked,
  onChange,
  disabled = false,
  className = "",
}: CheckboxInputProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="h-4 w-4 cursor-pointer rounded border border-[var(--border)] bg-[var(--background)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/50 focus:ring-offset-2 focus:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-50"
      />
      <label className="cursor-pointer text-[13px] text-white/80 select-none disabled:cursor-not-allowed disabled:opacity-50">
        {label}
      </label>
    </div>
  );
}