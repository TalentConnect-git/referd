"use client";

import { Plus, Trash2, Award, Calendar, FileText, Trophy } from "lucide-react";
import { TextInput } from "../shared/TextInput";
import { TextArea } from "../shared/TextArea";
import type { Achievement } from "@/types/profile";

type AchievementEditorProps = {
  achievements: Achievement[];
  onUpdate: (index: number, key: keyof Achievement, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

export function AchievementEditor({
  achievements,
  onUpdate,
  onAdd,
  onRemove,
}: AchievementEditorProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      

      {achievements.map((ach, idx) => (
        <div
          key={ach._id || idx}
          className="group rounded-xl border border-[#2a3a52] bg-[#111827] p-5 hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5"
        >
          {/* Card Header */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
                <Award className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">
                Achievement {idx + 1}
              </h4>
              {!ach.title && !ach.event && (
                <span className="text-[10px] text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full">Optional</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:border-red-500/50 hover:bg-red-500/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-gray-500" />
                Title
              </label>
              <input
                type="text"
                value={ach.title || ""}
                onChange={(e) => onUpdate(idx, "title", e.target.value)}
                placeholder="Enter achievement title"
                className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
              />
            </div>

            {/* Event */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-gray-500" />
                Event
              </label>
              <input
                type="text"
                value={ach.event || ""}
                onChange={(e) => onUpdate(idx, "event", e.target.value)}
                placeholder="Enter event name"
                className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
              />
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-gray-500" />
                Date
              </label>
              <input
                type="date"
                value={ach.date || ""}
                onChange={(e) => onUpdate(idx, "date", e.target.value)}
                className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-gray-300">
                Description
              </label>
              <textarea
                value={ach.description || ""}
                onChange={(e) => onUpdate(idx, "description", e.target.value)}
                placeholder="Describe your achievement..."
                rows={3}
                className="w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 resize-none text-sm"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add Button */}
      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#2a3a52] bg-[#111827] py-4 text-sm font-medium text-gray-400 transition hover:border-green-500/50 hover:text-green-400 hover:bg-green-500/5"
      >
        <Plus className="h-4 w-4" />
        Add Achievement
      </button>
    </div>
  );
}