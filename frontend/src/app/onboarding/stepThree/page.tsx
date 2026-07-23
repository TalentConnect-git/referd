"use client";

import dynamic from "next/dynamic";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SingleValue, StylesConfig } from "react-select";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  UploadIcon,
  Plus,
  Trash2,
  Clock,
} from "lucide-react";

const CreatableSelect = dynamic(() => import("react-select/creatable"), {
  ssr: false,
}) as any;

type OptionType = {
  value: string;
  label: string;
};

type CandidateRole = "student" | "fresher" | "professional";

type EducationFormData = {
  college: string;
  degree: string;
  specialization: string;
  semester: string;
  cgpa: string;
  yearOfGraduation: string;
  degreeCertificate: File | null;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
};

type EducationPayload = {
  college: string;
  degree: string;
  specialization?: string;
  semester?: string;
  cgpa?: string;
  yearOfGraduation?: string;
  degreeCertificate?: string;
  startDate?: string;
  endDate?: string;
  isCurrent: boolean;
};

type ToastState = {
  type: "success" | "error";
  message: string;
} | null;

type ParsedResume = {
  education?: {
    college?: string;
    institution?: string;
    degree?: string;
    year?: string;
    field_of_study?: string;
    specialization?: string;
    cgpa?: string;
    startDate?: string;
    start_date?: string;
    endDate?: string;
    end_date?: string;
  }[];
};

const emptyEducation: EducationFormData = {
  college: "",
  degree: "",
  specialization: "",
  semester: "",
  cgpa: "",
  yearOfGraduation: "",
  degreeCertificate: null,
  startDate: "",
  endDate: "",
  isCurrent: false,
};

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function hasMeaningfulEducationData(item: EducationFormData): boolean {
  return Boolean(
    cleanText(item.college) ||
      cleanText(item.degree) ||
      cleanText(item.specialization) ||
      cleanText(item.semester) ||
      cleanText(item.cgpa) ||
      cleanText(item.yearOfGraduation) ||
      item.degreeCertificate ||
      cleanText(item.startDate) ||
      cleanText(item.endDate) ||
      item.isCurrent,
  );
}

