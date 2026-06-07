import { Plus, Trash2 } from "lucide-react";
import { TextArea } from "../shared/TextArea";
import { TextInput } from "../shared/TextInput";
import type { InternationalExperience } from "@/types/profile";

type InternationalExperienceEditorProps = {
  items: InternationalExperience[];
  onUpdate: (
    index: number,
    key: keyof InternationalExperience,
    value: string,
  ) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

export function InternationalExperienceEditor({
  items,
  onUpdate,
  onAdd,
  onRemove,
}: InternationalExperienceEditorProps) {
  return (
    <div className="space-y-5">
      {items.map((item, idx) => (
        <div
          key={item._id || idx}
          className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
        >
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-white">
              International Experience {idx + 1}
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
              label="Country"
              value={item.country || ""}
              onChange={(value: string) => onUpdate(idx, "country", value)}
            />

            <TextInput
              label="Organization"
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

            <div className="md:col-span-2">
              <TextArea
                label="Description"
                value={item.description || ""}
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
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--background)] py-4 text-[13px] font-bold text-white hover:border-[var(--primary)] hover:text-[var(--primary)]"
      >
        <Plus className="h-4 w-4" />
        Add International Experience
      </button>
    </div>
  );
}
