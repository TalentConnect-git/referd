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
    <section className={`rounded-3xl border border-[#242d3a] bg-[#111821] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition hover:border-[#2fb344]/40 ${className}`}>
      <div className="mb-6 flex items-center gap-3">
        <span className="text-[#2fb344] [&_svg]:h-5 [&_svg]:w-5">
          {icon}
        </span>
        <h2 className="text-[16px] font-bold text-white">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}