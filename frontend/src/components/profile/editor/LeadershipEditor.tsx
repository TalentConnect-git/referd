import { Plus, Trash2 } from "lucide-react";
import { TextInput } from "../shared/TextInput";
import { TextArea } from "../shared/TextArea";
import type { Leadership } from "@/types/profile";

type LeadershipEditorProps = {
  items: Leadership[];
  onUpdate: (index: number, key: keyof Leadership, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

export function LeadershipEditor({
  items,
  onUpdate,
  onAdd,
  onRemove,
}: LeadershipEditorProps) {
  return (
    <div className="space-y-5">
      {items.map((item, idx) => (
        <div
          key={item._id || idx}
          className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
        >
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-white">
              Leadership {idx + 1}
            </h3>

            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-[12px] font-semibold text-red-300"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="organization"
              value={item.organization || ""}
              onChange={(value: string) => onUpdate(idx, "organization", value)}
            />

            <TextInput
              label="Role"
              value={item.role || ""}
              onChange={(value: string) => onUpdate(idx, "role", value)}
            />

            <TextInput
              label="Start Date (Month/Year)"
              type="month"
              value={item.startDate || ""}
              onChange={(value: string) => onUpdate(idx, "startDate", value)}
            />

            <TextInput
              label="End Date (Month/Year)"
              type="month"
              value={item.endDate || ""}
              onChange={(value: string) => onUpdate(idx, "endDate", value)}
            />

            <TextArea
              label="Description"
              value={item.description || ""}
              onChange={(value: string) => onUpdate(idx, "description", value)}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--background)] py-4 text-[13px] font-bold text-white hover:border-[var(--primary)] hover:text-[var(--primary)]"
      >
        <Plus className="h-4 w-4" />
        Add Leadership
      </button>
    </div>
  );
}
