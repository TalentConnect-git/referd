
export type Option = { value: string; label: string };

type SelectInputProps = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  onFocus?: () => void;
  allowCustom?: boolean;
  placeholder?: string;
};

export function SelectInput({ label, value, options, onChange, onFocus, allowCustom = false }: SelectInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-semibold text-[var(--text-primary)]">{label}</span>
      <div className="space-y-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-[14px] text-white outline-none focus:border-[var(--primary)]"
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={`${opt.value}-${opt.label}`} value={opt.label}>{opt.label}</option>
          ))}
        </select>
        {allowCustom && (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Or type custom ${label.toLowerCase()}`}
            className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-[13px] text-white outline-none focus:border-[var(--primary)]"
          />
        )}
      </div>
    </label>
  );
}