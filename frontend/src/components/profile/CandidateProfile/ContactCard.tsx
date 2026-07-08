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
    <section className="rounded-[14px] border border-white/10 bg-[#071018] px-[14px] py-[14px] shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] bg-[#12381f] text-[#37e875]">
          <Mail className="h-3 w-3" />
        </div>

        <h2 className="text-[13px] font-bold text-white tracking-wide">
          Contact
        </h2>
      </div>

      <div className="mt-[14px] border-t border-white/10" />

      {/* Contact Items */}
      <div className="mt-[14px] space-y-2.5">
        {/* Email */}
        <div className="flex items-center gap-2.5 rounded-[10px] border border-white/10 bg-[#0b1621] px-3 py-2.5">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] bg-[#12381f] text-[#37e875]">
            <Mail className="h-3 w-3" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[8px] font-normal uppercase tracking-[0.1em] text-[#7891c7]">
              Email
            </p>
            <a
              href={email !== "N/A" ? `mailto:${email}` : undefined}
              className="mt-0.5 block truncate text-[11px] font-medium text-white transition hover:text-[#37e875]"
            >
              {email}
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2.5 rounded-[10px] border border-white/10 bg-[#0b1621] px-3 py-2.5">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] bg-[#12381f] text-[#37e875]">
            <Phone className="h-3 w-3" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[8px] font-normal uppercase tracking-[0.1em] text-[#7891c7]">
              Phone
            </p>
            <a
              href={phone !== "N/A" ? `tel:${phone}` : undefined}
              className="mt-0.5 block truncate text-[11px] font-medium text-white transition hover:text-[#37e875]"
            >
              {phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}