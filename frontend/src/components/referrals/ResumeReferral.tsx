"use client";

import { useState } from "react";
import {ResumeReferralProps} from "@/types/referral"

export default function ResumeReferral({
  onClose,
  onSubmit,

}: ResumeReferralProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl">

          <h2 className="text-xl font-semibold mb-5">
            Reactivate Referral
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm text-gray-400">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
                className="w-full rounded-lg border border-[var(--border)] bg-transparent p-3"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-400">
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(e.target.value)
                }
                className="w-full rounded-lg border border-[var(--border)] bg-transparent p-3"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[var(--border)]"
            >
              Cancel
            </button>

            <button
              onClick={() =>
                onSubmit(startDate, endDate)
              }
              className="px-4 py-2 rounded-lg bg-green-600 text-white"
            >
              Reactivate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


