"use client";
import { useEffect, useMemo, useState, KeyboardEvent } from "react";
import axios from "axios";
import {
  BookOpen,
  Briefcase,
  Building2,
  DollarSign,
  FileText,
  GraduationCap,
  Link2,
  Loader2,
  Tag,
  Users,
  X,
  Radio,
  Award,
  Calendar,
  Plus,
  Check,
  Sparkles,
} from "lucide-react";
import StateCitySelector from "./StateCitySelector";
import { getMasterData, createMasterData } from "@/services/masterData.service";
import axiosInstance from "@/lib/axiosInstance";
import type { BasicJobDetailsProps } from "@/types/referral";

type MasterDegree = {
  _id: string;
  value: string;
  type: string;
};

type MasterStream = {
  _id: string;
  value: string;
  type: string;
  parent?: string;
  isActive: boolean;
  isCustom: boolean;
};

type MasterSkill = {
  _id: string;
  skills: string;
  __v?: number;
};

type MasterJobRole = {
  _id: string;
  value: string;
  type: string;
  isActive: boolean;
  isCustom: boolean;
  parent?: string | null;
};

// Hardcoded certification options
const certificationOptions = [
  "AWS Certified Cloud Practitioner",
  "AWS Certified Solutions Architect",
  "AWS Certified Developer",
  "Google Cloud Certified",
  "Microsoft Azure Certified",
  "Certified Kubernetes Administrator (CKA)",
  "Certified Information Systems Security Professional (CISSP)",
  "Certified Ethical Hacker (CEH)",
  "Project Management Professional (PMP)",
  "Certified Scrum Master (CSM)",
  "ITIL Foundation",
  "CompTIA Security+",
  "Cisco Certified Network Associate (CCNA)",
  "Oracle Certified Professional",
  "Salesforce Certified Administrator",
  "HubSpot Marketing Certification",
  "Google Analytics Individual Qualification",
  "Lean Six Sigma Green Belt",
  "Lean Six Sigma Black Belt",
  "Certified Public Accountant (CPA)",
  "Chartered Financial Analyst (CFA)",
  "Financial Risk Manager (FRM)",
];

// Hardcoded benefit options
const benefitOptions = [
  "Health Insurance",
  "401(k) Retirement Plan",
  "Paid Time Off (PTO)",
  "Flexible Schedule",
  "Dental Insurance",
  "Vision Insurance",
  "Remote Work",
  "Stock Options",
  "Learning & Development Budget",
  "Gym Membership",
  "Mental Health Support",
  "Parental Leave",
  "Life Insurance",
  "Disability Insurance",
  "Tuition Reimbursement",
  "Company Car",
  "Meal Allowance",
  "Home Office Setup Budget",
  "Internet Reimbursement",
  "Employee Assistance Program",
];

