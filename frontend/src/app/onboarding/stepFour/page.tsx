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
    <div className="min-h-screen bg-black px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-3xl items-center justify-center">
        <div className="w-full rounded-3xl border border-[var(--border)] bg-[var(--background)] p-7 shadow-2xl lg:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-soft)]">
              <Target className="h-8 w-8 text-[var(--primary)]" />
            </div>

            <h1 className="text-[26px] font-bold tracking-[-0.04em] text-white">
              Career Goals & Preferences
            </h1>

            <p className="mt-2 text-[13px] text-[var(--text-primary)]">
              Tell us your job interests and preferred locations.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-[13px] font-medium text-white">
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
              <label className="mb-2 flex items-center text-[13px] font-medium text-white">
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
              <label className="mb-2 flex items-center text-[13px] font-medium text-white">
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
              <label className="mb-2 block text-[13px] font-medium text-white">
                Looking For
              </label>

              <div className="grid grid-cols-3 gap-3">
                {["Job", "Internship", "Both"].map((option) => {
                  const isActive = formData.lookingFor[0] === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleLookingForClick(option)}
                      className={`h-10 rounded-lg border text-[13px] font-semibold transition ${
                        isActive
                          ? "border-[var(--primary)] bg-[var(--primary-soft)] text-white"
                          : "border-white/10 bg-transparent text-[var(--text-primary)] hover:border-[var(--primary)] hover:text-white"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[13px] font-medium text-white">
                Employment Type
              </label>

              <div className="grid grid-cols-3 gap-3">
                {employmentTypeOptions.map((type) => {
                  const isActive = formData.employmentType.includes(type);

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleEmploymentTypeClick(type)}
                      className={`h-10 rounded-lg border text-[13px] font-semibold capitalize transition ${
                        isActive
                          ? "border-[var(--primary)] bg-[var(--primary-soft)] text-white"
                          : "border-white/10 bg-transparent text-[var(--text-primary)] hover:border-[var(--primary)] hover:text-white"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
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

const customMultiSelectStyles: StylesConfig<OptionType, true> = {
  ...(customSelectStyles as unknown as StylesConfig<OptionType, true>),

  multiValue: (base) => ({
    ...base,
    backgroundColor: "var(--primary-soft)",
    borderRadius: "999px",
  }),

  multiValueLabel: (base) => ({
    ...base,
    color: "white",
  }),

  multiValueRemove: (base) => ({
    ...base,
    color: "white",

    ":hover": {
      backgroundColor: "rgba(255,255,255,0.1)",
      color: "white",
    },
  }),
};