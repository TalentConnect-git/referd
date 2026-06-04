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
} from "lucide-react";

const CreatableSelect = dynamic(() => import("react-select/creatable"), {
  ssr: false,
}) as any;

type OptionType = {
  value: string;
  label: string;
};

type CandidateRole = "student" | "fresher" | "professional";

type EducationType =
  | "school"
  | "diploma"
  | "bachelors"
  | "masters"
  | "phd"
  | "certification"
  | "other";

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
  educationType: EducationType;
  isCurrent: boolean;
};

type EducationPayload = {
  college: string;
  degree: string;
  specialization: string;
  semester?: string;
  cgpa: string;
  yearOfGraduation: string;
  degreeCertificate: string;
  startDate?: string;
  endDate: string;
  educationType: EducationType;
  isCurrent: boolean;
};

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
  educationType: "bachelors",
  isCurrent: false,
};

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

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 76 }, (_, i) => currentYear + 5 - i);
  }, []);

  const isStudent = selectedRole === "student";

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

        if (key === "educationType" && value === "school") {
          updated.semester = "";
        }

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
        alert(data.message || "Could not register college");
        return;
      }

      const newCollege: OptionType = {
        value: data._id || data.value || name,
        label: data.label || data.name || name,
      };

      setCollegeOptions((prev) => [...prev, newCollege]);
      updateEducation(index, "college", newCollege.label);
    } catch (error) {
      console.error("College create error:", error);
    } finally {
      setLoadingColleges(false);
    }
  };

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
    } catch (error) {
      console.error("Degree create error:", error);
    }
  };

  const handleStreamCreate = async (index: number, value: string) => {
    try {
      const degreeId = selectedDegreeIds[index];

      if (!degreeId) {
        alert("Please select degree first");
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
    } catch (error) {
      console.error("Stream create error:", error);
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
    const educationPayload: EducationPayload[] = educationList.map((item) => {
      const shouldSendSemester = isStudent && item.educationType !== "school";
      const shouldSendStartDate = isStudent;

      return {
        college: item.college,
        degree: item.degree,
        specialization: item.specialization,
        ...(shouldSendSemester && item.semester
          ? { semester: item.semester }
          : {}),
        cgpa: item.cgpa,
        yearOfGraduation: item.yearOfGraduation,
        degreeCertificate: item.degreeCertificate?.name || "",
        ...(shouldSendStartDate && item.startDate
          ? { startDate: item.startDate }
          : {}),
        endDate: item.isCurrent ? "" : item.endDate,
        educationType: item.educationType,
        isCurrent: item.isCurrent,
      };
    });

    localStorage.setItem("educationInfo", JSON.stringify(educationPayload));

    router.push("/onboarding/stepFour");
  };

  return (
    <div className="min-h-screen bg-black px-5 py-8 text-white">
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
              const showSemester =
                isStudent && education.educationType !== "school";
              const showStartDate = isStudent;

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
                    <div>
                      <label className="mb-2 block text-[13px] font-medium text-white">
                        Education Type
                      </label>

                      <select
                        value={education.educationType}
                        onChange={(e) =>
                          updateEducation(
                            index,
                            "educationType",
                            e.target.value as EducationType
                          )
                        }
                        className="h-11 w-full rounded-lg border border-white/10 bg-[var(--background)] px-4 text-[13px] text-white outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                      >
                        <option value="school">School</option>
                        <option value="diploma">Diploma</option>
                        <option value="bachelors">Bachelors</option>
                        <option value="masters">Masters</option>
                        <option value="phd">PhD</option>
                        <option value="certification">Certification</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

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

                    <GraduationYearSelect
                      value={education.yearOfGraduation}
                      years={yearOptions}
                      onChange={(value) =>
                        updateEducation(index, "yearOfGraduation", value)
                      }
                    />

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