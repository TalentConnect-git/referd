"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { MultiValue, StylesConfig } from "react-select";
import { City } from "country-state-city";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Target,
} from "lucide-react";

const CreatableSelect = dynamic(() => import("react-select/creatable"), {
  ssr: false,
}) as any;

type OptionType = {
  value: string;
  label: string;
};

type CareerPreferencesData = {
  industry: string[];
  jobRoles: string[];
  locations: string[];
  lookingFor: string[];
  employmentType: string[];
};

const employmentTypeOptions = ["part time", "full time", "contract"];

export default function CareerPreferencesForm() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [industryOptions, setIndustryOptions] = useState<OptionType[]>([]);
  const [jobRoleOptions, setJobRoleOptions] = useState<OptionType[]>([]);

  const [formData, setFormData] = useState<CareerPreferencesData>({
    industry: [],
    jobRoles: [],
    locations: [],
    lookingFor: ["Internship"],
    employmentType: [],
  });

  const locationOptions = useMemo<OptionType[]>(() => {
    return (
      City.getCitiesOfCountry("IN")
        ?.map((city) => ({
          value: city.name,
          label: city.name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)) || []
    );
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem("careerPreferences");

    if (!savedData) return;

    try {
      const parsed = JSON.parse(savedData);

      setFormData({
        industry: Array.isArray(parsed.industry)
          ? parsed.industry
          : parsed.industry
          ? [parsed.industry]
          : [],
        jobRoles: Array.isArray(parsed.jobRoles) ? parsed.jobRoles : [],
        locations: Array.isArray(parsed.locations) ? parsed.locations : [],
        lookingFor: Array.isArray(parsed.lookingFor)
          ? parsed.lookingFor
          : ["Internship"],
        employmentType: Array.isArray(parsed.employmentType)
          ? parsed.employmentType
          : [],
      });
    } catch (error) {
      console.error("Career preferences parse error:", error);
    }
  }, []);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [industryRes, jobRoleRes] = await Promise.all([
          fetch(`${API_URL}/api/company-master-data?type=INDUSTRY_TYPE`, {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }),
          fetch(`${API_URL}/api/company-master-data?type=JOB_ROLE`, {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }),
        ]);

        const industryData = await industryRes.json();
        const jobRoleData = await jobRoleRes.json();

        const industryList = industryData.data || industryData;
        const jobRoleList = jobRoleData.data || jobRoleData;

        if (Array.isArray(industryList)) {
          setIndustryOptions(
            industryList.map((item) => ({
              value: item.value,
              label: item.value,
            }))
          );
        }

        if (Array.isArray(jobRoleList)) {
          setJobRoleOptions(
            jobRoleList.map((item) => ({
              value: item.value,
              label: item.value,
            }))
          );
        }
      } catch (error) {
        console.error("Career master data error:", error);
      }
    };

    fetchMasterData();
  }, [API_URL]);

  const createCompanyMasterData = async (
    type: "INDUSTRY_TYPE" | "JOB_ROLE",
    value: string
  ) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/company-master-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        type,
        value,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to create option");
    }

    return data.data || data;
  };

  const addUniqueOption = (options: OptionType[], newOption: OptionType) => {
    const exists = options.some(
      (item) => item.value.toLowerCase() === newOption.value.toLowerCase()
    );

    return exists ? options : [...options, newOption];
  };

  const handleIndustryCreate = async (value: string) => {
    try {
      const trimmedValue = value.trim();

      if (!trimmedValue) return;

      const created = await createCompanyMasterData(
        "INDUSTRY_TYPE",
        trimmedValue
      );

      const newOption: OptionType = {
        value: created.value || trimmedValue,
        label: created.value || trimmedValue,
      };

      setIndustryOptions((prev) => addUniqueOption(prev, newOption));

      setFormData((prev) => ({
        ...prev,
        industry: prev.industry.includes(newOption.value)
          ? prev.industry
          : [...prev.industry, newOption.value],
      }));
    } catch (error) {
      console.error("Industry create error:", error);
    }
  };

  const handleJobRoleCreate = async (value: string) => {
    try {
      const trimmedValue = value.trim();

      if (!trimmedValue) return;

      const created = await createCompanyMasterData("JOB_ROLE", trimmedValue);

      const newOption: OptionType = {
        value: created.value || trimmedValue,
        label: created.value || trimmedValue,
      };

      setJobRoleOptions((prev) => addUniqueOption(prev, newOption));

      setFormData((prev) => ({
        ...prev,
        jobRoles: prev.jobRoles.includes(newOption.value)
          ? prev.jobRoles
          : [...prev.jobRoles, newOption.value],
      }));
    } catch (error) {
      console.error("Job role create error:", error);
    }
  };

  const handleLookingForClick = (option: string) => {
    setFormData((prev) => ({
      ...prev,
      lookingFor: [option],
    }));
  };

  const handleEmploymentTypeClick = (type: string) => {
    setFormData((prev) => {
      const exists = prev.employmentType.includes(type);

      return {
        ...prev,
        employmentType: exists
          ? prev.employmentType.filter((item) => item !== type)
          : [...prev.employmentType, type],
      };
    });
  };

  const handleNext = () => {
    localStorage.setItem("careerPreferences", JSON.stringify(formData));
    router.push("/onboarding/stepFive");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-6 text-[var(--text-primary)] sm:px-5 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-3xl items-center justify-center">
        <div className="surface-card w-full rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl sm:p-7 lg:p-10">
          <div className="mb-6 text-center sm:mb-8">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-soft)] sm:mb-4 sm:h-16 sm:w-16">
              <Target className="h-6 w-6 text-[var(--primary)] sm:h-8 sm:w-8" />
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.04em] text-[var(--text-primary)] sm:text-[26px]">
              Career Goals & Preferences
            </h1>

            <p className="mt-1 text-xs text-[var(--text-muted)] sm:mt-2 sm:text-sm">
              Tell us your job interests and preferred locations.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)] sm:mb-2 sm:text-sm">
                Interested Industry Type
              </label>

              <CreatableSelect
                instanceId="industry-select"
                inputId="industry-select"
                isMulti
                isClearable
                options={industryOptions}
                value={formData.industry.map((industry) => ({
                  value: industry,
                  label: industry,
                }))}
                onChange={(selected: MultiValue<OptionType>) => {
                  setFormData((prev) => ({
                    ...prev,
                    industry: selected.map((item) => item.value),
                  }));
                }}
                onCreateOption={handleIndustryCreate}
                placeholder="Select or add industries"
                styles={customMultiSelectStyles}
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center text-xs font-medium text-[var(--text-secondary)] sm:mb-2 sm:text-sm">
                <Briefcase className="mr-2 h-4 w-4 text-[var(--primary)]" />
                Interested Job Roles
              </label>

              <CreatableSelect
                instanceId="job-role-select"
                inputId="job-role-select"
                isMulti
                isClearable
                options={jobRoleOptions}
                value={formData.jobRoles.map((role) => ({
                  value: role,
                  label: role,
                }))}
                onChange={(selected: MultiValue<OptionType>) => {
                  setFormData((prev) => ({
                    ...prev,
                    jobRoles: selected.map((item) => item.value),
                  }));
                }}
                onCreateOption={handleJobRoleCreate}
                placeholder="Select or add job roles"
                styles={customMultiSelectStyles}
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center text-xs font-medium text-[var(--text-secondary)] sm:mb-2 sm:text-sm">
                <MapPin className="mr-2 h-4 w-4 text-[var(--primary)]" />
                Preferred Job Locations
              </label>

              <CreatableSelect
                instanceId="location-select"
                inputId="location-select"
                isMulti
                isClearable
                options={locationOptions}
                value={formData.locations.map((location) => ({
                  value: location,
                  label: location,
                }))}
                onChange={(selected: MultiValue<OptionType>) => {
                  setFormData((prev) => ({
                    ...prev,
                    locations: selected.map((item) => item.value),
                  }));
                }}
                placeholder="Select or type locations"
                styles={customMultiSelectStyles}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)] sm:mb-2 sm:text-sm">
                Looking For
              </label>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {["Job", "Internship", "Both"].map((option) => {
                  const isActive = formData.lookingFor[0] === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleLookingForClick(option)}
                      className={`h-9 rounded-lg border text-xs font-semibold transition sm:h-10 sm:text-sm ${
                        isActive
                          ? "border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--text-primary)]"
                          : "border-[var(--border)] bg-transparent text-[var(--text-muted)] hover:border-[var(--primary-border)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)] sm:mb-2 sm:text-sm">
                Employment Type
              </label>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {employmentTypeOptions.map((type) => {
                  const isActive = formData.employmentType.includes(type);

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleEmploymentTypeClick(type)}
                      className={`h-9 rounded-lg border text-xs font-semibold capitalize transition sm:h-10 sm:text-sm ${
                        isActive
                          ? "border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--text-primary)]"
                          : "border-[var(--border)] bg-transparent text-[var(--text-muted)] hover:border-[var(--primary-border)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary flex h-10 flex-1 items-center justify-center rounded-lg text-xs font-semibold sm:h-11 sm:text-sm"
            >
              <ChevronLeft className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="btn-primary flex h-10 flex-1 items-center justify-center rounded-lg text-xs font-semibold transition-all duration-300 active:scale-[0.99] sm:h-11 sm:text-sm"
            >
              Next
              <ChevronRight className="ml-1.5 h-3.5 w-3.5 sm:ml-2 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const customSelectStyles: StylesConfig<OptionType, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: "44px",
    borderRadius: "8px",
    backgroundColor: "var(--background-soft)",
    borderColor: state.isFocused ? "var(--primary)" : "var(--border)",
    boxShadow: state.isFocused
      ? "0 0 0 2px var(--focus-ring)"
      : "none",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "var(--primary-soft)" : "transparent",
    color: "var(--text-primary)",
    fontSize: "13px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "var(--text-primary)",
  }),
  input: (base) => ({
    ...base,
    color: "var(--text-primary)",
  }),
  placeholder: (base) => ({
    ...base,
    color: "var(--text-muted)",
  }),
};

const customMultiSelectStyles: StylesConfig<OptionType, true> = {
  ...(customSelectStyles as unknown as StylesConfig<OptionType, true>),

  multiValue: (base) => ({
    ...base,
    backgroundColor: "var(--primary-soft)",
    borderRadius: "999px",
  }),

  multiValueLabel: (base) => ({
    ...base,
    color: "var(--text-primary)",
  }),

  multiValueRemove: (base) => ({
    ...base,
    color: "var(--text-primary)",

    ":hover": {
      backgroundColor: "var(--primary-soft)",
      color: "var(--text-primary)",
    },
  }),
};