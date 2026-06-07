type TextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
};

export function TextInput({ label, value, onChange, type = "text", disabled = false }: TextInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-semibold text-[var(--text-primary)]">{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-[14px] text-white outline-none focus:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
      />
    </label>
  );
}