// Hardcoded tag options
const tagOptions = [
  "Urgent Hiring",
  "Freshers Preferred",
  "Remote Friendly",
  "Work From Home",
  "Immediate Joiner",
  "Women Returners",
  "Diversity Hiring",
  "Top Tier Company",
  "Startup Culture",
  "Fast Growth",
  "Global Team",
  "Flexible Hours",
  "No Dress Code",
  "Pet Friendly",
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BasicJobDetails({
  formData,
  setFormData,
  onNext,
}: BasicJobDetailsProps) {
  const [masterDegrees, setMasterDegrees] = useState<MasterDegree[]>([]);
  const [streamsByDegree, setStreamsByDegree] = useState<
    Record<string, MasterStream[]>
  >({});
  const [masterSkills, setMasterSkills] = useState<MasterSkill[]>([]);
  const [masterJobRoles, setMasterJobRoles] = useState<MasterJobRole[]>([]);
  const [loadingDegrees, setLoadingDegrees] = useState(false);
  const [loadingStreams, setLoadingStreams] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loadingJobRoles, setLoadingJobRoles] = useState(false);
  const [streamError, setStreamError] = useState("");
  const [isCreatingStream, setIsCreatingStream] = useState(false);
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);
  const [isCreatingJobRole, setIsCreatingJobRole] = useState(false);

  // Input states for Enter key separation
  const [skillInput, setSkillInput] = useState("");
  const [jobRoleInput, setJobRoleInput] = useState("");
  const [customCertInput, setCustomCertInput] = useState("");
  const [customBenefitInput, setCustomBenefitInput] = useState("");
  const [customTagInput, setCustomTagInput] = useState("");

  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch degrees on mount
  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        setLoadingDegrees(true);
        const response = await getMasterData("DEGREE");
        if (response.success && response.data) {
          setMasterDegrees(response.data);
        }
      } catch (error) {
        console.error("Error fetching degrees:", error);
      } finally {
        setLoadingDegrees(false);
      }
    };
    fetchDegrees();
  }, []);

  // Fetch skills using fetch API
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoadingSkills(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/meta/get-skills`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json();
        if (!res.ok) return;
        if (data && Array.isArray(data)) {
          setMasterSkills(data);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoadingSkills(false);
      }
    };
    fetchSkills();
  }, []);

  // Fetch job roles using axiosInstance
  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        setLoadingJobRoles(true);
        const response = await axiosInstance.get("/api/company-master-data", {
          params: {
            type: "JOB_ROLE",
          },
        });
        if (response.data?.success && response.data?.data) {
          setMasterJobRoles(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching job roles:", error);
      } finally {
        setLoadingJobRoles(false);
      }
    };
    fetchJobRoles();
  }, []);

  // Fetch streams for selected degree using degree ID
  const loadStreamsForDegree = async (degreeId: string): Promise<void> => {
    setStreamError("");

    if (!degreeId) {
      setStreamsByDegree({});
      return;
    }

    if (streamsByDegree[degreeId]) {
      return;
    }

    try {
      setLoadingStreams(true);
      const response = await getMasterData("STREAM", degreeId);

      if (response.success && response.data) {
        setStreamsByDegree((previous) => ({
          ...previous,
          [degreeId]: response.data,
        }));

        if (response.data.length === 0) {
          const degreeName =
            masterDegrees.find((d) => d._id === degreeId)?.value ||
            "this degree";
          setStreamError(
            `No streams found for ${degreeName}. You can enter a stream manually.`,
          );
        }
      } else {
        setStreamError(
          "Unable to load streams. You can enter a stream manually.",
        );
      }
    } catch (error) {
      console.error("Failed to load streams:", error);
      setStreamError(
        "Unable to load stream suggestions. You can still enter the stream manually.",
      );
    } finally {
      setLoadingStreams(false);
    }
  };

  // Handle degree change - FIXED: Store degree value in minEducation
  const handleDegreeChange = async (degreeId: string): Promise<void> => {
    const selectedDegree = masterDegrees.find((d) => d._id === degreeId);

    setFormData({
      ...formData,
      minEducation: selectedDegree?.value || "", // FIXED: Store degree value in minEducation
      degree: selectedDegree?.value ? [selectedDegree.value] : [], // FIXED: Also store in degree array
      degreeId: degreeId,
      studentStreams: [],
    });

    if (!degreeId) {
      setStreamError("");
      return;
    }

    await loadStreamsForDegree(degreeId);
  };

  // Handle stream input change - creates new stream if not exists
  const handleStreamInputChange = async (value: string) => {
    const streams = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const degreeId = formData.degreeId || "";

    if (!degreeId) {
      handleChange("studentStreams", streams);
      return;
    }

    const currentStreams = streamsByDegree[degreeId] || [];
    const streamValues = currentStreams.map((s) => s.value.toLowerCase());

    let updatedStreams = [...streams];

    for (const stream of streams) {
      if (!streamValues.includes(stream.toLowerCase())) {
        try {
          setIsCreatingStream(true);
          const response = await createMasterData("STREAM", stream, degreeId);

          if (response.success) {
            setStreamsByDegree((prev) => {
              const existingStreams = prev[degreeId] || [];
              const newStream: MasterStream = {
                _id: response.data?._id || `temp-${Date.now()}`,
                value: stream,
                type: "STREAM",
                parent: degreeId,
                isActive: true,
                isCustom: true,
              };
              return {
                ...prev,
                [degreeId]: [...existingStreams, newStream],
              };
            });

            setStreamError("");
          }
        } catch (error) {
          console.error("Error creating stream:", error);
        } finally {
          setIsCreatingStream(false);
        }
      }
    }

    handleChange("studentStreams", updatedStreams);
  };

  // Handle skill input - creates new skill using fetch API
  const handleSkillInputChange = async (value: string) => {
    const skills = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (skills.length === 0) return;

    const currentSkills = masterSkills;
    const skillValues = currentSkills.map((s) => s.skills.toLowerCase());

    let updatedSkills = [...(formData.skills || [])];

    for (const skill of skills) {
      if (updatedSkills.includes(skill)) continue;

      const skillExists = skillValues.includes(skill.toLowerCase());

      if (!skillExists) {
        try {
          setIsCreatingSkill(true);
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_URL}/api/meta/add-skill`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ skills: skill }),
          });

          const data = await res.json();

          if (res.status === 201 || res.status === 200) {
            const newSkill: MasterSkill = {
              _id: data?._id || `temp-${Date.now()}`,
              skills: data?.skills || skill,
            };
            setMasterSkills((prev) => [...prev, newSkill]);
          } else if (res.status === 409) {
            // Skill already exists, just add it to selected
            console.log("Skill already exists:", skill);
          } else {
            console.error("Error creating skill:", data);
          }
        } catch (error) {
          console.error("Error creating skill:", error);
        } finally {
          setIsCreatingSkill(false);
        }
      }

      if (!updatedSkills.includes(skill)) {
        updatedSkills.push(skill);
      }
    }

    handleChange("skills", updatedSkills);
    setSkillInput("");
  };

  // Handle job role input - creates new job role using axiosInstance
  const handleJobRoleInputChange = async (value: string) => {
    const roles = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (roles.length === 0) return;

    const currentRoles = masterJobRoles;
    const roleValues = currentRoles.map((r) => r.value.toLowerCase());

    let updatedRoles = [...(formData.jobTitle || [])];

    for (const role of roles) {
      if (updatedRoles.includes(role)) continue;

      const roleExists = roleValues.includes(role.toLowerCase());

      if (!roleExists) {
        try {
          setIsCreatingJobRole(true);
          const token = localStorage.getItem("token");
          const response = await axiosInstance.post(
            "/api/company-master-data",
            {
              type: "JOB_ROLE",
              value: role,
              parent: null,
            },
            {
              headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data?.success) {
            const newRole: MasterJobRole = {
              _id: response.data.data?._id || `temp-${Date.now()}`,
              value: response.data.data?.value || role,
              type: "JOB_ROLE",
              isActive: true,
              isCustom: true,
              parent: null,
            };
            setMasterJobRoles((prev) => [...prev, newRole]);
          }
        } catch (error) {
          console.error("Error creating job role:", error);
        } finally {
          setIsCreatingJobRole(false);
        }
      }

      if (!updatedRoles.includes(role)) {
        updatedRoles.push(role);
      }
    }

    handleChange("jobTitle", updatedRoles);
    setJobRoleInput("");
  };

  // Handle skill toggle (for click selection)
  const toggleSkill = (skillName: string) => {
    const currentSkills = formData.skills || [];
    const nextSkills = currentSkills.includes(skillName)
      ? currentSkills.filter((skill: string) => skill !== skillName)
      : [...currentSkills, skillName];
    handleChange("skills", nextSkills);
    setSkillInput("");
  };

  // Toggle job role
  const toggleJobRole = (roleName: string) => {
    const currentRoles = formData.jobTitle || [];
    const nextRoles = currentRoles.includes(roleName)
      ? currentRoles.filter((role: string) => role !== roleName)
      : [...currentRoles, roleName];
    handleChange("jobTitle", nextRoles);
    setJobRoleInput("");
  };

  const handleChange = (field: string, value: unknown) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // FIXED: Store both state name and code
  const handleStateChange = (stateCode: string, stateName: string) => {
    setFormData({
      ...formData,
      state: stateName, // Store state name
      stateCode: stateCode, // Store state code
      city: "",
      location: stateName ? [stateName] : [], // Also store in location array
    });
    if (errors.state) {
      setErrors((prev) => ({ ...prev, state: "" }));
    }
  };

  // FIXED: Store city name and update location array
  const handleCityChange = (cityName: string) => {
    setFormData({
      ...formData,
      city: cityName,
      // Update location array with both state and city if available
      location: cityName 
        ? [cityName, formData.state || ""].filter(Boolean)
        : formData.state ? [formData.state] : [],
    });
    if (errors.city) {
      setErrors((prev) => ({ ...prev, city: "" }));
    }
  };

  const handlePackageChange = (field: string, value: unknown) => {
    setFormData({
      ...formData,
      packageDetails: {
        ...formData.packageDetails,
        [field]: value,
      },
    });
    if (errors[`packageDetails.${field}`]) {
      setErrors((prev) => ({ ...prev, [`packageDetails.${field}`]: "" }));
    }
  };

  const toggleStream = (streamName: string) => {
    const currentStreams = formData.studentStreams || [];
    const nextStreams = currentStreams.includes(streamName)
      ? currentStreams.filter(
          (selectedStream: string) => selectedStream !== streamName,
        )
      : [...currentStreams, streamName];
    handleChange("studentStreams", nextStreams);
  };

  // Remove item from array
  const removeArrayItem = (fieldName: string, itemToRemove: string) => {
    const currentItems =
      (formData[fieldName as keyof typeof formData] as string[]) || [];
    handleChange(
      fieldName,
      currentItems.filter((item: string) => item !== itemToRemove),
    );
  };

  // Validate form before proceeding
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required: Job Title (at least one)
    if (!formData.jobTitle || formData.jobTitle.length === 0) {
      newErrors.jobTitle = "At least one job title is required";
    }

    // Required: Job Description
    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = "Job description is required (minimum 10 characters)";
    }

    // Required: Number of Openings (must be > 0)
    if (!formData.numberOfOpenings || formData.numberOfOpenings < 1) {
      newErrors.numberOfOpenings = "Number of openings must be at least 1";
    }

    // Required: Application Deadline
    if (!formData.endDate) {
      newErrors.endDate = "Application deadline is required";
    }

    // Required: Work Mode
    if (!formData.workMode || formData.workMode.length === 0 || !formData.workMode[0]) {
      newErrors.workMode = "Work mode is required";
    }

    // Required: Employment Type
    if (!formData.employmentType || formData.employmentType.length === 0 || !formData.employmentType[0]) {
      newErrors.employmentType = "Employment type is required";
    }

    // Required: Degree
    if (!formData.degreeId) {
      newErrors.degreeId = "Degree is required";
    }

    // Required: Student Streams (at least one)
    if (!formData.studentStreams || formData.studentStreams.length === 0) {
      newErrors.studentStreams = "At least one stream/specialization is required";
    }

    // Required: Skills (at least one)
    if (!formData.skills || formData.skills.length === 0) {
      newErrors.skills = "At least one skill is required";
    }

    // Required: Package Details - Total CTC
    if (!formData.packageDetails?.totalCTC || formData.packageDetails.totalCTC < 0) {
      newErrors["packageDetails.totalCTC"] = "Total CTC is required";
    }

    // Required: Package Details - Fixed Pay
    if (!formData.packageDetails?.fixedPay || formData.packageDetails.fixedPay < 0) {
      newErrors["packageDetails.fixedPay"] = "Fixed pay is required";
    }

    // Validate if Location is selected but state not provided
    if (formData.broadcastType === "Location") {
      if (!formData.state) {
        newErrors.state = "State is required when Location broadcast is selected";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const availableStreams = useMemo(() => {
    const degreeId = formData.degreeId || "";
    if (!degreeId) return [];
    return streamsByDegree[degreeId] || [];
  }, [formData.degreeId, streamsByDegree]);

  // Filter skills that are already selected
  const availableSkills = useMemo(() => {
    const selectedSkills = formData.skills || [];
    return masterSkills.filter(
      (skill) => !selectedSkills.includes(skill.skills)
    );
  }, [masterSkills, formData.skills]);

  // Filter job roles that are already selected
  const availableJobRoles = useMemo(() => {
    const selectedRoles = formData.jobTitle || [];
    return masterJobRoles.filter(
      (role) => !selectedRoles.includes(role.value)
    );
  }, [masterJobRoles, formData.jobTitle]);

  // Filter certifications
  const availableCertifications = useMemo(() => {
    const selectedCerts = formData.certifications || [];
    return certificationOptions.filter(
      (cert) => !selectedCerts.includes(cert)
    );
  }, [formData.certifications]);

  // Filter benefits
  const availableBenefits = useMemo(() => {
    const selectedBenefits = formData.benefits || [];
    return benefitOptions.filter(
      (benefit) => !selectedBenefits.includes(benefit)
    );
  }, [formData.benefits]);

  // Filter tags
  const availableTags = useMemo(() => {
    const selectedTags = formData.tags || [];
    return tagOptions.filter(
      (tag) => !selectedTags.includes(tag)
    );
  }, [formData.tags]);

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-green-400" />
        <h2 className="text-xl font-semibold text-white">Basic Job Details</h2>
        <span className="ml-auto text-sm text-gray-400">Step 1 of 2</span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Job Title - Multi-select with Master Data */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Job Title <span className="text-red-400">*</span>
            <span className="text-xs text-gray-500 ml-2">(Select from existing or type to create new)</span>
          </label>
          
          <div className="relative">
            <input
              type="text"
              value={jobRoleInput}
              onChange={(e) => {
                setJobRoleInput(e.target.value);
                if (errors.jobTitle) {
                  setErrors((prev) => ({ ...prev, jobTitle: "" }));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && jobRoleInput.trim()) {
                  e.preventDefault();
                  handleJobRoleInputChange(jobRoleInput);
                }
              }}
              placeholder={loadingJobRoles ? "Loading job roles..." : "Type job title and press Enter to create, or select from below..."}
              disabled={loadingJobRoles || isCreatingJobRole}
              className={`w-full rounded-lg border ${errors.jobTitle ? 'border-red-500' : 'border-slate-700'} bg-[#0F172A] px-4 py-2.5 pr-10 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
            />
            {(loadingJobRoles || isCreatingJobRole) && (
              <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-green-400" />
            )}
          </div>
          
          {errors.jobTitle && (
            <p className="mt-1 text-xs text-red-400">{errors.jobTitle}</p>
          )}

          {/* Job Role Suggestions - Show existing job roles */}
          {!loadingJobRoles && masterJobRoles.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-400 mb-1.5">Suggested Job Titles:</p>
              <div className="flex flex-wrap gap-1.5">
                {masterJobRoles
                  .filter((role) =>
                    jobRoleInput.length === 0 || 
                    role.value.toLowerCase().includes(jobRoleInput.toLowerCase())
                  )
                  .filter((role) => !formData.jobTitle?.includes(role.value))
                  .slice(0, 15)
                  .map((role) => (
                    <button
                      key={role._id}
                      type="button"
                      onClick={() => {
                        toggleJobRole(role.value);
                        setJobRoleInput("");
                      }}
                      className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-400 transition hover:bg-blue-500/20 hover:border-blue-500/40"
                    >
                      {role.value}
                    </button>
                  ))}
              </div>
              {masterJobRoles.filter((role) => !formData.jobTitle?.includes(role.value)).length === 0 && (
                <p className="text-xs text-gray-500 mt-1">All job titles are selected. Type a new one and press Enter to create it.</p>
              )}
            </div>
          )}
          {!loadingJobRoles && masterJobRoles.length === 0 && (
            <p className="text-xs text-amber-400 mt-1.5">No job titles available. Type one and press Enter to create.</p>
          )}

          {/* Selected Job Titles */}
          {formData.jobTitle && formData.jobTitle.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-400 mb-1.5">Selected Job Titles:</p>
              <div className="flex flex-wrap gap-1.5">
                {formData.jobTitle.map((item: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30"
                  >
                    <Briefcase className="w-3 h-3" />
                    {item}
                    <button
                      type="button"
                      onClick={() => removeArrayItem("jobTitle", item)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Number of Openings */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            <Users className="mr-1.5 inline h-4 w-4" />
            Number of Openings <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            min={1}
            value={formData.numberOfOpenings || ""}
            onChange={(event) =>
              handleChange(
                "numberOfOpenings",
                event.target.value ? Number(event.target.value) : 0,
              )
            }
            placeholder="e.g., 5"
            className={`w-full rounded-lg border ${errors.numberOfOpenings ? 'border-red-500' : 'border-slate-700'} bg-[#0F172A] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
          />
          {errors.numberOfOpenings && (
            <p className="mt-1 text-xs text-red-400">{errors.numberOfOpenings}</p>
          )}
        </div>

        {/* Application Deadline */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            <Calendar className="mr-1.5 inline h-4 w-4" />
            Application Deadline <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            value={
              formData.endDate
                ? new Date(formData.endDate).toISOString().split("T")[0]
                : ""
            }
            onChange={(event) => {
              const dateValue = event.target.value;
              if (dateValue) {
                const date = new Date(dateValue);
                date.setHours(23, 59, 59, 999);
                handleChange("endDate", date.toISOString());
              } else {
                handleChange("endDate", null);
              }
            }}
            min={new Date().toISOString().split("T")[0]}
            className={`w-full rounded-lg border ${errors.endDate ? 'border-red-500' : 'border-slate-700'} bg-[#0F172A] px-4 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
          />
          {errors.endDate && (
            <p className="mt-1 text-xs text-red-400">{errors.endDate}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Select the last date for applications.
          </p>
        </div>

        {/* Work Mode */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Work Mode <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.workMode?.[0] || ""}
            onChange={(event) => handleChange("workMode", [event.target.value])}
            className={`w-full rounded-lg border ${errors.workMode ? 'border-red-500' : 'border-slate-700'} bg-[#0F172A] px-4 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
          >
            <option value="">Select Work Mode</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          {errors.workMode && (
            <p className="mt-1 text-xs text-red-400">{errors.workMode}</p>
          )}
        </div>

        {/* Employment Type */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Employment Type <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.employmentType?.[0] || ""}
            onChange={(event) =>
              handleChange("employmentType", [event.target.value])
            }
            className={`w-full rounded-lg border ${errors.employmentType ? 'border-red-500' : 'border-slate-700'} bg-[#0F172A] px-4 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
          >
            <option value="">Select Employment Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Freelance">Freelance</option>
          </select>
          {errors.employmentType && (
            <p className="mt-1 text-xs text-red-400">{errors.employmentType}</p>
          )}
        </div>

        {/* Experience */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Experience Required
          </label>
          <select
            value={formData.experience || ""}
            onChange={(event) => handleChange("experience", event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="">Select Experience</option>
            <option value="Fresher">Fresher</option>
            <option value="0-1 years">0-1 years</option>
            <option value="1-3 years">1-3 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="5-8 years">5-8 years</option>
            <option value="8+ years">8+ years</option>
          </select>
        </div>

        {/* Broadcast Type */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            <Radio className="mr-1.5 inline h-4 w-4" />
            Broadcast Type
          </label>
          <select
            value={formData.broadcastType || "Everyone"}
            onChange={(event) =>
              handleChange("broadcastType", event.target.value)
            }
            className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="Everyone">Everyone</option>
            <option value="Location">Location</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            {formData.broadcastType === "Location"
              ? `📍 Job will be visible to users in ${formData.state || 'selected state'}${formData.city ? `, ${formData.city}` : ''} only`
              : "🌍 Job will be visible to all users"}
          </p>
          {formData.broadcastType === "Location" && !formData.state && (
            <p className="mt-1 text-xs text-yellow-400">
              ⚠️ Please select a state for location-based broadcasting
            </p>
          )}
        </div>

        {/* State and City - Always visible, always optional */}
        <div className="md:col-span-2">
          <StateCitySelector
            selectedState={formData.state || ""}
            selectedCity={formData.city || ""}
            onStateChange={handleStateChange}
            onCityChange={handleCityChange}
            required={false}
          />
          {errors.state && (
            <p className="mt-1 text-xs text-red-400">{errors.state}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.state && formData.city 
              ? `📍 Location: ${formData.state}, ${formData.city}`
              : formData.state 
                ? `📍 State: ${formData.state}`
                : formData.city 
                  ? `📍 City: ${formData.city}`
                  : "📍 No location selected (optional)"}
          </p>
        </div>

        {/* Degree */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            <BookOpen className="mr-1.5 inline h-4 w-4" />
            Degree <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.degreeId || ""}
            onChange={(event) => void handleDegreeChange(event.target.value)}
            disabled={loadingDegrees}
            className={`w-full rounded-lg border ${errors.degreeId ? 'border-red-500' : 'border-slate-700'} bg-[#0F172A] px-4 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:opacity-50`}
          >
            <option value="">Select Degree</option>
            {masterDegrees.map((degree) => (
              <option key={degree._id} value={degree._id}>
                {degree.value}
              </option>
            ))}
          </select>
          {errors.degreeId && (
            <p className="mt-1 text-xs text-red-400">{errors.degreeId}</p>
          )}
          {loadingDegrees && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
              <Loader2 className="h-3 w-3 animate-spin" />
              Loading degrees...
            </p>
          )}
          {/* Show selected degree in minEducation */}
          {formData.minEducation && (
            <p className="mt-1 text-xs text-green-400">
              ✓ Selected: {formData.minEducation}
            </p>
          )}
        </div>

        {/* Specialization / Stream */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            <BookOpen className="mr-1.5 inline h-4 w-4" />
            Specialization / Stream <span className="text-red-400">*</span>
          </label>
          {!formData.degreeId ? (
            <div className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-sm text-gray-500">
              Select a degree first
            </div>
          ) : (
            <div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.studentStreams?.join(", ") || ""}
                  onChange={(event) =>
                    handleStreamInputChange(event.target.value)
                  }
                  placeholder={
                    loadingStreams
                      ? "Loading streams..."
                      : "Enter or select streams"
                  }
                  disabled={loadingStreams || isCreatingStream}
                  className={`w-full rounded-lg border ${errors.studentStreams ? 'border-red-500' : 'border-slate-700'} bg-[#0F172A] px-4 py-2.5 pr-10 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-60`}
                />
                {(loadingStreams || isCreatingStream) && (
                  <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-green-400" />
                )}
              </div>
              {errors.studentStreams && (
                <p className="mt-1 text-xs text-red-400">{errors.studentStreams}</p>
              )}
              
              {/* Selected Streams */}
              {formData.studentStreams && formData.studentStreams.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-400 mb-1.5">Selected Streams:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.studentStreams.map((item: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/30"
                      >
                        <BookOpen className="w-3 h-3" />
                        {item}
                        <button
                          type="button"
                          onClick={() => {
                            const currentStreams = formData.studentStreams || [];
                            handleChange(
                              "studentStreams",
                              currentStreams.filter((s: string) => s !== item)
                            );
                          }}
                          className="hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Streams */}
              {!loadingStreams && availableStreams.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-400 mb-1.5">Suggested Streams:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {availableStreams.map((stream) => {
                      const isSelected =
                        formData.studentStreams?.includes(stream.value) ?? false;
                      return (
                        <button
                          key={stream._id}
                          type="button"
                          onClick={() => toggleStream(stream.value)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                            isSelected
                              ? "border-green-500/50 bg-green-500/15 text-green-400"
                              : "border-slate-700 bg-slate-800/50 text-gray-400 hover:border-green-500/30 hover:text-gray-200"
                          }`}
                        >
                          {stream.value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {streamError && (
                <p className="mt-2 text-xs text-amber-400">{streamError}</p>
              )}
            </div>
          )}
        </div>

        {/* Skills - Using fetch API */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Skills Required <span className="text-red-400">*</span>
            <span className="text-xs text-gray-500 ml-2">(Select from existing or type to create new)</span>
          </label>
          
          <div className="relative">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => {
                setSkillInput(e.target.value);
                if (errors.skills) {
                  setErrors((prev) => ({ ...prev, skills: "" }));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && skillInput.trim()) {
                  e.preventDefault();
                  handleSkillInputChange(skillInput);
                }
              }}
              placeholder={loadingSkills ? "Loading skills..." : "Type a skill and press Enter to create, or select from below..."}
              disabled={loadingSkills || isCreatingSkill}
              className={`w-full rounded-lg border ${errors.skills ? 'border-red-500' : 'border-slate-700'} bg-[#0F172A] px-4 py-2.5 pr-10 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
            />
            {(loadingSkills || isCreatingSkill) && (
              <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-green-400" />
            )}
          </div>
          
          {errors.skills && (
            <p className="mt-1 text-xs text-red-400">{errors.skills}</p>
          )}

          {/* Selected Skills */}
          {formData.skills && formData.skills.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-400 mb-1.5">Selected Skills:</p>
              <div className="flex flex-wrap gap-1.5">
                {formData.skills.map((item: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30"
                  >
                    <Sparkles className="w-3 h-3" />
                    {item}
                    <button
                      type="button"
                      onClick={() => removeArrayItem("skills", item)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Skills */}
          {!loadingSkills && masterSkills.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-400 mb-1.5">Suggested Skills:</p>
              <div className="flex flex-wrap gap-1.5">
                {masterSkills
                  .filter((skill) =>
                    skillInput.length === 0 || 
                    skill.skills.toLowerCase().includes(skillInput.toLowerCase())
                  )
                  .filter((skill) => !formData.skills?.includes(skill.skills))
                  .slice(0, 15)
                  .map((skill) => (
                    <button
                      key={skill._id}
                      type="button"
                      onClick={() => {
                        toggleSkill(skill.skills);
                        setSkillInput("");
                      }}
                      className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-400 transition hover:bg-blue-500/20 hover:border-blue-500/40"
                    >
                      {skill.skills}
                    </button>
                  ))}
              </div>
              {masterSkills.filter((skill) => !formData.skills?.includes(skill.skills)).length === 0 && (
                <p className="text-xs text-gray-500 mt-1">All skills are selected. Type a new one and press Enter to create it.</p>
              )}
            </div>
          )}
          {!loadingSkills && masterSkills.length === 0 && (
            <p className="text-xs text-amber-400 mt-1.5">No skills available. Type one and press Enter to create.</p>
          )}
        </div>

        {/* Certifications - Hardcoded + Custom */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            <Award className="mr-1.5 inline h-4 w-4" />
            Certifications
            <span className="text-xs text-gray-500 ml-2">(Select from options or type custom)</span>
          </label>
          
          <div className="relative">
            <input
              type="text"
              value={customCertInput}
              onChange={(e) => setCustomCertInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && customCertInput.trim()) {
                  e.preventDefault();
                  const newCert = customCertInput.trim();
                  const currentCerts = formData.certifications || [];
                  if (!currentCerts.includes(newCert)) {
                    handleChange("certifications", [...currentCerts, newCert]);
                  }
                  setCustomCertInput("");
                }
              }}
              placeholder="Type custom certification and press Enter..."
              className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Selected Certifications */}
          {formData.certifications && formData.certifications.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-400 mb-1.5">Selected Certifications:</p>
              <div className="flex flex-wrap gap-1.5">
                {formData.certifications.map((item: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/15 text-purple-400 border border-purple-500/30"
                  >
                    <Award className="w-3 h-3" />
                    {item}
                    <button
                      type="button"
                      onClick={() => removeArrayItem("certifications", item)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Certifications */}
          {availableCertifications.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-400 mb-1.5">Suggested Certifications:</p>
              <div className="flex flex-wrap gap-1.5">
                {availableCertifications
                  .filter((cert) =>
                    customCertInput.length === 0 ||
                    cert.toLowerCase().includes(customCertInput.toLowerCase())
                  )
                  .slice(0, 10)
                  .map((cert) => (
                    <button
                      key={cert}
                      type="button"
                      onClick={() => {
                        const currentCerts = formData.certifications || [];
                        if (!currentCerts.includes(cert)) {
                          handleChange("certifications", [...currentCerts, cert]);
                        }
                        setCustomCertInput("");
                      }}
                      className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs text-purple-400 transition hover:bg-purple-500/20 hover:border-purple-500/40"
                    >
                      {cert}
                    </button>
                  ))}
              </div>
              {availableCertifications.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">All certifications are selected. Type a new one and press Enter to create it.</p>
              )}
            </div>
          )}
        </div>

        {/* Benefits - Hardcoded + Custom */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            <Sparkles className="mr-1.5 inline h-4 w-4" />
            Benefits
            <span className="text-xs text-gray-500 ml-2">(Select from options or type custom)</span>
          </label>
          
          <div className="relative">
            <input
              type="text"
              value={customBenefitInput}
              onChange={(e) => setCustomBenefitInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && customBenefitInput.trim()) {
                  e.preventDefault();
                  const newBenefit = customBenefitInput.trim();
                  const currentBenefits = formData.benefits || [];
                  if (!currentBenefits.includes(newBenefit)) {
                    handleChange("benefits", [...currentBenefits, newBenefit]);
                  }
                  setCustomBenefitInput("");
                }
              }}
              placeholder="Type custom benefit and press Enter..."
              className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Selected Benefits */}
          {formData.benefits && formData.benefits.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-400 mb-1.5">Selected Benefits:</p>
              <div className="flex flex-wrap gap-1.5">
                {formData.benefits.map((item: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  >
                    <Check className="w-3 h-3" />
                    {item}
                    <button
                      type="button"
                      onClick={() => removeArrayItem("benefits", item)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Benefits */}
          {availableBenefits.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-400 mb-1.5">Suggested Benefits:</p>
              <div className="flex flex-wrap gap-1.5">
                {availableBenefits
                  .filter((benefit) =>
                    customBenefitInput.length === 0 ||
                    benefit.toLowerCase().includes(customBenefitInput.toLowerCase())
                  )
                  .slice(0, 10)
                  .map((benefit) => (
                    <button
                      key={benefit}
                      type="button"
                      onClick={() => {
                        const currentBenefits = formData.benefits || [];
                        if (!currentBenefits.includes(benefit)) {
                          handleChange("benefits", [...currentBenefits, benefit]);
                        }
                        setCustomBenefitInput("");
                      }}
                      className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 transition hover:bg-emerald-500/20 hover:border-emerald-500/40"
                    >
                      {benefit}
                    </button>
                  ))}
              </div>
              {availableBenefits.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">All benefits are selected. Type a new one and press Enter to create it.</p>
              )}
            </div>
          )}
        </div>

        {/* Tags - Hardcoded + Custom */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            <Tag className="mr-1.5 inline h-4 w-4" />
            Tags
            <span className="text-xs text-gray-500 ml-2">(Select from options or type custom)</span>
          </label>
          
          <div className="relative">
            <input
              type="text"
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && customTagInput.trim()) {
                  e.preventDefault();
                  const newTag = customTagInput.trim();
                  const currentTags = formData.tags || [];
                  if (!currentTags.includes(newTag)) {
                    handleChange("tags", [...currentTags, newTag]);
                  }
                  setCustomTagInput("");
                }
              }}
              placeholder="Type custom tag and press Enter..."
              className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Selected Tags */}
          {formData.tags && formData.tags.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-400 mb-1.5">Selected Tags:</p>
              <div className="flex flex-wrap gap-1.5">
                {formData.tags.map((item: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30"
                  >
                    <Tag className="w-3 h-3" />
                    {item}
                    <button
                      type="button"
                      onClick={() => removeArrayItem("tags", item)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Tags */}
          {availableTags.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-400 mb-1.5">Suggested Tags:</p>
              <div className="flex flex-wrap gap-1.5">
                {availableTags
                  .filter((tag) =>
                    customTagInput.length === 0 ||
                    tag.toLowerCase().includes(customTagInput.toLowerCase())
                  )
                  .slice(0, 10)
                  .map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const currentTags = formData.tags || [];
                        if (!currentTags.includes(tag)) {
                          handleChange("tags", [...currentTags, tag]);
                        }
                        setCustomTagInput("");
                      }}
                      className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-400 transition hover:bg-amber-500/20 hover:border-amber-500/40"
                    >
                      {tag}
                    </button>
                  ))}
              </div>
              {availableTags.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">All tags are selected. Type a new one and press Enter to create it.</p>
              )}
            </div>
          )}
        </div>

        {/* Job Description */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            <FileText className="mr-1.5 inline h-4 w-4" />
            Job Description <span className="text-red-400">*</span>
            <span className="text-xs text-gray-500 ml-2">(Minimum 10 characters)</span>
          </label>
          <textarea
            value={formData.description || ""}
            onChange={(event) => {
              handleChange("description", event.target.value);
              if (errors.description) {
                setErrors((prev) => ({ ...prev, description: "" }));
              }
            }}
            placeholder="Describe the job role, responsibilities, and requirements..."
            rows={5}
            className={`w-full resize-none rounded-lg border ${errors.description ? 'border-red-500' : 'border-slate-700'} bg-[#0F172A] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-400">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.description?.length || 0} characters (minimum 10 required)
          </p>
        </div>

        {/* Package Details */}
        <div className="mt-2 border-t border-slate-800 pt-4 md:col-span-2">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-300">
            <DollarSign className="h-4 w-4 text-green-400" />
            Package Details
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs text-gray-400">
                Currency
              </label>
              <select
                value={formData.packageDetails?.currency || "INR"}
                onChange={(event) =>
                  handlePackageChange("currency", event.target.value)
                }
                className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">
                Total CTC <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min={0}
                value={formData.packageDetails?.totalCTC || ""}
                onChange={(event) =>
                  handlePackageChange(
                    "totalCTC",
                    event.target.value ? Number(event.target.value) : 0,
                  )
                }
                placeholder="e.g., 1200000"
                className={`w-full rounded-lg border ${errors['packageDetails.totalCTC'] ? 'border-red-500' : 'border-slate-700'} bg-[#0F172A] px-4 py-2 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
              />
              {errors['packageDetails.totalCTC'] && (
                <p className="mt-1 text-xs text-red-400">{errors['packageDetails.totalCTC']}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">
                Fixed Pay <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min={0}
                value={formData.packageDetails?.fixedPay || ""}
                onChange={(event) =>
                  handlePackageChange(
                    "fixedPay",
                    event.target.value ? Number(event.target.value) : 0,
                  )
                }
                placeholder="e.g., 50000"
                className={`w-full rounded-lg border ${errors['packageDetails.fixedPay'] ? 'border-red-500' : 'border-slate-700'} bg-[#0F172A] px-4 py-2 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
              />
              {errors['packageDetails.fixedPay'] && (
                <p className="mt-1 text-xs text-red-400">{errors['packageDetails.fixedPay']}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">
                Variable Pay
              </label>
              <input
                type="number"
                min={0}
                value={formData.packageDetails?.joiningBonus || ""}
                onChange={(event) =>
                  handlePackageChange(
                    "joiningBonus",
                    event.target.value ? Number(event.target.value) : 0,
                  )
                }
                placeholder="e.g., 50000"
                className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-800 pt-4">
        <button
          type="button"
          onClick={handleNext}
          className="rounded-lg bg-green-500 px-6 py-2.5 font-medium text-black transition-colors hover:bg-green-400"
        >
          Next Step →
        </button>
      </div>
    </div>
  );
}