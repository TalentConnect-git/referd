"use client";

import Select from "react-select";
import { City } from "country-state-city";
import { Calendar } from "lucide-react";
import { BasicJobDetailsProps } from "@/types/dashboard";


const cities =
  (City.getCitiesOfCountry("IN") || []).map((city) => ({
    value: city.name,
    label: city.name,
  }));

export default function BasicJobDetailsSection({
  formData,
  handleChange,
  invalidFields
}: BasicJobDetailsProps) {
    
    const currentYear = new Date().getFullYear();
    const batchYears = Array.from({ length: currentYear + 5 - 1980 + 1 },(_, i) => 1980 + i);
    const batchYearOptions = batchYears.map((year) => ({value: year.toString(),label: year.toString(),}));



  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
 

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* <input
          type="number"
          name="cgpa"
          min="0"
          value={formData.cgpa}
          onChange={handleChange}
          placeholder="Minimum CGPA"
          className="rounded-xl border border-[#334155] bg-[#0f172a] p-3 text-white"
        /> */}
        <div>
  <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-white">
    Minimum CGPA
  </label>

  <input
    type="number"
    name="cgpa"
    min="0"
    value={formData.cgpa}
    onChange={handleChange}
    placeholder="e.g. 7.5"
    className="w-full rounded-xl border border-[#334155] bg-[#0f172a] p-3 text-white"
  />

  <p className="mt-1 text-xs text-gray-400">
    Leave blank if no CGPA requirement
  </p>
</div>

      <div>
      <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-white">
        Eligible Batch Years
      </label>



  <Select
  options={batchYearOptions}
  placeholder="Select Batch Year"
  value={
    batchYearOptions.find(
      (option) => option.value === formData.batchYear
    ) || null
  }
  onChange={(selected) =>
    handleChange({
      target: {
        name: "batchYear",
        value: selected?.value || "",
      },
    } as any)
  }
  styles={{
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#0f172a",
      borderColor: state.isFocused
        ? "#22c55e"
        : "#334155",
      borderRadius: "12px",
      minHeight: "52px",
      boxShadow: "none",
      color: "white",
    }),

    input: (provided) => ({
      ...provided,
      color: "white",
    }),

    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),

    placeholder: (provided) => ({
      ...provided,
      color: "#94a3b8",
    }),

    menu: (provided) => ({
      ...provided,
      backgroundColor: "#0f172a",
      border: "1px solid #334155",
      borderRadius: "12px",
      zIndex: 9999,
      maxHeight: "250px",
      overflowY: "auto",
    }),

    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "#22c55e"
        : "#0f172a",
      color: state.isFocused
        ? "#000"
        : "#fff",
      cursor: "pointer",
    }),

    dropdownIndicator: (provided) => ({
      ...provided,
      color: "white",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),
  }}
/>

      <p className="mt-1 text-xs text-gray-400">
        4-digit years only
      </p>
    </div>




  <div>
  <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-white">
    Employment Type *
  </label>

  <select
    name="employmentType"
    value={formData.employmentType}
    onChange={handleChange}
    className={`w-full rounded-xl bg-[#0f172a] p-3 text-white ${
      invalidFields.includes("employmentType")
        ? "border border-red-500"
        : "border border-[#334155]"
    }`}
  >
    <option value="">Employment Type</option>
    <option value="Full-time">Full-time</option>
    <option value="Part-time">Part-time</option>
    <option value="Contract">Contract</option>
  </select>
</div>


  <div>
  <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-white">
    Last Date To Apply *
  </label>


  <div
  className={`relative rounded-xl ${
    invalidFields.includes("endDate")
      ? "border border-red-500"
      : "border border-[#334155]"
  }`}
>
  <Calendar
    size={18}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
  />

  <input
    type="date"
    name="endDate"
    value={formData.endDate}
    onChange={handleChange}
    style={{ colorScheme: "dark" }}
    className="w-full rounded-xl bg-[#0f172a] py-3 pl-10 pr-3 text-white outline-none"
  />
</div>

</div>


        <div>
          <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-white">
          Job Title *
          </label>
        <input
          type="text"
          name="jobTitle"
          placeholder="Senior Software Developer/IOS Developer etc.."
          value={formData.jobTitle}
          onChange={handleChange}
          className={`w-full rounded-xl bg-[#0f172a] p-3 text-white ${
        invalidFields.includes("jobTitle")
        ? "border border-red-500"
        : "border border-[#334155]"
      }`}
          required
        />
        </div>


       <div>
         <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-white">
          Work Mode *
        </label>
        <select
          name="workMode"
          value={formData.workMode}
          onChange={handleChange}
          required
          className={`w-full rounded-xl bg-[#0f172a] p-3 text-white ${
  invalidFields.includes("workMode")
    ? "border border-red-500"
    : "border border-[#334155]"
}`}
        >
          <option value="On-site">On-site</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
        </select>
       </div>




