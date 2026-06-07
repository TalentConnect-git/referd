export default function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-[14px] text-[var(--text-muted)]">{children}</p>;
}