// ProfileSection.tsx

interface ProfileSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string; // Added for additional styling flexibility
}

export default function ProfileSection({ 
  title, 
  icon, 
  children,
  className = "" 
}: ProfileSectionProps) {
  return (
    <section className={`card rounded-3xl p-6 shadow-lg transition hover:border-primary/40 ${className}`}>
      <div className="mb-6 flex items-center gap-3">
        <span className="text-primary [&_svg]:h-5 [&_svg]:w-5">
          {icon}
        </span>
        <h2 className="text-[16px] font-bold text-primary">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}