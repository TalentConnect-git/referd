"use client";

import { useState } from "react";
import BasicJobDetails from "./BasicJobDetails";
import SelectionCriteriaSection from "./SelectionCriteriaSection";
import { createReferralPosting } from "@/services/referral.service";
import { Briefcase,GraduationCap } from "lucide-react";

export default function PostReferralForm() {

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    cgpa: "",
    batchYear: "",
    employmentType: "",
    endDate: "",
    jobTitle: "",
    workMode: "",
    location: "",
    broadcastType: "Everyone",

    totalCTC: "",
    fixedPay: "",
    joiningBonus: "",

    numberOfOpenings: "",
    description: "",

    eligibilityCriteria: "",
    degree: "",

    minYearofExperience: "",
    yearsOfExperience: "",

    workAuthorization: "",

    skills: "",
    rounds: "",
    selectionProcess: "",

    benefits: "",
    tags: "",
    certifications: "",
  });

  const handleSubmit = async () => {
  try {
    setLoading(true);

    const payload = {
  jobType: "Referral",

  cgpa: Number(formData.cgpa),

  batchYear: formData.batchYear
    ? [formData.batchYear]
    : [],

  employmentType: formData.employmentType
    ? [formData.employmentType]
    : [],

  workMode: formData.workMode
    ? [formData.workMode]
    : [],

  location: formData.location
    ? [formData.location]
    : [],

  broadcastType: formData.broadcastType,

  jobTitle: formData.jobTitle
    ? [formData.jobTitle]
    : [],

  packageDetails: {
    totalCTC: Number(formData.totalCTC),
    fixedPay: Number(formData.fixedPay),
    joiningBonus: Number(formData.joiningBonus),
  },

  numberOfOpenings: Number(formData.numberOfOpenings),

  description: formData.description,

  eligibilityCriteria: formData.eligibilityCriteria,

  degree: formData.degree
    ? [formData.degree]
    : [],

  minYearofExperience: formData.minYearofExperience,

  yearsOfExperience: formData.yearsOfExperience,

  workAuthorization: formData.workAuthorization,

  skills: formData.skills
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),

  rounds: formData.rounds
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),

  selectionProcess: formData.selectionProcess
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),

  benefits: formData.benefits
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),

  tags: formData.tags
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),

  certifications: formData.certifications
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),

  endDate: formData.endDate,
};

    const response = await createReferralPosting(payload);

    console.log("Referral Posted:", response);

    alert("Referral posted successfully!");

    // Reset form
    setFormData({
      cgpa: "",
      batchYear: "",
      employmentType: "",
      endDate: "",
      jobTitle: "",
      workMode: "",
      location: "",
      broadcastType: "Everyone",
      totalCTC: "",
      fixedPay: "",
      joiningBonus: "",
      numberOfOpenings: "",
      description: "",
      eligibilityCriteria: "",
      degree: "",
      minYearofExperience: "",
      yearsOfExperience: "",
      workAuthorization: "",
      skills: "",
      rounds: "",
      selectionProcess: "",
      benefits: "",
      tags: "",
      certifications: "",
    });

    setStep(1);
  } catch (error: any) {
    console.error(error);

    alert(
      error?.response?.data?.message ||
      "Failed to post referral"
    );
  } finally {
    setLoading(false);
  }
};

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setInvalidFields((prev) =>
  prev.filter((field) => field !== e.target.name)
);
  };


 const validateStep1 = () => {
  const invalid: string[] = [];

  if (!formData.employmentType) invalid.push("employmentType");
  if (!formData.jobTitle?.trim()) invalid.push("jobTitle");
  if (!formData.workMode) invalid.push("workMode");
  if (!formData.location) invalid.push("location");
  if (!formData.broadcastType) invalid.push("broadcastType");
  if (!formData.totalCTC) invalid.push("totalCTC");
  if (!formData.numberOfOpenings) invalid.push("numberOfOpenings");
  if (!formData.description?.trim()) invalid.push("description");
  if (!formData.endDate) invalid.push("endDate");

  setInvalidFields(invalid);

  return invalid.length === 0;
};

  return (
  <div className="space-y-6">
  <div className="mb-6 border-b border-[var(--border)] pb-4">
  {step === 1 ? (
    <button
      onClick={() => setStep(1)}
      className="flex items-start gap-3"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-semibold text-white">
        1
      </div>

      <div>
        <div className="flex items-center gap-2">
          <Briefcase
            size={18}
            className="text-[var(--primary)]"
          />

          <h2 className="text-lg font-semibold text-white">
            Basic Job Details
          </h2>
        </div>

        <p className="mt-1 text-sm text-gray-400">
          Provide the core details about this job opportunity.
        </p>
      </div>
    </button>
  ) : (
    <button
      onClick={() => setStep(2)}
      className="flex items-start gap-3"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-semibold text-white">
        2
      </div>

      <div>
        <div className="flex items-center gap-2">
          <GraduationCap
            size={18}
            className="text-[var(--primary)]"
          />

          <h2 className="text-lg font-semibold text-white">
            Selection Criteria
          </h2>
        </div>

        <p className="mt-1 text-sm text-gray-400">
          Outline the qualifications for the ideal candidate.
        </p>
      </div>
    </button>
  )}
</div>



      {step === 1 && (
        <>
          <BasicJobDetails
            formData={formData}
            handleChange={handleChange}
            invalidFields={invalidFields}
          />

          <div className="flex justify-end">
            <button
            onClick={() => {
              if (!validateStep1()) return;
              setStep(2);
            }}
             className="rounded-xl cursor-pointer bg-green-500 px-6 py-3 font-medium text-black" >
            Next →
          </button>
      </div>
        </>
      )}

      {step === 2 && (
        <>
          <SelectionCriteriaSection
            formData={formData}
            handleChange={handleChange}
          />

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="rounded-xl cursor-pointer border border-[#334155] px-6 py-3 text-white"
            >
              ← Back
            </button>

            <button onClick={handleSubmit}
            
              className="rounded-xl bg-green-500 px-6 py-3 font-medium text-black"
            >
             {loading ? "Posting..." : "Post Referral"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}


