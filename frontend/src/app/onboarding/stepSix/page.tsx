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
  "Google Cloud Digital Leader",
  "Google Cloud Associate Cloud Engineer",
  "Google Cloud Professional Cloud Architect",
  "Google Cloud Professional Data Engineer",
  "Google Cloud Professional Cloud DevOps Engineer",
  "Google Cloud Professional Cloud Security Engineer",
  "Google Cloud Professional Cloud Network Engineer",
  "Google Cloud Professional Machine Learning Engineer",
  "Google Cloud Professional Collaboration Engineer",
  "Microsoft Azure Fundamentals",
  "Microsoft Azure Administrator Associate",
  "Microsoft Azure Developer Associate",
  "Microsoft Azure Solutions Architect Expert",
  "Microsoft Azure DevOps Engineer Expert",
  "Microsoft Azure Security Engineer Associate",
  "Microsoft Azure Data Scientist Associate",
  "Microsoft Azure AI Engineer Associate",
  "Microsoft Azure Database Administrator Associate",
  "Oracle Cloud Infrastructure Certified",
  "IBM Cloud Certified",
  "VMware Certified Professional",
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

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

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
    <div className="min-h-screen bg-[var(--background)] px-4 py-6 text-[var(--text-primary)] sm:px-5 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-3xl items-center justify-center">
        <div className="surface-card w-full rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl sm:p-7 lg:p-10">
          <div className="mb-6 text-center sm:mb-8">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--primary-border)] bg-[var(--primary-soft)] sm:mb-4 sm:h-16 sm:w-16">
              <Award className="h-6 w-6 text-[var(--primary)] sm:h-8 sm:w-8" />
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.04em] text-[var(--text-primary)] sm:text-[26px]">
              Skills & Achievements
            </h1>

            <p className="mt-1 text-xs text-[var(--text-muted)] sm:mt-2 sm:text-sm">
              Highlight your skills and achievements to stand out to employers.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {/* Skills */}
            <div ref={dropdownRef}>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)] sm:mb-2 sm:text-sm">
                Skills
              </label>

              <div className="relative">
                <div className="flex min-h-12 flex-wrap gap-2 rounded-lg border border-[var(--border)] bg-[var(--background-soft)] p-3 transition focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--focus-ring)]">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="badge badge-primary flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
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
                    className="min-w-[160px] flex-1 bg-transparent text-xs text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] sm:text-sm"
                  />
                </div>

                {isDropdownOpen && (
                  <div className="surface-card absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">
                    {isCreatingSkill && (
                      <div className="flex items-center gap-2 px-4 py-3 text-xs text-[var(--text-muted)] sm:text-sm">
                        <Loader2 className="h-4 w-4 animate-spin text-[var(--primary)]" />
                        Adding skill...
                      </div>
                    )}

                    {filteredSkillOptions.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSelectOrAddSkill(skill)}
                        className="block w-full border-b border-[var(--border)] px-4 py-3 text-left text-xs text-[var(--text-primary)] transition last:border-none hover:bg-[var(--primary-soft)] sm:text-sm"
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
                          className="block w-full px-4 py-3 text-left text-xs font-medium text-[var(--primary)] transition hover:bg-[var(--primary-soft)] sm:text-sm"
                          disabled={isCreatingSkill}
                        >
                          {isCreatingSkill ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin text-[var(--primary)]" />
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
                        <p className="px-4 py-3 text-xs text-[var(--text-muted)] sm:text-sm">
                          No skills available. Type to add new skill.
                        </p>
                      )}
                  </div>
                )}
              </div>
            </div>

            {/* Certifications */}
            <div ref={certDropdownRef}>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)] sm:mb-2 sm:text-sm">
                Certifications
              </label>

              <div className="relative">
                <div className="flex min-h-12 flex-wrap gap-2 rounded-lg border border-[var(--border)] bg-[var(--background-soft)] p-3 transition focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--focus-ring)]">
                  {formData.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="badge badge-primary flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
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
                    className="min-w-[160px] flex-1 bg-transparent text-xs text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] sm:text-sm"
                  />
                </div>

                {isCertDropdownOpen && (
                  <div className="surface-card absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">
                    {filteredCertifications.length > 0 ? (
                      filteredCertifications.slice(0, 20).map((cert) => (
                        <button
                          key={cert}
                          type="button"
                          onClick={() => handleSelectCertification(cert)}
                          className="flex w-full items-center gap-2 border-b border-[var(--border)] px-4 py-3 text-left text-xs text-[var(--text-primary)] transition last:border-none hover:bg-[var(--primary-soft)] sm:text-sm"
                        >
                          <Award className="h-4 w-4 text-[var(--primary)]" />
                          {cert}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3">
                        {certSearchTerm ? (
                          <button
                            type="button"
                            onClick={handleAddCustomCertification}
                            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs text-[var(--primary)] transition hover:bg-[var(--primary-soft)] sm:text-sm"
                          >
                            <Plus className="h-4 w-4" />
                            Add "{certSearchTerm}"
                          </button>
                        ) : (
                          <p className="text-xs text-[var(--text-muted)] sm:text-sm">
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
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)] sm:mb-2 sm:text-sm">
                Tools & Platforms Known
              </label>

              {formData.toolsAndPlatforms.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {formData.toolsAndPlatforms.map((tool) => (
                    <span
                      key={tool}
                      className="badge flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--background-soft)] px-3 py-1 text-xs text-[var(--text-primary)]"
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
                <Wrench className="mr-3 h-5 w-5 text-[var(--text-muted)]" />
                <select
                  onChange={handleToolsSelect}
                  value=""
                  className="select-field h-10 text-xs sm:h-11 sm:text-sm"
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
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)] sm:mb-2 sm:text-sm">
                  Expected Salary
                </label>
                <div className="flex gap-2">
                  <select
                    name="expectedSalaryCurrency"
                    value={formData.expectedSalaryCurrency}
                    onChange={handleChange}
                    className="w-24 rounded-lg border border-[var(--border)] bg-[var(--background-soft)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--focus-ring)] sm:text-sm"
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
                    className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background-soft)] px-4 py-2 text-xs text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--focus-ring)] sm:text-sm"
                  />
                </div>
                {errors.expectedSalaryAmount && (
                  <p className="mt-1 text-xs text-[var(--danger)]">
                    {errors.expectedSalaryAmount}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)] sm:mb-2 sm:text-sm">
                  Current Salary
                </label>
                <div className="flex gap-2">
                  <select
                    name="currentSalaryCurrency"
                    value={formData.currentSalaryCurrency}
                    onChange={handleChange}
                    className="w-24 rounded-lg border border-[var(--border)] bg-[var(--background-soft)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--focus-ring)] sm:text-sm"
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
                    className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background-soft)] px-4 py-2 text-xs text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--focus-ring)] sm:text-sm"
                  />
                </div>
                {errors.currentSalaryAmount && (
                  <p className="mt-1 text-xs text-[var(--danger)]">
                    {errors.currentSalaryAmount}
                  </p>
                )}
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)] sm:mb-2 sm:text-sm">
                LinkedIn Profile
              </label>
              <div className="flex items-center">
                <Link className="mr-3 h-5 w-5 text-[var(--text-muted)]" />
                <div className="w-full">
                  <input
                    name="linkedin"
                    type="url"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="linkedin.com/in/username"
                    className="input-field h-10 text-xs sm:h-11 sm:text-sm"
                  />
                  {errors.linkedin && (
                    <p className="mt-1 text-xs text-[var(--danger)]">
                      {errors.linkedin}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* GitHub */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)] sm:mb-2 sm:text-sm">
                GitHub Profile
              </label>
              <div className="flex items-center">
                <FileCode className="mr-3 h-5 w-5 text-[var(--text-muted)]" />
                <div className="w-full">
                  <input
                    name="github"
                    type="url"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="github.com/username"
                    className="input-field h-10 text-xs sm:h-11 sm:text-sm"
                  />
                  {errors.github && (
                    <p className="mt-1 text-xs text-[var(--danger)]">
                      {errors.github}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Portfolio */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)] sm:mb-2 sm:text-sm">
                Portfolio Website
              </label>
              <div className="flex items-center">
                <Link className="mr-3 h-5 w-5 text-[var(--text-muted)]" />
                <div className="w-full">
                  <input
                    name="portfolio"
                    type="url"
                    value={formData.portfolio}
                    onChange={handleChange}
                    placeholder="https://yourportfolio.com"
                    className="input-field h-10 text-xs sm:h-11 sm:text-sm"
                  />
                  {errors.portfolio && (
                    <p className="mt-1 text-xs text-[var(--danger)]">
                      {errors.portfolio}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Project Upload */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)] sm:mb-2 sm:text-sm">
                Upload a Project{" "}
                <span className="text-[var(--text-muted)]">(Optional)</span>
              </label>

              <label className="flex h-12 cursor-pointer items-center rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--background-soft)] px-3 transition hover:border-[var(--primary-border)] hover:bg-[var(--primary-soft)] sm:h-14 sm:px-4">
                <UploadIcon className="mr-2 h-4 w-4 text-[var(--text-muted)] sm:mr-3 sm:h-5 sm:w-5" />
                <span className="truncate text-xs text-[var(--text-muted)] sm:text-sm">
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

              <div className="mt-1.5 space-y-1">
                <p className="text-xs text-[var(--text-muted)]">
                  Supported formats: PDF, PPT, PPTX, JPG, PNG
                </p>
                <p className="flex items-center gap-1 text-xs text-[var(--warning)]">
                  <AlertCircle className="h-3 w-3" />
                  ⚠️ DOC, DOCX and ZIP files are not supported
                </p>
              </div>

              {formData.project && (
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-[var(--primary-border)] bg-[var(--primary-soft)] px-3 py-2">
                  <FileIcon className="h-4 w-4 text-[var(--primary)]" />
                  <span className="flex-1 truncate text-sm text-[var(--primary)]">
                    {formData.project.name}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {(formData.project.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, project: null });
                      const fileInput = document.querySelector(
                        'input[type="file"]',
                      ) as HTMLInputElement;
                      if (fileInput) fileInput.value = "";
                    }}
                    className="text-[var(--danger)] transition-colors hover:text-[var(--danger)]/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary flex h-10 flex-1 items-center justify-center rounded-lg text-xs font-semibold sm:h-11 sm:text-sm"
            >
              <ChevronLeft className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="btn-primary flex h-10 flex-1 items-center justify-center rounded-lg text-xs font-semibold transition-all duration-300 active:scale-[0.99] sm:h-11 sm:text-sm"
            >
              Next
              <ChevronRight className="ml-1.5 h-3.5 w-3.5 sm:ml-2 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}