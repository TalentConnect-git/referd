export default function Empty({ children }: { children: React.ReactNode }) {
  return <div className="text-[14px] text-[var(--text-muted)]">{children}</div>;
}