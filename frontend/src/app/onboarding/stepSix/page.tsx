"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  ChevronLeft,
  FileIcon,
  ChevronRight,
  FileCode,
  AlertCircle,
  Link,
  UploadIcon,
  Wrench,
  XIcon,
  Loader2,
  DollarSign,
  Euro,
  PoundSterling,
  IndianRupee,
  Plus,
  X,
  Check,
} from "lucide-react";

type SkillsFormData = {
  skills: string[];
  certifications: string[];
  linkedin: string;
  github: string;
  portfolio: string;
  project: File | null;
  toolsAndPlatforms: string[];
  referralSource: string;
  expectedSalaryCurrency: string;
  expectedSalaryAmount: string;
  currentSalaryCurrency: string;
  currentSalaryAmount: string;
};

type FormErrors = Partial<
  Record<
    | "linkedin"
    | "github"
    | "portfolio"
    | "expectedSalaryAmount"
    | "currentSalaryAmount",
    string
  >
>;

type ParsedResume = {
  skills?: string[];
  certifications?: string[] | string;
  linkedin?: string;
  linkedin_url?: string;
  github?: string;
  github_url?: string;
  portfolio?: string;
  portfolio_url?: string;
};

const toolsAndPlatforms = [
  "VS Code",
  "Figma",
  "JIRA",
  "Slack",
  "Trello",
  "Postman",
  "AWS Console",
  "Google Cloud Platform",
  "Azure Portal",
  "Docker",
  "Kubernetes",
  "Jenkins",
  "GitHub",
  "GitLab",
  "Bitbucket",
  "Notion",
  "Confluence",
];

const certificationOptions = [
  // AWS Certifications
  "AWS Certified Cloud Practitioner",
  "AWS Certified Solutions Architect - Associate",
  "AWS Certified Solutions Architect - Professional",
  "AWS Certified Developer - Associate",
  "AWS Certified SysOps Administrator - Associate",
  "AWS Certified DevOps Engineer - Professional",
  "AWS Certified Security - Specialty",
  "AWS Certified Machine Learning - Specialty",
  "AWS Certified Data Analytics - Specialty",
  "AWS Certified Advanced Networking - Specialty",
  "AWS Certified Database - Specialty",
  "AWS Certified SAP on AWS - Specialty",

  // Google Cloud Certifications
  "Google Cloud Digital Leader",
  "Google Cloud Associate Cloud Engineer",
  "Google Cloud Professional Cloud Architect",
  "Google Cloud Professional Data Engineer",
  "Google Cloud Professional Cloud DevOps Engineer",
  "Google Cloud Professional Cloud Security Engineer",
  "Google Cloud Professional Cloud Network Engineer",
  "Google Cloud Professional Machine Learning Engineer",
  "Google Cloud Professional Collaboration Engineer",

  // Microsoft Azure Certifications
  "Microsoft Azure Fundamentals",
  "Microsoft Azure Administrator Associate",
  "Microsoft Azure Developer Associate",
  "Microsoft Azure Solutions Architect Expert",
  "Microsoft Azure DevOps Engineer Expert",
  "Microsoft Azure Security Engineer Associate",
  "Microsoft Azure Data Scientist Associate",
  "Microsoft Azure AI Engineer Associate",
  "Microsoft Azure Database Administrator Associate",

  // Other Cloud Certifications
  "Oracle Cloud Infrastructure Certified",
  "IBM Cloud Certified",
  "VMware Certified Professional",

  // Other Popular Certifications
  "Certified Kubernetes Administrator (CKA)",
  "Certified Kubernetes Application Developer (CKAD)",
  "Red Hat Certified Engineer (RHCE)",
  "Cisco Certified Network Associate (CCNA)",
  "Cisco Certified Network Professional (CCNP)",
  "Certified Information Systems Security Professional (CISSP)",
  "Certified Ethical Hacker (CEH)",
  "CompTIA Security+",
  "CompTIA Network+",
  "Project Management Professional (PMP)",
  "Certified Scrum Master (CSM)",
  "SAFe Agilist",
  "ITIL Foundation",
  "Certified Data Professional (CDP)",
  "Oracle Database Administrator Certified Professional",
  "Salesforce Certified Administrator",
  "Salesforce Certified Developer",
  "HubSpot Inbound Marketing Certification",
  "Google Analytics Individual Qualification",
  "Meta Certified Digital Marketing Associate",
  "Adobe Certified Expert",
  "Autodesk Certified Professional",
  "SolidWorks Certification",
  "Lean Six Sigma Green Belt",
  "Lean Six Sigma Black Belt",
  "Certified Internal Auditor (CIA)",
  "Certified Public Accountant (CPA)",
  "Chartered Financial Analyst (CFA)",
  "Financial Risk Manager (FRM)",
  "Certified Supply Chain Professional (CSCP)",
];

