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
    <div className="flex items-center justify-between border-t border-divider pt-4 mt-4">
      {/* Left Side - Pause/Reactivate Button */}
      <div className="flex gap-3">
        <button
          onClick={onPause}
          className="
            btn-secondary
            flex items-center gap-2
            px-4 py-2 
            rounded-lg 
            border border-theme 
            hover:bg-card-hover 
            transition-all duration-200
            hover:border-primary/30
            text-sm font-medium
          "
        >
          {inactive ? (
            <>
              <Play className="w-4 h-4 text-success" />
              <span className="text-success">Reactivate</span>
            </>
          ) : (
            <>
              <Pause className="w-4 h-4 text-warning" />
              <span className="text-warning">Pause</span>
            </>
          )}
        </button>

        <button
          onClick={handleDelete}
          className="
            btn-danger
            flex items-center gap-2
            px-4 py-2
            rounded-lg
            border border-danger/20
            hover:bg-danger-soft
            transition-all duration-200
            hover:border-danger/40
            text-sm font-medium
            text-danger
            hover:text-danger
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