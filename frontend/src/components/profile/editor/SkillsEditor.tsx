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

        // Deduplicate and sort
        setSkillOptions([...new Set(skillsList)].sort());
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

  // Filter skills based on input - Limited to prevent overload
  const filteredSkills = useMemo(() => {
    const searchTerm = inputValue.toLowerCase().trim();
    if (!searchTerm) return [];

    return skillOptions
      .filter((skill) =>
        skill.toLowerCase().includes(searchTerm)
      )
      .filter(
        (skill) =>
          !skills.some(
            (selected) => selected.toLowerCase() === skill.toLowerCase()
          )
      )
      .slice(0, 15); // Limit to 15 results to prevent overload
  }, [skillOptions, inputValue, skills]);

  // Popular skills - Limited to 12
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
        setSkillOptions((prev) => [...new Set([...prev, existingSkill])].sort());
        if (!skills.includes(existingSkill)) {
          onChange([...skills, existingSkill]);
        }
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || data.error || "Error adding skill");
      }

      const createdSkill = data.skills || trimmedSkill;
      setSkillOptions((prev) => [...new Set([...prev, createdSkill])].sort());
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
    <div className="w-full space-y-3">
      <div className="relative w-full" ref={dropdownRef}>
        {/* Main input area */}
        <div className="relative w-full">
          <div className="flex min-h-10 flex-wrap gap-1.5 rounded-lg border border-theme bg-background-soft p-2 transition focus-within:border-primary focus-within:ring-1 focus-within:ring-primary sm:min-h-12 sm:gap-2 sm:p-3">
            {/* Selected Skills - Responsive */}
            {skills.map((skill) => (
              <span
                key={skill}
                className="badge badge-primary inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-medium sm:gap-1 sm:px-3 sm:py-1 sm:text-xs"
              >
                <span className="truncate max-w-[120px] sm:max-w-none">{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:text-danger transition-colors"
                >
                  <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </button>
              </span>
            ))}

            {/* Input - Responsive */}
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
              className="min-w-[80px] flex-1 bg-transparent text-xs text-primary outline-none placeholder:text-muted sm:min-w-[120px] sm:text-sm"
            />
          </div>

          {/* Loading indicator */}
          {(loading || isCreating) && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 sm:right-3">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary sm:h-4 sm:w-4" />
            </div>
          )}
        </div>

        {/* Dropdown - Responsive */}
        {isOpen && (
          <div className="surface-card absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-theme shadow-xl sm:mt-2">
            <div className="max-h-60 overflow-y-auto p-2 sm:max-h-80 sm:p-3">
              {/* Search results - Show only when typing */}
              {inputValue.length > 0 && (
                <div className="mb-2 sm:mb-3">
                  <div className="px-2 py-1 text-[10px] font-medium uppercase text-muted">
                    Search Results
                  </div>
                  {loading ? (
                    <div className="flex items-center justify-center px-3 py-2 text-xs text-muted sm:px-4 sm:py-3 sm:text-sm">
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
                      Loading...
                    </div>
                  ) : filteredSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {filteredSkills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleSelectOrAddSkill(skill)}
                          className="inline-flex items-center rounded-full border border-theme px-2 py-1 text-[10px] text-primary transition-colors hover:border-primary/40 hover:bg-primary-soft sm:px-3 sm:py-1.5 sm:text-xs"
                        >
                          <span className="truncate max-w-[100px] sm:max-w-none">{skill}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-2 py-2 text-xs text-muted sm:px-3 sm:text-sm">
                      No matching skills found
                    </div>
                  )}

                  {/* Create new skill option */}
                  {inputValue.trim() && !exactMatchExists && (
                    <button
                      type="button"
                      onClick={() => handleSelectOrAddSkill(inputValue)}
                      disabled={isCreating}
                      className="mt-1.5 flex w-full items-center gap-2 rounded-lg border border-dashed border-primary/40 px-3 py-2 text-left text-xs text-primary transition-colors hover:bg-primary-soft sm:mt-2 sm:px-4 sm:py-2.5 sm:text-sm"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
                          Adding "{inputValue}"...
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="truncate">Create new skill: "{inputValue}"</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Popular Skills - Show only when not typing */}
              {inputValue.length === 0 && popularSkills.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2 py-1 sm:gap-2">
                    <Sparkles className="h-2.5 w-2.5 text-warning sm:h-3 sm:w-3" />
                    <span className="text-[10px] font-medium uppercase text-muted">
                      Popular Skills
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {popularSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSelectOrAddSkill(skill)}
                        className="inline-flex items-center rounded-full border border-theme px-2 py-1 text-[10px] text-primary transition-colors hover:border-primary/40 hover:bg-primary-soft sm:px-3 sm:py-1.5 sm:text-xs"
                      >
                        <span className="truncate max-w-[80px] sm:max-w-none">{skill}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {popularSkills.length === 0 && !loading && inputValue.length === 0 && (
                <div className="px-3 py-4 text-center sm:px-4 sm:py-6">
                  <p className="text-xs text-muted sm:text-sm">No skills available</p>
                  <p className="mt-0.5 text-[10px] text-muted sm:mt-1 sm:text-xs">
                    Start typing to create a new skill
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Skill count - Responsive */}
      {skills.length > 0 && (
        <p className="text-[10px] text-muted sm:text-xs">
          {skills.length} skill{skills.length !== 1 ? "s" : ""} added
        </p>
      )}
    </div>
  );
}