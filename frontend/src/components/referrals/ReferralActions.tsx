import { ReferralActionsProps,ReferralJob } from "@/types/referral";
import {useState} from  'react';


export default function ReferralActions({
  onViewDetails,
  onPause,
  handleDelete,
  inactive,
}: ReferralActionsProps) {


  return (

    
    <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 mt-4">
      <div className="flex gap-3">
        <button
          onClick={onViewDetails}
          className="px-3 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--card-hover)] transition"
        >
          Details
        </button>

        <button
          onClick={onPause}
          className="px-3 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--card-hover)] transition"
        >
          {inactive ? "Reactivate" : "Pause"}
        </button>

      </div>
      <button
        onClick={handleDelete}
        className="text-gray-400 hover:text-gray-100 transition"
      >
        Delete Referral
      </button>

    </div>

  );

}


