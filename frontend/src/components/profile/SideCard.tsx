// SideCard.tsx
interface SideCardProps {
  title: string;
  children: React.ReactNode;
}
export default function SideCard({ title, children }: SideCardProps) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <h2 className="mb-5 text-[13px] font-medium uppercase tracking-wide text-[var(--text-primary)]">
        {title}
      </h2>
      {children}
    </section>
  );
}