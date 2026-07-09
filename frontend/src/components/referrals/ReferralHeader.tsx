// components/referrals/ReferralHeader.tsx
"use client";

import { Plus, Users } from "lucide-react";
import Link from "next/link";

export default function ReferralHeader() {
  return (
    <div className="mx-2">
      <div className="glass-card rounded-xl p-4 border border-[var(--border)] bg-[var(--card)] hover:border-green-500/20 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Left Section - Title & Description */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center flex-shrink-0 border border-green-500/20">
              <Users className="w-4.5 h-4.5 text-green-400" />
            </div>

            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                My Referrals
                <span className="text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded-full border border-green-500/20 font-medium">
                  Active
                </span>
              </h1>
              <p className="text-xs text-[var(--text-primary)] mt-0.5">
                Manage and track your referrals
              </p>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            {/* Post New Referral Button */}
            <Link
              href="/professional/post-referral"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              Post New Referral
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}