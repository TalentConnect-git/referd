// components/profile/editors/EducationEditor.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Plus,
  School,
  Trash2,
  Clock,
} from "lucide-react";

import { TextInput } from "../shared/TextInput";
import { SelectInput } from "../shared/SelectInput";
import { CheckboxInput } from "../shared/CheckboxInput";
import type { Education, MasterData } from "@/types/profile";

const educationTypes = [
  { value: "school", label: "School" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelors", label: "Bachelors" },
  { value: "masters", label: "Masters" },
  { value: "phd", label: "PhD" },
  { value: "certification", label: "Certification" },
  { value: "other", label: "Other" },
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

const emptyEducation: Education = {
  educationType: undefined,
  college: "",
  degree: "",
  specialization: "",
  semester: "",
  cgpa: "",
  yearOfGraduation: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
};

function normalizeDateValue(value?: string | null) {
  if (!value) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }

  return value;
}

function getEducationLabel(value?: string) {
  return (
    educationTypes.find((item) => item.value === value)?.label ||
    "Education Details"
  );
}

export function EducationEditor({
  educations,
  masterData,
  userType,
  onUpdate,
  onAdd,
  onRemove,
  onLoadStreams,
}: EducationEditorProps) {
  const [localEducations, setLocalEducations] = useState<Education[]>(
    educations || [],
  );

  const showSemester = userType === "student";

  useEffect(() => {
    setLocalEducations(educations || []);
  }, [educations]);

  const safeMasterData = useMemo(
    () => ({
      colleges: masterData?.colleges || [],
      degrees: masterData?.degrees || [],
      streamsByDegree: masterData?.streamsByDegree || {},
    }),
    [masterData],
  );

  const handleUpdate = (
    index: number,
    key: keyof Education,
    value: any,
  ) => {
    setLocalEducations((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;

        const updatedItem = {
          ...item,
          [key]: value,
        };

        if (key === "degree") {
          updatedItem.specialization = "";
        }

        if (key === "isCurrent" && value === true) {
          updatedItem.endDate = "";
        }

        return updatedItem;
      }),
    );

    onUpdate(index, key, value);

    if (key === "degree") {
      onUpdate(index, "specialization", "");
      onLoadStreams(String(value || ""));
    }

    if (key === "isCurrent" && value === true) {
      onUpdate(index, "endDate", "");
    }
  };

  const handleAdd = () => {
    setLocalEducations((prev) => [...prev, { ...emptyEducation }]);
    onAdd();
  };

  const handleRemove = (index: number) => {
    setLocalEducations((prev) => prev.filter((_, idx) => idx !== index));
    onRemove(index);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      

      {localEducations.length === 0 && (
        <div className="rounded-xl border border-dashed border-[#2a3a52] bg-[#111827] p-8 text-center hover:border-green-500/30 transition-all duration-300">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20">
            <GraduationCap className="h-7 w-7 text-green-400" />
          </div>

          <h3 className="text-base font-semibold text-white">
            No education added yet
          </h3>

          <p className="mt-1 text-sm text-gray-400 max-w-sm mx-auto">
            Add your school, college, degree, specialization, and graduation
            details here.
          </p>

          <button
            type="button"
            onClick={handleAdd}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/30 px-4 py-2 text-sm font-medium text-green-400 hover:bg-green-500/20 hover:border-green-500/50 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Education
          </button>
        </div>
      )}

      {localEducations.map((edu, idx) => {
        const degreeId =
          safeMasterData.degrees.find(
            (degree) =>
              degree.label === edu.degree || degree.value === edu.degree,
          )?.value || edu.degree || "";

        const streamOpts = safeMasterData.streamsByDegree[degreeId] || [];

        const isSchool = edu.educationType === "school";

        return (
          <div
            key={edu._id || `education-${idx}`}
            className="group rounded-xl border border-[#2a3a52] bg-[#111827] p-5 hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5"
          >
            {/* Card Header */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 border border-green-500/20">
                  {isSchool ? (
                    <School className="h-5 w-5 text-green-400" />
                  ) : (
                    <GraduationCap className="h-5 w-5 text-green-400" />
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Education {idx + 1}
                  </h4>

                  <p className="text-xs text-gray-400">
                    {getEducationLabel(edu.educationType)}
                    {edu.college ? ` • ${edu.college}` : ""}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="flex w-fit items-center gap-2 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:border-red-500/50 hover:bg-red-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>

            {/* Card Content */}
            <div className="space-y-5">
              {/* Basic Details Section */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-green-400" />
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Basic Details
                  </h5>
                  <div className="flex-1 h-px bg-[#2a3a52]" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectInput
                    label="Education Type"
                    value={edu.educationType || ""}
                    options={educationTypes}
                    onChange={(value: string) =>
                      handleUpdate(idx, "educationType", value)
                    }
                  />

                  <SelectInput
                    label="College / School"
                    value={edu.college || ""}
                    options={safeMasterData.colleges}
                    allowCustom
                    onChange={(value: string) =>
                      handleUpdate(idx, "college", value)
                    }
                  />

                  <SelectInput
                    label={isSchool ? "Class / Board" : "Degree"}
                    value={edu.degree || ""}
                    options={safeMasterData.degrees}
                    allowCustom
                    onChange={(value: string) =>
                      handleUpdate(idx, "degree", value)
                    }
                  />

                  <SelectInput
                    label={isSchool ? "Stream" : "Specialization / Stream"}
                    value={edu.specialization || ""}
                    options={streamOpts}
                    allowCustom
                    onFocus={() => {
                      if (edu.degree) onLoadStreams(edu.degree);
                    }}
                    onChange={(value: string) =>
                      handleUpdate(idx, "specialization", value)
                    }
                  />

                  {showSemester && !isSchool && (
                    <TextInput
                      label="Current Semester"
                      value={edu.semester || ""}
                      placeholder="e.g., 7"
                      onChange={(value: string) =>
                        handleUpdate(idx, "semester", value)
                      }
                    />
                  )}

                  <TextInput
                    label="CGPA / Percentage"
                    value={edu.cgpa || ""}
                    placeholder="e.g., 8.9 or 89%"
                    onChange={(value: string) =>
                      handleUpdate(idx, "cgpa", value)
                    }
                  />

                  <TextInput
                    label="Year of Graduation"
                    value={edu.yearOfGraduation || ""}
                    placeholder="e.g., 2026"
                    onChange={(value: string) =>
                      handleUpdate(idx, "yearOfGraduation", value)
                    }
                  />
                </div>
              </div>

              {/* Duration Section */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-green-400" />
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Duration
                  </h5>
                  <div className="flex-1 h-px bg-[#2a3a52]" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput
                    label="Start Date"
                    type="date"
                    value={normalizeDateValue(edu.startDate)}
                    onChange={(value: string) =>
                      handleUpdate(idx, "startDate", value)
                    }
                  />

                  <TextInput
                    label="End Date"
                    type="date"
                    value={normalizeDateValue(edu.endDate)}
                    disabled={Boolean(edu.isCurrent)}
                    placeholder={
                      edu.isCurrent ? "Currently studying" : ""
                    }
                    onChange={(value: string) =>
                      handleUpdate(idx, "endDate", value)
                    }
                  />

                  <div className="sm:col-span-2 rounded-lg border border-[#2a3a52] bg-[#0f172a] p-4">
                    <CheckboxInput
                      label="I am currently studying here"
                      checked={Boolean(edu.isCurrent)}
                      onChange={(checked: boolean) =>
                        handleUpdate(idx, "isCurrent", checked)
                      }
                    />

                    {edu.isCurrent && (
                      <p className="mt-2 text-xs text-gray-400 flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        End date is disabled because this education is marked as current.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Add Button */}
      <button
        type="button"
        onClick={handleAdd}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#2a3a52] bg-[#111827] py-4 text-sm font-medium text-gray-400 transition hover:border-green-500/50 hover:text-green-400 hover:bg-green-500/5"
      >
        <Plus className="h-4 w-4" />
        Add More Education
      </button>
    </div>
  );
}