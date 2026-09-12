import { ReferralActionsProps, ReferralJob } from "@/types/referral";
import { useState } from "react";
import { Pause, Play, Trash2 } from "lucide-react";

export default function ReferralActions({
  onViewDetails,
  onPause,
  handleDelete,
  inactive,
  status,
}: ReferralActionsProps) {
  const isClosed = status === "Closed";

  return (
    <div className="flex items-center justify-between border-t border-divider pt-4 mt-4">
      <div className="flex gap-3">
        {!isClosed && (
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
        )}

        {isClosed && (
          <button
            onClick={onPause}
            className="
              btn-secondary
              flex items-center gap-2
              px-4 py-2 
              rounded-lg 
              border border-success/20 
              hover:bg-success-soft 
              transition-all duration-200
              hover:border-success/40
              text-sm font-medium
              text-success
            "
          >
            <Play className="w-4 h-4 text-success" />
            <span className="text-success">Reactivate</span>
          </button>
        )}

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
    </div>
  );
}