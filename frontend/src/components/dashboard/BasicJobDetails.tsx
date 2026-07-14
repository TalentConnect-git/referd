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
  Calendar,
} from "lucide-react";
import StateCitySelector from "./StateCitySelector";
import { getMasterData, createMasterData } from "@/services/masterData.service";
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
  value: string;
  type: string;
  isActive: boolean;
  isCustom: boolean;
};

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
  const [loadingDegrees, setLoadingDegrees] = useState(false);
  const [loadingStreams, setLoadingStreams] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [streamError, setStreamError] = useState("");
  const [isCreatingStream, setIsCreatingStream] = useState(false);
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);

  // Input states for Enter key separation
  const [skillInput, setSkillInput] = useState("");
  const [certificationInput, setCertificationInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [jobRoleInput, setJobRoleInput] = useState("");

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

  // Fetch skills on mount
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoadingSkills(true);
        const response = await getMasterData("SKILL");
        if (response.success && response.data) {
          setMasterSkills(response.data);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoadingSkills(false);
      }
    };
    fetchSkills();
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

  // Handle degree change
  const handleDegreeChange = async (degreeId: string): Promise<void> => {
    const selectedDegree = masterDegrees.find((d) => d._id === degreeId);

    setFormData({
      ...formData,
      degree: selectedDegree?.value || "",
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

  // Handle skill input change - creates new skill if not exists
  const handleSkillInputChange = async (value: string) => {
    const skills = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (skills.length === 0) return;

    const currentSkills = masterSkills;
    const skillValues = currentSkills.map((s) => s.value.toLowerCase());

    let updatedSkills = [...(formData.skills || [])];

    for (const skill of skills) {
      // Check if skill already exists in selected skills
      if (updatedSkills.includes(skill)) continue;

      // Check if skill exists in master data (case insensitive)
      const skillExists = skillValues.includes(skill.toLowerCase());

      if (!skillExists) {
        try {
          setIsCreatingSkill(true);
          const response = await createMasterData("SKILL", skill);

          if (response.success) {
            // Add the new skill to masterSkills
            const newSkill: MasterSkill = {
              _id: response.data?._id || `temp-${Date.now()}`,
              value: skill,
              type: "SKILL",
              isActive: true,
              isCustom: true,
            };
            setMasterSkills((prev) => [...prev, newSkill]);
          }
        } catch (error) {
          console.error("Error creating skill:", error);
        } finally {
          setIsCreatingSkill(false);
        }
      }

      // Add to selected skills if not already there
      if (!updatedSkills.includes(skill)) {
        updatedSkills.push(skill);
      }
    }

    handleChange("skills", updatedSkills);
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

  const handleChange = (field: string, value: unknown) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    // Clear error for this field when user changes it
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleStateChange = (_stateId: string, stateName: string) => {
    setFormData({
      ...formData,
      state: stateName,
      city: "",
    });
    if (errors.state) {
      setErrors((prev) => ({ ...prev, state: "" }));
    }
  };

  const handleCityChange = (cityName: string) => {
    handleChange("city", cityName);
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

  // Generic function to handle Enter key for array fields (non-master data fields)
  const handleArrayKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    inputValue: string,
    setInputValue: (value: string) => void,
    fieldName: string,
    currentItems: string[],
  ) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const newItem = inputValue.trim();
      if (!currentItems.includes(newItem)) {
        handleChange(fieldName, [...currentItems, newItem]);
      }
      setInputValue("");
    }
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

    // Required: Job Title
    if (!formData.jobTitle || formData.jobTitle.length === 0 || !formData.jobTitle[0]?.trim()) {
      newErrors.jobTitle = "Job title is required";
    }

    // Required: Broadcast Type
    if (!formData.broadcastType) {
      newErrors.broadcastType = "Broadcast type is required";
    }

    // Required: State (if broadcast type is Location)
    if (formData.broadcastType === "Location" && !formData.state) {
      newErrors.state = "State is required for location-based broadcast";
    }

    // Required: Work Mode
    if (!formData.workMode || formData.workMode.length === 0 || !formData.workMode[0]) {
      newErrors.workMode = "Work mode is required";
    }

    // Required: Employment Type
    if (!formData.employmentType || formData.employmentType.length === 0 || !formData.employmentType[0]) {
      newErrors.employmentType = "Employment type is required";
    }

    // Required: Number of Openings (must be > 0)
    if (!formData.numberOfOpenings || formData.numberOfOpenings < 1) {
      newErrors.numberOfOpenings = "Number of openings must be at least 1";
    }

    // Required: Application Deadline
    if (!formData.endDate) {
      newErrors.endDate = "Application deadline is required";
    }

    // Required: Package Details - Total CTC
    if (!formData.packageDetails?.totalCTC || formData.packageDetails.totalCTC < 0) {
      newErrors["packageDetails.totalCTC"] = "Total CTC is required";
    }

    // Required: Package Details - Fixed Pay
    if (!formData.packageDetails?.fixedPay || formData.packageDetails.fixedPay < 0) {
      newErrors["packageDetails.fixedPay"] = "Fixed pay is required";
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
      (skill) => !selectedSkills.includes(skill.value)
    );
  }, [masterSkills, formData.skills]);

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-green-400" />
        <h2 className="text-xl font-semibold text-white">Basic Job Details</h2>
        <span className="ml-auto text-sm text-gray-400">Step 1 of 2</span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Job Title */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Job Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.jobTitle?.[0] || ""}
            onChange={(event) => handleChange("jobTitle", [event.target.value])}
            placeholder="e.g., Full Stack Developer"
            className={`w-full rounded-lg border ${errors.jobTitle ? 'border-red-500' : 'border-slate-700'} bg-[#0F172A] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
          />
          {errors.jobTitle && (
            <p className="mt-1 text-xs text-red-400">{errors.jobTitle}</p>
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

        {/* Broadcast Type */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            <Radio className="mr-1.5 inline h-4 w-4" />
            Broadcast Type <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.broadcastType || "Everyone"}
            onChange={(event) =>
              handleChange("broadcastType", event.target.value)
            }
            className={`w-full rounded-lg border ${errors.broadcastType ? 'border-red-500' : 'border-slate-700'} bg-[#0F172A] px-4 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
          >
            <option value="Everyone">Everyone</option>
            <option value="Location">Location</option>
          </select>
          {errors.broadcastType && (
            <p className="mt-1 text-xs text-red-400">{errors.broadcastType}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.broadcastType === "Location"
              ? "Job will be visible to users in the selected location only"
              : "Job will be visible to all users"}
          </p>
        </div>

        {/* State and City */}
        <div className="md:col-span-2">
          <StateCitySelector
            selectedState={formData.state || ""}
            selectedCity={formData.city || ""}
            onStateChange={handleStateChange}
            onCityChange={handleCityChange}
            required={formData.broadcastType === "Location"}
          />
          {errors.state && (
            <p className="mt-1 text-xs text-red-400">{errors.state}</p>
          )}
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
              {!loadingStreams && availableStreams.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
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
              )}
              {streamError && (
                <p className="mt-2 text-xs text-amber-400">{streamError}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                {loadingStreams
                  ? "Loading stream suggestions..."
                  : "Select a suggestion or enter a custom stream. Custom streams will be created automatically."}
              </p>
            </div>
          )}
        </div>

        {/* Skills - Enhanced with Master Data */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Skills Required <span className="text-red-400">*</span>
            <span className="text-xs text-gray-500 ml-2">(Type or select from suggestions)</span>
          </label>
          
          {/* Input with suggestions */}
          <div className="relative">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => {
                setSkillInput(e.target.value);
                // Clear error when user types
                if (errors.skills) {
                  setErrors((prev) => ({ ...prev, skills: "" }));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && skillInput.trim()) {
                  e.preventDefault();
                  handleSkillInputChange(skillInput);
                  setSkillInput("");
                }
              }}
              placeholder={loadingSkills ? "Loading skills..." : "Type a skill and press Enter, or click suggestions below..."}
              disabled={loadingSkills || isCreatingSkill}
              className={`w-full rounded-lg border ${errors.skills ? 'border-red-500' : 'border-slate-700'} bg-[#0F172A] px-4 py-2.5 pr-10 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-60`}
            />
            {(loadingSkills || isCreatingSkill) && (
              <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-green-400" />
            )}
          </div>
          
          {errors.skills && (
            <p className="mt-1 text-xs text-red-400">{errors.skills}</p>
          )}

          {/* Skill Suggestions - Show when there are available skills */}
          {!loadingSkills && availableSkills.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1.5">Suggested skills:</p>
              <div className="flex flex-wrap gap-1.5">
                {availableSkills
                  .filter((skill) =>
                    skillInput.length === 0 || 
                    skill.value.toLowerCase().includes(skillInput.toLowerCase())
                  )
                  .slice(0, 15)
                  .map((skill) => (
                    <button
                      key={skill._id}
                      type="button"
                      onClick={() => {
                        toggleSkill(skill.value);
                        setSkillInput("");
                      }}
                      className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-400 transition hover:bg-blue-500/20 hover:border-blue-500/40"
                    >
                      {skill.value}
                    </button>
                  ))}
              </div>
              {availableSkills.length > 15 && (
                <p className="text-xs text-gray-500 mt-1">
                  +{availableSkills.length - 15} more skills available
                </p>
              )}
            </div>
          )}

          {/* Show message when no skills are available */}
          {!loadingSkills && availableSkills.length === 0 && masterSkills.length > 0 && (
            <p className="mt-2 text-xs text-amber-400">
              All skills are selected. You can type new skills and press Enter to add them.
            </p>
          )}

          {/* Show loading state for skills */}
          {loadingSkills && (
            <p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
              <Loader2 className="h-3 w-3 animate-spin" />
              Loading skill suggestions...
            </p>
          )}

          {/* Selected Skills */}
          {formData.skills && formData.skills.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1.5">Selected skills:</p>
              <div className="flex flex-wrap gap-1.5">
                {formData.skills.map((item: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30"
                  >
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

          <p className="mt-2 text-xs text-gray-500">
            {!loadingSkills && masterSkills.length === 0 && !isCreatingSkill
              ? "No skills found. Type a skill and press Enter to create it."
              : "Type a skill and press Enter to add it. Click on suggested skills to select them."}
          </p>
        </div>

        {/* Certifications - Enter key separated */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Certifications
            <span className="text-xs text-gray-500 ml-2">(Press Enter to add)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={certificationInput}
              onChange={(e) => setCertificationInput(e.target.value)}
              onKeyDown={(e) =>
                handleArrayKeyDown(
                  e,
                  certificationInput,
                  setCertificationInput,
                  "certifications",
                  formData.certifications || [],
                )
              }
              placeholder="Type and press Enter to add..."
              className="flex-1 rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          {formData.certifications && formData.certifications.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {formData.certifications.map((item: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20"
                >
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
          )}
          <p className="mt-1 text-xs text-gray-500">
            Press Enter after each certification to add it to the list
          </p>
        </div>

        {/* Benefits - Enter key separated */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Benefits
            <span className="text-xs text-gray-500 ml-2">(Press Enter to add)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={benefitInput}
              onChange={(e) => setBenefitInput(e.target.value)}
              onKeyDown={(e) =>
                handleArrayKeyDown(
                  e,
                  benefitInput,
                  setBenefitInput,
                  "benefits",
                  formData.benefits || [],
                )
              }
              placeholder="Type and press Enter to add..."
              className="flex-1 rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          {formData.benefits && formData.benefits.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {formData.benefits.map((item: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                >
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
          )}
          <p className="mt-1 text-xs text-gray-500">
            Press Enter after each benefit to add it to the list
          </p>
        </div>

        {/* Tags - Enter key separated */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Tags
            <span className="text-xs text-gray-500 ml-2">(Press Enter to add)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) =>
                handleArrayKeyDown(
                  e,
                  tagInput,
                  setTagInput,
                  "tags",
                  formData.tags || [],
                )
              }
              placeholder="Type and press Enter to add..."
              className="flex-1 rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          {formData.tags && formData.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {formData.tags.map((item: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"
                >
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
          )}
          <p className="mt-1 text-xs text-gray-500">
            Press Enter after each tag to add it to the list
          </p>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            <FileText className="mr-1.5 inline h-4 w-4" />
            Job Description
          </label>
          <textarea
            value={formData.description || ""}
            onChange={(event) =>
              handleChange("description", event.target.value)
            }
            placeholder="Describe the job role, responsibilities, and requirements..."
            rows={4}
            className="w-full resize-none rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        {/* Package Details */}
        <div className="mt-2 border-t border-slate-800 pt-4 md:col-span-2">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-300">
           
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