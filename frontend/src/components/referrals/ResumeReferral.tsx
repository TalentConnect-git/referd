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
    <div className="modal-overlay fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-overlay backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="modal-content w-full max-w-md rounded-2xl border border-theme bg-card p-6 shadow-xl">

          <h2 className="text-xl font-semibold text-primary mb-5">
            Reactivate Referral
          </h2>

          <div className="space-y-4">
            <div>
              <label className="form-label block mb-2 text-sm">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
                className="input-field w-full rounded-lg p-3"
              />
            </div>

            <div>
              <label className="form-label block mb-2 text-sm">
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(e.target.value)
                }
                className="input-field w-full rounded-lg p-3"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="btn-secondary px-4 py-2 rounded-lg border border-theme text-primary hover:bg-card-hover transition-all"
            >
              Cancel
            </button>

            <button
              onClick={() =>
                onSubmit(startDate, endDate)
              }
              className="btn-primary px-4 py-2 rounded-lg bg-primary text-inverse hover:bg-primary-hover transition-all"
            >
              Reactivate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}