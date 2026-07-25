// components/profile/ContactCard.tsx
"use client";

import { Mail, Phone } from "lucide-react";
import { ProfileData } from "@/types/profile";

interface ContactCardProps {
  profile: ProfileData & {
    email?: string;
    phone?: string;
  };
}

const safeText = (value?: string | null, fallback = "N/A") => {
  if (!value || !String(value).trim()) return fallback;
  return String(value).trim();
};

export default function ContactCard({ profile }: ContactCardProps) {
  const email = safeText(profile.email);
  const phone = safeText(profile.phone);

  return (
    <section className="surface-card rounded-[14px] border border-[var(--border)] bg-[var(--card)] p-[14px] shadow-md">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] bg-[var(--primary-soft)] text-[var(--primary)]">
          <Mail className="h-3 w-3" />
        </div>

        <h2 className="text-sm font-bold tracking-wide text-[var(--text-primary)]">
          Contact
        </h2>
      </div>

      <div className="mt-[14px] border-t border-[var(--border)]" />

      {/* Contact Items */}
      <div className="mt-[14px] space-y-2.5">
        {/* Email */}
        <div className="flex items-center gap-2.5 rounded-[10px] border border-[var(--border)] bg-[var(--background-soft)] px-3 py-2.5">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] bg-[var(--primary-soft)] text-[var(--primary)]">
            <Mail className="h-3 w-3" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[8px] font-normal uppercase tracking-[0.1em] text-[var(--text-muted)]">
              Email
            </p>
            <a
              href={email !== "N/A" ? `mailto:${email}` : undefined}
              className="mt-0.5 block truncate text-[11px] font-medium text-[var(--text-primary)] transition hover:text-[var(--primary)]"
            >
              {email}
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2.5 rounded-[10px] border border-[var(--border)] bg-[var(--background-soft)] px-3 py-2.5">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] bg-[var(--primary-soft)] text-[var(--primary)]">
            <Phone className="h-3 w-3" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[8px] font-normal uppercase tracking-[0.1em] text-[var(--text-muted)]">
              Phone
            </p>
            <a
              href={phone !== "N/A" ? `tel:${phone}` : undefined}
              className="mt-0.5 block truncate text-[11px] font-medium text-[var(--text-primary)] transition hover:text-[var(--primary)]"
            >
              {phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}