"use client";

import { ApplicationDetailTimelineProps } from "@/types/applications";
import { CheckCircle2, Clock, Circle } from "lucide-react";

export default function ApplicationDetailTimeline({
  statusHistory,
}: ApplicationDetailTimelineProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[#2a3a52]
        bg-gradient-to-r from-[#111827] to-[#1a2332]
        p-5
        shadow-xl
        shadow-black/20
        backdrop-blur-sm
      "
    >
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className="bg-gradient-to-r from-green-500 to-emerald-600 w-1 h-6 rounded-full"></span>
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
                    border-[#2a3a52]
                    bg-[#0f172a]
                    p-4
                    hover:border-green-500/30
                    transition-all
                    hover:scale-[1.01]
                    group
                  "
                >
                  {/* Timeline connector line */}
                  {!isFirst && (
                    <div className="absolute -top-3 left-5 h-3 w-0.5 bg-[#2a3a52] group-hover:bg-green-500/30 transition-colors"></div>
                  )}
                  
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {/* Status icon */}
                      <div className="mt-0.5">
                        {isLatest ? (
                          <div className="h-3 w-3 rounded-full bg-green-500 ring-2 ring-green-500/30 animate-pulse"></div>
                        ) : (
                          <div className="h-3 w-3 rounded-full bg-slate-600 ring-2 ring-slate-600/30"></div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          {item.status}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
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
                          <span className="text-slate-600">•</span>
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
                        px-2.5
                        py-0.5
                        rounded-full
                        text-xs
                        font-medium
                        flex-shrink-0
                        ml-2
                        ${
                          isLatest
                            ? "bg-green-500/10 border border-green-500/30 text-green-400"
                            : "bg-slate-500/10 border border-slate-500/30 text-slate-400"
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
        <p className="text-sm text-slate-500 text-center py-4">
          No timeline available
        </p>
      )}
    </div>
  );
}