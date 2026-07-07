"use client";

import { useEffect, useState, useRef } from "react";
import {
  Sun,
  Moon,
  RefreshCw,
  Globe,
  Building2,
  MapPin,
  ChevronDown,
} from "lucide-react";

import { MultiSelectChips } from "../shared/MultiSelectChips";
import { ChipInput } from "../shared/ChipInput";
import type { Option } from "@/types/profile";

type ShiftPreferences = {
  Day: boolean;
  Night: boolean;
  Rotational: boolean;
  Any?: boolean;
};

type JobPreferencesEditorProps = {
  jobRoles: string[];
  industry: string[];
  lookingFor: string[];
  employmentType: string[];
  locations: string[];

  openToShift?: string;

  shiftPreferences?: ShiftPreferences;

  currentSalaryCurrency?: string;
  currentSalaryAmount?: string;
  expectedSalaryCurrency?: string;
  expectedSalaryAmount?: string;

  onUpdate: (field: string, items: any) => void;

  roleOptions: Option[];
  industryOptions: Option[];
};

const currencyOptions = [
  { value: "₹", label: "₹ INR", symbol: "₹" },
  { value: "$", label: "$ USD", symbol: "$" },
  { value: "€", label: "€ EUR", symbol: "€" },
  { value: "£", label: "£ GBP", symbol: "£" },
];

const lookingForOptions: Option[] = [
  { value: "Internship", label: "Internship" },
  { value: "Job", label: "Job" },
  { value: "Both", label: "Both" },
];

