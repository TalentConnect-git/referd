import { Plus, Trash2 } from "lucide-react";
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
    <div className="space-y-5">
      {achievements.map((ach, idx) => (
        <div
          key={ach._id || idx}
          className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
        >
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-white">
              Achievement {idx + 1}
            </h3>

            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-[12px] font-semibold text-red-300 transition hover:bg-red-500/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="Title"
              value={ach.title || ""}
              onChange={(value: string) => onUpdate(idx, "title", value)}
            />

            <TextInput
              label="Event"
              value={ach.event || ""}
              onChange={(value: string) => onUpdate(idx, "event", value)}
            />

            <TextInput
              label="Date"
              type="date"
              value={ach.date || ""}
              onChange={(value: string) => onUpdate(idx, "date", value)}
            />

            <div className="md:col-span-2">
              <TextArea
                label="Description"
                value={ach.description || ""}
                onChange={(value: string) =>
                  onUpdate(idx, "description", value)
                }
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--background)] py-4 text-[13px] font-bold text-white transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
      >
        <Plus className="h-4 w-4" />
        Add Achievement
      </button>
    </div>
  );
}