export default function EducationForm() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [selectedRole, setSelectedRole] = useState<CandidateRole>("student");
  const [educationList, setEducationList] = useState<EducationFormData[]>([
    emptyEducation,
  ]);

  const [collegeOptions, setCollegeOptions] = useState<OptionType[]>([]);
  const [degreeOptions, setDegreeOptions] = useState<OptionType[]>([]);
  const [streamOptions, setStreamOptions] = useState<Record<number, OptionType[]>>(
    {}
  );
  const [selectedDegreeIds, setSelectedDegreeIds] = useState<
    Record<number, string | null>
  >({});

  const [loadingColleges, setLoadingColleges] = useState(false);
  const [loadingDegrees, setLoadingDegrees] = useState(false);
  const [loadingStreams, setLoadingStreams] = useState<Record<number, boolean>>(
    {}
  );
  const [toast, setToast] = useState<ToastState>(null);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 76 }, (_, i) => currentYear + 5 - i);
  }, []);

  const showSemesterField =
    selectedRole === "student" || selectedRole === "fresher";
  const showCgpaField = selectedRole !== "professional";
  const showStartDate =
    selectedRole === "student" || selectedRole === "fresher";

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });

    window.setTimeout(() => {
      setToast((current) =>
        current?.type === type && current.message === message ? null : current,
      );
    }, 3500);
  };

  const updateEducation = (
    index: number,
    key: keyof EducationFormData,
    value: EducationFormData[keyof EducationFormData]
  ) => {
    setEducationList((prev) =>
      prev.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        const updated = {
          ...item,
          [key]: value,
        };

        // When isCurrent is true, clear end date
        if (key === "isCurrent" && value === true) {
          updated.endDate = "";
        }

        return updated;
      })
    );
  };

  const addEducation = () => {
    setEducationList((prev) => [...prev, { ...emptyEducation }]);
  };

  const removeEducation = (index: number) => {
    setEducationList((prev) => prev.filter((_, itemIndex) => itemIndex !== index));

    setSelectedDegreeIds((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });

    setStreamOptions((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = localStorage.getItem("selectedRole") || user?.userType || "student";

    setSelectedRole(role as CandidateRole);
  }, []);

  useEffect(() => {
    const parsedResume = localStorage.getItem("parsedResume");
    if (!parsedResume) return;

    const parsedData: ParsedResume = JSON.parse(parsedResume);

    if (!parsedData.education?.length) return;

    const formattedEducation = parsedData.education.map((item) => ({
      ...emptyEducation,
      college: item.college || item.institution || "",
      degree: item.degree || "",
      specialization: item.specialization || item.field_of_study || "",
      cgpa: item.cgpa || "",
      yearOfGraduation: item.year || "",
      startDate: item.startDate || item.start_date || "",
      endDate: item.endDate || item.end_date || "",
    }));

    setEducationList(formattedEducation);
  }, []);

  // ✅ Fetch colleges from /api/colleges/all
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoadingColleges(true);

        const res = await fetch(`${API_URL}/api/colleges/all`);
        const data = await res.json();

        if (!res.ok) return;

        const formatted: OptionType[] = Array.isArray(data)
          ? data.map((item) =>
              typeof item === "string"
                ? { value: item, label: item }
                : {
                    value: item._id || item.value || item.name || item.label,
                    label: item.name || item.label || item.value,
                  }
            )
          : [];

        setCollegeOptions(formatted);
      } catch (error) {
        console.error("College fetch error:", error);
      } finally {
        setLoadingColleges(false);
      }
    };

    fetchColleges();
  }, [API_URL]);

  // ✅ Fetch degrees from /api/master-data?type=DEGREE
  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        setLoadingDegrees(true);

        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/master-data?type=DEGREE`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const data = await res.json();

        if (!res.ok) return;

        const list = data.data || data;

        const formatted: OptionType[] = Array.isArray(list)
          ? list.map((item) => ({
              value: item._id,
              label: item.value,
            }))
          : [];

        setDegreeOptions(formatted);
      } catch (error) {
        console.error("Degree fetch error:", error);
      } finally {
        setLoadingDegrees(false);
      }
    };

    fetchDegrees();
  }, [API_URL]);

  // ✅ Fetch streams from /api/master-data?type=STREAM&parent={degreeId}
  const fetchStreams = async (index: number, degreeId: string) => {
    try {
      setLoadingStreams((prev) => ({ ...prev, [index]: true }));

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/master-data?type=STREAM&parent=${degreeId}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      const data = await res.json();

      if (!res.ok) return;

      const list = data.data || data;

      const formatted: OptionType[] = Array.isArray(list)
        ? list.map((item) => ({
            value: item._id,
            label: item.value,
          }))
        : [];

      setStreamOptions((prev) => ({
        ...prev,
        [index]: formatted,
      }));
    } catch (error) {
      console.error("Stream fetch error:", error);
    } finally {
      setLoadingStreams((prev) => ({ ...prev, [index]: false }));
    }
  };

  // ✅ Create college using /api/colleges/register
  const createCollege = async (index: number, name: string) => {
    try {
      setLoadingColleges(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/colleges/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast("error", data.message || "Could not register college");
        return;
      }

      const newCollege: OptionType = {
        value: data._id || data.value || name,
        label: data.label || data.name || name,
      };

      setCollegeOptions((prev) => [...prev, newCollege]);
      updateEducation(index, "college", newCollege.label);
      
      showToast("success", "College added successfully");
    } catch (error) {
      console.error("College create error:", error);
      showToast("error", "Failed to create college");
    } finally {
      setLoadingColleges(false);
    }
  };

  // ✅ Create master data (DEGREE or STREAM) using /api/master-data POST
  const createMasterData = async (
    type: "DEGREE" | "STREAM",
    value: string,
    parent?: string | null
  ) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/master-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        type,
        value,
        ...(parent ? { parent } : {}),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to create master data");
    }

    return data.data || data;
  };

  // ✅ Handle degree creation using master data API
  const handleDegreeCreate = async (index: number, value: string) => {
    try {
      const created = await createMasterData("DEGREE", value);

      const newOption: OptionType = {
        value: created._id,
        label: created.value,
      };

      setDegreeOptions((prev) => [...prev, newOption]);
      setSelectedDegreeIds((prev) => ({ ...prev, [index]: newOption.value }));

      updateEducation(index, "degree", newOption.label);
      updateEducation(index, "specialization", "");

      await fetchStreams(index, newOption.value);
      
      showToast("success", "Degree added successfully");
    } catch (error) {
      console.error("Degree create error:", error);
      showToast("error", "Failed to create degree");
    }
  };

  // ✅ Handle stream creation using master data API
  const handleStreamCreate = async (index: number, value: string) => {
    try {
      const degreeId = selectedDegreeIds[index];

      if (!degreeId) {
        showToast("error", "Please select a degree first");
        return;
      }

      const created = await createMasterData("STREAM", value, degreeId);

      const newOption: OptionType = {
        value: created._id,
        label: created.value,
      };

      setStreamOptions((prev) => ({
        ...prev,
        [index]: [...(prev[index] || []), newOption],
      }));

      updateEducation(index, "specialization", newOption.label);
      
      showToast("success", "Specialization added successfully");
    } catch (error) {
      console.error("Stream create error:", error);
      showToast("error", "Failed to create specialization");
    }
  };

  const handleFileChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    updateEducation(index, "degreeCertificate", file);
  };

  const handleNext = () => {
    const enteredEducation = educationList.filter(hasMeaningfulEducationData);

    for (let index = 0; index < enteredEducation.length; index += 1) {
      const item = enteredEducation[index];
      const college = cleanText(item.college);
      const degree = cleanText(item.degree);

      if (!college && !degree) {
        showToast(
          "error",
          `Education ${index + 1}: college name and degree are required.`,
        );
        return;
      }

      if (!college) {
        showToast(
          "error",
          `Education ${index + 1}: college name is required.`,
        );
        return;
      }

      if (!degree) {
        showToast(
          "error",
          `Education ${index + 1}: degree is required.`,
        );
        return;
      }
    }

    const educationPayload: EducationPayload[] = enteredEducation.map((item) => {
      const payload: EducationPayload = {
        college: cleanText(item.college),
        degree: cleanText(item.degree),
        isCurrent: Boolean(item.isCurrent),
      };

      const specialization = cleanText(item.specialization);
      const semester = cleanText(item.semester);
      const cgpa = cleanText(item.cgpa);
      const graduationYear = cleanText(item.yearOfGraduation);
      const startDate = cleanText(item.startDate);
      const endDate = cleanText(item.endDate);
      const certificateName = item.degreeCertificate?.name || "";

      if (specialization) payload.specialization = specialization;

      if (showSemesterField && item.isCurrent && semester) {
        payload.semester = semester;
      }

      if (showCgpaField && cgpa) {
        payload.cgpa = cgpa;
      }

      if (graduationYear) {
        payload.yearOfGraduation = graduationYear;
      }

      if (certificateName) {
        payload.degreeCertificate = certificateName;
      }

      if (showStartDate && startDate) {
        payload.startDate = startDate;
      }

      if (!item.isCurrent && endDate) {
        payload.endDate = endDate;
      }

      return payload;
    });

    localStorage.setItem("educationInfo", JSON.stringify(educationPayload));
    router.push("/onboarding/stepFour");
  };

  return (
    <div className="min-h-screen bg-black px-5 py-8 text-white">
      {toast ? (
        <div
          role="alert"
          aria-live="assertive"
          className={`fixed right-4 top-4 z-[100] max-w-sm rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur ${
            toast.type === "success"
              ? "border-emerald-500/40 bg-emerald-950/95 text-emerald-200"
              : "border-red-500/40 bg-red-950/95 text-red-200"
          }`}
        >
          {toast.message}
        </div>
      ) : null}
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-3xl items-center justify-center">
        <div className="w-full rounded-3xl border border-[var(--border)] bg-[var(--background)] p-7 shadow-2xl lg:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-soft)]">
              <GraduationCap className="h-8 w-8 text-[var(--primary)]" />
            </div>

            <h1 className="text-[26px] font-bold tracking-[-0.04em] text-white">
              Educational Background
            </h1>

            <p className="mt-2 text-[13px] text-[var(--text-primary)]">
              Add one or more education details.
            </p>
          </div>

          <div className="space-y-6">
            {educationList.map((education, index) => {
              const showSemester = showSemesterField && education.isCurrent;

              return (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <h2 className="text-sm font-semibold text-white">
                      Education {index + 1}
                    </h2>

                    {educationList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="flex h-9 items-center gap-2 rounded-lg border border-red-500/30 px-3 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-5">
                    {/* College / University / School */}
                    <div>
                      <label className="mb-2 block text-[13px] font-medium text-white">
                        College / University / School
                      </label>

                      <CreatableSelect
                        instanceId={`college-select-${index}`}
                        inputId={`college-select-${index}`}
                        isClearable
                        isLoading={loadingColleges}
                        options={collegeOptions}
                        value={
                          education.college
                            ? {
                                value: education.college,
                                label: education.college,
                              }
                            : null
                        }
                        onChange={(selected: SingleValue<OptionType>) =>
                          updateEducation(index, "college", selected?.label || "")
                        }
                        onCreateOption={(value: string) =>
                          createCollege(index, value)
                        }
                        placeholder="Search or add college/school"
                        styles={customSelectStyles}
                      />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      {/* Degree */}
                      <div>
                        <label className="mb-2 block text-[13px] font-medium text-white">
                          Degree / Class
                        </label>

                        <CreatableSelect
                          instanceId={`degree-select-${index}`}
                          inputId={`degree-select-${index}`}
                          isClearable
                          isLoading={loadingDegrees}
                          options={degreeOptions}
                          value={
                            degreeOptions.find(
                              (item) =>
                                item.label
                                  .toLowerCase()
                                  .replace(/\s|\./g, "") ===
                                education.degree
                                  .toLowerCase()
                                  .replace(/\s|\./g, "")
                            ) || null
                          }
                          onChange={(selected: SingleValue<OptionType>) => {
                            updateEducation(
                              index,
                              "degree",
                              selected?.label || ""
                            );
                            updateEducation(index, "specialization", "");

                            setSelectedDegreeIds((prev) => ({
                              ...prev,
                              [index]: selected?.value || null,
                            }));

                            if (selected?.value) {
                              fetchStreams(index, selected.value);
                            } else {
                              setStreamOptions((prev) => ({
                                ...prev,
                                [index]: [],
                              }));
                            }
                          }}
                          onCreateOption={(value: string) =>
                            handleDegreeCreate(index, value)
                          }
                          placeholder="Select or add degree"
                          styles={customSelectStyles}
                        />
                      </div>

                      {/* Stream / Specialization */}
                      <div>
                        <label className="mb-2 block text-[13px] font-medium text-white">
                          Stream / Specialization
                        </label>

                        <CreatableSelect
                          instanceId={`specialization-select-${index}`}
                          inputId={`specialization-select-${index}`}
                          isClearable
                          isDisabled={!education.degree}
                          isLoading={loadingStreams[index]}
                          options={streamOptions[index] || []}
                          value={
                            (streamOptions[index] || []).find(
                              (item) =>
                                item.label === education.specialization ||
                                item.value === education.specialization
                            ) || null
                          }
                          onChange={(selected: SingleValue<OptionType>) =>
                            updateEducation(
                              index,
                              "specialization",
                              selected?.label || ""
                            )
                          }
                          onCreateOption={(value: string) =>
                            handleStreamCreate(index, value)
                          }
                          placeholder="Search or add specialization"
                          styles={customSelectStyles}
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      {showSemester && (
                        <div>
                          <label className="mb-2 block text-[13px] font-medium text-white">
                            Current Semester
                          </label>

                          <select
                            value={education.semester}
                            onChange={(e) =>
                              updateEducation(index, "semester", e.target.value)
                            }
                            className="h-11 w-full rounded-lg border border-white/10 bg-[var(--background)] px-4 text-[13px] text-white outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                          >
                            <option value="">Select semester</option>

                            {Array.from({ length: 8 }, (_, i) => (
                              <option key={i + 1} value={String(i + 1)}>
                                Semester {i + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {showCgpaField ? (
                        <div>
                          <label className="mb-2 block text-[13px] font-medium text-white">
                            CGPA / Percentage
                          </label>

                          <input
                            value={education.cgpa}
                            onChange={(e) =>
                              updateEducation(index, "cgpa", e.target.value)
                            }
                            placeholder="e.g. 8.5 or 85%"
                            className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 text-[13px] text-white outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                          />
                        </div>
                      ) : null}
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      {showStartDate && (
                        <div>
                          <label className="mb-2 block text-[13px] font-medium text-white">
                            Start Date
                          </label>

                          <input
                            type="date"
                            value={education.startDate}
                            onChange={(e) =>
                              updateEducation(index, "startDate", e.target.value)
                            }
                            className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 text-[13px] text-white outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                          />
                        </div>
                      )}

                      {/* End Date */}
                      <div>
                        <label className="mb-2 block text-[13px] font-medium text-white">
                          End Date
                        </label>

                        <input
                          type="date"
                          value={education.endDate}
                          disabled={education.isCurrent}
                          onChange={(e) =>
                            updateEducation(index, "endDate", e.target.value)
                          }
                          className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 text-[13px] text-white outline-none transition disabled:cursor-not-allowed disabled:opacity-50 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                        />
                      </div>
                    </div>

                    {/* Currently studying checkbox */}
                    <label className="flex items-center gap-3 text-[13px] text-[var(--text-primary)]">
                      <input
                        type="checkbox"
                        checked={education.isCurrent}
                        onChange={(e) =>
                          updateEducation(index, "isCurrent", e.target.checked)
                        }
                        className="h-4 w-4 accent-[var(--primary)]"
                      />

                      I am currently studying here
                    </label>

                    {showSemesterField && education.isCurrent && !education.semester && (
                      <p className="text-xs text-yellow-400 flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        Please select your current semester
                      </p>
                    )}

                    <GraduationYearSelect
                      value={education.yearOfGraduation}
                      years={yearOptions}
                      onChange={(value) =>
                        updateEducation(index, "yearOfGraduation", value)
                      }
                    />

                    {/* Degree Certificate Upload */}
                    <div>
                      <label className="mb-2 block text-[13px] font-medium text-white">
                        Degree Certificate{" "}
                        <span className="text-[var(--text-primary)]">
                          (Optional)
                        </span>
                      </label>

                      <label className="flex h-14 cursor-pointer items-center rounded-lg border-2 border-dashed border-white/10 bg-white/[0.03] px-4 transition hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]">
                        <UploadIcon className="mr-3 h-5 w-5 text-[var(--text-primary)]" />

                        <span className="truncate text-[13px] text-[var(--text-primary)]">
                          {education.degreeCertificate
                            ? education.degreeCertificate.name
                            : "Click to upload certificate PDF, JPG, PNG"}
                        </span>

                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(index, e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={addEducation}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--primary)] text-[13px] font-semibold text-[var(--primary)] transition hover:bg-[var(--primary-soft)]"
            >
              <Plus className="h-4 w-4" />
              Add More Education
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-10 flex-1 items-center justify-center rounded-lg border border-white/10 text-[13px] font-semibold text-white transition hover:bg-white/10"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="button-color flex h-10 flex-1 items-center justify-center rounded-lg text-[13px] font-semibold text-black transition-all duration-300 hover:brightness-110 active:scale-[0.99]"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type GraduationYearSelectProps = {
  value: string;
  years: number[];
  onChange: (value: string) => void;
};

function GraduationYearSelect({
  value,
  years,
  onChange,
}: GraduationYearSelectProps) {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-medium text-white">
        Graduation Year
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-white/10 bg-[var(--background)] px-4 text-[13px] text-white outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
      >
        <option value="">Select year</option>

        {years.map((year) => (
          <option key={year} value={String(year)}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}

const customSelectStyles: StylesConfig<OptionType, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: "44px",
    borderRadius: "8px",
    backgroundColor: "var(--background)",
    borderColor: state.isFocused ? "var(--primary)" : "rgba(255,255,255,0.1)",
    boxShadow: state.isFocused
      ? "0 0 0 2px rgba(49,170,64,0.15)"
      : "none",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--background)",
    border: "1px solid rgba(255,255,255,0.1)",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "var(--primary-soft)" : "transparent",
    color: "white",
    fontSize: "13px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "white",
  }),
  input: (base) => ({
    ...base,
    color: "white",
  }),
  placeholder: (base) => ({
    ...base,
    color: "var(--text-muted)",
  }),
};