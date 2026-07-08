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
} from "lucide-react";

import { TextInput } from "../shared/TextInput";
import { SelectInput } from "../shared/SelectInput";
import { CheckboxInput } from "../shared/CheckboxInput";
import type { Education, MasterData } from "@/types/profile";

const educationTypes = [
  { value: "school", label: "School" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelors", label: "Bachelor's Degree" },
  { value: "masters", label: "Master's Degree" },
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
    <div className="space-y-5">
      {localEducations.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#12381f] bg-[#071018] p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#12381f]">
            <GraduationCap className="h-6 w-6 text-[#38e878]" />
          </div>

          <h3 className="text-base font-bold text-white">
            No education added yet
          </h3>

          <p className="mt-1 text-sm text-[#94a3b8]">
            Add your school, college, degree, specialization, and graduation
            details here.
          </p>
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
            className="rounded-2xl border border-[#12381f]/70 bg-[#071018] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
          >
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#12381f]">
                  {isSchool ? (
                    <School className="h-5 w-5 text-[#38e878]" />
                  ) : (
                    <GraduationCap className="h-5 w-5 text-[#38e878]" />
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">
                    Education {idx + 1}
                  </h3>

                  <p className="text-xs text-[#94a3b8]">
                    {getEducationLabel(edu.educationType)}
                    {edu.college ? ` • ${edu.college}` : ""}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="flex w-fit items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:border-red-400/60 hover:bg-red-500/20"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>

            <div className="space-y-5 rounded-2xl border border-[#12381f]/50 bg-[#0b1621] p-4">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#38e878]" />
                  <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[#94a3b8]">
                    Basic Details
                  </h4>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
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
                      placeholder="Example: 7"
                      onChange={(value: string) =>
                        handleUpdate(idx, "semester", value)
                      }
                    />
                  )}

                  <TextInput
                    label="CGPA / Percentage"
                    value={edu.cgpa || ""}
                    placeholder="Example: 8.9 or 89%"
                    onChange={(value: string) =>
                      handleUpdate(idx, "cgpa", value)
                    }
                  />

                  <TextInput
                    label="Year of Graduation"
                    value={edu.yearOfGraduation || ""}
                    placeholder="Example: 2026"
                    onChange={(value: string) =>
                      handleUpdate(idx, "yearOfGraduation", value)
                    }
                  />
                </div>
              </div>

              <div className="border-t border-[#12381f]/50 pt-5">
                <div className="mb-4 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#38e878]" />
                  <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[#94a3b8]">
                    Duration
                  </h4>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
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
                      edu.isCurrent ? "Disabled because currently studying" : ""
                    }
                    onChange={(value: string) =>
                      handleUpdate(idx, "endDate", value)
                    }
                  />

                  <div className="md:col-span-2 rounded-xl border border-[#12381f]/50 bg-[#071018] px-4 py-3">
                    <CheckboxInput
                      label="I am currently studying here"
                      checked={Boolean(edu.isCurrent)}
                      onChange={(checked: boolean) =>
                        handleUpdate(idx, "isCurrent", checked)
                      }
                    />

                    {edu.isCurrent && (
                      <p className="mt-2 text-xs text-[#94a3b8]">
                        End date is disabled because this education is marked as
                        current.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={handleAdd}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#38e878]/40 bg-[#071018] py-4 text-sm font-bold text-[#38e878] transition hover:border-[#38e878] hover:bg-[#12381f]/40"
      >
        <Plus className="h-4 w-4" />
        Add More Education
      </button>
    </div>
  );
}