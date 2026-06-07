type TextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function TextArea({ label, value, onChange }: TextAreaProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-semibold text-[var(--text-primary)]">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[14px] leading-6 text-white outline-none focus:border-[var(--primary)]"
      />
    </label>
  );
}