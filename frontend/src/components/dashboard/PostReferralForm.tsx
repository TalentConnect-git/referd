"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import BasicJobDetails from "./BasicJobDetails";
import SelectionCriteriaSection from "./SelectionCriteriaSection";
import { createReferralPosting } from "@/services/referral.service";
import { ReferralPostingPayload } from "@/types/referral";

export default function PostReferralForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ReferralPostingPayload>({
    jobTitle: [],
    companyName: "",
    location: [],
    workMode: [],
    employmentType: [],
    description: "",
    jobRoles: [],
    packageDetails: {
      currency: "INR",
      totalCTC: 0,
      fixedPay: 0,
      joiningBonus: 0,
    },
    skills: [],
    experience: "",
    minEducation: "",
    certifications: [],
    benefits: [],
    tags: [],
    numberOfOpenings: 1,
    careerPageUrl: "",
    state: "",
    city: "",
    country: "India",
    cgpa: 0,
    studentStreams: [],
    batchYear: [],
    eligibilityCriteria: "",
    selectionProcess: [],
    rounds: [],
    onlineTestDate: undefined,
    interviewWindow: {},
    proposedSchedule: {},
    venue: "",
    isAskForReferral: false,
    referralRequestId: null,
    senderProfile: {},
    receiverProfile: {},
    broadcastType: "Everyone",
    visibleTo: "All",
    workLocation: [],
    expireAt: undefined,
    inactive: false,
    degree: [],
    degreeId: "",
    workAuthorization: "",
    endDate: undefined,
  });

  const steps = [
    {
      title: "Basic Job Details",
      component: BasicJobDetails,
    },
    {
      title: "Selection Criteria",
      component: SelectionCriteriaSection,
    },
  ];

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      jobTitle: [],
      companyName: "",
      location: [],
      workMode: [],
      employmentType: [],
      description: "",
      jobRoles: [],
      packageDetails: {
        currency: "INR",
        totalCTC: 0,
        fixedPay: 0,
        joiningBonus: 0,
      },
      skills: [],
      experience: "",
      minEducation: "",
      certifications: [],
      benefits: [],
      tags: [],
      numberOfOpenings: 1,
      careerPageUrl: "",
      state: "",
      city: "",
      country: "India",
      cgpa: 0,
      studentStreams: [],
      batchYear: [],
      eligibilityCriteria: "",
      selectionProcess: [],
      rounds: [],
      onlineTestDate: undefined,
      interviewWindow: {},
      proposedSchedule: {},
      venue: "",
      isAskForReferral: false,
      referralRequestId: null,
      senderProfile: {},
      receiverProfile: {},
      broadcastType: "Everyone",
      visibleTo: "All",
      workLocation: [],
      expireAt: undefined,
      inactive: false,
      degree: [],
      degreeId: "",
      workAuthorization: "",
      endDate: undefined,
    });
    setCurrentStep(0);
  };

  const handleNext = () => {
    // Validate required fields for step 1
    if (currentStep === 0) {
      if (!formData.jobTitle || formData.jobTitle.length === 0) {
        toast.error("Please enter a job title");
        return;
      }
      if (!formData.workMode || formData.workMode.length === 0) {
        toast.error("Please select a work mode");
        return;
      }
      if (!formData.employmentType || formData.employmentType.length === 0) {
        toast.error("Please select an employment type");
        return;
      }
      
      if (!formData.broadcastType) {
        toast.error("Please select a broadcast type");
        return;
      }
      
      // Validate location if broadcast type is Location
      if (formData.broadcastType === "Location") {
        if (!formData.city || !formData.state) {
          toast.error("Please enter city and state for location-based broadcast");
          return;
        }
      }
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields for step 2
    if (!formData.workAuthorization) {
      toast.error("Please select work authorization");
      return;
    }

    // Validate rounds and selection process match
    const totalRounds = (formData.rounds || []).length;
    const selectionCount = (formData.selectionProcess || []).length;
    
    if (totalRounds === 0) {
      toast.error("Please add at least one round");
      return;
    }
    
    if (selectionCount === 0) {
      toast.error("Please add selection process items");
      return;
    }
    
    // if (selectionCount !== totalRounds) {
    //   toast.error(`Selection process items (${selectionCount}) must match the number of rounds (${totalRounds})`);
    //   return;
    // }

    setIsLoading(true);
    try {
      // Prepare location array - combine city, state, country
      const locationArray = [];
      if (formData.city && formData.city.trim()) {
        locationArray.push(formData.city.trim());
      }
      if (formData.state && formData.state.trim()) {
        locationArray.push(formData.state.trim());
      }
      if (formData.country && formData.country.trim()) {
        locationArray.push(formData.country.trim());
      }

      // Prepare workLocation array
      const workLocationArray = [];
      if (formData.city && formData.city.trim()) {
        workLocationArray.push(formData.city.trim());
      }
      if (formData.state && formData.state.trim()) {
        workLocationArray.push(formData.state.trim());
      }

      // Handle degree - store as array of strings
      const degreeArray = formData.degree && formData.degree.length > 0 
        ? formData.degree 
        : [];

      // Handle minEducation - use the first degree or empty string
      const minEducationValue = degreeArray.length > 0 
        ? degreeArray[0] 
        : formData.minEducation || "";

      const payload = {
        ...formData,
        jobTitle: formData.jobTitle || [],
        location: locationArray.length > 0 ? locationArray : ["India"],
        workMode: formData.workMode || [],
        employmentType: formData.employmentType || [],
        jobRoles: formData.jobRoles || [],
        skills: formData.skills || [],
        certifications: formData.certifications || [],
        benefits: formData.benefits || [],
        tags: formData.tags || [],
        studentStreams: formData.studentStreams || [],
        batchYear: formData.batchYear || [],
        selectionProcess: formData.selectionProcess || [],
        rounds: formData.rounds || [],
        workLocation: workLocationArray.length > 0 ? workLocationArray : [],
        degree: degreeArray,
        minEducation: minEducationValue,
        endDate: formData.endDate || undefined,
        state: formData.state || "",
        city: formData.city || "",
        country: formData.country || "India",
      };

      const response = await createReferralPosting(payload);
      
      if (response.message) {
        toast.success("Referral posting created successfully!", {
          duration: 4000,
          icon: '✅',
        });
        
        resetForm();
        
        setTimeout(() => {
          router.push("/professional/referrals");
        }, 2000);
      } else {
        toast.error(response.message || "Failed to create referral posting");
      }
    } catch (error: any) {
      console.error("Error creating referral posting:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const StepComponent = steps[currentStep].component;

  return (
    <div className="bg-[#0F172A] rounded-3xl border border-slate-800 p-6 ml-5">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-white">
              {steps[currentStep].title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index <= currentStep
                    ? "w-6 bg-green-500"
                    : "w-4 bg-slate-700"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="min-h-[500px]">
        <StepComponent
          formData={formData}
          setFormData={setFormData}
          onNext={handleNext}
          onPrev={handlePrev}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}