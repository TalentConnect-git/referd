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

export default function BasicJobDetails({
  formData,
  setFormData,
  onNext,
}: BasicJobDetailsProps) {
  const [masterDegrees, setMasterDegrees] = useState<MasterDegree[]>([]);
  const [streamsByDegree, setStreamsByDegree] = useState<
    Record<string, MasterStream[]>
  >({});
  const [loadingDegrees, setLoadingDegrees] = useState(false);
  const [loadingStreams, setLoadingStreams] = useState(false);
  const [streamError, setStreamError] = useState("");
  const [isCreatingStream, setIsCreatingStream] = useState(false);

  // Input states for Enter key separation
  const [skillInput, setSkillInput] = useState("");
  const [certificationInput, setCertificationInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [jobRoleInput, setJobRoleInput] = useState("");

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

  const handleChange = (field: string, value: unknown) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleStateChange = (_stateId: string, stateName: string) => {
    setFormData({
      ...formData,
      state: stateName,
      city: "",
    });
  };

  const handleCityChange = (cityName: string) => {
    handleChange("city", cityName);
  };

  const handlePackageChange = (field: string, value: unknown) => {
    setFormData({
      ...formData,
      packageDetails: {
        ...formData.packageDetails,
        [field]: value,
      },
    });
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

  // Generic function to handle Enter key for array fields
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

  const availableStreams = useMemo(() => {
    const degreeId = formData.degreeId || "";
    if (!degreeId) return [];
    return streamsByDegree[degreeId] || [];
  }, [formData.degreeId, streamsByDegree]);

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
            className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        {/* Number of Openings */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            <Users className="mr-1.5 inline h-4 w-4" />
            Number of Openings
          </label>
          <input
            type="number"
            min={0}
            value={formData.numberOfOpenings || ""}
            onChange={(event) =>
              handleChange(
                "numberOfOpenings",
                event.target.value ? Number(event.target.value) : 0,
              )
            }
            placeholder="e.g., 5"
            className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        {/* Application Deadline */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            <Calendar className="mr-1.5 inline h-4 w-4" />
            Application Deadline
          </label>
          <input
            type="date"
            value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ""}
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
            min={new Date().toISOString().split('T')[0]}
            className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Select the last date for applications. Defaults to 30 days from now.
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
            onChange={(event) => handleChange("broadcastType", event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="Everyone">Everyone</option>
            <option value="Location">Location</option>
          </select>
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
            required
          />
        </div>

        {/* Work Mode */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Work Mode <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.workMode?.[0] || ""}
            onChange={(event) => handleChange("workMode", [event.target.value])}
            className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="">Select Work Mode</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
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
            className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="">Select Employment Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
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
            Degree
          </label>
          <select
            value={formData.degreeId || ""}
            onChange={(event) => void handleDegreeChange(event.target.value)}
            disabled={loadingDegrees}
            className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:opacity-50"
          >
            <option value="">Select Degree</option>
            {masterDegrees.map((degree) => (
              <option key={degree._id} value={degree._id}>
                {degree.value}
              </option>
            ))}
          </select>
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
            Specialization / Stream
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
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 pr-10 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-60"
                />
                {(loadingStreams || isCreatingStream) && (
                  <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-green-400" />
                )}
              </div>
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

        {/* Skills - Enter key separated */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Skills Required{" "}
            <span className="text-xs text-gray-500">(Press Enter to add)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) =>
                handleArrayKeyDown(
                  e,
                  skillInput,
                  setSkillInput,
                  "skills",
                  formData.skills || [],
                )
              }
              placeholder="Type and press Enter to add..."
              className="flex-1 rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          {formData.skills && formData.skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {formData.skills.map((item: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"
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
          )}
          <p className="mt-1 text-xs text-gray-500">
            Press Enter after each skill to add it to the list
          </p>
        </div>

        {/* Certifications - Enter key separated */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Certifications{" "}
            <span className="text-xs text-gray-500">(Press Enter to add)</span>
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
            Benefits{" "}
            <span className="text-xs text-gray-500">(Press Enter to add)</span>
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
            Tags{" "}
            <span className="text-xs text-gray-500">(Press Enter to add)</span>
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
                Total CTC
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
                className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">
                Joining Bonus
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
          onClick={onNext}
          className="rounded-lg bg-green-500 px-6 py-2.5 font-medium text-black transition-colors hover:bg-green-400"
        >
          Next Step →
        </button>
      </div>
    </div>
  );
}