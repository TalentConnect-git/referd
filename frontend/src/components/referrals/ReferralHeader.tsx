"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

export default function ReferralHeader() {
 

  return (
    <div className="flex items-center justify-between mb-8 ml-5 mt-5">
      <div>
        <h1 className="text-xl font-bold text-white ">
          My Referrals
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Manage and track all your posted referral opportunities
        </p>
      </div>


<Link
  href="/professional/post-referral"
  className="flex items-center mr-5 gap-1.5 bg-green-500 hover:bg-green-600 text-black text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
>
  <Plus size={16} />
  <span>Post New Referral</span>
</Link>
    </div>
  );
}