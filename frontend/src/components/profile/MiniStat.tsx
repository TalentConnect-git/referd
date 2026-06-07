interface MiniStatProps {
  icon: React.ReactNode;
  label: string;
}
export default function MiniStat({ icon, label }: MiniStatProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 text-center">
      <span className="mb-1 text-[var(--primary)] [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
      <span className="text-[12px] font-bold text-white">{label}</span>
    </div>
  );
}