import { useState, useEffect, useRef, useMemo } from "react";
import { X, Loader2, Plus, Search, Sparkles } from "lucide-react";

type SkillsEditorProps = {
  skills: string[];
  onChange: (skills: string[]) => void;
};

export function SkillsEditor({ skills, onChange }: SkillsEditorProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [skillOptions, setSkillOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch skills from API
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/meta/get-skills`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json();
        if (!res.ok) return;

        const skillsList = Array.isArray(data)
          ? data
              .map((item) => {
                if (typeof item === "string") return item;
                return item.skills || item.value || item.name;
              })
              .filter(Boolean)
          : [];

        setSkillOptions([...new Set(skillsList)]);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, [API_URL]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter skills based on input
  const filteredSkills = useMemo(() => {
    return skillOptions
      .filter((skill) =>
        skill.toLowerCase().includes(inputValue.toLowerCase())
      )
      .filter(
        (skill) =>
          !skills.some(
            (selected) => selected.toLowerCase() === skill.toLowerCase()
          )
      )
      .sort();
  }, [skillOptions, inputValue, skills]);

  // Popular skills (top 10 most relevant)
  const popularSkills = useMemo(() => {
    return skillOptions
      .filter(
        (skill) =>
          !skills.some(
            (selected) => selected.toLowerCase() === skill.toLowerCase()
          )
      )
      .slice(0, 12);
  }, [skillOptions, skills]);

  const exactMatchExists = skillOptions.some(
    (skill) => skill.toLowerCase() === inputValue.toLowerCase()
  );

  // Add new skill via API
  const handleAddNewSkill = async (skillName: string) => {
    const trimmedSkill = skillName.trim();
    if (!trimmedSkill) return;

    try {
      setIsCreating(true);
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
        if (!skills.includes(existingSkill)) {
          onChange([...skills, existingSkill]);
        }
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || data.error || "Error adding skill");
      }

      const createdSkill = data.skills || trimmedSkill;
      setSkillOptions((prev) => [...new Set([...prev, createdSkill])]);
      if (!skills.includes(createdSkill)) {
        onChange([...skills, createdSkill]);
      }
    } catch (error) {
      console.error("Add skill error:", error);
      if (!skills.includes(trimmedSkill)) {
        onChange([...skills, trimmedSkill]);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectOrAddSkill = async (skillName: string) => {
    const trimmedSkill = skillName.trim();
    if (!trimmedSkill) return;

    if (skills.some((s) => s.toLowerCase() === trimmedSkill.toLowerCase())) {
      setInputValue("");
      setIsOpen(false);
      return;
    }

    const existsInGlobalList = skillOptions.some(
      (skill) => skill.toLowerCase() === trimmedSkill.toLowerCase()
    );

    if (existsInGlobalList) {
      onChange([...skills, trimmedSkill]);
    } else {
      await handleAddNewSkill(trimmedSkill);
    }

    setInputValue("");
    setIsOpen(false);
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      handleSelectOrAddSkill(inputValue);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative" ref={dropdownRef}>
        

        {/* Main input area */}
        <div className="relative">
          <div className="flex min-h-12 flex-wrap gap-2 rounded-lg border border-[#2a3a52] bg-[#0f172a] p-3 transition focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
            {/* Selected Skills */}
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={
                loading
                  ? "Loading skills..."
                  : skills.length === 0
                  ? "Search or add skills..."
                  : "Add more skills..."
              }
              disabled={loading || isCreating}
              className="min-w-[120px] flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
            />
          </div>

          {/* Loading indicator */}
          {(loading || isCreating) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-green-400" />
            </div>
          )}
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 mt-2 w-full rounded-lg border border-[#2a3a52] bg-[#111827] shadow-xl overflow-hidden">
            <div className="max-h-80 overflow-y-auto p-2">
              {/* Search results */}
              {inputValue.length > 0 && (
                <div className="mb-2">
                  <div className="px-2 py-1 text-[10px] font-medium uppercase text-gray-500">
                    Search Results
                  </div>
                  {loading ? (
                    <div className="flex items-center justify-center px-4 py-3 text-sm text-gray-400">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading...
                    </div>
                  ) : filteredSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {filteredSkills.slice(0, 10).map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleSelectOrAddSkill(skill)}
                          className="inline-flex items-center rounded-full border border-[#2a3a52] px-3 py-1.5 text-xs text-white hover:border-green-500 hover:bg-green-500/10 transition-colors"
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-2 py-2 text-sm text-gray-400">
                      No matching skills found
                    </div>
                  )}

                  {/* Create new skill option */}
                  {inputValue.trim() && !exactMatchExists && (
                    <button
                      type="button"
                      onClick={() => handleSelectOrAddSkill(inputValue)}
                      disabled={isCreating}
                      className="mt-2 w-full rounded-lg border border-dashed border-green-500/30 px-4 py-2.5 text-left text-sm text-green-400 hover:bg-green-500/10 transition-colors flex items-center gap-2"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Adding "{inputValue}"...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Create new skill: "{inputValue}"
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Popular Skills */}
              {popularSkills.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-2 py-1">
                    <Sparkles className="h-3 w-3 text-yellow-500" />
                    <span className="text-[10px] font-medium uppercase text-gray-500">
                      Popular Skills
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {popularSkills.slice(0, 15).map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSelectOrAddSkill(skill)}
                        className="inline-flex items-center rounded-full border border-[#2a3a52] px-3 py-1.5 text-xs text-white hover:border-green-500 hover:bg-green-500/10 transition-colors"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {popularSkills.length === 0 && !loading && (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-gray-400">No skills available</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Start typing to create a new skill
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Skill count */}
      {skills.length > 0 && (
        <p className="text-xs text-gray-500">
          {skills.length} skill{skills.length !== 1 ? "s" : ""} added
        </p>
      )}
    </div>
  );
}