// ProfileSection.tsx
interface ProfileSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}
export default function ProfileSection({ title, icon, children }: ProfileSectionProps) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="text-[var(--text-primary)] [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
        <h2 className="text-[16px] font-bold text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}