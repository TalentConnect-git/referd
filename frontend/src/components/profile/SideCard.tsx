// SideCard.tsx
interface SideCardProps {
  title: string;
  children: React.ReactNode;
}
export default function SideCard({ title, children }: SideCardProps) {
  return (
    <section className="card rounded-2xl p-6">
      <h2 className="mb-5 text-[13px] font-medium uppercase tracking-wide text-secondary">
        {title}
      </h2>
      {children}
    </section>
  );
}