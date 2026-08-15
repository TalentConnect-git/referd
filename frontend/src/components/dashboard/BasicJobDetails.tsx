"use client";
import { useEffect, useMemo, useState } from "react";
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
import TagComboBox from "./TagComboBox";

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
  const [isCreatingDegree, setIsCreatingDegree] = useState(false);
  const [degreeInput, setDegreeInput] = useState("");
  const [streamInput, setStreamInput] = useState("");

  // Input states for Enter key separation
  const [skillInput, setSkillInput] = useState("");
  const [jobRoleInput, setJobRoleInput] = useState("");
  const [customCertInput, setCustomCertInput] = useState("");
  const [customBenefitInput, setCustomBenefitInput] = useState("");
  const [customTagInput, setCustomTagInput] = useState("");

  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // User profile states
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<string>("");
  const [profileError, setProfileError] = useState<string>("");

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

  // Fetch user profile for currentCompany
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoadingProfile(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setProfileError("User not authenticated");
          setLoadingProfile(false);
          return;
        }

        const response = await axiosInstance.get("/api/onboarding/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("profile data", response);

        if (response.data) {
          const company = response.data.currentCompany || "";
          setCurrentCompany(company);

          // Update formData with company name - use direct object update
          if (company) {
            setFormData({
              ...formData,
              companyName: company,
            });
          }

          if (!company) {
            setProfileError(
              "Please add your current company to your profile before posting a job.",
            );
          } else {
            setProfileError("");
          }
        } else {
          setProfileError("Failed to load user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setProfileError("Failed to load user profile. Please try again.");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
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

  // Handle degree creation
  const handleCreateDegree = async (degreeValue: string) => {
    if (!degreeValue.trim()) return;

    try {
      setIsCreatingDegree(true);
      const response = await createMasterData("DEGREE", degreeValue.trim());

      if (response.success && response.data) {
        const newDegree: MasterDegree = {
          _id: response.data._id || `temp-${Date.now()}`,
          value: response.data.value || degreeValue.trim(),
          type: "DEGREE",
        };

        setMasterDegrees((prev) => [...prev, newDegree]);

        // Auto-select the newly created degree
        setFormData({
          ...formData,
          minEducation: newDegree.value,
          degree: [newDegree.value],
          degreeId: newDegree._id,
          studentStreams: [],
        });

        // Load streams for the new degree
        await loadStreamsForDegree(newDegree._id);
        setDegreeInput("");
        setErrors((prev) => ({ ...prev, degreeId: "" }));
      }
    } catch (error) {
      console.error("Error creating degree:", error);
      setErrors((prev) => ({
        ...prev,
        degreeId: "Failed to create degree. Please try again.",
      }));
    } finally {
      setIsCreatingDegree(false);
    }
  };

  // Handle degree change
  const handleDegreeChange = async (degreeId: string): Promise<void> => {
    if (!degreeId) {
      setFormData({
        ...formData,
        minEducation: "",
        degree: [],
        degreeId: "",
        studentStreams: [],
      });
      setStreamError("");
      return;
    }

    const selectedDegree = masterDegrees.find((d) => d._id === degreeId);

    if (selectedDegree) {
      setFormData({
        ...formData,
        minEducation: selectedDegree.value,
        degree: [selectedDegree.value],
        degreeId: degreeId,
        studentStreams: [],
      });
    }

    await loadStreamsForDegree(degreeId);
  };

  // Handle degree toggle (for TagComboBox)
  const toggleDegree = (item: { id: string; label: string }) => {
    if (item.id === formData.degreeId) {
      // Deselect
      handleDegreeChange("");
    } else {
      handleDegreeChange(item.id);
    }
    setDegreeInput("");
  };

  // Handle stream creation on Enter key
  const handleStreamCreate = async (value: string) => {
    const degreeId = formData.degreeId || "";

    if (!degreeId) {
      setStreamError("Please select a degree first before adding a stream.");
      return;
    }

    // Check if stream already exists in the list
    const currentStreams = streamsByDegree[degreeId] || [];
    const streamValues = currentStreams.map((s) => s.value.toLowerCase());

    // Check if already selected
    const selectedStreams = formData.studentStreams || [];
    if (selectedStreams.includes(value)) {
      return;
    }

    // If stream exists in master data, just add it to selected
    if (streamValues.includes(value.toLowerCase())) {
      const existingStream = currentStreams.find(
        (s) => s.value.toLowerCase() === value.toLowerCase(),
      );
      if (existingStream && !selectedStreams.includes(existingStream.value)) {
        handleChange("studentStreams", [
          ...selectedStreams,
          existingStream.value,
        ]);
      }
      return;
    }

    // Create new stream
    try {
      setIsCreatingStream(true);
      const response = await createMasterData("STREAM", value, degreeId);

      if (response.success && response.data) {
        const newStream: MasterStream = {
          _id: response.data._id || `temp-${Date.now()}`,
          value: response.data.value || value,
          type: "STREAM",
          parent: degreeId,
          isActive: true,
          isCustom: true,
        };

        // Update streams cache
        setStreamsByDegree((prev) => ({
          ...prev,
          [degreeId]: [...(prev[degreeId] || []), newStream],
        }));

        // Add to selected streams
        const currentSelected = formData.studentStreams || [];
        if (!currentSelected.includes(newStream.value)) {
          handleChange("studentStreams", [...currentSelected, newStream.value]);
        }

        setStreamError("");
      }
    } catch (error) {
      console.error("Error creating stream:", error);
      setStreamError("Failed to create stream. Please try again.");
    } finally {
      setIsCreatingStream(false);
    }
  };

  // Handle stream input change
  const handleStreamInputChange = (value: string) => {
    setStreamInput(value);
    if (errors.studentStreams) {
      setErrors((prev) => ({ ...prev, studentStreams: "" }));
    }
  };

  // Handle stream toggle
  const toggleStream = (item: { id: string; label: string }) => {
    const currentStreams = formData.studentStreams || [];
    const nextStreams = currentStreams.includes(item.label)
      ? currentStreams.filter((s: string) => s !== item.label)
      : [...currentStreams, item.label];
    handleChange("studentStreams", nextStreams);
    setStreamInput("");
  };

  // Handle stream removal
  const removeStream = (value: string) => {
    const currentStreams = formData.studentStreams || [];
    handleChange(
      "studentStreams",
      currentStreams.filter((s: string) => s !== value),
    );
  };

  // Handle skill creation
  const handleSkillCreate = async (value: string) => {
    const skill = value.trim();
    if (!skill) return;

    const currentSkills = masterSkills;
    const skillValues = currentSkills.map((s) => s.skills.toLowerCase());

    if (skillValues.includes(skill.toLowerCase())) {
      // Skill exists, just add to selected if not already
      const updatedSkills = [...(formData.skills || [])];
      if (!updatedSkills.includes(skill)) {
        updatedSkills.push(skill);
        handleChange("skills", updatedSkills);
      }
      return;
    }

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

        // Add to selected
        const updatedSkills = [...(formData.skills || [])];
        if (!updatedSkills.includes(skill)) {
          updatedSkills.push(skill);
          handleChange("skills", updatedSkills);
        }
      } else if (res.status === 409) {
        // Skill already exists, just add it to selected
        const updatedSkills = [...(formData.skills || [])];
        if (!updatedSkills.includes(skill)) {
          updatedSkills.push(skill);
          handleChange("skills", updatedSkills);
        }
      } else {
        console.error("Error creating skill:", data);
      }
    } catch (error) {
      console.error("Error creating skill:", error);
    } finally {
      setIsCreatingSkill(false);
    }
  };

  // Handle skill toggle
  const toggleSkill = (item: { id: string; label: string }) => {
    const currentSkills = formData.skills || [];
    const nextSkills = currentSkills.includes(item.label)
      ? currentSkills.filter((skill: string) => skill !== item.label)
      : [...currentSkills, item.label];
    handleChange("skills", nextSkills);
    setSkillInput("");
  };

  // Handle skill removal
  const removeSkill = (value: string) => {
    const currentSkills = formData.skills || [];
    handleChange(
      "skills",
      currentSkills.filter((skill: string) => skill !== value),
    );
  };

  // Handle job role creation
  const handleJobRoleCreate = async (value: string) => {
    const role = value.trim();
    if (!role) return;

    const currentRoles = masterJobRoles;
    const roleValues = currentRoles.map((r) => r.value.toLowerCase());

    if (roleValues.includes(role.toLowerCase())) {
      // Role exists, just add to selected if not already
      const updatedRoles = [...(formData.jobTitle || [])];
      if (!updatedRoles.includes(role)) {
        updatedRoles.push(role);
        handleChange("jobTitle", updatedRoles);
      }
      return;
    }

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
        },
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

        // Add to selected
        const updatedRoles = [...(formData.jobTitle || [])];
        if (!updatedRoles.includes(role)) {
          updatedRoles.push(role);
          handleChange("jobTitle", updatedRoles);
        }
      }
    } catch (error) {
      console.error("Error creating job role:", error);
    } finally {
      setIsCreatingJobRole(false);
    }
  };

  // Handle job role toggle
  const toggleJobRole = (item: { id: string; label: string }) => {
    const currentRoles = formData.jobTitle || [];
    const nextRoles = currentRoles.includes(item.label)
      ? currentRoles.filter((role: string) => role !== item.label)
      : [...currentRoles, item.label];
    handleChange("jobTitle", nextRoles);
    setJobRoleInput("");
  };

  // Handle job role removal
  const removeJobRole = (value: string) => {
    const currentRoles = formData.jobTitle || [];
    handleChange(
      "jobTitle",
      currentRoles.filter((role: string) => role !== value),
    );
  };

  // Handle certification creation (local, no API)
  const handleCertificationCreate = (value: string) => {
    const newCert = value.trim();
    if (!newCert) return;
    const currentCerts = formData.certifications || [];
    if (!currentCerts.includes(newCert)) {
      handleChange("certifications", [...currentCerts, newCert]);
    }
    setCustomCertInput("");
  };

  // Handle certification toggle
  const toggleCertification = (item: { id: string; label: string }) => {
    const currentCerts = formData.certifications || [];
    const nextCerts = currentCerts.includes(item.label)
      ? currentCerts.filter((c: string) => c !== item.label)
      : [...currentCerts, item.label];
    handleChange("certifications", nextCerts);
    setCustomCertInput("");
  };

  // Handle certification removal
  const removeCertification = (value: string) => {
    const currentCerts = formData.certifications || [];
    handleChange(
      "certifications",
      currentCerts.filter((c: string) => c !== value),
    );
  };

  // Handle benefit creation (local, no API)
  const handleBenefitCreate = (value: string) => {
    const newBenefit = value.trim();
    if (!newBenefit) return;
    const currentBenefits = formData.benefits || [];
    if (!currentBenefits.includes(newBenefit)) {
      handleChange("benefits", [...currentBenefits, newBenefit]);
    }
    setCustomBenefitInput("");
  };

  // Handle benefit toggle
  const toggleBenefit = (item: { id: string; label: string }) => {
    const currentBenefits = formData.benefits || [];
    const nextBenefits = currentBenefits.includes(item.label)
      ? currentBenefits.filter((b: string) => b !== item.label)
      : [...currentBenefits, item.label];
    handleChange("benefits", nextBenefits);
    setCustomBenefitInput("");
  };

  // Handle benefit removal
  const removeBenefit = (value: string) => {
    const currentBenefits = formData.benefits || [];
    handleChange(
      "benefits",
      currentBenefits.filter((b: string) => b !== value),
    );
  };

  // Handle tag creation (local, no API)
  const handleTagCreate = (value: string) => {
    const newTag = value.trim();
    if (!newTag) return;
    const currentTags = formData.tags || [];
    if (!currentTags.includes(newTag)) {
      handleChange("tags", [...currentTags, newTag]);
    }
    setCustomTagInput("");
  };

  // Handle tag toggle
  const toggleTag = (item: { id: string; label: string }) => {
    const currentTags = formData.tags || [];
    const nextTags = currentTags.includes(item.label)
      ? currentTags.filter((t: string) => t !== item.label)
      : [...currentTags, item.label];
    handleChange("tags", nextTags);
    setCustomTagInput("");
  };

  // Handle tag removal
  const removeTag = (value: string) => {
    const currentTags = formData.tags || [];
    handleChange(
      "tags",
      currentTags.filter((t: string) => t !== value),
    );
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
      state: stateName,
      stateCode: stateCode,
      city: "",
      location: stateName ? [stateName] : [],
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
      location: cityName
        ? [cityName, formData.state || ""].filter(Boolean)
        : formData.state
          ? [formData.state]
          : [],
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

  // Remove item from array (generic)
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

    // Validate current company
    if (!currentCompany || currentCompany.trim() === "") {
      newErrors.company =
        "Please add your current company to your profile before posting a job.";
    }

    // Required: Job Title (at least one)
    if (!formData.jobTitle || formData.jobTitle.length === 0) {
      newErrors.jobTitle = "At least one job title is required";
    }

    // Required: Job Description
    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description =
        "Job description is required (minimum 10 characters)";
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
    if (
      !formData.workMode ||
      formData.workMode.length === 0 ||
      !formData.workMode[0]
    ) {
      newErrors.workMode = "Work mode is required";
    }

    // Required: Employment Type
    if (
      !formData.employmentType ||
      formData.employmentType.length === 0 ||
      !formData.employmentType[0]
    ) {
      newErrors.employmentType = "Employment type is required";
    }

    // Required: Degree
    if (!formData.degreeId) {
      newErrors.degreeId = "Degree is required";
    }

    // Required: Student Streams (at least one)
    if (!formData.studentStreams || formData.studentStreams.length === 0) {
      newErrors.studentStreams =
        "At least one stream/specialization is required";
    }

    // Required: Skills (at least one)
    if (!formData.skills || formData.skills.length === 0) {
      newErrors.skills = "At least one skill is required";
    }

    // Required: Package Details - Total CTC (Allow 0)
    if (
      formData.packageDetails?.totalCTC === undefined ||
      formData.packageDetails?.totalCTC === null ||
      formData.packageDetails.totalCTC < 0
    ) {
      newErrors["packageDetails.totalCTC"] = "Total CTC is required";
    }

    // Validate if Location is selected but state not provided
    if (formData.broadcastType === "Location") {
      if (!formData.state) {
        newErrors.state =
          "State is required when Location broadcast is selected";
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

  // Convert master data to suggestion format
  const degreeSuggestions = useMemo(() => {
    return masterDegrees.map((d) => ({
      id: d._id,
      label: d.value,
    }));
  }, [masterDegrees]);

  const streamSuggestions = useMemo(() => {
    return availableStreams.map((s) => ({
      id: s._id,
      label: s.value,
    }));
  }, [availableStreams]);

  const skillSuggestions = useMemo(() => {
    return masterSkills.map((s) => ({
      id: s._id,
      label: s.skills,
    }));
  }, [masterSkills]);

  const jobRoleSuggestions = useMemo(() => {
    return masterJobRoles.map((r) => ({
      id: r._id,
      label: r.value,
    }));
  }, [masterJobRoles]);

  const certificationSuggestions = useMemo(() => {
    return certificationOptions.map((c, index) => ({
      id: `cert-${index}`,
      label: c,
    }));
  }, []);

  const benefitSuggestions = useMemo(() => {
    return benefitOptions.map((b, index) => ({
      id: `benefit-${index}`,
      label: b,
    }));
  }, []);

  const tagSuggestions = useMemo(() => {
    return tagOptions.map((t, index) => ({
      id: `tag-${index}`,
      label: t,
    }));
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-[var(--primary)]" />
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          Basic Job Details
        </h2>
        <span className="ml-auto text-sm text-[var(--text-muted)]">
          Step 1 of 2
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Current Company - Read-only field */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            <Building2 className="mr-1.5 inline h-4 w-4" />
            Current Company <span className="text-[var(--danger)]">*</span>
            <span className="ml-2 text-xs text-[var(--text-muted)]">
              (Auto-detected from your profile)
            </span>
          </label>

          <div className="relative">
            <input
              type="text"
              value={currentCompany}
              disabled
              placeholder={
                loadingProfile
                  ? "Loading profile..."
                  : "Add your current company to post jobs"
              }
              className={`input-field bg-[var(--bg-secondary)] cursor-not-allowed ${errors.company ? "border-[var(--danger)]" : ""}`}
            />
            {loadingProfile && (
              <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-[var(--primary)]" />
            )}
            {!loadingProfile && currentCompany && (
              <Check className="absolute right-3 top-3 h-4 w-4 text-[var(--success)]" />
            )}
          </div>

          {errors.company && (
            <p className="form-error mt-1">{errors.company}</p>
          )}
          {!errors.company && profileError && !currentCompany && (
            <p className="mt-1 text-xs text-[var(--warning)]">
              ⚠️ {profileError}
            </p>
          )}
          {!currentCompany && !loadingProfile && (
            <p className="form-helper mt-1 text-[var(--warning)]">
              Please update your profile with your current company to post jobs.
            </p>
          )}
        </div>

        {/* Job Title - Using TagComboBox */}
        <div className="md:col-span-2">
          <TagComboBox
            selected={formData.jobTitle || []}
            suggestions={jobRoleSuggestions}
            inputValue={jobRoleInput}
            onInputChange={(value) => {
              setJobRoleInput(value);
              if (errors.jobTitle) {
                setErrors((prev) => ({ ...prev, jobTitle: "" }));
              }
            }}
            onToggleSuggestion={toggleJobRole}
            onCreate={handleJobRoleCreate}
            onRemoveChip={removeJobRole}
            loading={loadingJobRoles || isCreatingJobRole}
            disabled={loadingJobRoles || isCreatingJobRole}
            placeholder={
              loadingJobRoles
                ? "Loading job roles..."
                : "Type job title and press Enter, or select from below..."
            }
            allowCreate={true}
            error={errors.jobTitle}
            label="Job Title"
            labelIcon={<Briefcase className="h-4 w-4" />}
            required={true}
            helperText="(Select from existing or type to create new)"
          />
        </div>

        {/* Number of Openings */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            <Users className="mr-1.5 inline h-4 w-4" />
            Number of Openings <span className="text-[var(--danger)]">*</span>
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
            className={`input-field ${errors.numberOfOpenings ? "border-[var(--danger)]" : ""}`}
          />
          {errors.numberOfOpenings && (
            <p className="form-error mt-1">{errors.numberOfOpenings}</p>
          )}
        </div>

        {/* Application Deadline */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            <Calendar className="mr-1.5 inline h-4 w-4" />
            Application Deadline <span className="text-[var(--danger)]">*</span>
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
            className={`input-field ${errors.endDate ? "border-[var(--danger)]" : ""}`}
          />
          {errors.endDate && (
            <p className="form-error mt-1">{errors.endDate}</p>
          )}
          <p className="form-helper mt-1">
            Select the last date for applications.
          </p>
        </div>

        {/* Work Mode */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            Work Mode <span className="text-[var(--danger)]">*</span>
          </label>
          <select
            value={formData.workMode?.[0] || ""}
            onChange={(event) => handleChange("workMode", [event.target.value])}
            className={`select-field ${errors.workMode ? "border-[var(--danger)]" : ""}`}
          >
            <option value="">Select Work Mode</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          {errors.workMode && (
            <p className="form-error mt-1">{errors.workMode}</p>
          )}
        </div>

        {/* Employment Type */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            Employment Type <span className="text-[var(--danger)]">*</span>
          </label>
          <select
            value={formData.employmentType?.[0] || ""}
            onChange={(event) =>
              handleChange("employmentType", [event.target.value])
            }
            className={`select-field ${errors.employmentType ? "border-[var(--danger)]" : ""}`}
          >
            <option value="">Select Employment Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Freelance">Freelance</option>
          </select>
          {errors.employmentType && (
            <p className="form-error mt-1">{errors.employmentType}</p>
          )}
        </div>

        {/* Experience */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            Experience Required
          </label>
          <select
            value={formData.experience || ""}
            onChange={(event) => handleChange("experience", event.target.value)}
            className="select-field"
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
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            <Radio className="mr-1.5 inline h-4 w-4" />
            Broadcast Type
          </label>
          <select
            value={formData.broadcastType || "Everyone"}
            onChange={(event) =>
              handleChange("broadcastType", event.target.value)
            }
            className="select-field"
          >
            <option value="Everyone">Everyone</option>
            <option value="Location">Location</option>
          </select>
          <p className="form-helper mt-1">
            {formData.broadcastType === "Location"
              ? `📍 Job will be visible to users in ${formData.state || "selected state"}${formData.city ? `, ${formData.city}` : ""} only`
              : "🌍 Job will be visible to all users"}
          </p>
          {formData.broadcastType === "Location" && !formData.state && (
            <p className="mt-1 text-xs text-[var(--warning)]">
              ⚠️ Please select a state for location-based broadcasting
            </p>
          )}
        </div>

        {/* State and City */}
        <div className="md:col-span-2">
          <StateCitySelector
            selectedState={formData.state || ""}
            selectedCity={formData.city || ""}
            onStateChange={handleStateChange}
            onCityChange={handleCityChange}
            required={false}
          />
          {errors.state && <p className="form-error mt-1">{errors.state}</p>}
          <p className="form-helper mt-1">
            {formData.state && formData.city
              ? `📍 Location: ${formData.state}, ${formData.city}`
              : formData.state
                ? `📍 State: ${formData.state}`
                : formData.city
                  ? `📍 City: ${formData.city}`
                  : "📍 No location selected (optional)"}
          </p>
        </div>

        {/* Degree - Using TagComboBox */}
        {/* Degree - Using TagComboBox */}
        <div>
          <TagComboBox
            selected={
              formData.degreeId
                ? [
                    masterDegrees.find((d) => d._id === formData.degreeId)
                      ?.value || "",
                  ]
                : []
            }
            suggestions={degreeSuggestions}
            inputValue={degreeInput}
            onInputChange={(value) => {
              setDegreeInput(value);
              if (errors.degreeId) {
                setErrors((prev) => ({ ...prev, degreeId: "" }));
              }
            }}
            onToggleSuggestion={(item) => {
              // Find the degree by label
              const degree = masterDegrees.find((d) => d.value === item.label);
              if (degree) {
                toggleDegree({ id: degree._id, label: degree.value });
              } else if (item.id === formData.degreeId) {
                // Deselect
                handleDegreeChange("");
              } else {
                // Try to find by ID match
                toggleDegree(item);
              }
            }}
            onCreate={handleCreateDegree}
            onRemoveChip={() => handleDegreeChange("")}
            loading={loadingDegrees || isCreatingDegree}
            disabled={loadingDegrees || isCreatingDegree}
            placeholder={
              loadingDegrees
                ? "Loading degrees..."
                : "Type degree and press Enter, or select from below..."
            }
            allowCreate={true}
            error={errors.degreeId}
            label="Degree"
            labelIcon={<BookOpen className="h-4 w-4" />}
            required={true}
            helperText="(Select or type to create)"
          />
        </div>

        {/* Specialization / Stream - Using TagComboBox */}
        <div>
          {!formData.degreeId ? (
            <div className="input-field text-[var(--text-muted)] cursor-not-allowed">
              Select a degree first
            </div>
          ) : (
            <TagComboBox
              selected={formData.studentStreams || []}
              suggestions={streamSuggestions}
              inputValue={streamInput}
              onInputChange={handleStreamInputChange}
              onToggleSuggestion={toggleStream}
              onCreate={handleStreamCreate}
              onRemoveChip={removeStream}
              loading={loadingStreams || isCreatingStream}
              disabled={
                loadingStreams || isCreatingStream || !formData.degreeId
              }
              placeholder={
                loadingStreams
                  ? "Loading streams..."
                  : "Type stream and press Enter, or select from below"
              }
              allowCreate={true}
              error={errors.studentStreams || streamError}
              label="Specialization / Stream"
              labelIcon={<BookOpen className="h-4 w-4" />}
              required={true}
              helperText="(Select or type to create)"
            />
          )}
        </div>

        {/* Skills - Using TagComboBox */}
        <div className="md:col-span-2">
          <TagComboBox
            selected={formData.skills || []}
            suggestions={skillSuggestions}
            inputValue={skillInput}
            onInputChange={(value) => {
              setSkillInput(value);
              if (errors.skills) {
                setErrors((prev) => ({ ...prev, skills: "" }));
              }
            }}
            onToggleSuggestion={toggleSkill}
            onCreate={handleSkillCreate}
            onRemoveChip={removeSkill}
            loading={loadingSkills || isCreatingSkill}
            disabled={loadingSkills || isCreatingSkill}
            placeholder={
              loadingSkills
                ? "Loading skills..."
                : "Type a skill and press Enter, or select from below..."
            }
            allowCreate={true}
            error={errors.skills}
            label="Skills Required"
            labelIcon={<Sparkles className="h-4 w-4" />}
            required={true}
            helperText="(Select from existing or type to create new)"
          />
        </div>

        {/* Certifications - Using TagComboBox */}
        <div className="md:col-span-2">
          <TagComboBox
            selected={formData.certifications || []}
            suggestions={certificationSuggestions}
            inputValue={customCertInput}
            onInputChange={setCustomCertInput}
            onToggleSuggestion={toggleCertification}
            onCreate={handleCertificationCreate}
            onRemoveChip={removeCertification}
            loading={false}
            disabled={false}
            placeholder="Type custom certification and press Enter..."
            allowCreate={true}
            error={undefined}
            label="Certifications"
            labelIcon={<Award className="h-4 w-4" />}
            required={false}
            helperText="(Select from options or type custom)"
          />
        </div>

        {/* Benefits - Using TagComboBox */}
        <div className="md:col-span-2">
          <TagComboBox
            selected={formData.benefits || []}
            suggestions={benefitSuggestions}
            inputValue={customBenefitInput}
            onInputChange={setCustomBenefitInput}
            onToggleSuggestion={toggleBenefit}
            onCreate={handleBenefitCreate}
            onRemoveChip={removeBenefit}
            loading={false}
            disabled={false}
            placeholder="Type custom benefit and press Enter..."
            allowCreate={true}
            error={undefined}
            label="Benefits"
            labelIcon={<Sparkles className="h-4 w-4" />}
            required={false}
            helperText="(Select from options or type custom)"
          />
        </div>

        {/* Tags - Using TagComboBox */}
        <div className="md:col-span-2">
          <TagComboBox
            selected={formData.tags || []}
            suggestions={tagSuggestions}
            inputValue={customTagInput}
            onInputChange={setCustomTagInput}
            onToggleSuggestion={toggleTag}
            onCreate={handleTagCreate}
            onRemoveChip={removeTag}
            loading={false}
            disabled={false}
            placeholder="Type custom tag and press Enter..."
            allowCreate={true}
            error={undefined}
            label="Tags"
            labelIcon={<Tag className="h-4 w-4" />}
            required={false}
            helperText="(Select from options or type custom)"
          />
        </div>

        {/* Job Description */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            <FileText className="mr-1.5 inline h-4 w-4" />
            Job Description <span className="text-[var(--danger)]">*</span>
            <span className="ml-2 text-xs text-[var(--text-muted)]">
              (Minimum 10 characters)
            </span>
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
            className={`textarea-field ${errors.description ? "border-[var(--danger)]" : ""}`}
          />
          {errors.description && (
            <p className="form-error mt-1">{errors.description}</p>
          )}
          <p className="form-helper mt-1">
            {formData.description?.length || 0} characters (minimum 10 required)
          </p>
        </div>

        {/* Package Details */}
        <div className="mt-2 border-t border-[var(--border)] pt-4 md:col-span-2">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
            Package Details
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs text-[var(--text-muted)]">
                Currency
              </label>
              <select
                value={formData.packageDetails?.currency || "INR"}
                onChange={(event) =>
                  handlePackageChange("currency", event.target.value)
                }
                className="select-field"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-[var(--text-muted)]">
                Total CTC <span className="text-[var(--danger)]">*</span>
               
              </label>
              <input
                type="number"
                min={0}
                step="any"
                value={
                  formData.packageDetails?.totalCTC !== undefined &&
                  formData.packageDetails?.totalCTC !== null
                    ? formData.packageDetails.totalCTC
                    : ""
                }
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "") {
                    handlePackageChange("totalCTC", "");
                  } else {
                    const numValue = Number(value);
                    if (!isNaN(numValue) && numValue >= 0) {
                      handlePackageChange("totalCTC", numValue);
                    }
                  }
                  if (errors["packageDetails.totalCTC"]) {
                    setErrors((prev) => ({
                      ...prev,
                      "packageDetails.totalCTC": "",
                    }));
                  }
                }}
                placeholder="e.g., 1200000"
                className={`input-field ${errors["packageDetails.totalCTC"] ? "border-[var(--danger)]" : ""}`}
              />
              {errors["packageDetails.totalCTC"] && (
                <p className="form-error mt-1">
                  {errors["packageDetails.totalCTC"]}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs text-[var(--text-muted)]">
                Fixed Pay
               
              </label>
              <input
                type="number"
                min={0}
                step="any"
                value={
                  formData.packageDetails?.fixedPay !== undefined &&
                  formData.packageDetails?.fixedPay !== null
                    ? formData.packageDetails.fixedPay
                    : ""
                }
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "") {
                    handlePackageChange("fixedPay", "");
                  } else {
                    const numValue = Number(value);
                    if (!isNaN(numValue) && numValue >= 0) {
                      handlePackageChange("fixedPay", numValue);
                    }
                  }
                }}
                placeholder="e.g., 50000"
                className={`input-field ${errors["packageDetails.fixedPay"] ? "border-[var(--danger)]" : ""}`}
              />
              {errors["packageDetails.fixedPay"] && (
                <p className="form-error mt-1">
                  {errors["packageDetails.fixedPay"]}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs text-[var(--text-muted)]">
                Variable Pay
               
              </label>
              <input
                type="number"
                min={0}
                step="any"
                value={
                  formData.packageDetails?.joiningBonus !== undefined &&
                  formData.packageDetails?.joiningBonus !== null
                    ? formData.packageDetails.joiningBonus
                    : ""
                }
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "") {
                    handlePackageChange("joiningBonus", "");
                  } else {
                    const numValue = Number(value);
                    if (!isNaN(numValue) && numValue >= 0) {
                      handlePackageChange("joiningBonus", numValue);
                    }
                  }
                }}
                placeholder="e.g., 50000"
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t border-[var(--border)] pt-4">
        <button
          type="button"
          onClick={handleNext}
          disabled={!currentCompany || loadingProfile}
          className={`btn-primary rounded-lg px-6 py-2.5 font-medium ${
            !currentCompany || loadingProfile
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {loadingProfile ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </span>
          ) : (
            "Next Step →"
          )}
        </button>
      </div>
    </div>
  );
}
