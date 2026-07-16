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
      <div className="flex items-center gap-2 mb-6">
        <FileCheck className="w-5 h-5 text-green-400" />
        <h2 className="text-xl font-semibold text-white">Selection Criteria</h2>
        <span className="text-sm text-gray-400 ml-auto">Step 2 of 2</span>
      </div>

      {/* Info Bar */}
      <div className="bg-slate-800/30 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">Rounds:</span>
            <span className="text-sm font-medium text-white">
              {totalRounds}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Selection Process:</span>
            <span className="text-sm font-medium text-white">
              {selectionCount}
            </span>
          </div>
        </div>
        {totalRounds > 0 && (
          <span className="text-xs text-gray-500">
            {selectionCount > totalRounds ? (
              <span className="text-red-400">
                ⚠️ Selection process exceeds rounds
              </span>
            ) : selectionCount === totalRounds ? (
              <span className="text-green-400">✓ Matched</span>
            ) : (
              <span className="text-yellow-400">
                ⏳ {totalRounds - selectionCount} more needed
              </span>
            )}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Work Authorization */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            <ShieldCheck className="w-4 h-4 inline mr-1.5" />
            Work Authorization
          </label>
          <select
            value={formData.workAuthorization || ""}
            onChange={(e) => handleChange("workAuthorization", e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
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
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            <FileText className="w-4 h-4 inline mr-1.5" />
            Eligibility Criteria
          </label>
          <textarea
            value={formData.eligibilityCriteria || ""}
            onChange={(e) =>
              handleChange("eligibilityCriteria", e.target.value)
            }
            placeholder="e.g., B.Tech with 60% or above. Must have relevant experience."
            rows={3}
            className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter the eligibility criteria as a single text description
          </p>
        </div>

        {/* Rounds - Predefined + Custom */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            <Users className="w-4 h-4 inline mr-1.5" />
            Rounds
            <span className="text-xs text-gray-500 ml-2">
              (Select from options or add custom)
            </span>
          </label>

          {/* Predefined Round Buttons */}
          <div className="flex flex-wrap gap-2 mb-3">
            {PREDEFINED_ROUNDS.map((round) => (
              <button
                key={round}
                type="button"
                onClick={() => handleAddPredefinedRound(round)}
                disabled={
                  (formData.rounds || []).includes(round) ||
                  (formData.rounds || []).length >= 10
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  (formData.rounds || []).includes(round)
                    ? "bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed"
                    : (formData.rounds || []).length >= 10
                    ? "bg-slate-700/30 text-gray-500 border border-slate-700 cursor-not-allowed"
                    : "bg-slate-700/50 text-gray-300 border border-slate-600 hover:bg-slate-600/50 hover:border-slate-500"
                }`}
              >
                {round}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowCustomRoundInput(!showCustomRoundInput)}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Custom
            </button>
          </div>

          {/* Custom Round Input */}
          {showCustomRoundInput && (
            <div className="flex gap-2 mb-3">
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
                className="flex-1 rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={handleAddCustomRound}
                className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30 hover:bg-green-500/30 transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCustomRoundInput(false);
                  setRoundsInput("");
                }}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-colors"
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
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeRoundsItem(item)}
                    className="hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {roundsError && (
            <div className="mt-2 flex items-start gap-1.5 text-xs text-red-400">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>{roundsError}</span>
            </div>
          )}

          <p className="mt-1 text-xs text-gray-500">
            Select predefined rounds or add custom ones. Maximum 10 rounds total.
          </p>
        </div>

        {/* Selection Process - Predefined + Custom */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            <Award className="w-4 h-4 inline mr-1.5" />
            Selection Process
            <span className="text-xs text-gray-500 ml-2">
              (Select from options or add custom)
            </span>
          </label>

          {/* Predefined Selection Buttons */}
          <div className="flex flex-wrap gap-2 mb-3">
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
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  (formData.selectionProcess || []).includes(item)
                    ? "bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed"
                    : (formData.selectionProcess || []).length >= totalRoundsCount || totalRoundsCount === 0
                    ? "bg-slate-700/30 text-gray-500 border border-slate-700 cursor-not-allowed"
                    : "bg-slate-700/50 text-gray-300 border border-slate-600 hover:bg-slate-600/50 hover:border-slate-500"
                }`}
              >
                {item}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowCustomSelectionInput(!showCustomSelectionInput)}
              disabled={totalRoundsCount === 0}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                totalRoundsCount === 0
                  ? "bg-slate-700/30 text-gray-500 border border-slate-700 cursor-not-allowed"
                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20"
              }`}
            >
              <Plus className="w-3 h-3" />
              Custom
            </button>
          </div>

          {/* Custom Selection Input */}
          {showCustomSelectionInput && totalRoundsCount > 0 && (
            <div className="flex gap-2 mb-3">
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
                className="flex-1 rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={handleAddCustomSelection}
                className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30 hover:bg-green-500/30 transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCustomSelectionInput(false);
                  setSelectionInput("");
                }}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Selection Process Count Info */}
          {totalRounds > 0 && (
            <div className="mt-1.5 text-xs text-gray-400">
              {selectionCount} of {totalRounds} selection process items added
              {selectionCount < totalRounds && (
                <span className="text-yellow-400 ml-1">
                  ({totalRounds - selectionCount} more needed)
                </span>
              )}
              {selectionCount === totalRounds && (
                <span className="text-green-400 ml-1">✓ Complete</span>
              )}
              {selectionCount > totalRounds && (
                <span className="text-red-400 ml-1">
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
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        index < totalRounds
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeSelectionItem(item)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ),
                )}
              </div>
            )}

          {selectionError && (
            <div className="mt-2 flex items-start gap-1.5 text-xs text-red-400">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>{selectionError}</span>
            </div>
          )}

          <p className="mt-1 text-xs text-gray-500">
            {totalRounds === 0
              ? "Please add rounds first. Selection process items must match the number of rounds."
              : `Select predefined items or add custom ones. You can add up to ${totalRounds} selection process item${totalRounds > 1 ? "s" : ""}.`}
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t border-slate-800">
        <button
          onClick={onPrev}
          className="px-6 py-2.5 border border-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
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
          className="px-6 py-2.5 bg-green-500 text-black font-medium rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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