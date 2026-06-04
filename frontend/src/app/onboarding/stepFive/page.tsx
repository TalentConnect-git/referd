"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  FileCode,
  Link,
  UploadIcon,
  Wrench,
  XIcon,
} from "lucide-react";

type SkillsFormData = {
  skills: string[];
  certifications: string;
  linkedin: string;
  github: string;
  portfolio: string;
  project: File | null;
  toolsAndPlatforms: string[];
  referralSource: string;
};

type FormErrors = Partial<Record<"linkedin" | "github" | "portfolio", string>>;

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

  const [skillOptions, setSkillOptions] = useState<string[]>([]);
  const [customSkillSearch, setCustomSkillSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loadingSkills, setLoadingSkills] = useState(false);

  const [formData, setFormData] = useState<SkillsFormData>({
    skills: [],
    certifications: "",
    linkedin: "",
    github: "",
    portfolio: "",
    project: null,
    toolsAndPlatforms: [],
    referralSource: "",
  });

  useEffect(() => {
    const parsedResume = localStorage.getItem("parsedResume");
    const savedSkills = localStorage.getItem("skillsAchievements");

    if (savedSkills) {
      setFormData(JSON.parse(savedSkills));
      return;
    }

    if (!parsedResume) return;

    const parsedData: ParsedResume = JSON.parse(parsedResume);

    setFormData((prev) => ({
      ...prev,
      skills: parsedData.skills || [],
      certifications: Array.isArray(parsedData.certifications)
        ? parsedData.certifications.join("\n")
        : parsedData.certifications || "",
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

  const filteredSkillOptions = useMemo(() => {
    return skillOptions
      .filter((skill) =>
        skill.toLowerCase().includes(customSkillSearch.toLowerCase())
      )
      .filter(
        (skill) =>
          !formData.skills.some(
            (selected) => selected.toLowerCase() === skill.toLowerCase()
          )
      )
      .sort();
  }, [skillOptions, customSkillSearch, formData.skills]);

  const handleAddNewSkill = async (skillName: string) => {
    const trimmedSkill = skillName.trim();

    if (!trimmedSkill) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/meta/add-skill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          skills: trimmedSkill,
        }),
      });

      const data = await res.json();

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
    }
  };

  const handleSelectOrAddSkill = async (skillName: string) => {
    const trimmedSkill = skillName.trim();

    if (!trimmedSkill) return;

    const alreadySelected = formData.skills.some(
      (skill) => skill.toLowerCase() === trimmedSkill.toLowerCase()
    );

    if (alreadySelected) {
      setCustomSkillSearch("");
      setIsDropdownOpen(false);
      return;
    }

    const existsInGlobalList = skillOptions.some(
      (skill) => skill.toLowerCase() === trimmedSkill.toLowerCase()
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
        (tool) => tool !== toolToRemove
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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      newErrors.linkedin = "Enter valid LinkedIn URL like linkedin.com/in/username";
    }

    if (!isValidGithub(formData.github)) {
      newErrors.github = "Enter valid GitHub URL like github.com/username";
    }

    if (formData.portfolio) {
      const lowerPortfolio = formData.portfolio.toLowerCase();

      if (lowerPortfolio.includes("linkedin.com")) {
        newErrors.portfolio = "LinkedIn URL should be entered in LinkedIn field";
      } else if (lowerPortfolio.includes("github.com")) {
        newErrors.portfolio = "GitHub URL should be entered in GitHub field";
      } else if (!isValidPortfolio(formData.portfolio)) {
        newErrors.portfolio = "Enter a valid portfolio URL";
      }
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
      })
    );

    router.push("/onboarding/complete-profile");
  };

  return (
    <div className="min-h-screen bg-black px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-3xl items-center justify-center">
        <div className="w-full rounded-3xl border border-[var(--border)] bg-[var(--background)] p-7 shadow-2xl lg:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-soft)]">
              <Award className="h-8 w-8 text-[var(--primary)]" />
            </div>

            <h1 className="text-[26px] font-bold tracking-[-0.04em] text-white">
              Skills & Achievements
            </h1>

            <p className="mt-2 text-[13px] text-[var(--text-primary)]">
              Highlight your skills and achievements to stand out to employers.
            </p>
          </div>

          <div className="space-y-5">
            <div ref={dropdownRef}>
              <label className="mb-2 block text-[13px] font-medium text-white">
                Skills
              </label>

              <div className="relative">
                <div className="flex min-h-12 flex-wrap gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-3 transition focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/15">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 rounded-full border border-[var(--primary)]/30 bg-[var(--primary-soft)] px-3 py-1 text-[12px] font-medium text-white"
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
                    className="min-w-[160px] flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-[var(--text-muted)]"
                  />
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-white/10 bg-[var(--background)] shadow-2xl">
                    {filteredSkillOptions.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSelectOrAddSkill(skill)}
                        className="block w-full border-b border-white/5 px-4 py-3 text-left text-[13px] text-white transition last:border-none hover:bg-[var(--primary-soft)]"
                      >
                        {skill}
                      </button>
                    ))}

                    {customSkillSearch &&
                      !skillOptions.some(
                        (skill) =>
                          skill.toLowerCase() ===
                          customSkillSearch.toLowerCase()
                      ) && (
                        <button
                          type="button"
                          onClick={() =>
                            handleSelectOrAddSkill(customSkillSearch)
                          }
                          className="block w-full px-4 py-3 text-left text-[13px] font-medium text-[var(--primary)] transition hover:bg-[var(--primary-soft)]"
                        >
                          Add "{customSkillSearch}"
                        </button>
                      )}

                    {!loadingSkills &&
                      !customSkillSearch &&
                      filteredSkillOptions.length === 0 && (
                        <p className="px-4 py-3 text-[13px] text-[var(--text-primary)]">
                          No skills available.
                        </p>
                      )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[13px] font-medium text-white">
                Certifications
              </label>

              <div className="flex items-start">
                <Award className="mr-3 mt-3 h-5 w-5 text-[var(--text-primary)]" />

                <textarea
                  name="certifications"
                  rows={3}
                  value={formData.certifications}
                  onChange={handleChange}
                  placeholder="e.g. AWS Certified Developer, Google Cloud Certified"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-[13px] text-white outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[13px] font-medium text-white">
                Tools & Platforms Known
              </label>

              {formData.toolsAndPlatforms.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {formData.toolsAndPlatforms.map((tool) => (
                    <span
                      key={tool}
                      className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[12px] text-white"
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
                <Wrench className="mr-3 h-5 w-5 text-[var(--text-primary)]" />

                <select
                  onChange={handleToolsSelect}
                  value=""
                  className="h-11 w-full rounded-lg border border-white/10 bg-[var(--background)] px-4 text-[13px] text-white outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
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

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[13px] font-medium text-white">
                  LinkedIn Profile
                </label>

                <div className="flex items-center">
                  <Link className="mr-3 h-5 w-5 text-[var(--text-primary)]" />

                  <div className="w-full">
                    <input
                      name="linkedin"
                      type="url"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="linkedin.com/in/username"
                      className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 text-[13px] text-white outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                    />

                    {errors.linkedin && (
                      <p className="mt-1 text-[12px] text-red-400">
                        {errors.linkedin}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-medium text-white">
                  GitHub Profile
                </label>

                <div className="flex items-center">
                  <FileCode className="mr-3 h-5 w-5 text-[var(--text-primary)]" />

                  <div className="w-full">
                    <input
                      name="github"
                      type="url"
                      value={formData.github}
                      onChange={handleChange}
                      placeholder="github.com/username"
                      className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 text-[13px] text-white outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                    />

                    {errors.github && (
                      <p className="mt-1 text-[12px] text-red-400">
                        {errors.github}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[13px] font-medium text-white">
                Portfolio Website
              </label>

              <div className="flex items-center">
                <Link className="mr-3 h-5 w-5 text-[var(--text-primary)]" />

                <div className="w-full">
                  <input
                    name="portfolio"
                    type="url"
                    value={formData.portfolio}
                    onChange={handleChange}
                    placeholder="https://yourportfolio.com"
                    className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 text-[13px] text-white outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                  />

                  {errors.portfolio && (
                    <p className="mt-1 text-[12px] text-red-400">
                      {errors.portfolio}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[13px] font-medium text-white">
                Upload a Project{" "}
                <span className="text-[var(--text-primary)]">(Optional)</span>
              </label>

              <label className="flex h-14 cursor-pointer items-center rounded-lg border-2 border-dashed border-white/10 bg-white/[0.03] px-4 transition hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]">
                <UploadIcon className="mr-3 h-5 w-5 text-[var(--text-primary)]" />

                <span className="truncate text-[13px] text-[var(--text-primary)]">
                  {formData.project
                    ? formData.project.name
                    : "Click to upload project file PDF, ZIP, etc."}
                </span>

                <input type="file" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-10 flex-1 items-center justify-center rounded-lg border border-white/10 text-[13px] font-semibold text-white transition hover:bg-white/10"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="button-color flex h-10 flex-1 items-center justify-center rounded-lg text-[13px] font-semibold text-black transition-all duration-300 hover:brightness-110 active:scale-[0.99]"
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