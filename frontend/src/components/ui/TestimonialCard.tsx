import { FileCheck2 } from "lucide-react";

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
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)]/70 p-6">
      <FileCheck2
        size={16}
        strokeWidth={2}
        className="mb-5 text-[var(--primary)]"
      />

      <p className="text-[13px] leading-7 text-white">
        &quot;{quote}&quot;
      </p>

      <div className="my-5 h-px w-full bg-[var(--border)]" />

      <h3 className="text-[13px] font-semibold text-white">
        {name}
      </h3>

      <p className="mt-1 font-mono text-[11px] text-[var(--text-primary)]">
        {role}
      </p>
    </div>
  );
}