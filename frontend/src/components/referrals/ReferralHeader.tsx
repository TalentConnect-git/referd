// components/referrals/ReferralHeader.tsx
"use client";

import { Plus, Users } from "lucide-react";
import Link from "next/link";

export default function ReferralHeader() {
  return (
    <div className="mx-2">
      <div className="card rounded-xl p-4 border border-theme bg-card hover:border-primary/20 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Left Section - Title & Description */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-soft flex items-center justify-center flex-shrink-0 border border-primary/20">
              <Users className="w-4.5 h-4.5 text-primary" />
            </div>

            <div>
              <h1 className="text-lg font-bold text-primary flex items-center gap-2">
                My Referrals
                <span className="badge badge-primary text-[10px] px-1.5 py-0.5 rounded-full border border-primary/20 font-medium">
                  Active
                </span>
              </h1>
              <p className="text-xs text-primary mt-0.5">
                Manage and track your referrals
              </p>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            {/* Post New Referral Button */}
            <Link
              href="/professional/post-referral"
              className="btn-primary inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-light text-inverse font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
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