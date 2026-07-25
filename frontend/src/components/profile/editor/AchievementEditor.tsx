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
      {achievements.map((ach, idx) => (
        <div
          key={ach._id || idx}
          className="surface-card group rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition-all duration-300 hover:border-[var(--primary-border)] hover:shadow-md"
        >
          {/* Card Header */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--primary)]">
                <Award className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                Achievement {idx + 1}
              </h4>
              {!ach.title && !ach.event && (
                <span className="badge rounded-full bg-[var(--background-soft)] px-2 py-0.5 text-[10px] text-[var(--text-muted)]">
                  Optional
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="btn-danger flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                <FileText className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                Title
              </label>
              <input
                type="text"
                value={ach.title || ""}
                onChange={(e) => onUpdate(idx, "title", e.target.value)}
                placeholder="Enter achievement title"
                className="input-field text-sm"
              />
            </div>

            {/* Event */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                <Calendar className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                Event
              </label>
              <input
                type="text"
                value={ach.event || ""}
                onChange={(e) => onUpdate(idx, "event", e.target.value)}
                placeholder="Enter event name"
                className="input-field text-sm"
              />
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                <Calendar className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                Date
              </label>
              <input
                type="date"
                value={ach.date || ""}
                onChange={(e) => onUpdate(idx, "date", e.target.value)}
                className="input-field text-sm"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-[var(--text-secondary)]">
                Description
              </label>
              <textarea
                value={ach.description || ""}
                onChange={(e) => onUpdate(idx, "description", e.target.value)}
                placeholder="Describe your achievement..."
                rows={3}
                className="textarea-field text-sm resize-none"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add Button */}
      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] py-4 text-sm font-medium text-[var(--text-muted)] transition hover:border-[var(--primary-border)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)]"
      >
        <Plus className="h-4 w-4" />
        Add Achievement
      </button>
    </div>
  );
}