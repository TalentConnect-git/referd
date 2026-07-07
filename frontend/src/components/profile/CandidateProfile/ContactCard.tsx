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
    <section className="rounded-[18px] border border-white/10 bg-[#071018] px-[18px] py-[18px] shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#12381f] text-[#37e875]">
          <Mail className="h-3.5 w-3.5" />
        </div>

        <h2 className="text-[14px] font-bold text-white">
          Contact
        </h2>
      </div>

      <div className="mt-[18px] border-t border-white/10" />

      <div className="mt-[17px] space-y-3">
        <div className="flex items-center gap-3 rounded-[12px] border border-white/10 bg-[#0b1621] px-3.5 py-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-[#12381f] text-[#37e875]">
            <Mail className="h-3.5 w-3.5" />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-normal uppercase tracking-[0.08em] text-[#7891c7]">
              Email
            </p>
            <a
              href={email !== "N/A" ? `mailto:${email}` : undefined}
              className="mt-1 block truncate text-[12px] font-medium text-white transition hover:text-[#37e875]"
            >
              {email}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-[12px] border border-white/10 bg-[#0b1621] px-3.5 py-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-[#12381f] text-[#37e875]">
            <Phone className="h-3.5 w-3.5" />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-normal uppercase tracking-[0.08em] text-[#7891c7]">
              Phone
            </p>
            <a
              href={phone !== "N/A" ? `tel:${phone}` : undefined}
              className="mt-1 block truncate text-[12px] font-medium text-white transition hover:text-[#37e875]"
            >
              {phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}