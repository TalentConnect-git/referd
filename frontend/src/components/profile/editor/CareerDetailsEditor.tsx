import { useState, useEffect } from "react";
import { TextInput } from "../shared/TextInput";
import { SelectInput } from "../shared/SelectInput";
import { CheckboxInput } from "../shared/CheckboxInput";
import { Lock, Edit2 } from "lucide-react";
import type { Option, Experience } from "@/types/profile";

const currencyOptions = [
  { value: "₹", label: "₹ INR", symbol: "₹" },
  { value: "$", label: "$ USD", symbol: "$" },
  { value: "€", label: "€ EUR", symbol: "€" },
  { value: "£", label: "£ GBP", symbol: "£" },
];

type CareerDetailsEditorProps = {
  currentCompany: string;
  currentCompany_display?: string;
  companyEmail: string;
  totalYearsOfExperience: string;
  noticePeriod: string;
  noticePeriodStartDate?: string;
  servingNoticePeriod?: boolean;
  currentSalaryCurrency?: string;
  currentSalaryAmount?: string;
  onUpdate: (field: string, value: string | boolean) => void;
  experiences?: Experience[];
};

export function CareerDetailsEditor({
  currentCompany,
  currentCompany_display = "",
  companyEmail,
  totalYearsOfExperience,
  noticePeriod,
  noticePeriodStartDate = "",
  servingNoticePeriod = false,
  currentSalaryCurrency = "₹",
  currentSalaryAmount = "",
  onUpdate,
  experiences = [],
}: CareerDetailsEditorProps) {
  const currentJob = experiences.find((exp) => exp.isCurrent === true);
  const companyFromExperience = currentJob?.company || currentJob?.organization || "";
  const displayCompany = currentCompany_display || companyFromExperience || currentCompany || "";

  const [isCurrentCurrencyOpen, setIsCurrentCurrencyOpen] = useState(false);
  
  // Local state for serving notice period to handle toggle properly
  const [localServingNotice, setLocalServingNotice] = useState<boolean>(servingNoticePeriod || false);
  const [localNoticeStartDate, setLocalNoticeStartDate] = useState<string>(noticePeriodStartDate || "");
  
  // Local state for notice period with lock functionality
  const [localNoticePeriod, setLocalNoticePeriod] = useState<string>(noticePeriod || "");
  const [isNoticePeriodLocked, setIsNoticePeriodLocked] = useState<boolean>(Boolean(noticePeriod));

  // Sync with props when they change
  useEffect(() => {
    setLocalServingNotice(servingNoticePeriod || false);
  }, [servingNoticePeriod]);

  useEffect(() => {
    setLocalNoticeStartDate(noticePeriodStartDate || "");
  }, [noticePeriodStartDate]);

  useEffect(() => {
    setLocalNoticePeriod(noticePeriod || "");
    setIsNoticePeriodLocked(Boolean(noticePeriod));
  }, [noticePeriod]);

  const getCurrencySymbol = (currencyValue: string) => {
    return (
      currencyOptions.find((item) => item.value === currencyValue)?.symbol || "₹"
    );
  };

  const handleServingNoticeToggle = (checked: boolean) => {
    setLocalServingNotice(checked);
    onUpdate("servingNoticePeriod", checked);
    
    if (!checked) {
      setLocalNoticeStartDate("");
      onUpdate("noticePeriodStartDate", "");
    }
  };

  const handleNoticeStartDateChange = (value: string) => {
    setLocalNoticeStartDate(value);
    onUpdate("noticePeriodStartDate", value);
  };

  const handleSalaryAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    onUpdate("currentSalaryAmount", numericValue);
  };

  const handleSalaryCurrencyChange = (value: string) => {
    onUpdate("currentSalaryCurrency", value);
  };

  const handleNoticePeriodChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");
    setLocalNoticePeriod(numericValue);
    onUpdate("noticePeriod", numericValue);
    
    // Lock the field once value is entered
    if (numericValue) {
      setIsNoticePeriodLocked(true);
    }
  };

  const handleUnlockNoticePeriod = () => {
    setIsNoticePeriodLocked(false);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Current Company - Locked/Read-only */}
        <div>
          <label className="mb-2 block text-[12px] font-semibold text-[var(--text-primary)]">
            Current Company
          </label>
          <div className="flex h-12 w-full items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-[14px] text-white/70">
            <span>{displayCompany || "Not currently employed"}</span>
            <Lock className="h-4 w-4 text-[var(--text-muted)]" />
          </div>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Auto-detected from your experience section
          </p>
        </div>

        {/* Company Email */}
        <TextInput
          label="Company Email"
          value={companyEmail}
          onChange={(value: string) => onUpdate("companyEmail", value)}
          placeholder="yourname@company.com"
          type="email"
        />

        {/* Total Years of Experience - Select */}
        <SelectInput
          label="Total Years of Experience"
          value={totalYearsOfExperience}
          options={[
            "Fresher",
            "Less than 1 year",
            "1 year",
            "2 years",
            "3 years",
            "4 years",
            "5 years",
            "6 years",
            "7 years",
            "8 years",
            "9 years",
            "10+ years",
          ].map((value: string) => ({
            value,
            label: value,
          }))}
          allowCustom
          onChange={(value: string) => onUpdate("totalYearsOfExperience", value)}
          placeholder="Select total experience"
        />

        {/* Notice Period - Manual Input with Lock */}
        <div>
          <label className="mb-2 block text-[12px] font-semibold text-[var(--text-primary)]">
            Notice Period (days)
          </label>
          <div className="flex h-12 w-full items-center rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 focus-within:border-[var(--primary)]">
            <input
              type="text"
              value={localNoticePeriod}
              onChange={(e) => handleNoticePeriodChange(e.target.value)}
              placeholder="Enter notice period in days"
              disabled={isNoticePeriodLocked}
              className={`w-full bg-transparent text-[14px] text-white outline-none placeholder:text-[var(--text-muted)] ${
                isNoticePeriodLocked ? "cursor-not-allowed opacity-70" : ""
              }`}
            />
            {isNoticePeriodLocked ? (
              <button
                type="button"
                onClick={handleUnlockNoticePeriod}
                className="ml-2 rounded-lg p-1 text-[var(--text-muted)] transition hover:bg-[var(--card-hover)] hover:text-white"
                title="Unlock to edit"
              >
                <Lock className="h-4 w-4" />
              </button>
            ) : (
              localNoticePeriod && (
                <button
                  type="button"
                  onClick={() => {
                    setIsNoticePeriodLocked(true);
                  }}
                  className="ml-2 rounded-lg p-1 text-[var(--text-muted)] transition hover:bg-[var(--card-hover)] hover:text-white"
                  title="Lock to prevent changes"
                >
                  <Lock className="h-4 w-4" />
                </button>
              )
            )}
          </div>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            {isNoticePeriodLocked 
              ? "🔒 Locked - Click lock icon to edit" 
              : "Enter number of days"}
          </p>
        </div>
      </div>

      {/* Serving Notice Period Toggle */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <CheckboxInput
            label="Currently serving notice period"
            checked={localServingNotice}
            onChange={(checked: boolean) => handleServingNoticeToggle(checked)}
          />
        </div>

        {/* Notice Period Start Date - Only show when serving notice */}
        {localServingNotice && (
          <div className="md:col-span-2">
            <TextInput
              label="Notice Period Start Date"
              type="date"
              value={localNoticeStartDate}
              onChange={(value: string) => handleNoticeStartDateChange(value)}
              placeholder="Select notice period start date"
            />
            <p className="mt-1 text-[11px] text-[var(--text-muted)]">
              Select the date when your notice period started
            </p>
          </div>
        )}
      </div>

      {/* Salary Details - Only Current Salary */}
      <div className="mt-4">
        <h4 className="mb-3 text-[14px] font-semibold text-white">Current Salary</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[var(--text-primary)]">
              Currency
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCurrentCurrencyOpen(!isCurrentCurrencyOpen)}
                className="flex h-12 w-full items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-[14px] text-white outline-none transition-colors hover:border-[var(--primary)] focus:border-[var(--primary)]"
              >
                <span>
                  {currencyOptions.find(c => c.value === currentSalaryCurrency)?.label || "₹ INR"}
                </span>
                <svg
                  className={`h-4 w-4 transition-transform ${
                    isCurrentCurrencyOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isCurrentCurrencyOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-xl">
                  {currencyOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        handleSalaryCurrencyChange(option.value);
                        setIsCurrentCurrencyOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-[14px] transition hover:bg-[var(--card-hover)] ${
                        currentSalaryCurrency === option.value
                          ? "bg-[var(--card-hover)] text-[var(--primary)]"
                          : "text-white"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[var(--text-primary)]">
              Amount
            </label>
            <div className="flex h-12 w-full items-center rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 focus-within:border-[var(--primary)]">
              <span className="mr-2 text-[14px] font-bold text-[var(--primary)]">
                {getCurrencySymbol(currentSalaryCurrency)}
              </span>
              <input
                type="text"
                value={currentSalaryAmount}
                onChange={(e) => handleSalaryAmountChange(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-transparent text-[14px] text-white outline-none placeholder:text-[var(--text-muted)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}