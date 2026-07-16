"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import {
  Sun,
  Moon,
  RefreshCw,
  Globe,
  Building2,
  MapPin,
  ChevronDown,
  Search,
  X,
  Loader2,
  Plus,
  Briefcase
} from "lucide-react";

import { MultiSelectChips } from "../shared/MultiSelectChips";
import { ChipInput } from "../shared/ChipInput";
import type { Option } from "@/types/profile";
import axiosInstance from "@/lib/axiosInstance";

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

  roleOptions?: Option[];
  industryOptions?: Option[];
};

const currencyOptions = [
  { value: "INR", label: "₹ INR", symbol: "₹" },
  { value: "USD", label: "$ USD", symbol: "$" },
  { value: "EUR", label: "€ EUR", symbol: "€" },
  { value: "GBP", label: "£ GBP", symbol: "£" },
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

// State and City data only
const states = [
  { value: "andhra_pradesh", label: "Andhra Pradesh" },
  { value: "karnataka", label: "Karnataka" },
  { value: "kerala", label: "Kerala" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "tamil_nadu", label: "Tamil Nadu" },
  { value: "delhi", label: "Delhi" },
  { value: "rajasthan", label: "Rajasthan" },
  { value: "uttar_pradesh", label: "Uttar Pradesh" },
  { value: "gujarat", label: "Gujarat" },
  { value: "west_bengal", label: "West Bengal" },
  { value: "telangana", label: "Telangana" },
  { value: "punjab", label: "Punjab" },
  { value: "haryana", label: "Haryana" },
  { value: "bihar", label: "Bihar" },
  { value: "odisha", label: "Odisha" },
  { value: "assam", label: "Assam" },
];

const citiesByState: Record<string, { value: string; label: string }[]> = {
  andhra_pradesh: [
    { value: "visakhapatnam", label: "Visakhapatnam" },
    { value: "vijayawada", label: "Vijayawada" },
    { value: "guntur", label: "Guntur" },
    { value: "nellore", label: "Nellore" },
    { value: "kurnool", label: "Kurnool" },
  ],
  karnataka: [
    { value: "bengaluru", label: "Bengaluru" },
    { value: "mysore", label: "Mysore" },
    { value: "hubli", label: "Hubli" },
    { value: "mangalore", label: "Mangalore" },
    { value: "belgaum", label: "Belgaum" },
  ],
  kerala: [
    { value: "thiruvananthapuram", label: "Thiruvananthapuram" },
    { value: "kochi", label: "Kochi" },
    { value: "kozhikode", label: "Kozhikode" },
    { value: "thrissur", label: "Thrissur" },
    { value: "alappuzha", label: "Alappuzha" },
  ],
  maharashtra: [
    { value: "mumbai", label: "Mumbai" },
    { value: "pune", label: "Pune" },
    { value: "nagpur", label: "Nagpur" },
    { value: "thane", label: "Thane" },
    { value: "nashik", label: "Nashik" },
  ],
  tamil_nadu: [
    { value: "chennai", label: "Chennai" },
    { value: "coimbatore", label: "Coimbatore" },
    { value: "madurai", label: "Madurai" },
    { value: "tiruchirappalli", label: "Tiruchirappalli" },
    { value: "salem", label: "Salem" },
  ],
  delhi: [
    { value: "new_delhi", label: "New Delhi" },
    { value: "delhi", label: "Delhi" },
    { value: "noida", label: "Noida" },
    { value: "gurgaon", label: "Gurgaon" },
    { value: "faridabad", label: "Faridabad" },
  ],
  rajasthan: [
    { value: "jaipur", label: "Jaipur" },
    { value: "jodhpur", label: "Jodhpur" },
    { value: "udaipur", label: "Udaipur" },
    { value: "ajmer", label: "Ajmer" },
    { value: "bikaner", label: "Bikaner" },
  ],
  uttar_pradesh: [
    { value: "lucknow", label: "Lucknow" },
    { value: "kanpur", label: "Kanpur" },
    { value: "varanasi", label: "Varanasi" },
    { value: "agra", label: "Agra" },
    { value: "noida", label: "Noida" },
  ],
  gujarat: [
    { value: "ahmedabad", label: "Ahmedabad" },
    { value: "surat", label: "Surat" },
    { value: "vadodara", label: "Vadodara" },
    { value: "rajkot", label: "Rajkot" },
    { value: "bhavnagar", label: "Bhavnagar" },
  ],
  west_bengal: [
    { value: "kolkata", label: "Kolkata" },
    { value: "howrah", label: "Howrah" },
    { value: "durgapur", label: "Durgapur" },
    { value: "siliguri", label: "Siliguri" },
    { value: "asansol", label: "Asansol" },
  ],
  telangana: [
    { value: "hyderabad", label: "Hyderabad" },
    { value: "warangal", label: "Warangal" },
    { value: "nizamabad", label: "Nizamabad" },
    { value: "karimnagar", label: "Karimnagar" },
    { value: "ramagundam", label: "Ramagundam" },
  ],
  punjab: [
    { value: "chandigarh", label: "Chandigarh" },
    { value: "amritsar", label: "Amritsar" },
    { value: "ludhiana", label: "Ludhiana" },
    { value: "jalandhar", label: "Jalandhar" },
    { value: "patiala", label: "Patiala" },
  ],
  haryana: [
    { value: "gurgaon", label: "Gurgaon" },
    { value: "faridabad", label: "Faridabad" },
    { value: "rohtak", label: "Rohtak" },
    { value: "panipat", label: "Panipat" },
    { value: "ambala", label: "Ambala" },
  ],
  bihar: [
    { value: "patna", label: "Patna" },
    { value: "gaya", label: "Gaya" },
    { value: "bhagalpur", label: "Bhagalpur" },
    { value: "muzaffarpur", label: "Muzaffarpur" },
    { value: "purnia", label: "Purnia" },
  ],
  odisha: [
    { value: "bhubaneswar", label: "Bhubaneswar" },
    { value: "cuttack", label: "Cuttack" },
    { value: "rourkela", label: "Rourkela" },
    { value: "berhampur", label: "Berhampur" },
    { value: "sambalpur", label: "Sambalpur" },
  ],
  assam: [
    { value: "guwahati", label: "Guwahati" },
    { value: "dibrugarh", label: "Dibrugarh" },
    { value: "silchar", label: "Silchar" },
    { value: "jorhat", label: "Jorhat" },
    { value: "tezpur", label: "Tezpur" },
  ],
};

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

// Custom Autocomplete Component for Job Roles and Industry
const AutocompleteField = ({
  label,
  value,
  onChange,
  type,
  placeholder,
  icon: Icon,
}: {
  label: string;
  value: string[];
  onChange: (items: string[]) => void;
  type: "JOB_ROLE" | "INDUSTRY_TYPE";
  placeholder?: string;
  icon?: React.ElementType;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/company-master-data', {
        params: { type }
      });
      const data = response.data?.data || [];
      const values: string[] = data
        .map((item: any) => String(item.value))
        .filter((value: string) => value && value.trim() !== '');
      setOptions([...new Set(values)]);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(false);
    }
  }, [type]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter options based on input
  const filteredOptions = useMemo(() => {
    return options
      .filter((opt) =>
        opt.toLowerCase().includes(inputValue.toLowerCase())
      )
      .filter(
        (opt) =>
          !value.some(
            (selected) => selected.toLowerCase() === opt.toLowerCase()
          )
      )
      .sort();
  }, [options, inputValue, value]);

  const exactMatchExists = options.some(
    (opt) => opt.toLowerCase() === inputValue.toLowerCase()
  );

  // Add new item via API
  const handleAddNewItem = async (itemName: string) => {
    const trimmedItem = itemName.trim();
    if (!trimmedItem) return;

    try {
      setIsCreating(true);
      const response = await axiosInstance.post('/api/company-master-data', {
        type,
        value: trimmedItem
      });

      if (response?.data?.success) {
        const newData = response.data.data;
        const newValue = String(newData?.value || trimmedItem);
        setOptions((prev) => [...new Set([...prev, newValue])]);
        if (!value.includes(newValue)) {
          onChange([...value, newValue]);
        }
      }
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
      if (!value.includes(trimmedItem)) {
        onChange([...value, trimmedItem]);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelect = (item: string) => {
    if (!value.includes(item)) {
      onChange([...value, item]);
    }
    setInputValue("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleRemove = (item: string) => {
    onChange(value.filter((v) => v !== item));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const trimmed = inputValue.trim();
      const exists = options.some(
        (opt) => opt.toLowerCase() === trimmed.toLowerCase()
      );
      if (exists) {
        handleSelect(trimmed);
      } else {
        handleAddNewItem(trimmed);
      }
      setInputValue("");
    }
  };

  return (
    <div className="space-y-1.5" ref={dropdownRef}>
      <label className="text-xs font-medium text-gray-300">
        {label}
      </label>
      <div className="relative">
        <div className="flex min-h-11 flex-wrap gap-2 rounded-lg border border-[#2a3a52] bg-[#0f172a] p-2 transition focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
          {value.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-400"
            >
              {item}
              <button
                type="button"
                onClick={() => handleRemove(item)}
                className="hover:text-red-400 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={loading ? "Loading..." : placeholder}
            disabled={loading || isCreating}
            className="min-w-[120px] flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
          />
        </div>

        {(loading || isCreating) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-green-400" />
          </div>
        )}
      </div>

      {isOpen && (inputValue.length > 0 || filteredOptions.length > 0) && (
        <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-[#2a3a52] bg-[#111827] shadow-xl">
          {loading ? (
            <div className="flex items-center justify-center px-4 py-3 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading...
            </div>
          ) : filteredOptions.length > 0 ? (
            <>
              {filteredOptions.slice(0, 15).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-green-500/10 transition-colors border-b border-[#2a3a52] last:border-0"
                >
                  {item}
                </button>
              ))}
              {inputValue.trim() && !exactMatchExists && (
                <button
                  type="button"
                  onClick={() => handleAddNewItem(inputValue)}
                  disabled={isCreating}
                  className="w-full px-4 py-2.5 text-left text-sm text-green-400 hover:bg-green-500/10 transition-colors flex items-center gap-2 border-t border-[#2a3a52]"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create "{inputValue}"
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400">
              {inputValue.length > 0 ? (
                <button
                  type="button"
                  onClick={() => handleAddNewItem(inputValue)}
                  disabled={isCreating}
                  className="text-green-400 hover:text-green-300 flex items-center gap-2 w-full"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create "{inputValue}"
                    </>
                  )}
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400">Type to search...</p>
                  <p className="text-xs text-gray-500 mt-1">No items found</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Location Selector Component - Only State and City
const LocationSelector = ({
  locations,
  onChange,
}: {
  locations: string[];
  onChange: (items: string[]) => void;
}) => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Get available cities based on selected state
  const availableCities = selectedState ? citiesByState[selectedState] || [] : [];

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity("");
  };

  const handleAddLocation = () => {
    let locationParts = [];
    if (selectedCity) locationParts.push(selectedCity);
    // if (selectedState) locationParts.push(selectedState);
    
    const locationString = locationParts.join(", ");
    if (locationString && !locations.includes(locationString)) {
      onChange([...locations, locationString]);
    }
    
    // Reset selections after adding
    setSelectedState("");
    setSelectedCity("");
  };

  const removeLocation = (item: string) => {
    onChange(locations.filter((v) => v !== item));
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-300">Locations</label>
      
      {/* Selected Locations */}
      {locations.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {locations.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400"
            >
              {item}
              <button
                type="button"
                onClick={() => removeLocation(item)}
                className="hover:text-red-400 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Location Selection Dropdowns - State and City only */}
      <div className="grid grid-cols-2 gap-2">
        {/* State */}
        <select
          value={selectedState}
          onChange={(e) => handleStateChange(e.target.value)}
          className="h-10 rounded-lg border border-[#2a3a52] bg-[#0f172a] px-3 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state.value} value={state.value}>
              {state.label}
            </option>
          ))}
        </select>

        {/* City */}
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedState}
          className="h-10 rounded-lg border border-[#2a3a52] bg-[#0f172a] px-3 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Select City</option>
          {availableCities.map((city) => (
            <option key={city.value} value={city.value}>
              {city.label}
            </option>
          ))}
        </select>
      </div>

      {/* Add Button */}
      <button
        type="button"
        onClick={handleAddLocation}
        disabled={!selectedState}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-green-500/30 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/10 hover:border-green-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Location
      </button>
    </div>
  );
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
  currentSalaryCurrency = "INR",
  currentSalaryAmount = "",
  expectedSalaryCurrency = "INR",
  expectedSalaryAmount = "",
  onUpdate,
  roleOptions = [],
  industryOptions = [],
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
    useState<string>(currentSalaryCurrency || "INR");

  const [localExpectedSalaryCurrency, setLocalExpectedSalaryCurrency] =
    useState<string>(expectedSalaryCurrency || "INR");

  const [isCurrentCurrencyOpen, setIsCurrentCurrencyOpen] = useState(false);
  const [isExpectedCurrencyOpen, setIsExpectedCurrencyOpen] = useState(false);

  const [selectedEmploymentType, setSelectedEmploymentType] = useState<string>(
    normalizeEmploymentType(employmentType?.[0]) || "",
  );

  // Sync shift preferences from props without causing infinite loop
  useEffect(() => {
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
        setLocalCurrentSalaryCurrency(currentSalaryCurrency || "INR");
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
        setLocalExpectedSalaryCurrency(expectedSalaryCurrency || "INR");
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
    } else {
      setLocalExpectedSalaryAmount(numericValue);
      onUpdate("expectedSalaryAmount", numericValue);
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
    } else {
      setLocalExpectedSalaryCurrency(value);
      onUpdate("expectedSalaryCurrency", value);
      setIsExpectedCurrencyOpen(false);
    }
    
    setTimeout(() => {
      isUpdatingFromUser.current = false;
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/20">
          <Briefcase className="h-5 w-5 text-green-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Job Preferences</h3>
          <p className="text-xs text-gray-400">Set your job preferences and expectations</p>
        </div>
      </div> */}

      {/* Salary Fields */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Current Salary */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-300">
            Current Salary
          </label>
          <div className="flex h-11 w-full items-center rounded-lg border border-[#2a3a52] bg-[#0f172a] px-3 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsCurrentCurrencyOpen((prev) => !prev);
                  setIsExpectedCurrencyOpen(false);
                }}
                className="flex items-center gap-1 text-sm font-bold text-green-400 transition hover:text-green-300"
              >
                <span>{getCurrencySymbol(localCurrentSalaryCurrency)}</span>
                <ChevronDown
                  className={`h-3 w-3 transition-transform ${
                    isCurrentCurrencyOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCurrentCurrencyOpen && (
                <div className="absolute left-0 top-full z-50 mt-1 min-w-[120px] overflow-hidden rounded-lg border border-[#2a3a52] bg-[#111827] shadow-xl">
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
                      className={`w-full px-3 py-2 text-left text-sm transition hover:bg-green-500/10 ${
                        localCurrentSalaryCurrency === option.value
                          ? "bg-green-500/10 text-green-400"
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
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Expected Salary */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-300">
            Expected Salary
          </label>
          <div className="flex h-11 w-full items-center rounded-lg border border-[#2a3a52] bg-[#0f172a] px-3 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsExpectedCurrencyOpen((prev) => !prev);
                  setIsCurrentCurrencyOpen(false);
                }}
                className="flex items-center gap-1 text-sm font-bold text-green-400 transition hover:text-green-300"
              >
                <span>{getCurrencySymbol(localExpectedSalaryCurrency)}</span>
                <ChevronDown
                  className={`h-3 w-3 transition-transform ${
                    isExpectedCurrencyOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isExpectedCurrencyOpen && (
                <div className="absolute left-0 top-full z-50 mt-1 min-w-[120px] overflow-hidden rounded-lg border border-[#2a3a52] bg-[#111827] shadow-xl">
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
                      className={`w-full px-3 py-2 text-left text-sm transition hover:bg-green-500/10 ${
                        localExpectedSalaryCurrency === option.value
                          ? "bg-green-500/10 text-green-400"
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
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Shift Preferences */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-300">
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
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                  isSelected
                    ? "border-green-500/50 bg-green-500/10 text-green-400"
                    : "border-[#2a3a52] bg-[#0f172a] text-gray-400 hover:border-green-500/30 hover:text-white"
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
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-300">
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
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                  isSelected
                    ? "border-green-500/50 bg-green-500/10 text-green-400"
                    : "border-[#2a3a52] bg-[#0f172a] text-gray-400 hover:border-green-500/30 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Job Roles - Using API */}
      <AutocompleteField
        label="Job Roles"
        value={jobRoles}
        onChange={(items: string[]) => onUpdate("jobRoles", items)}
        type="JOB_ROLE"
        placeholder="Search or type job role..."
        icon={Search}
      />

      {/* Industry - Using API */}
      <AutocompleteField
        label="Industry"
        value={industry}
        onChange={(items: string[]) => onUpdate("industry", items)}
        type="INDUSTRY_TYPE"
        placeholder="Search or type industry..."
        icon={Building2}
      />

      {/* Looking For */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-300">
          Looking For
        </label>
        <div className="flex flex-wrap gap-2">
          {lookingForOptions.map((option) => {
            const isSelected = lookingFor.includes(option.value);

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  const updated = isSelected
                    ? lookingFor.filter((v) => v !== option.value)
                    : [...lookingFor, option.value];
                  onUpdate("lookingFor", updated);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                  isSelected
                    ? "border-green-500/50 bg-green-500/10 text-green-400"
                    : "border-[#2a3a52] bg-[#0f172a] text-gray-400 hover:border-green-500/30 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Locations - Using Location Selector */}
      <LocationSelector
        locations={locations}
        onChange={(items: string[]) => onUpdate("locations", items)}
      />
    </div>
  );
}