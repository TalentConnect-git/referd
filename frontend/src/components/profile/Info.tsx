interface InfoProps {
  label: string;
  value?: string;
}
export default function Info({ label, value }: InfoProps) {
  return (
    <div className="border-b border-[var(--border)] py-3 last:border-b-0">
      <p className="text-[12px] text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 text-[14px] font-semibold text-white">{value || 'N/A'}</p>
    </div>
  );
}