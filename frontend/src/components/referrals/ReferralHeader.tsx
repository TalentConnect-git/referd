// components/referrals/ReferralHeader.tsx
"use client";

import { Plus, Send, Sparkles, Users } from "lucide-react";
import Link from "next/link";

interface ReferralHeaderProps {
  onAskForReferral: () => void;
}

export default function ReferralHeader({ onAskForReferral }: ReferralHeaderProps) {
  return (
    <div className="glass-card rounded-[var(--radius-xl)] p-6 sm:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl primary-gradient flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">
              Get Referred
            </h1>
            <p className="text-sm text-[var(--text-primary)] mt-1">
              Connect with alumni who can refer you to top companies
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onAskForReferral}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--primary)] text-black font-semibold hover:bg-[var(--primary-dark)] transition-all duration-300"
          >
            <Send className="w-4 h-4" />
            Ask for Referral
          </button>
          
          <Link
            href="/professional/post-referral"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[var(--border-strong)] text-[var(--text-secondary)] font-semibold hover:bg-[var(--card-hover)] transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Post New Referral
          </Link>
        </div>
      </div>
    </div>
  );
}