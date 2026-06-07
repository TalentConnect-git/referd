import { Plus, Trash2 } from "lucide-react";
import { TextInput} from "../shared/TextInput";
import { SelectInput} from "../shared/SelectInput";
import {CheckboxInput } from "../shared/CheckboxInput";
import type { Education, MasterData } from "@/types/profile";   // define these types globally

const educationTypes = [
  "school",
  "diploma",
  "bachelors",
  "masters",
  "phd",
  "certification",
  "other",
];

type EducationEditorProps = {
  educations: Education[];
  masterData: MasterData;
  userType: "student" | "fresher" | "professional";
  onUpdate: (index: number, key: keyof Education, value: any) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onLoadStreams: (degree: string) => void;
};

export function EducationEditor({
  educations,
  masterData,
  userType,
  onUpdate,
  onAdd,
  onRemove,
  onLoadStreams,
}: EducationEditorProps) {
  const showSemester = userType === "student";

  return (
    <div className="space-y-5">
      {educations.map((edu, idx) => {
        const degreeId =
          masterData.degrees.find(
            (d) => d.label === edu.degree || d.value === edu.degree,
          )?.value ?? "";
        const streamOpts = masterData.streamsByDegree[degreeId] || [];

        return (
          <div
            key={edu._id || idx}
            className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-white">
                Education {idx + 1}
              </h3>
              <button
                onClick={() => onRemove(idx)}
                className="flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-[12px] font-semibold text-red-300"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <SelectInput
                label="Education Type"
                value={edu.educationType || ""}
                options={educationTypes.map((t) => ({ value: t, label: t }))}
                onChange={(value: string) =>
                  onUpdate(idx, "educationType", value)
                }
              />
              <SelectInput
                label="College / School"
                value={edu.college || ""}
                options={masterData.colleges}
                allowCustom
                onChange={(value: string) =>
                  onUpdate(idx, "college", value)
                }
              />
              <SelectInput
                label="Degree"
                value={edu.degree || ""}
                options={masterData.degrees}
                allowCustom
                onChange={(value: string) => {
                  onUpdate(idx, "degree", value);
                  onLoadStreams(value);
                }}
              />
              <SelectInput
                label="Specialization / Stream"
                value={edu.specialization || ""}
                options={streamOpts}
                allowCustom
                onFocus={() =>
                  edu.degree && onLoadStreams(edu.degree)
                }
                onChange={(value: string) =>
                  onUpdate(idx, "specialization", value)
                }
              />

              {showSemester && edu.educationType !== "school" && (
                <TextInput
                  label="Semester"
                  value={edu.semester || ""}
                  onChange={(value: string) =>
                    onUpdate(idx, "semester", value)
                  }
                />
              )}

              <TextInput
                label="CGPA / Percentage"
                value={edu.cgpa || ""}
                onChange={(value: string) =>
                  onUpdate(idx, "cgpa", value)
                }
              />
              <TextInput
                label="Year of Graduation"
                value={edu.yearOfGraduation || ""}
                onChange={(value: string) =>
                  onUpdate(idx, "yearOfGraduation", value)
                }
              />
              <TextInput
                label="Start Date"
                type="date"
                value={edu.startDate || ""}
                onChange={(value: string) =>
                  onUpdate(idx, "startDate", value)
                }
              />
              <TextInput
                label="End Date"
                type="date"
                value={edu.endDate || ""}
                disabled={edu.isCurrent}
                onChange={(value: string) =>
                  onUpdate(idx, "endDate", value)
                }
              />
              <CheckboxInput
                label="Currently studying here"
                checked={Boolean(edu.isCurrent)}
                onChange={(checked: boolean) =>
                  onUpdate(idx, "isCurrent", checked)
                }
              />
            </div>
          </div>
        );
      })}

      <button
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--background)] py-4 text-[13px] font-bold text-white hover:border-[var(--primary)] hover:text-[var(--primary)]"
      >
        <Plus className="h-4 w-4" /> Add more education
      </button>
    </div>
  );
}