const employmentTypeOptions: Option[] = [
  { value: "full time", label: "Full Time" },
  { value: "part time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

const shiftOptions: Option[] = [
  { value: "Day", label: "Day" },
  { value: "Night", label: "Night" },
  { value: "Rotational", label: "Rotational" },
  { value: "Any", label: "Any" },
];

const normalizeEmploymentType = (value?: string) => {
  const normalized = String(value || "")
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  if (normalized === "full time" || normalized === "fulltime") return "full time";
  if (normalized === "part time" || normalized === "parttime") return "part time";
  if (normalized === "contract") return "contract";
  if (normalized === "internship" || normalized === "intern") return "internship";

  return "";
};

export function JobPreferencesEditor({
  jobRoles,
  industry,
  lookingFor,
  employmentType,
  locations,
  shiftPreferences = {
    Day: false,
    Night: false,
    Rotational: false,
    Any: false,
  },
  currentSalaryCurrency = "₹",
  currentSalaryAmount = "",
  expectedSalaryCurrency = "₹",
  expectedSalaryAmount = "",
  onUpdate,
  roleOptions,
  industryOptions,
}: JobPreferencesEditorProps) {
  // Use refs to track if we're updating from props to avoid loops
  const isUpdatingFromProps = useRef(false);
  const isUpdatingFromUser = useRef(false);

  const [localShiftPreferences, setLocalShiftPreferences] =
    useState<ShiftPreferences>(shiftPreferences);

  const [localCurrentSalaryAmount, setLocalCurrentSalaryAmount] =
    useState<string>(currentSalaryAmount || "");

  const [localExpectedSalaryAmount, setLocalExpectedSalaryAmount] =
    useState<string>(expectedSalaryAmount || "");

  const [localCurrentSalaryCurrency, setLocalCurrentSalaryCurrency] =
    useState<string>(currentSalaryCurrency || "₹");

  const [localExpectedSalaryCurrency, setLocalExpectedSalaryCurrency] =
    useState<string>(expectedSalaryCurrency || "₹");

  const [isCurrentCurrencyOpen, setIsCurrentCurrencyOpen] = useState(false);
  const [isExpectedCurrencyOpen, setIsExpectedCurrencyOpen] = useState(false);

  const [selectedEmploymentType, setSelectedEmploymentType] = useState<string>(
    normalizeEmploymentType(employmentType?.[0]) || "",
  );

  // Sync shift preferences from props without causing infinite loop
  useEffect(() => {
    // Only update if we're not already updating from user action
    if (!isUpdatingFromUser.current) {
      const hasChanged = JSON.stringify(localShiftPreferences) !== JSON.stringify(shiftPreferences);
      if (hasChanged) {
        isUpdatingFromProps.current = true;
        setLocalShiftPreferences(shiftPreferences);
        setTimeout(() => {
          isUpdatingFromProps.current = false;
        }, 0);
      }
    }
  }, [shiftPreferences, localShiftPreferences]);

  // Sync salary from props without causing infinite loops
  useEffect(() => {
    if (!isUpdatingFromUser.current) {
      if (currentSalaryAmount !== undefined && currentSalaryAmount !== localCurrentSalaryAmount) {
        isUpdatingFromProps.current = true;
        setLocalCurrentSalaryAmount(currentSalaryAmount || "");
        setTimeout(() => {
          isUpdatingFromProps.current = false;
        }, 0);
      }
    }
  }, [currentSalaryAmount, localCurrentSalaryAmount]);

  useEffect(() => {
    if (!isUpdatingFromUser.current) {
      if (expectedSalaryAmount !== undefined && expectedSalaryAmount !== localExpectedSalaryAmount) {
        isUpdatingFromProps.current = true;
        setLocalExpectedSalaryAmount(expectedSalaryAmount || "");
        setTimeout(() => {
          isUpdatingFromProps.current = false;
        }, 0);
      }
    }
  }, [expectedSalaryAmount, localExpectedSalaryAmount]);

  useEffect(() => {
    if (!isUpdatingFromUser.current) {
      if (currentSalaryCurrency !== undefined && currentSalaryCurrency !== localCurrentSalaryCurrency) {
        isUpdatingFromProps.current = true;
        setLocalCurrentSalaryCurrency(currentSalaryCurrency || "₹");
        setTimeout(() => {
          isUpdatingFromProps.current = false;
        }, 0);
      }
    }
  }, [currentSalaryCurrency, localCurrentSalaryCurrency]);

  useEffect(() => {
    if (!isUpdatingFromUser.current) {
      if (expectedSalaryCurrency !== undefined && expectedSalaryCurrency !== localExpectedSalaryCurrency) {
        isUpdatingFromProps.current = true;
        setLocalExpectedSalaryCurrency(expectedSalaryCurrency || "₹");
        setTimeout(() => {
          isUpdatingFromProps.current = false;
        }, 0);
      }
    }
  }, [expectedSalaryCurrency, localExpectedSalaryCurrency]);

  useEffect(() => {
    if (!isUpdatingFromUser.current) {
      const normalized = normalizeEmploymentType(employmentType?.[0]) || "";
      if (normalized !== selectedEmploymentType) {
        isUpdatingFromProps.current = true;
        setSelectedEmploymentType(normalized);
        setTimeout(() => {
          isUpdatingFromProps.current = false;
        }, 0);
      }
    }
  }, [employmentType, selectedEmploymentType]);

  const getCurrencySymbol = (currencyValue: string) => {
    return (
      currencyOptions.find((item) => item.value === currencyValue)?.symbol || "₹"
    );
  };

  const handleShiftToggle = (shift: keyof ShiftPreferences) => {
    isUpdatingFromUser.current = true;
    
    const isAlreadySelected = Boolean(localShiftPreferences[shift]);

    const updated: ShiftPreferences = {
      Day: false,
      Night: false,
      Rotational: false,
      Any: false,
    };

    if (!isAlreadySelected) {
      updated[shift] = true;
    }

    setLocalShiftPreferences(updated);
    onUpdate("shiftPreferences", updated);
    onUpdate("openToShift", isAlreadySelected ? "" : shift);
    
    setTimeout(() => {
      isUpdatingFromUser.current = false;
    }, 0);
  };

  const handleEmploymentTypeSelect = (value: string) => {
    isUpdatingFromUser.current = true;
    
    const normalized = normalizeEmploymentType(value);

    setSelectedEmploymentType(normalized);
    onUpdate("employmentType", normalized ? [normalized] : []);
    
    setTimeout(() => {
      isUpdatingFromUser.current = false;
    }, 0);
  };

  const handleSalaryAmountChange = (
    field: "currentSalaryAmount" | "expectedSalaryAmount",
    value: string,
  ) => {
    isUpdatingFromUser.current = true;
    
    const numericValue = value.replace(/[^0-9.]/g, "");

    if (field === "currentSalaryAmount") {
      setLocalCurrentSalaryAmount(numericValue);
      onUpdate("currentSalaryAmount", numericValue);
      console.log("Current Salary Amount updated:", numericValue);
    } else {
      setLocalExpectedSalaryAmount(numericValue);
      onUpdate("expectedSalaryAmount", numericValue);
      console.log("Expected Salary Amount updated:", numericValue);
    }
    
    setTimeout(() => {
      isUpdatingFromUser.current = false;
    }, 0);
  };

  const handleSalaryCurrencyChange = (
    field: "currentSalaryCurrency" | "expectedSalaryCurrency",
    value: string,
  ) => {
    isUpdatingFromUser.current = true;
    
    if (field === "currentSalaryCurrency") {
      setLocalCurrentSalaryCurrency(value);
      onUpdate("currentSalaryCurrency", value);
      setIsCurrentCurrencyOpen(false);
      console.log("Current Salary Currency updated:", value);
    } else {
      setLocalExpectedSalaryCurrency(value);
      onUpdate("expectedSalaryCurrency", value);
      setIsExpectedCurrencyOpen(false);
      console.log("Expected Salary Currency updated:", value);
    }
    
    setTimeout(() => {
      isUpdatingFromUser.current = false;
    }, 0);
  };

  return (
    <div className="space-y-5">
      {/* Salary Fields */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Current Salary */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#7891c7]">
            Current Salary
          </label>

          <div className="flex items-center gap-2 rounded-[10px] border border-white/10 bg-[#0b1621] px-3 py-2 focus-within:border-[#37e875]">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsCurrentCurrencyOpen((prev) => !prev);
                  setIsExpectedCurrencyOpen(false);
                }}
                className="flex items-center gap-1 text-[14px] font-bold text-[#37e875] transition hover:text-[#37e875]/80"
              >
                <span>{getCurrencySymbol(localCurrentSalaryCurrency)}</span>
                <ChevronDown
                  className={`h-3 w-3 transition-transform ${
                    isCurrentCurrencyOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCurrentCurrencyOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 min-w-[120px] overflow-hidden rounded-lg border border-white/10 bg-[#0b1621] shadow-xl">
                  {currencyOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        handleSalaryCurrencyChange(
                          "currentSalaryCurrency",
                          option.value,
                        )
                      }
                      className={`w-full px-3 py-2 text-left text-[13px] transition hover:bg-[#12381f] ${
                        localCurrentSalaryCurrency === option.value
                          ? "text-[#37e875]"
                          : "text-white"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <input
              type="text"
              value={localCurrentSalaryAmount}
              onChange={(e) =>
                handleSalaryAmountChange("currentSalaryAmount", e.target.value)
              }
              placeholder="Enter amount"
              className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-[#7891c7]"
            />
          </div>
        </div>

        {/* Expected Salary */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#7891c7]">
            Expected Salary
          </label>

          <div className="flex items-center gap-2 rounded-[10px] border border-white/10 bg-[#0b1621] px-3 py-2 focus-within:border-[#37e875]">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsExpectedCurrencyOpen((prev) => !prev);
                  setIsCurrentCurrencyOpen(false);
                }}
                className="flex items-center gap-1 text-[14px] font-bold text-[#37e875] transition hover:text-[#37e875]/80"
              >
                <span>{getCurrencySymbol(localExpectedSalaryCurrency)}</span>
                <ChevronDown
                  className={`h-3 w-3 transition-transform ${
                    isExpectedCurrencyOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isExpectedCurrencyOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 min-w-[120px] overflow-hidden rounded-lg border border-white/10 bg-[#0b1621] shadow-xl">
                  {currencyOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        handleSalaryCurrencyChange(
                          "expectedSalaryCurrency",
                          option.value,
                        )
                      }
                      className={`w-full px-3 py-2 text-left text-[13px] transition hover:bg-[#12381f] ${
                        localExpectedSalaryCurrency === option.value
                          ? "text-[#37e875]"
                          : "text-white"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <input
              type="text"
              value={localExpectedSalaryAmount}
              onChange={(e) =>
                handleSalaryAmountChange("expectedSalaryAmount", e.target.value)
              }
              placeholder="Enter amount"
              className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-[#7891c7]"
            />
          </div>
        </div>
      </div>

      {/* Shift Preferences */}
      <div>
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#7891c7]">
          Shift Preferences
        </label>

        <div className="flex flex-wrap gap-2">
          {shiftOptions.map((option) => {
            const shift = option.value as keyof ShiftPreferences;
            const isSelected = Boolean(localShiftPreferences[shift]);

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleShiftToggle(shift)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-bold transition-all duration-200 ${
                  isSelected
                    ? "border-[#37e875] bg-[#12381f] text-[#37e875] shadow-[0_0_20px_rgba(55,232,117,0.1)]"
                    : "border-white/10 bg-[#0b1621] text-[#7891c7] hover:border-[#37e875]/30 hover:text-white"
                }`}
              >
                {option.value === "Day" && <Sun className="h-3.5 w-3.5" />}
                {option.value === "Night" && <Moon className="h-3.5 w-3.5" />}
                {option.value === "Rotational" && (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                {option.value === "Any" && <Globe className="h-3.5 w-3.5" />}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Employment Type */}
      <div>
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#7891c7]">
          Employment Type
        </label>

        <div className="flex flex-wrap gap-2">
          {employmentTypeOptions.map((option) => {
            const isSelected = selectedEmploymentType === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleEmploymentTypeSelect(option.value)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-bold transition-all duration-200 ${
                  isSelected
                    ? "border-[#37e875] bg-[#12381f] text-[#37e875] shadow-[0_0_20px_rgba(55,232,117,0.1)]"
                    : "border-white/10 bg-[#0b1621] text-[#7891c7] hover:border-[#37e875]/30 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <MultiSelectChips
        label="Job Roles"
        value={jobRoles}
        options={roleOptions}
        onChange={(items: string[]) => onUpdate("jobRoles", items)}
        placeholder="Add job role"
      />

      <MultiSelectChips
        label="Industry"
        value={industry}
        options={industryOptions}
        onChange={(items: string[]) => onUpdate("industry", items)}
        placeholder="Add industry"
      />

      <MultiSelectChips
        label="Looking For"
        value={lookingFor}
        options={lookingForOptions}
        onChange={(items: string[]) => onUpdate("lookingFor", items)}
        placeholder="Add preference"
      />

      <ChipInput
        label="Locations"
        value={locations}
        onChange={(items: string[]) => onUpdate("locations", items)}
        placeholder="Type location and press Enter"
      />
    </div>
  );
}