<div className="md:col-span-2">
  <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-white">
  Location *
</label>

  <Select
  options={cities}
  placeholder="Search Location..."
  value={
    cities.find(
      (city) => city.value === formData.location
    ) || null
  }
  onChange={(selected) =>
    handleChange({
      target: {
        name: "location",
        value: selected?.value || "",
      },
    } as any)
  }
  styles={{
    control: (provided, state) => ({

    ...provided,

    backgroundColor: "#0f172a",

    borderColor: invalidFields.includes("location")
  ? "#ef4444"
  : state.isFocused
  ? "#22c55e"
  : "#334155",

    borderRadius: "12px",
    minHeight: "52px",
    boxShadow: "none",
    color: "white",

  }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#94a3b8",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#0f172a",
      border: "1px solid #334155",
      borderRadius: "12px",
      overflow: "hidden",
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "#22c55e"
        : "#0f172a",
      color: state.isFocused
        ? "#000"
        : "#fff",
      cursor: "pointer",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "white",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),
  }}
/>
</div>

    <div className="md:col-span-2 rounded-xl border border-[#334155] bg-[#0f172a] p-5">
  <label className="mb-3 block text-sm font-medium uppercase tracking-wide text-white">
    Broadcast Options *
  </label>

  <div className="flex flex-wrap gap-8">
    <label className="flex cursor-pointer items-center gap-3 text-white">
      <input
        type="radio"
        name="broadcastType"
        value="Everyone"
        checked={formData.broadcastType === "Everyone"}
        onChange={handleChange}
        className="h-4 w-4 accent-green-500"
        required
      />
      <span>Broadcast to Everyone</span>
    </label>

    <label className="flex cursor-pointer items-center gap-3 text-white">
      <input
        type="radio"
        name="broadcastType"
        value="Location"
        checked={formData.broadcastType === "Location"}
        onChange={handleChange}
        className="h-4 w-4 accent-green-500"
      />
      <span>Broadcast by Location</span>
    </label>
  </div>

  <p className="mt-3 text-sm text-gray-400">
    Select "Broadcast by Location" to show this referral only to candidates in the selected locations.
  </p>
</div>

       {/* PACKAGE DETAILS */}
<div className="md:col-span-2">
  <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-white">
    Package Details (CTC) *
  </label>

  <div
  className={`flex overflow-hidden rounded-xl ${
    invalidFields.includes("totalCTC")
      ? "border border-red-500"
      : "border border-[#334155]"
  }`}
>
    <select className="w-32 border-r border-[#334155] bg-[#0f172a] px-3 text-white outline-none">
      <option value="INR">₹ INR</option>
      <option value="USD">$ USD</option>
      <option value="EUR">€ EUR</option>
    </select>

    <input
      type="number"
      min="0"
      name="totalCTC"
      value={formData.totalCTC}
      onChange={handleChange}
      placeholder="Total CTC"
      className="flex-1 bg-[#0f172a] p-3 text-white outline-none"
    />
  </div>
</div>

{/* FIXED PAY + JOINING BONUS */}
<input
  type="number"
  name="fixedPay"
  value={formData.fixedPay}
  onChange={handleChange}
  placeholder="Fixed Pay (optional)"
  className="rounded-xl border border-[#334155] bg-[#0f172a] p-3 text-white"
/>

<input
  type="number"
  name="joiningBonus"
  value={formData.joiningBonus}
  onChange={handleChange}
  placeholder="Joining Bonus (optional)"
  className="rounded-xl border border-[#334155] bg-[#0f172a] p-3 text-white"
/>

{/* OPENINGS */}
<div>
  <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-white">
    No. Of Openings *
  </label>

  <input
    type="number"
    min="1"
    name="numberOfOpenings"
    value={formData.numberOfOpenings}
    onChange={handleChange}
    placeholder="e.g. 5"
    className={`w-full rounded-xl bg-[#0f172a] p-3 text-white ${
  invalidFields.includes("numberOfOpenings")
    ? "border border-red-500"
    : "border border-[#334155]"
}`} />
</div>

{/* DESCRIPTION */}
<div>
  <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-white">
    Job Description *
  </label>

  <textarea
    rows={4}
    maxLength={500}
    name="description"
    value={formData.description}
    onChange={handleChange}
    placeholder="Describe job responsibilities and requirements..."
    className={`w-full rounded-xl bg-[#0f172a] p-3 text-white ${
  invalidFields.includes("description")
    ? "border border-red-500"
    : "border border-[#334155]"
}`}
  />

  <p className="mt-1 text-right text-xs text-gray-400">
    {formData.description.length}/500
  </p>
</div>
      </div>
    </div>
  );
}