const currencyOptions = [
  { value: "INR", label: "₹ INR", icon: IndianRupee },
  { value: "USD", label: "$ USD", icon: DollarSign },
  { value: "EUR", label: "€ EUR", icon: Euro },
  { value: "GBP", label: "£ GBP", icon: PoundSterling },
];

const isValidLinkedIn = (url: string) => {
  if (!url.trim()) return true;
  const cleanUrl = url
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/^\/+|\/+$/g, "");
  if (!cleanUrl.includes("linkedin.com")) return false;
  return /^linkedin\.com\/[a-z0-9-_/]+\/?$/.test(cleanUrl);
};

const isValidGithub = (url: string) => {
  if (!url.trim()) return true;
  const cleanUrl = url
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/^\/+|\/+$/g, "");
  if (!cleanUrl.includes("github.com")) return false;
  return /^github\.com\/[a-z0-9-_]+\/?$/.test(cleanUrl);
};

const isValidPortfolio = (url: string) => {
  if (!url.trim()) return true;
  try {
    const parsedUrl = new URL(url);
    const lowerUrl = parsedUrl.href.toLowerCase();
    if (lowerUrl.includes("linkedin.com") || lowerUrl.includes("github.com")) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export default function SkillsAchievementsForm() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const certDropdownRef = useRef<HTMLDivElement | null>(null);

  const [skillOptions, setSkillOptions] = useState<string[]>([]);
  const [customSkillSearch, setCustomSkillSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);

  // Certification states
  const [certSearchTerm, setCertSearchTerm] = useState("");
  const [isCertDropdownOpen, setIsCertDropdownOpen] = useState(false);

  const [formData, setFormData] = useState<SkillsFormData>({
    skills: [],
    certifications: [],
    linkedin: "",
    github: "",
    portfolio: "",
    project: null,
    toolsAndPlatforms: [],
    referralSource: "",
    expectedSalaryCurrency: "INR",
    expectedSalaryAmount: "",
    currentSalaryCurrency: "INR",
    currentSalaryAmount: "",
  });

  // Load saved data from localStorage
  useEffect(() => {
    const parsedResume = localStorage.getItem("parsedResume");
    const savedSkills = localStorage.getItem("skillsAchievements");

    if (savedSkills) {
      const parsed = JSON.parse(savedSkills);
      setFormData((prev) => ({
        ...prev,
        ...parsed,
        certifications: parsed.certifications || [],
      }));
      return;
    }

    if (!parsedResume) return;

    const parsedData: ParsedResume = JSON.parse(parsedResume);

    // Handle certifications - could be array or string
    let certs: string[] = [];
    if (Array.isArray(parsedData.certifications)) {
      certs = parsedData.certifications;
    } else if (typeof parsedData.certifications === "string") {
      certs = parsedData.certifications.split("\n").filter(Boolean);
    }

    setFormData((prev) => ({
      ...prev,
      skills: parsedData.skills || [],
      certifications: certs,
      linkedin: parsedData.linkedin || parsedData.linkedin_url || "",
      github: parsedData.github || parsedData.github_url || "",
      portfolio: parsedData.portfolio || parsedData.portfolio_url || "",
    }));
  }, []);

  // Fetch skills from API
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
        const skills = Array.isArray(data)
          ? data
              .map((item) => {
                if (typeof item === "string") return item;
                return item.skills || item.value || item.name;
              })
              .filter(Boolean)
          : [];
        setSkillOptions([...new Set(skills)]);
      } catch (error) {
        console.error("Skill fetch error:", error);
      } finally {
        setLoadingSkills(false);
      }
    };
    fetchSkills();
  }, [API_URL]);

  // Handle click outside for skills dropdown
  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  // Handle click outside for certification dropdown
  useEffect(() => {
    const closeCertDropdown = (e: MouseEvent) => {
      if (!certDropdownRef.current?.contains(e.target as Node)) {
        setIsCertDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", closeCertDropdown);
    return () => document.removeEventListener("mousedown", closeCertDropdown);
  }, []);

  const filteredSkillOptions = useMemo(() => {
    return skillOptions
      .filter((skill) =>
        skill.toLowerCase().includes(customSkillSearch.toLowerCase()),
      )
      .filter(
        (skill) =>
          !formData.skills.some(
            (selected) => selected.toLowerCase() === skill.toLowerCase(),
          ),
      )
      .sort();
  }, [skillOptions, customSkillSearch, formData.skills]);

  // Filter certifications
  const filteredCertifications = useMemo(() => {
    return certificationOptions
      .filter((cert) =>
        cert.toLowerCase().includes(certSearchTerm.toLowerCase()),
      )
      .filter(
        (cert) =>
          !formData.certifications.some(
            (selected) => selected.toLowerCase() === cert.toLowerCase(),
          ),
      )
      .sort();
  }, [certSearchTerm, formData.certifications]);

  // Add new skill via API
  const handleAddNewSkill = async (skillName: string) => {
    const trimmedSkill = skillName.trim();
    if (!trimmedSkill) return;

    try {
      setIsCreatingSkill(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/meta/add-skill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ skills: trimmedSkill }),
      });

      const data = await res.json();

      if (res.status === 409) {
        const existingSkill = data.skills || trimmedSkill;
        setSkillOptions((prev) => [...new Set([...prev, existingSkill])]);
        setFormData((prev) => ({
          ...prev,
          skills: [...new Set([...prev.skills, existingSkill])],
        }));
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || data.error || "Error adding skill");
      }

      const createdSkill = data.skills || trimmedSkill;
      setSkillOptions((prev) => [...new Set([...prev, createdSkill])]);
      setFormData((prev) => ({
        ...prev,
        skills: [...new Set([...prev.skills, createdSkill])],
      }));
    } catch (error) {
      console.error("Add skill error:", error);
      setFormData((prev) => ({
        ...prev,
        skills: [...new Set([...prev.skills, trimmedSkill])],
      }));
    } finally {
      setIsCreatingSkill(false);
    }
  };

  const handleSelectOrAddSkill = async (skillName: string) => {
    const trimmedSkill = skillName.trim();
    if (!trimmedSkill) return;

    const alreadySelected = formData.skills.some(
      (skill) => skill.toLowerCase() === trimmedSkill.toLowerCase(),
    );

    if (alreadySelected) {
      setCustomSkillSearch("");
      setIsDropdownOpen(false);
      return;
    }

    const existsInGlobalList = skillOptions.some(
      (skill) => skill.toLowerCase() === trimmedSkill.toLowerCase(),
    );

    if (existsInGlobalList) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill],
      }));
    } else {
      await handleAddNewSkill(trimmedSkill);
    }

    setCustomSkillSearch("");
    setIsDropdownOpen(false);
  };

  // Certification handlers
  const handleSelectCertification = (cert: string) => {
    if (formData.certifications.includes(cert)) return;
    setFormData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, cert],
    }));
    setCertSearchTerm("");
    setIsCertDropdownOpen(false);
  };

  const handleRemoveCertification = (certToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter(
        (cert) => cert !== certToRemove,
      ),
    }));
  };

  const handleAddCustomCertification = () => {
    const trimmedCert = certSearchTerm.trim();
    if (!trimmedCert) return;
    if (formData.certifications.includes(trimmedCert)) {
      setCertSearchTerm("");
      setIsCertDropdownOpen(false);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, trimmedCert],
    }));
    setCertSearchTerm("");
    setIsCertDropdownOpen(false);
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const removeTool = (toolToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      toolsAndPlatforms: prev.toolsAndPlatforms.filter(
        (tool) => tool !== toolToRemove,
      ),
    }));
  };

  const handleToolsSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const tool = e.target.value;
    if (!tool) return;
    setFormData((prev) => ({
      ...prev,
      toolsAndPlatforms: prev.toolsAndPlatforms.includes(tool)
        ? prev.toolsAndPlatforms
        : [...prev.toolsAndPlatforms, tool],
    }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      project: file,
    }));
  };

  const handleNext = () => {
    const newErrors: FormErrors = {};

    if (!isValidLinkedIn(formData.linkedin)) {
      newErrors.linkedin =
        "Enter valid LinkedIn URL like linkedin.com/in/username";
    }

    if (!isValidGithub(formData.github)) {
      newErrors.github = "Enter valid GitHub URL like github.com/username";
    }

    if (formData.portfolio) {
      const lowerPortfolio = formData.portfolio.toLowerCase();
      if (lowerPortfolio.includes("linkedin.com")) {
        newErrors.portfolio =
          "LinkedIn URL should be entered in LinkedIn field";
      } else if (lowerPortfolio.includes("github.com")) {
        newErrors.portfolio = "GitHub URL should be entered in GitHub field";
      } else if (!isValidPortfolio(formData.portfolio)) {
        newErrors.portfolio = "Enter a valid portfolio URL";
      }
    }

    if (
      formData.expectedSalaryAmount &&
      isNaN(Number(formData.expectedSalaryAmount))
    ) {
      newErrors.expectedSalaryAmount = "Enter a valid number";
    }

    if (
      formData.currentSalaryAmount &&
      isNaN(Number(formData.currentSalaryAmount))
    ) {
      newErrors.currentSalaryAmount = "Enter a valid number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    localStorage.setItem(
      "skillsAchievements",
      JSON.stringify({
        ...formData,
        project: formData.project ? formData.project.name : null,
        certifications: formData.certifications,
      }),
    );

    router.push("/onboarding/complete-profile");
  };

  return (
    <div className="min-h-screen bg-black px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-3xl items-center justify-center">
        <div className="w-full rounded-3xl border border-[#2a3a52] bg-[#0f172a] p-7 shadow-2xl lg:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 border border-green-500/20">
              <Award className="h-8 w-8 text-green-400" />
            </div>

            <h1 className="text-[26px] font-bold tracking-[-0.04em] text-white">
              Skills & Achievements
            </h1>

            <p className="mt-2 text-[13px] text-gray-400">
              Highlight your skills and achievements to stand out to employers.
            </p>
          </div>

          <div className="space-y-5">
            {/* Skills */}
            <div ref={dropdownRef}>
              <label className="mb-2 block text-[13px] font-medium text-white">
                Skills
              </label>

              <div className="relative">
                <div className="flex min-h-12 flex-wrap gap-2 rounded-lg border border-[#2a3a52] bg-[#0f172a] p-3 transition focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/15">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[12px] font-medium text-green-400"
                    >
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)}>
                        <XIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}

                  <input
                    type="text"
                    value={customSkillSearch}
                    onFocus={() => setIsDropdownOpen(true)}
                    onChange={(e) => {
                      setCustomSkillSearch(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    placeholder={
                      loadingSkills
                        ? "Loading skills..."
                        : "Search skills like React, Node.js"
                    }
                    className="min-w-[160px] flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-gray-500"
                  />
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-[#2a3a52] bg-[#0f172a] shadow-2xl">
                    {isCreatingSkill && (
                      <div className="flex items-center gap-2 px-4 py-3 text-[13px] text-gray-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Adding skill...
                      </div>
                    )}

                    {filteredSkillOptions.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSelectOrAddSkill(skill)}
                        className="block w-full border-b border-[#2a3a52] px-4 py-3 text-left text-[13px] text-white transition last:border-none hover:bg-green-500/10"
                      >
                        {skill}
                      </button>
                    ))}

                    {customSkillSearch &&
                      !skillOptions.some(
                        (skill) =>
                          skill.toLowerCase() ===
                          customSkillSearch.toLowerCase(),
                      ) && (
                        <button
                          type="button"
                          onClick={() =>
                            handleSelectOrAddSkill(customSkillSearch)
                          }
                          className="block w-full px-4 py-3 text-left text-[13px] font-medium text-green-400 transition hover:bg-green-500/10"
                          disabled={isCreatingSkill}
                        >
                          {isCreatingSkill ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Adding...
                            </span>
                          ) : (
                            `Add "${customSkillSearch}"`
                          )}
                        </button>
                      )}

                    {!loadingSkills &&
                      !customSkillSearch &&
                      filteredSkillOptions.length === 0 && (
                        <p className="px-4 py-3 text-[13px] text-gray-400">
                          No skills available. Type to add new skill.
                        </p>
                      )}
                  </div>
                )}
              </div>
            </div>

            {/* Certifications - New Multi-Select with Hardcoded Options */}
            <div ref={certDropdownRef}>
              <label className="mb-2 block text-[13px] font-medium text-white">
                Certifications
              </label>

              <div className="relative">
                <div className="flex min-h-12 flex-wrap gap-2 rounded-lg border border-[#2a3a52] bg-[#0f172a] p-3 transition focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/15">
                  {formData.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[12px] font-medium text-green-400"
                    >
                      <Award className="h-3 w-3" />
                      {cert}
                      <button
                        type="button"
                        onClick={() => handleRemoveCertification(cert)}
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}

                  <input
                    type="text"
                    value={certSearchTerm}
                    onFocus={() => setIsCertDropdownOpen(true)}
                    onChange={(e) => {
                      setCertSearchTerm(e.target.value);
                      setIsCertDropdownOpen(true);
                    }}
                    placeholder={
                      formData.certifications.length === 0
                        ? "Search certifications like AWS, Google Cloud..."
                        : "Add more certifications..."
                    }
                    className="min-w-[160px] flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-gray-500"
                  />
                </div>

                {isCertDropdownOpen && (
                  <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-[#2a3a52] bg-[#0f172a] shadow-2xl">
                    {filteredCertifications.length > 0 ? (
                      filteredCertifications.slice(0, 20).map((cert) => (
                        <button
                          key={cert}
                          type="button"
                          onClick={() => handleSelectCertification(cert)}
                          className="flex w-full items-center gap-2 border-b border-[#2a3a52] px-4 py-3 text-left text-[13px] text-white transition last:border-none hover:bg-green-500/10"
                        >
                          <Award className="h-4 w-4 text-green-400" />
                          {cert}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3">
                        {certSearchTerm ? (
                          <button
                            type="button"
                            onClick={handleAddCustomCertification}
                            className="flex w-full items-center gap-2 text-[13px] text-green-400 hover:bg-green-500/10 rounded-lg px-2 py-2 transition"
                          >
                            <Plus className="h-4 w-4" />
                            Add "{certSearchTerm}"
                          </button>
                        ) : (
                          <p className="text-[13px] text-gray-400">
                            Type to search certifications
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Tools & Platforms */}
            <div>
              <label className="mb-2 block text-[13px] font-medium text-white">
                Tools & Platforms Known
              </label>

              {formData.toolsAndPlatforms.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {formData.toolsAndPlatforms.map((tool) => (
                    <span
                      key={tool}
                      className="flex items-center gap-1 rounded-full border border-[#2a3a52] bg-[#0f172a] px-3 py-1 text-[12px] text-white"
                    >
                      {tool}
                      <button type="button" onClick={() => removeTool(tool)}>
                        <XIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center">
                <Wrench className="mr-3 h-5 w-5 text-gray-500" />
                <select
                  onChange={handleToolsSelect}
                  value=""
                  className="h-11 w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 text-[13px] text-white outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/15"
                >
                  <option value="">Select a tool or platform</option>
                  {toolsAndPlatforms.map((tool) => (
                    <option key={tool} value={tool}>
                      {tool}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Expected Salary */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[13px] font-medium text-white">
                  Expected Salary
                </label>
                <div className="flex gap-2">
                  <select
                    name="expectedSalaryCurrency"
                    value={formData.expectedSalaryCurrency}
                    onChange={handleChange}
                    className="w-24 rounded-lg border border-[#2a3a52] bg-[#0f172a] px-3 py-2 text-[13px] text-white outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/15"
                  >
                    {currencyOptions.map((curr) => (
                      <option key={curr.value} value={curr.value}>
                        {curr.label}
                      </option>
                    ))}
                  </select>
                  <input
                    name="expectedSalaryAmount"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.expectedSalaryAmount}
                    onChange={handleChange}
                    placeholder="e.g. 1200000"
                    className="flex-1 rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2 text-[13px] text-white outline-none transition placeholder:text-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/15"
                  />
                </div>
                {errors.expectedSalaryAmount && (
                  <p className="mt-1 text-[12px] text-red-400">
                    {errors.expectedSalaryAmount}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-medium text-white">
                  Current Salary
                </label>
                <div className="flex gap-2">
                  <select
                    name="currentSalaryCurrency"
                    value={formData.currentSalaryCurrency}
                    onChange={handleChange}
                    className="w-24 rounded-lg border border-[#2a3a52] bg-[#0f172a] px-3 py-2 text-[13px] text-white outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/15"
                  >
                    {currencyOptions.map((curr) => (
                      <option key={curr.value} value={curr.value}>
                        {curr.label}
                      </option>
                    ))}
                  </select>
                  <input
                    name="currentSalaryAmount"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.currentSalaryAmount}
                    onChange={handleChange}
                    placeholder="e.g. 800000"
                    className="flex-1 rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 py-2 text-[13px] text-white outline-none transition placeholder:text-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/15"
                  />
                </div>
                {errors.currentSalaryAmount && (
                  <p className="mt-1 text-[12px] text-red-400">
                    {errors.currentSalaryAmount}
                  </p>
                )}
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <label className="mb-2 block text-[13px] font-medium text-white">
                LinkedIn Profile
              </label>
              <div className="flex items-center">
                <Link className="mr-3 h-5 w-5 text-gray-500" />
                <div className="w-full">
                  <input
                    name="linkedin"
                    type="url"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="linkedin.com/in/username"
                    className="h-11 w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 text-[13px] text-white outline-none transition placeholder:text-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/15"
                  />
                  {errors.linkedin && (
                    <p className="mt-1 text-[12px] text-red-400">
                      {errors.linkedin}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* GitHub */}
            <div>
              <label className="mb-2 block text-[13px] font-medium text-white">
                GitHub Profile
              </label>
              <div className="flex items-center">
                <FileCode className="mr-3 h-5 w-5 text-gray-500" />
                <div className="w-full">
                  <input
                    name="github"
                    type="url"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="github.com/username"
                    className="h-11 w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 text-[13px] text-white outline-none transition placeholder:text-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/15"
                  />
                  {errors.github && (
                    <p className="mt-1 text-[12px] text-red-400">
                      {errors.github}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Portfolio */}
            <div>
              <label className="mb-2 block text-[13px] font-medium text-white">
                Portfolio Website
              </label>
              <div className="flex items-center">
                <Link className="mr-3 h-5 w-5 text-gray-500" />
                <div className="w-full">
                  <input
                    name="portfolio"
                    type="url"
                    value={formData.portfolio}
                    onChange={handleChange}
                    placeholder="https://yourportfolio.com"
                    className="h-11 w-full rounded-lg border border-[#2a3a52] bg-[#0f172a] px-4 text-[13px] text-white outline-none transition placeholder:text-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/15"
                  />
                  {errors.portfolio && (
                    <p className="mt-1 text-[12px] text-red-400">
                      {errors.portfolio}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Project Upload */}
            <div>
              <label className="mb-2 block text-[13px] font-medium text-white">
                Upload a Project{" "}
                <span className="text-gray-400">(Optional)</span>
              </label>

              <label className="flex h-14 cursor-pointer items-center rounded-lg border-2 border-dashed border-[#2a3a52] bg-[#0f172a] px-4 transition hover:border-green-500 hover:bg-green-500/5">
                <UploadIcon className="mr-3 h-5 w-5 text-gray-500" />
                <span className="truncate text-[13px] text-gray-400">
                  {formData.project
                    ? formData.project.name
                    : "Click to upload project file (PDF, PPT, PPTX, JPG, PNG)"}
                </span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.ppt,.pptx,.jpg,.jpeg,.png"
                />
              </label>

              {/* File type instructions */}
              <div className="mt-1.5 space-y-1">
                <p className="text-xs text-gray-500">
                  Supported formats: PDF, PPT, PPTX, JPG, PNG
                </p>
                <p className="text-xs text-yellow-400/70 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  ⚠️ DOC, DOCX and ZIP files are not supported
                </p>
              </div>

              {/* Show file info after upload */}
              {formData.project && (
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/30 px-3 py-2">
                  <FileIcon className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400 truncate flex-1">
                    {formData.project.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {(formData.project.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, project: null });
                      // Reset file input
                      const fileInput = document.querySelector(
                        'input[type="file"]',
                      ) as HTMLInputElement;
                      if (fileInput) fileInput.value = "";
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-10 flex-1 items-center justify-center rounded-lg border border-[#2a3a52] bg-[#0f172a] text-[13px] font-semibold text-gray-300 transition hover:border-green-500/30 hover:bg-green-500/5 hover:text-white"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex h-10 flex-1 items-center justify-center rounded-lg bg-green-500 text-[13px] font-semibold text-black transition-all duration-300 hover:bg-green-400 active:scale-[0.99]"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
