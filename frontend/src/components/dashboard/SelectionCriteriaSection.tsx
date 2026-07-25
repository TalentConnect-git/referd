"use client";

import { SelectionCriteriaSectionProps } from "@/types/referral";
import {
  GraduationCap,
  Calendar,
  FileCheck,
  Award,
  Users,
  Clock,
  MapPin,
  FileText,
  ShieldCheck,
  X,
  AlertCircle,
  Plus,
} from "lucide-react";
import { useState, KeyboardEvent } from "react";

// Predefined round options
const PREDEFINED_ROUNDS = [
  "Round 1",
  "Round 2",
  "Round 3",
  "Round 4",
  "Round 5",
  "Round 6",
];

// Predefined selection process options
const PREDEFINED_SELECTION = [
  "Aptitude Test",
  "Technical Round 1",
  "Technical Round 2",
  "HR Round 1",
  "HR Round 2",
  "Coding Round 1",
  "Coding Round 2",
  "Group Discussion",
  "Managerial Round",
  "Presentation",
];

export default function SelectionCriteriaSection({
  formData,
  setFormData,
  onPrev,
  onSubmit,
  isLoading = false,
}: SelectionCriteriaSectionProps) {
  const [selectionInput, setSelectionInput] = useState("");
  const [roundsInput, setRoundsInput] = useState("");
  const [roundsError, setRoundsError] = useState("");
  const [selectionError, setSelectionError] = useState("");
  const [showCustomRoundInput, setShowCustomRoundInput] = useState(false);
  const [showCustomSelectionInput, setShowCustomSelectionInput] =
    useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Get total number of rounds from the rounds array
  const getTotalRounds = (): number => {
    const rounds = formData.rounds || [];
    return rounds.reduce((total, item) => {
      const match = item.match(/(\d+)/);
      return total + (match ? parseInt(match[0]) : 1);
    }, 0);
  };

  const totalRoundsCount = getTotalRounds();

  // Handle adding predefined round
  const handleAddPredefinedRound = (round: string) => {
    const currentItems = formData.rounds || [];
    if (!currentItems.includes(round)) {
      handleChange("rounds", [...currentItems, round]);
      setRoundsError("");
    }
  };

  // Handle adding custom round
  const handleAddCustomRound = () => {
    if (roundsInput.trim()) {
      const currentItems = formData.rounds || [];
      const newItem = roundsInput.trim();

      // Check if adding this round would exceed 10 total rounds (safety limit)
      if (currentItems.length >= 10) {
        setRoundsError("Maximum 10 rounds allowed.");
        return;
      }

      if (!currentItems.includes(newItem)) {
        handleChange("rounds", [...currentItems, newItem]);
        setRoundsError("");
      }
      setRoundsInput("");
      setShowCustomRoundInput(false);
    }
  };

  // Handle adding predefined selection process
  const handleAddPredefinedSelection = (item: string) => {
    const currentItems = formData.selectionProcess || [];

    // Check if user has exceeded the number of rounds
    if (currentItems.length >= totalRoundsCount) {
      setSelectionError(
        `You have ${totalRoundsCount} round${totalRoundsCount > 1 ? "s" : ""}. You cannot add more than ${totalRoundsCount} selection process items.`,
      );
      return;
    }

    if (!currentItems.includes(item)) {
      handleChange("selectionProcess", [...currentItems, item]);
      setSelectionError("");
    }
  };

  // Handle adding custom selection process
  const handleAddCustomSelection = () => {
    if (selectionInput.trim()) {
      const currentItems = formData.selectionProcess || [];

      // Check if user has exceeded the number of rounds
      if (currentItems.length >= totalRoundsCount) {
        setSelectionError(
          `You have ${totalRoundsCount} round${totalRoundsCount > 1 ? "s" : ""}. You cannot add more than ${totalRoundsCount} selection process items.`,
        );
        return;
      }

      const newItem = selectionInput.trim();
      if (!currentItems.includes(newItem)) {
        handleChange("selectionProcess", [...currentItems, newItem]);
        setSelectionError("");
      }
      setSelectionInput("");
      setShowCustomSelectionInput(false);
    }
  };

  // Remove selection process item
  const removeSelectionItem = (itemToRemove: string) => {
    const currentItems = formData.selectionProcess || [];
    handleChange(
      "selectionProcess",
      currentItems.filter((item: string) => item !== itemToRemove),
    );
    setSelectionError("");
  };

  // Remove rounds item
  const removeRoundsItem = (itemToRemove: string) => {
    const currentItems = formData.rounds || [];
    const newRounds = currentItems.filter(
      (item: string) => item !== itemToRemove,
    );
    handleChange("rounds", newRounds);

    // Trim selection process if it exceeds new round count
    const newTotalRounds = getTotalRounds();
    const currentSelection = formData.selectionProcess || [];
    if (currentSelection.length > newTotalRounds) {
      handleChange(
        "selectionProcess",
        currentSelection.slice(0, newTotalRounds),
      );
      setSelectionError(
        `Selection process trimmed to ${newTotalRounds} item${newTotalRounds > 1 ? "s" : ""} to match rounds.`,
      );
    }
    setRoundsError("");
  };

  const totalRounds = getTotalRounds();
  const selectionCount = (formData.selectionProcess || []).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <FileCheck className="h-5 w-5 text-[var(--primary)]" />
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Selection Criteria</h2>
        <span className="ml-auto text-sm text-[var(--text-muted)]">Step 2 of 2</span>
      </div>

      {/* Info Bar */}
      <div className="rounded-lg bg-[var(--background-soft)] p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[var(--info)]" />
            <span className="text-xs text-[var(--text-muted)]">Rounds:</span>
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {totalRounds}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-[var(--primary)]" />
            <span className="text-xs text-[var(--text-muted)]">Selection Process:</span>
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {selectionCount}
            </span>
          </div>
        </div>
        {totalRounds > 0 && (
          <span className="text-xs text-[var(--text-muted)]">
            {selectionCount > totalRounds ? (
              <span className="text-[var(--danger)]">
                ⚠️ Selection process exceeds rounds
              </span>
            ) : selectionCount === totalRounds ? (
              <span className="text-[var(--success)]">✓ Matched</span>
            ) : (
              <span className="text-[var(--warning)]">
                ⏳ {totalRounds - selectionCount} more needed
              </span>
            )}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Work Authorization */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            <ShieldCheck className="mr-1.5 inline h-4 w-4" />
            Work Authorization
          </label>
          <select
            value={formData.workAuthorization || ""}
            onChange={(e) => handleChange("workAuthorization", e.target.value)}
            className="select-field"
          >
            <option value="">Select Work Authorization</option>
            <option value="Citizens Only">Citizens Only</option>
            <option value="Permanent Residents">Permanent Residents</option>
            <option value="Work Visa Holders">Work Visa Holders</option>
            <option value="Any">Any</option>
          </select>
        </div>

        {/* Eligibility Criteria - String type */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            <FileText className="mr-1.5 inline h-4 w-4" />
            Eligibility Criteria
          </label>
          <textarea
            value={formData.eligibilityCriteria || ""}
            onChange={(e) =>
              handleChange("eligibilityCriteria", e.target.value)
            }
            placeholder="e.g., B.Tech with 60% or above. Must have relevant experience."
            rows={3}
            className="textarea-field resize-none"
          />
          <p className="form-helper mt-1">
            Enter the eligibility criteria as a single text description
          </p>
        </div>

        {/* Rounds - Predefined + Custom */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            <Users className="mr-1.5 inline h-4 w-4" />
            Rounds
            <span className="ml-2 text-xs text-[var(--text-muted)]">
              (Select from options or add custom)
            </span>
          </label>

          {/* Predefined Round Buttons */}
          <div className="mb-3 flex flex-wrap gap-2">
            {PREDEFINED_ROUNDS.map((round) => (
              <button
                key={round}
                type="button"
                onClick={() => handleAddPredefinedRound(round)}
                disabled={
                  (formData.rounds || []).includes(round) ||
                  (formData.rounds || []).length >= 10
                }
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  (formData.rounds || []).includes(round)
                    ? "badge badge-success cursor-not-allowed"
                    : (formData.rounds || []).length >= 10
                    ? "cursor-not-allowed bg-[var(--background-soft)] text-[var(--text-muted)] border border-[var(--border)]"
                    : "badge cursor-pointer hover:bg-[var(--card-hover)]"
                }`}
              >
                {round}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowCustomRoundInput(!showCustomRoundInput)}
              className="badge badge-info flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3 w-3" />
              Custom
            </button>
          </div>

          {/* Custom Round Input */}
          {showCustomRoundInput && (
            <div className="mb-3 flex gap-2">
              <input
                type="text"
                value={roundsInput}
                onChange={(e) => setRoundsInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomRound();
                  }
                }}
                placeholder="Enter custom round name..."
                className="input-field flex-1"
              />
              <button
                type="button"
                onClick={handleAddCustomRound}
                className="btn-primary rounded-lg px-4 py-2"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCustomRoundInput(false);
                  setRoundsInput("");
                }}
                className="btn-danger rounded-lg px-4 py-2"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Rounds Tags */}
          {formData.rounds && formData.rounds.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {formData.rounds.map((item: string, index: number) => (
                <span
                  key={index}
                  className="badge badge-info inline-flex items-center gap-1"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeRoundsItem(item)}
                    className="hover:text-[var(--danger)] transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {roundsError && (
            <div className="form-error mt-2 flex items-start gap-1.5 text-xs">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              <span>{roundsError}</span>
            </div>
          )}

          <p className="form-helper mt-1">
            Select predefined rounds or add custom ones. Maximum 10 rounds total.
          </p>
        </div>

        {/* Selection Process - Predefined + Custom */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            <Award className="mr-1.5 inline h-4 w-4" />
            Selection Process
            <span className="ml-2 text-xs text-[var(--text-muted)]">
              (Select from options or add custom)
            </span>
          </label>

          {/* Predefined Selection Buttons */}
          <div className="mb-3 flex flex-wrap gap-2">
            {PREDEFINED_SELECTION.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleAddPredefinedSelection(item)}
                disabled={
                  (formData.selectionProcess || []).includes(item) ||
                  (formData.selectionProcess || []).length >= totalRoundsCount ||
                  totalRoundsCount === 0
                }
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  (formData.selectionProcess || []).includes(item)
                    ? "badge badge-success cursor-not-allowed"
                    : (formData.selectionProcess || []).length >= totalRoundsCount || totalRoundsCount === 0
                    ? "cursor-not-allowed bg-[var(--background-soft)] text-[var(--text-muted)] border border-[var(--border)]"
                    : "badge cursor-pointer hover:bg-[var(--card-hover)]"
                }`}
              >
                {item}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowCustomSelectionInput(!showCustomSelectionInput)}
              disabled={totalRoundsCount === 0}
              className={`badge badge-info flex items-center gap-1 ${
                totalRoundsCount === 0
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
            >
              <Plus className="h-3 w-3" />
              Custom
            </button>
          </div>

          {/* Custom Selection Input */}
          {showCustomSelectionInput && totalRoundsCount > 0 && (
            <div className="mb-3 flex gap-2">
              <input
                type="text"
                value={selectionInput}
                onChange={(e) => setSelectionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomSelection();
                  }
                }}
                placeholder="Enter custom selection process..."
                className="input-field flex-1"
              />
              <button
                type="button"
                onClick={handleAddCustomSelection}
                className="btn-primary rounded-lg px-4 py-2"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCustomSelectionInput(false);
                  setSelectionInput("");
                }}
                className="btn-danger rounded-lg px-4 py-2"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Selection Process Count Info */}
          {totalRounds > 0 && (
            <div className="mt-1.5 text-xs text-[var(--text-muted)]">
              {selectionCount} of {totalRounds} selection process items added
              {selectionCount < totalRounds && (
                <span className="ml-1 text-[var(--warning)]">
                  ({totalRounds - selectionCount} more needed)
                </span>
              )}
              {selectionCount === totalRounds && (
                <span className="ml-1 text-[var(--success)]">✓ Complete</span>
              )}
              {selectionCount > totalRounds && (
                <span className="ml-1 text-[var(--danger)]">
                  ⚠️ Exceeds rounds limit
                </span>
              )}
            </div>
          )}

          {/* Selection Process Tags */}
          {formData.selectionProcess &&
            formData.selectionProcess.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {formData.selectionProcess.map(
                  (item: string, index: number) => (
                    <span
                      key={index}
                      className={`badge inline-flex items-center gap-1 ${
                        index < totalRounds
                          ? "badge-info"
                          : "badge-danger"
                      }`}
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeSelectionItem(item)}
                        className="hover:text-[var(--danger)] transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ),
                )}
              </div>
            )}

          {selectionError && (
            <div className="form-error mt-2 flex items-start gap-1.5 text-xs">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              <span>{selectionError}</span>
            </div>
          )}

          <p className="form-helper mt-1">
            {totalRounds === 0
              ? "Please add rounds first. Selection process items must match the number of rounds."
              : `Select predefined items or add custom ones. You can add up to ${totalRounds} selection process item${totalRounds > 1 ? "s" : ""}.`}
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between border-t border-[var(--border)] pt-4">
        <button
          onClick={onPrev}
          className="btn-secondary rounded-lg px-6 py-2.5 font-medium"
        >
          ← Previous
        </button>
        <button
          onClick={onSubmit}
          disabled={
            isLoading ||
            !!roundsError ||
            !!selectionError ||
            (totalRounds > 0 && selectionCount !== totalRounds)
          }
          className="btn-primary flex items-center gap-2 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
              Submitting...
            </>
          ) : (
            "Submit →"
          )}
        </button>
      </div>
    </div>
  );
}