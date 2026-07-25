"use client";

import { ApplicationDetailTimelineProps } from "@/types/applications";
import { CheckCircle2, Clock, Circle } from "lucide-react";

export default function ApplicationDetailTimeline({
  statusHistory,
}: ApplicationDetailTimelineProps) {
  return (
    <div
      className="
        card
        rounded-2xl
        border
        border-theme
        bg-gradient-to-r from-card to-card-soft
        p-5
        shadow-xl
        shadow-black/20
        backdrop-blur-sm
      "
    >
      <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
        <span className="bg-gradient-to-r from-primary to-primary-light w-1 h-6 rounded-full"></span>
        Application Timeline
      </h2>

      {statusHistory?.length ? (
        <div className="space-y-3">
          {statusHistory.map(
            (item: any, index: number) => {
              const isLatest = index === statusHistory.length - 1;
              const isFirst = index === 0;
              
              return (
                <div
                  key={item._id || index}
                  className="
                    relative
                    rounded-xl
                    border
                    border-theme
                    bg-background
                    p-4
                    hover:border-success/30
                    transition-all
                    hover:scale-[1.01]
                    group
                  "
                >
                  {/* Timeline connector line */}
                  {!isFirst && (
                    <div className="absolute -top-3 left-5 h-3 w-0.5 bg-theme group-hover:bg-success/30 transition-colors"></div>
                  )}
                  
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {/* Status icon */}
                      <div className="mt-0.5">
                        {isLatest ? (
                          <div className="h-3 w-3 rounded-full bg-success ring-2 ring-success/30 animate-pulse"></div>
                        ) : (
                          <div className="h-3 w-3 rounded-full bg-muted ring-2 ring-muted/30"></div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold text-primary">
                          {item.status}
                        </h3>

                        <p className="mt-1 text-xs text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(
                            item.date
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                          <span className="text-muted/60">•</span>
                          {new Date(
                            item.date
                          ).toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`
                        badge
                        px-2.5
                        py-0.5
                        rounded-full
                        text-xs
                        font-medium
                        flex-shrink-0
                        ml-2
                        ${
                          isLatest
                            ? "badge-success border border-success/30"
                            : "badge border border-theme bg-background-soft text-muted"
                        }
                      `}
                    >
                      {isLatest ? "Current" : `Step ${index + 1}`}
                    </span>
                  </div>
                </div>
              );
            }
          )}
        </div>
      ) : (
        <p className="text-sm text-muted text-center py-4">
          No timeline available
        </p>
      )}
    </div>
  );
}