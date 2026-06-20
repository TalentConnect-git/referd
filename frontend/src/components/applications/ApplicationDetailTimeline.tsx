"use client";

import { ApplicationDetailTimelineProps } from "@/types/applications";

export default function ApplicationDetailTimeline({
  statusHistory,
}: ApplicationDetailTimelineProps) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-800
        p-6
      "
    >
      <h2 className="text-xl font-semibold mb-6 text-blue-400">
        Application Timeline
      </h2>

      {statusHistory?.length ? (
        <div className="space-y-6">
          {statusHistory.map(
            (item: any, index: number) => (
              <div
                key={item._id || index}
                className="
                  rounded-2xl
                  border
                  border-slate-800
                  bg-slate-900/40
                  p-5
                "
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {item.status}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
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
                      {" • "}
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

                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      bg-green-500/10
                      border
                      border-green-500/30
                      text-green-400
                      text-xs
                    "
                  >
                    {index ===
                    statusHistory.length - 1
                      ? "Latest"
                      : "Completed"}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <p className="text-slate-500">
          No timeline available
        </p>
      )}
    </div>
  );
}