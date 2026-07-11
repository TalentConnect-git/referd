import { ReferralActionsProps, ReferralJob } from "@/types/referral";
import { useState } from "react";
import { Pause, Play, Trash2 } from "lucide-react";

export default function ReferralActions({
  onViewDetails,
  onPause,
  handleDelete,
  inactive,
}: ReferralActionsProps) {
  return (
    <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 mt-4">
      {/* Left Side - Pause/Reactivate Button */}
      <div className="flex gap-3">
        <button
          onClick={onPause}
          className="
            flex items-center gap-2
            px-4 py-2 
            rounded-lg 
            border border-[var(--border)] 
            hover:bg-[var(--card-hover)] 
            transition-all duration-200
            hover:border-green-500/30
            text-sm font-medium
          "
        >
          {inactive ? (
            <>
              <Play className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Reactivate</span>
            </>
          ) : (
            <>
              <Pause className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400">Pause</span>
            </>
          )}
        </button>

        <button
          onClick={handleDelete}
          className="
          flex items-center gap-2
          px-4 py-2
          rounded-lg
          border border-red-500/20
          hover:bg-red-500/10
          transition-all duration-200
          hover:border-red-500/40
          text-sm font-medium
          text-red-400
          hover:text-red-300
        "
        >
          <Trash2 className="w-4 h-4" />
          Delete Referral
        </button>
      </div>
      {/* Right Side - Delete Button */}
    </div>
  );
}
