import { Plus, Trash2 } from "lucide-react";
import { TextInput } from "../shared/TextInput";
import { CheckboxInput } from "../shared/CheckboxInput";
import { TextArea } from "../shared/TextArea";
import type { Experience } from "@/types/profile";

type ExperienceEditorProps = {
  experiences: Experience[];
  userType: "student" | "fresher" | "professional";
  onUpdate: (index: number, key: keyof Experience, value: any) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

export function ExperienceEditor({
  experiences,
  userType,
  onUpdate,
  onAdd,
  onRemove,
}: ExperienceEditorProps) {
  const handleCurrentlyWorkingChange = (index: number, checked: boolean) => {
    // Update isCurrent
    onUpdate(index, "isCurrent", checked);
    
    // If checked, clear end date
    if (checked) {
      onUpdate(index, "endDate", "");
    } else {
      // If unchecked, clear notice period and company email (they're only for current jobs)
      onUpdate(index, "noticePeriod", "");
      onUpdate(index, "officialCompanyEmail", "");
    }
  };

  return (
    <div className="space-y-5">
      {experiences.map((exp, idx) => (
        <div
          key={exp._id || idx}
          className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
        >
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-white">
              Experience {idx + 1}
            </h3>

            {experiences.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-[12px] font-semibold text-red-300 transition hover:border-red-500/50 hover:bg-red-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="Company"
              value={exp.company || exp.organization || ""}
              onChange={(value: string) => {
                onUpdate(idx, "company", value);
                onUpdate(idx, "organization", value);
              }}
              placeholder="Enter company name"
            />

            <TextInput
              label="Role / Title"
              value={exp.role || exp.title || ""}
              onChange={(value: string) => {
                onUpdate(idx, "role", value);
                onUpdate(idx, "title", value);
              }}
              placeholder="Enter your role"
            />

            <TextInput
              label="Start Date"
              type="date"
              value={exp.startDate || ""}
              onChange={(value: string) => onUpdate(idx, "startDate", value)}
              placeholder="Select start date"
            />

            <TextInput
              label="End Date"
              type="date"
              value={exp.endDate || ""}
              disabled={Boolean(exp.isCurrent)}
              onChange={(value: string) => onUpdate(idx, "endDate", value)}
              placeholder={exp.isCurrent ? "Currently working" : "Select end date"}
            />

            <div className="md:col-span-2">
              <CheckboxInput
                label="Currently working here"
                checked={Boolean(exp.isCurrent)}
                onChange={(checked: boolean) => handleCurrentlyWorkingChange(idx, checked)}
              />
            </div>

            {/* Show notice period and company email ONLY when currently working here is checked */}
            {/* This is now shown for ALL user types */}
            {Boolean(exp.isCurrent) && (
              <>
                <TextInput
                  label="Notice Period (days)"
                  value={exp.noticePeriod || ""}
                  onChange={(value: string) =>
                    onUpdate(idx, "noticePeriod", value)
                  }
                  placeholder="e.g., 30, 60, 90"
                  type="number"
                />

                <TextInput
                  label="Official Company Email"
                  value={exp.officialCompanyEmail || ""}
                  onChange={(value: string) =>
                    onUpdate(idx, "officialCompanyEmail", value)
                  }
                  placeholder="yourname@company.com"
                  type="email"
                />
              </>
            )}

            <div className="md:col-span-2">
              <TextArea
                label="Description"
                value={
                  Array.isArray(exp.description)
                    ? exp.description.join("\n")
                    : exp.description || ""
                }
                onChange={(value: string) =>
                  onUpdate(idx, "description", value)
                }
                placeholder="Describe your responsibilities and achievements"
                rows={4}
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
        Add more experience
      </button>
    </div>
  );
}