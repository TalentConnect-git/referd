"use client";
import { SelectionCriteriaProps } from "@/types/dashboard";
import CreatableSelect from "react-select/creatable";

export default function SelectionCriteriaSection({
  formData,
  handleChange,
}: SelectionCriteriaProps) {


  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

  <div className="md:col-span-2">
  <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-white">
    Eligibility Criteria
  </label>

  <textarea
    rows={5}
    name="eligibilityCriteria"
    value={formData.eligibilityCriteria}
    onChange={handleChange}
    placeholder="e.g., Minimum 3.0 GPA, Must be eligible to work in the specified location..."
    className="w-full rounded-xl border border-[#334155] bg-[#0f172a] p-4 text-white placeholder:text-gray-400"
  />
</div>


    <div>
  <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-white">
    Minimum Education
  </label>

  <select
    name="degree"
    value={formData.degree}
    onChange={handleChange}
    className="w-full rounded-xl border border-[#334155] bg-[#0f172a] p-3 text-white"
  >
    <option value="">Search or add degree...</option>
    <option value="B.Tech">B.Tech</option>
    <option value="B.E">B.E</option>
    <option value="BCA">BCA</option>
    <option value="MCA">MCA</option>
    <option value="M.Tech">M.Tech</option>
    <option value="MBA">MBA</option>
    <option value="MBA">Other</option>
  </select>
</div>

<div>
  <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-white">
    Preferred Field Of Study
  </label>

  <select
    name="fieldOfStudy"
    value={formData.fieldOfStudy || ""}
    onChange={handleChange}
    className="w-full rounded-xl border border-[#334155] bg-[#0f172a] p-3 text-white"
  >
    <option value="">Select a degree first</option>

    <option value="Computer Science">
      Computer Science
    </option>

    <option value="Information Technology">
      Information Technology
    </option>

    <option value="Electronics">
      Electronics
    </option>

    <option value="Mechanical">
      Mechanical
    </option>

    <option value="Civil">
      Civil
    </option>
  </select>
</div>


{/* Experience */}
<div>
  <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-white">
    Min. Years Of Experience
  </label>

  <input
    type="number"
    min="0"
    step="0.5"
    name="minYearofExperience"
    value={formData.minYearofExperience}
    onChange={handleChange}
    placeholder="e.g. 1"
    className="w-full rounded-xl border border-[#334155] bg-[#0f172a] p-3 text-white"
  />
</div>

<div>
  <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-white">
    Max. Years Of Experience
  </label>

  <input
    type="number"
    min="0"
    step="0.5"
    name="yearsOfExperience"
    value={formData.yearsOfExperience}
    onChange={handleChange}
    placeholder="e.g. 5"
    className="w-full rounded-xl border border-[#334155] bg-[#0f172a] p-3 text-white"
  />
</div>


{/* WORK AUTHORIZATION */}

<div className="md:col-span-2">
  <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-white">
    Work Authorization
  </label>

  <select
    name="workAuthorization"
    value={formData.workAuthorization}
    onChange={handleChange}
    className="w-full rounded-xl border border-[#334155] bg-[#0f172a] p-3 text-white"
  >
    ...
  </select>
</div>

<div className="hidden md:block"></div>

{/* SKILLS */}
<div className="md:col-span-2">
  <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-white">
    Skills
  </label>

  <input
    type="text"
    name="skills"
    value={formData.skills}
    onChange={handleChange}
    placeholder="React, Node.js, TypeScript.."
    className="w-full rounded-xl border border-[#334155] bg-[#0f172a] p-3 text-white"
  />
</div>

{/* NUMBER OF ROUNDS */}
<div>
  <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-white">
    Number Of Rounds
  </label>

  <select
    name="rounds"
    value={formData.rounds}
    onChange={handleChange}
    className="w-full rounded-xl border border-[#334155] bg-[#0f172a] p-3 text-white"
  >
    <option value="">Select rounds</option>
    <option value="1">1 Round</option>
    <option value="2">2 Rounds</option>
    <option value="3">3 Rounds</option>
    <option value="4">4 Rounds</option>
    <option value="5">5 Rounds</option>
    <option value="6+">6+ Rounds</option>
  </select>
</div>

{/* PROCESS OF SELECTION */}
<div>
  <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-white">
    Process Of Selection
  </label>

  <select
    name="selectionProcess"
    value={formData.selectionProcess}
    onChange={handleChange}
    className="w-full rounded-xl border border-[#334155] bg-[#0f172a] p-3 text-white"
  >
    <option value="">Select process</option>
    <option value="Online Assessment">
      Online Assessment
    </option>
    <option value="Technical Interview">
      Technical Interview
    </option>
    <option value="HR Interview">
      HR Interview
    </option>
    <option value="Assignment + Interview">
      Assignment + Interview
    </option>
    <option value="Technical + HR">
      Technical + HR
    </option>
  </select>
</div>

       {/* BENEFITS */}
<div>
  <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-white">
    Benefits
  </label>

  <input
    type="text"
    name="benefits"
    value={formData.benefits}
    onChange={handleChange}
    placeholder="Type a benefit..."
    className="w-full rounded-xl border border-[#334155] bg-[#0f172a] p-3 text-white"
  />
</div>

{/* TAGS */}
<div>
  <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-white">
    Tags
  </label>

  <select
    name="tags"
    value={formData.tags}
    onChange={handleChange}
    className="w-full rounded-xl border border-[#334155] bg-[#0f172a] p-3 text-white"
  >
    <option value="">Select tags</option>
    <option value="Remote">Remote</option>
    <option value="Hybrid">Hybrid</option>
    <option value="On-site">On-site</option>
    <option value="Internship">Internship</option>
    <option value="Full-time">Full-time</option>
    <option value="Referral">Referral</option>
    <option value="Fresher">Fresher</option>
  </select>
</div>

{/* CERTIFICATIONS */}
<div className="md:col-span-2">
  <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-white">
    Certifications (If Any)
  </label>

  <input
    type="text"
    name="certifications"
    value={formData.certifications}
    onChange={handleChange}
    placeholder="Type a certification..."
    className="w-full rounded-xl border border-[#334155] bg-[#0f172a] p-3 text-white"
  />
</div>
      </div>
    </div>
  );
}