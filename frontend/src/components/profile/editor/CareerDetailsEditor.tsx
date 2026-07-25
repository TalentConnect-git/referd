import { useState, useEffect } from "react";
import { TextInput } from "../shared/TextInput";
import { SelectInput } from "../shared/SelectInput";
import { CheckboxInput } from "../shared/CheckboxInput";
import { Lock, Edit2, Briefcase, Mail, Calendar, DollarSign, Clock, Shield } from "lucide-react";
import type { Option, Experience } from "@/types/profile";

const currencyOptions = [
  { value: "INR", label: "₹ INR", symbol: "₹" },
  { value: "USD", label: "$ USD", symbol: "$" },
  { value: "EUR", label: "€ EUR", symbol: "€" },
  { value: "GBP", label: "£ GBP", symbol: "£" },
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
  currentSalaryCurrency = "INR",
  currentSalaryAmount = "",
  onUpdate,
  experiences = [],
}: CareerDetailsEditorProps) {
  const currentJob = experiences.find((exp) => exp.isCurrent === true);
  const companyFromExperience = currentJob?.company || currentJob?.organization || "";
  const displayCompany = currentCompany_display || companyFromExperience || currentCompany || "";

  const [isCurrentCurrencyOpen, setIsCurrentCurrencyOpen] = useState(false);
  
  // Local state for serving notice period
  const [localServingNotice, setLocalServingNotice] = useState<boolean>(servingNoticePeriod || false);
  const [localNoticeStartDate, setLocalNoticeStartDate] = useState<string>(noticePeriodStartDate || "");
  
  // Local state for notice period with lock functionality
  const [localNoticePeriod, setLocalNoticePeriod] = useState<string>(noticePeriod || "");
  const [isNoticePeriodLocked, setIsNoticePeriodLocked] = useState<boolean>(Boolean(noticePeriod));

  // Sync with props
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
    const numericValue = value.replace(/[^0-9]/g, "");
    setLocalNoticePeriod(numericValue);
    onUpdate("noticePeriod", numericValue);
    
    if (numericValue) {
      setIsNoticePeriodLocked(true);
    }
  };

  const handleUnlockNoticePeriod = () => {
    setIsNoticePeriodLocked(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Current Company - Locked/Read-only */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
            <Briefcase className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            Current Company
          </label>
          <div className="flex h-11 w-full items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background-soft)] px-4 text-sm text-[var(--text-secondary)]">
            <span>{displayCompany || "Not currently employed"}</span>
            <Lock className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          </div>
          <p className="text-[10px] text-[var(--text-muted)]">
            Auto-detected from your experience section
          </p>
        </div>

        {/* Company Email */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
            <Mail className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            Company Email
          </label>
          <input
            type="email"
            value={companyEmail}
            onChange={(e) => onUpdate("companyEmail", e.target.value)}
            placeholder="yourname@company.com"
            className="input-field h-11"
          />
        </div>

        {/* Total Years of Experience */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
            <Clock className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            Total Years of Experience
          </label>
          <select
            value={totalYearsOfExperience}
            onChange={(e) => onUpdate("totalYearsOfExperience", e.target.value)}
            className="select-field h-11"
          >
            <option value="">Select experience</option>
            {[
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
            ].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        {/* Notice Period - Manual Input with Lock */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
            <Shield className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            Notice Period (days)
          </label>
          <div className="flex h-11 w-full items-center rounded-lg border border-[var(--border)] bg-[var(--background-soft)] px-4 focus-within:border-[var(--primary)] focus-within:ring-1 focus-within:ring-[var(--primary)]">
            <input
              type="text"
              value={localNoticePeriod}
              onChange={(e) => handleNoticePeriodChange(e.target.value)}
              placeholder="e.g., 30, 60, 90"
              disabled={isNoticePeriodLocked}
              className={`w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] ${
                isNoticePeriodLocked ? "cursor-not-allowed opacity-70" : ""
              }`}
            />
            {isNoticePeriodLocked ? (
              <button
                type="button"
                onClick={handleUnlockNoticePeriod}
                className="ml-2 rounded-lg p-1 text-[var(--text-muted)] transition hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]"
                title="Unlock to edit"
              >
                <Lock className="h-3.5 w-3.5" />
              </button>
            ) : (
              localNoticePeriod && (
                <button
                  type="button"
                  onClick={() => setIsNoticePeriodLocked(true)}
                  className="ml-2 rounded-lg p-1 text-[var(--text-muted)] transition hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]"
                  title="Lock to prevent changes"
                >
                  <Lock className="h-3.5 w-3.5" />
                </button>
              )
            )}
          </div>
          <p className="text-[10px] text-[var(--text-muted)]">
            {isNoticePeriodLocked 
              ? "🔒 Locked - Click lock icon to edit" 
              : "Enter number of days"}
          </p>
        </div>
      </div>

      {/* Serving Notice Period Toggle */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--background-soft)] p-4 space-y-4">
        <div className="flex items-center gap-3">
          <CheckboxInput
            label="Currently serving notice period"
            checked={localServingNotice}
            onChange={(checked: boolean) => handleServingNoticeToggle(checked)}
          />
        </div>

        {/* Notice Period Start Date - Only show when serving notice */}
        {localServingNotice && (
          <div className="border-t border-[var(--border)] pt-3">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                <Calendar className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                Notice Period Start Date
              </label>
              <input
                type="date"
                value={localNoticeStartDate}
                onChange={(e) => handleNoticeStartDateChange(e.target.value)}
                className="input-field h-11"
              />
              <p className="text-[10px] text-[var(--text-muted)]">
                Select the date when your notice period started
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Salary Details */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <div className="rounded-lg border border-[var(--primary-border)] bg-[var(--primary-soft)] p-1">
            <DollarSign className="h-4 w-4 text-[var(--primary)]" />
          </div>
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">Current Salary</h4>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Currency */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Currency
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCurrentCurrencyOpen(!isCurrentCurrencyOpen)}
                className="flex h-11 w-full items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background-soft)] px-4 text-sm text-[var(--text-primary)] transition-colors hover:border-[var(--primary-border)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              >
                <span>
                  {currencyOptions.find(c => c.value === currentSalaryCurrency)?.label || "₹ INR"}
                </span>
                <svg
                  className={`h-4 w-4 transition-transform text-[var(--text-muted)] ${
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
                <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-xl">
                  {currencyOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        handleSalaryCurrencyChange(option.value);
                        setIsCurrentCurrencyOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition hover:bg-[var(--primary-soft)] ${
                        currentSalaryCurrency === option.value
                          ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                          : "text-[var(--text-primary)]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Amount
            </label>
            <div className="flex h-11 w-full items-center rounded-lg border border-[var(--border)] bg-[var(--background-soft)] px-4 focus-within:border-[var(--primary)] focus-within:ring-1 focus-within:ring-[var(--primary)]">
              <span className="mr-2 text-sm font-semibold text-[var(--primary)]">
                {getCurrencySymbol(currentSalaryCurrency)}
              </span>
              <input
                type="text"
                value={currentSalaryAmount}
                onChange={(e) => handleSalaryAmountChange(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}