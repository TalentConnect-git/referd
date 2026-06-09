"use client";

import { useState } from "react";
import BasicJobDetails from "./BasicJobDetails";
import SelectionCriteriaSection from "./SelectionCriteriaSection";
import { createReferralPosting } from "@/services/referral.service";


export default function PostReferralForm() {

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
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
    .map((s) => s.trim())
    .filter(Boolean),

  rounds: formData.rounds
    ? [formData.rounds]
    : [],

  selectionProcess: formData.selectionProcess
    ? [formData.selectionProcess]
    : [],

  benefits: formData.benefits
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  tags: formData.tags
    ? [formData.tags]
    : [],

  certifications: formData.certifications
    .split(",")
    .map((s) => s.trim())
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
  };

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold text-white">
        Post a Referral
      </h1>

      {/* Progress Indicator */}
      <div className="flex gap-4">
        <div onClick={() => setStep(1)}
          className={`rounded-lg cursor-pointer px-4 py-2 ${
            step === 1
              ? "bg-green-500 text-black"
              : "bg-[#1e293b] text-white"
          }`}
        >
          Basic Job Details
        </div>

        <div onClick={() => setStep(2)}
          className={`rounded-lg cursor-pointer px-4 py-2 ${
            step === 2
              ? "bg-green-500 text-black"
              : "bg-[#1e293b] text-white"
          }`}
        >
          Selection Criteria
        </div>
      </div>

      {step === 1 && (
        <>
          <BasicJobDetails
            formData={formData}
            handleChange={handleChange}
          />

          <div className="flex justify-end">
            <button
  onClick={() => {
    
      setStep(2);
    
  }}
  className="rounded-xl cursor-pointer bg-green-500 px-6 py-3 font-medium text-black"
>
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


