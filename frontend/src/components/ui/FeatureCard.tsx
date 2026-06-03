import { ReactNode } from "react";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  footerText: string;
};

export default function FeatureCard({
  icon,
  title,
  description,
  footerText,
}: FeatureCardProps) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)]/70 p-8">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(49,170,64,0.20)] bg-[var(--primary-soft)] text-[var(--primary)]">
        {icon}
      </div>

      <h3 className="mb-2 text-[18px] font-semibold tracking-[-0.03em] text-white">
        {title}
      </h3>

      <p className="min-h-[72px] font-normal text-[13px] leading-6 text-[var(--text-primary)]">
        {description}
      </p>

      <div className="my-4 h-px w-full bg-[var(--border)]" />

      <p className="font-mono text-[12px] tracking-wide text-[var(--text-primary)]">
        {footerText}
      </p>
    </div>
  );
}