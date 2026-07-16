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
      {/* Header */}
      

      <div className="grid gap-4 md:grid-cols-2">
        {/* Current Company - Locked/Read-only */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-gray-500" />
            Current Company
          </label>
          <div className="flex h-11 w-full items-center justify-between rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 text-sm text-gray-300">
            <span>{displayCompany || "Not currently employed"}</span>
            <Lock className="h-3.5 w-3.5 text-gray-500" />
          </div>
          <p className="text-[10px] text-gray-500">
            Auto-detected from your experience section
          </p>
        </div>

        {/* Company Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-gray-500" />
            Company Email
          </label>
          <input
            type="email"
            value={companyEmail}
            onChange={(e) => onUpdate("companyEmail", e.target.value)}
            placeholder="yourname@company.com"
            className="w-full h-11 rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 text-sm text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        {/* Total Years of Experience */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-gray-500" />
            Total Years of Experience
          </label>
          <select
            value={totalYearsOfExperience}
            onChange={(e) => onUpdate("totalYearsOfExperience", e.target.value)}
            className="w-full h-11 rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 text-sm text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
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
          <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-gray-500" />
            Notice Period (days)
          </label>
          <div className="flex h-11 w-full items-center rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
            <input
              type="text"
              value={localNoticePeriod}
              onChange={(e) => handleNoticePeriodChange(e.target.value)}
              placeholder="e.g., 30, 60, 90"
              disabled={isNoticePeriodLocked}
              className={`w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500 ${
                isNoticePeriodLocked ? "cursor-not-allowed opacity-70" : ""
              }`}
            />
            {isNoticePeriodLocked ? (
              <button
                type="button"
                onClick={handleUnlockNoticePeriod}
                className="ml-2 rounded-lg p-1 text-gray-500 transition hover:bg-[#2a3a52] hover:text-white"
                title="Unlock to edit"
              >
                <Lock className="h-3.5 w-3.5" />
              </button>
            ) : (
              localNoticePeriod && (
                <button
                  type="button"
                  onClick={() => setIsNoticePeriodLocked(true)}
                  className="ml-2 rounded-lg p-1 text-gray-500 transition hover:bg-[#2a3a52] hover:text-white"
                  title="Lock to prevent changes"
                >
                  <Lock className="h-3.5 w-3.5" />
                </button>
              )
            )}
          </div>
          <p className="text-[10px] text-gray-500">
            {isNoticePeriodLocked 
              ? "🔒 Locked - Click lock icon to edit" 
              : "Enter number of days"}
          </p>
        </div>
      </div>

      {/* Serving Notice Period Toggle */}
      <div className="rounded-lg border border-[#2a3a52] bg-[#0f172a] p-4 space-y-4">
        <div className="flex items-center gap-3">
          <CheckboxInput
            label="Currently serving notice period"
            checked={localServingNotice}
            onChange={(checked: boolean) => handleServingNoticeToggle(checked)}
          />
        </div>

        {/* Notice Period Start Date - Only show when serving notice */}
        {localServingNotice && (
          <div className="pt-3 border-t border-[#2a3a52]">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-gray-500" />
                Notice Period Start Date
              </label>
              <input
                type="date"
                value={localNoticeStartDate}
                onChange={(e) => handleNoticeStartDateChange(e.target.value)}
                className="w-full h-11 rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <p className="text-[10px] text-gray-500">
                Select the date when your notice period started
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Salary Details */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1 rounded-lg bg-green-500/10 border border-green-500/20">
            <DollarSign className="h-4 w-4 text-green-400" />
          </div>
          <h4 className="text-sm font-semibold text-white">Current Salary</h4>
          <div className="flex-1 h-px bg-[#2a3a52]" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Currency */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">
              Currency
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCurrentCurrencyOpen(!isCurrentCurrencyOpen)}
                className="flex h-11 w-full items-center justify-between rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 text-sm text-white transition-colors hover:border-green-500/50 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                <span>
                  {currencyOptions.find(c => c.value === currentSalaryCurrency)?.label || "₹ INR"}
                </span>
                <svg
                  className={`h-4 w-4 transition-transform text-gray-500 ${
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
                <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-lg border border-[#2a3a52] bg-[#111827] shadow-xl">
                  {currencyOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        handleSalaryCurrencyChange(option.value);
                        setIsCurrentCurrencyOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition hover:bg-green-500/10 ${
                        currentSalaryCurrency === option.value
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
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">
              Amount
            </label>
            <div className="flex h-11 w-full items-center rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
              <span className="mr-2 text-sm font-semibold text-green-400">
                {getCurrencySymbol(currentSalaryCurrency)}
              </span>
              <input
                type="text"
                value={currentSalaryAmount}
                onChange={(e) => handleSalaryAmountChange(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}