import { Quote } from "lucide-react";

type TestimonialCardProps = {
  quote: string;
  name: string;
  role: string;
};

export default function TestimonialCard({
  quote,
  name,
  role,
}: TestimonialCardProps) {
  return (
    <div className="surface-card group flex h-full flex-col rounded-3xl p-6 transition-all duration-300 hover:border-[var(--border-strong)] hover:shadow-md">
      {/* Quote Icon */}
      <Quote
        size={20}
        strokeWidth={2}
        className="mb-4 text-[var(--primary)] opacity-60 transition-opacity duration-200 group-hover:opacity-100"
      />

      {/* Quote Text */}
      <p className="flex-1 text-sm leading-7 text-[var(--text-secondary)]">
        &quot;{quote}&quot;
      </p>

      {/* Divider */}
      <div className="my-4 h-px w-full bg-[var(--border)]" />

      {/* Author Info */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--primary)]">
          {name}
        </h3>
        <p className="mt-0.5 font-mono text-[11px] text-[var(--text-muted)]">
          {role}
        </p>
      </div>
    </div>
  );
}