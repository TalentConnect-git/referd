type CheckboxInputProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function CheckboxInput({ label, checked, onChange }: CheckboxInputProps) {
  return (
    <label className="flex h-12 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[var(--primary)]"
      />
      <span className="text-[13px] font-semibold text-white">{label}</span>
    </label>
  );
}