// components/profile/editors/EducationEditor.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Plus,
  Trash2,
  Clock,
} from "lucide-react";

import { TextInput } from "../shared/TextInput";
import { SelectInput } from "../shared/SelectInput";
import { CheckboxInput } from "../shared/CheckboxInput";
import type { Education, MasterData } from "@/types/profile";
import axiosInstance from "@/lib/axiosInstance";

type EducationEditorProps = {
  educations: Education[];
  masterData: MasterData;
  userType: "student" | "fresher" | "professional";
  onUpdate: (index: number, key: keyof Education, value: any) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onLoadStreams: (degree: string) => void;
  onMasterDataUpdate?: () => void;
};

const emptyEducation: Education = {
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

export function EducationEditor({
  educations,
  masterData,
  userType,
  onUpdate,
  onAdd,
  onRemove,
  onLoadStreams,
  onMasterDataUpdate,
}: EducationEditorProps) {
  const [localEducations, setLocalEducations] = useState<Education[]>(
    educations || [],
  );
  const [isCreating, setIsCreating] = useState(false);

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

  // ✅ API function to create new master data item
  const createMasterDataItem = async (type: string, value: string, parent?: string) => {
    try {
      setIsCreating(true);
      const payload: any = { type, value };
      if (parent) {
        payload.parent = parent;
      }
      
      const response = await axiosInstance.post('/api/master-data', payload);

      if (response?.data?.success) {
        if (onMasterDataUpdate) {
          onMasterDataUpdate();
        }
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  // ✅ Handle college creation using /api/colleges/register
  const handleCollegeCreate = async (value: string) => {
    try {
      setIsCreating(true);
      const response = await axiosInstance.post('/api/colleges/register', {
        name: value
      });

      if (response?.data?.value) {
        if (onMasterDataUpdate) {
          onMasterDataUpdate();
        }
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error('Error creating college:', error);
      if (error?.response?.data?.message) {
        alert(error.response.data.message);
      }
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  // ✅ Handle degree creation
  const handleDegreeCreate = async (value: string) => {
    return await createMasterDataItem('DEGREE', value);
  };

  // ✅ FIXED: Handle stream creation with proper degree ID
  const handleStreamCreate = async (value: string, degree: string) => {
    try {
      setIsCreating(true);
      
      // 🔍 Debug: Log what we're looking for
      console.log('Looking for degree:', degree);
      console.log('Available degrees:', safeMasterData.degrees);
      
      // Find the degree ID - check both label and value
      const degreeItem = safeMasterData.degrees.find(
        d => {
          const matchesLabel = d.label === degree;
          const matchesValue = d.value === degree;
          const matchesLabelCaseInsensitive = d.label?.toLowerCase() === degree?.toLowerCase();
          const matchesValueCaseInsensitive = d.value?.toLowerCase() === degree?.toLowerCase();
          
          return matchesLabel || matchesValue || matchesLabelCaseInsensitive || matchesValueCaseInsensitive;
        }
      );
      
      console.log('Found degree item:', degreeItem);
      
      if (!degreeItem) {
        console.error('Degree not found for stream creation. Degree value:', degree);
        alert('Please select a valid degree first before adding a specialization.');
        return null;
      }

      // Get the actual degree ID from the item
      const degreeId = degreeItem.value || "";
      
      console.log('Using degree ID:', degreeId);
      
      if (!degreeId) {
        console.error('No degree ID found for:', degreeItem);
        alert('Invalid degree selected. Please try again.');
        return null;
      }

      const response = await axiosInstance.post('/api/master-data', {
        type: 'STREAM',
        value: value,
        parent: degreeId // Pass degree ID as parent
      });

      console.log('Stream creation response:', response.data);

      if (response?.data?.success) {
        if (onMasterDataUpdate) {
          onMasterDataUpdate();
        }
        return response.data.data;
      }
      return null;
    } catch (error: any) {
      console.error('Error creating stream:', error);
      if (error?.response?.data?.message) {
        alert(error.response.data.message);
      }
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  // ✅ Helper function to get college options
  const collegeOptions = useMemo(() => {
    return safeMasterData.colleges.map((college) => ({
      value: college.label,
      label: college.label,
      id: college.value,
    }));
  }, [safeMasterData.colleges]);

  // ✅ Helper function to get degree options
  const degreeOptions = useMemo(() => {
    return safeMasterData.degrees.map((degree) => ({
      value: degree.label,
      label: degree.label,
      id: degree.value,
    }));
  }, [safeMasterData.degrees]);

  // ✅ Helper function to get stream options
  const getStreamOptions = (degreeId: string) => {
    const streams = safeMasterData.streamsByDegree[degreeId] || [];
    return streams.map((stream) => ({
      value: stream.label || stream.value,
      label: stream.label || stream.value,
      id: stream.value,
    }));
  };

  return (
    <div className="space-y-6">
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

        const streamOptions = getStreamOptions(degreeId);

        return (
          <div
            key={edu._id || `education-${idx}`}
            className="group rounded-xl border border-[#2a3a52] bg-[#111827] p-5 hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5"
          >
            {/* Card Header */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 border border-green-500/20">
                  <GraduationCap className="h-5 w-5 text-green-400" />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Education {idx + 1}
                  </h4>

                  <p className="text-xs text-gray-400">
                    {edu.college ? edu.college : "No college selected"}
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
                  {/* College / School */}
                  <SelectInput
                    label="College / School"
                    value={edu.college || ""}
                    options={collegeOptions}
                    allowCustom
                    onCreate={handleCollegeCreate}
                    loading={isCreating}
                    onChange={(value: string) =>
                      handleUpdate(idx, "college", value)
                    }
                  />

                  {/* Degree */}
                  <SelectInput
                    label="Degree"
                    value={edu.degree || ""}
                    options={degreeOptions}
                    allowCustom
                    onCreate={handleDegreeCreate}
                    loading={isCreating}
                    onChange={(value: string) =>
                      handleUpdate(idx, "degree", value)
                    }
                  />

                  {/* Specialization / Stream */}
                  <SelectInput
                    label="Specialization / Stream"
                    value={edu.specialization || ""}
                    options={streamOptions}
                    allowCustom
                    onCreate={(value: string) => 
                      handleStreamCreate(value, edu.degree || "")
                    }
                    loading={isCreating}
                    onFocus={() => {
                      if (edu.degree) onLoadStreams(edu.degree);
                    }}
                    onChange={(value: string) =>
                      handleUpdate(idx, "specialization", value)
                    }
                  />

                  {showSemester && (
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