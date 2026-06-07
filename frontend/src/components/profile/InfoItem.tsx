interface InfoItemProps {
  label: string;
  value?: string;
}
export default function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <p className="text-[12px] text-[var(--text-muted)]">{label}</p>
      <p className="text-[14px] font-semibold text-white">{value || 'N/A'}</p>
    </div>
  );
}