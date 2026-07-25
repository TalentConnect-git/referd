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
    <div className="surface-card group flex h-full flex-col rounded-3xl p-6 transition-all duration-300 hover:shadow-md hover:border-[var(--border-strong)] sm:p-8">
      {/* Icon */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--primary)] transition-transform duration-300 group-hover:scale-110 sm:mb-6">
        {icon}
      </div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--primary)] sm:text-[18px]">
        {title}
      </h3>

      {/* Description */}
      <p className="flex-1 text-sm leading-6 text-[var(--text-secondary)]">
        {description}
      </p>

      {/* Divider */}
      <div className="my-4 h-px w-full bg-[var(--border)]" />

      {/* Footer */}
      <p className="font-mono text-xs tracking-wide text-[var(--text-muted)]">
        {footerText}
      </p>
    </div>
  );
}