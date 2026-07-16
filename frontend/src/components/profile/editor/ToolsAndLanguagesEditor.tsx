import { ChipInput } from "../shared/ChipInput";
import { useState, useMemo } from "react";
import { X, Plus, Check } from "lucide-react";

type ToolsAndLanguagesEditorProps = {
  tools: string[];
  domains: string[];
  languages: string[];
  onUpdate: (field: string, items: string[]) => void;
};

// Hardcoded tool options
const PREDEFINED_TOOLS = [
  "Git",
  "GitHub",
  "GitLab",
  "Jira",
  "Confluence",
  "Slack",
  "Trello",
  "Asana",
  "Zoom",
  "Microsoft Teams",
  "Visual Studio Code",
  "IntelliJ IDEA",
  "Eclipse",
  "PyCharm",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "Jenkins",
  "CircleCI",
  "GitHub Actions",
  "Bitbucket",
  "Postman",
  "Swagger",
  "Figma",
  "Sketch",
  "Adobe XD",
  "Photoshop",
  "Illustrator",
  "Premiere Pro",
  "After Effects",
  "Blender",
  "Unity",
  "Unreal Engine",
  "Android Studio",
  "Xcode",
  "Selenium",
  "JUnit",
  "TestNG",
  "Jenkins",
  "SonarQube",
  "New Relic",
  "Datadog",
  "Splunk",
  "ElasticSearch",
  "Kibana",
  "Grafana",
  "Prometheus",
  "Tableau",
  "Power BI",
  "Looker",
  "Salesforce",
  "HubSpot",
  "Zendesk",
  "Intercom",
  "Mailchimp",
  "Google Analytics",
  "Mixpanel",
  "Amplitude",
  "Segment",
  "Redis",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Oracle",
  "SQL Server",
  "Firebase",
  "Supabase",
  "Nginx",
  "Apache",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "C#",
  "Ruby",
  "PHP",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "TypeScript",
  "JavaScript",
  "React",
  "Angular",
  "Vue.js",
  "Next.js",
  "NestJS",
  "Spring Boot",
  "Django",
  "Flask",
  "Express.js",
  "TensorFlow",
  "PyTorch",
  "Keras",
  "Scikit-learn",
  "Pandas",
  "NumPy",
  "Matplotlib",
  "Seaborn",
  "Jupyter",
  "Anaconda",
  "RStudio",
  "VS Code",
  "Sublime Text",
  "Atom",
  "Notepad++",
  "Vim",
  "Emacs",
];

// Hardcoded domain options
const PREDEFINED_DOMAINS = [
  "Web Development",
  "Mobile Development",
  "Desktop Development",
  "Cloud Computing",
  "DevOps",
  "Cybersecurity",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Deep Learning",
  "Natural Language Processing",
  "Computer Vision",
  "Big Data",
  "Data Engineering",
  "Data Analytics",
  "Business Intelligence",
  "Digital Marketing",
  "Content Marketing",
  "Social Media Marketing",
  "Search Engine Optimization (SEO)",
  "Search Engine Marketing (SEM)",
  "Email Marketing",
  "Affiliate Marketing",
  "Product Management",
  "Project Management",
  "Agile Methodology",
  "Scrum",
  "Kanban",
  "Lean Management",
  "Financial Analysis",
  "Investment Banking",
  "Risk Management",
  "Compliance",
  "Auditing",
  "Taxation",
  "Accounting",
  "Human Resources",
  "Talent Acquisition",
  "Performance Management",
  "Learning & Development",
  "Operations Management",
  "Supply Chain Management",
  "Logistics",
  "Inventory Management",
  "Customer Relationship Management (CRM)",
  "Customer Support",
  "Sales Management",
  "Business Development",
  "Enterprise Software",
  "Blockchain",
  "Internet of Things (IoT)",
  "Augmented Reality (AR)",
  "Virtual Reality (VR)",
  "Game Development",
  "Automotive Engineering",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Architecture",
  "Interior Design",
  "Graphic Design",
  "UI/UX Design",
  "UX Research",
  "Content Writing",
  "Copywriting",
  "Technical Writing",
  "Journalism",
  "Public Relations",
  "Event Management",
  "Healthcare Administration",
  "Medical Research",
  "Pharmaceuticals",
  "Biotechnology",
  "Environmental Science",
  "Agriculture",
  "Food Technology",
];

// Hardcoded language options
const PREDEFINED_LANGUAGES = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Chinese (Mandarin)",
  "Japanese",
  "Korean",
  "Russian",
  "Arabic",
  "Portuguese",
  "Italian",
  "Dutch",
  "Swedish",
  "Norwegian",
  "Danish",
  "Finnish",
  "Polish",
  "Turkish",
  "Greek",
  "Hebrew",
  "Thai",
  "Vietnamese",
  "Indonesian",
  "Malay",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Marathi",
  "Gujarati",
  "Punjabi",
  "Bengali",
  "Urdu",
  "Nepali",
  "Sinhala",
  "Burmese",
  "Khmer",
  "Lao",
  "Mongolian",
  "Persian",
  "Pashto",
  "Swahili",
  "Zulu",
  "Xhosa",
  "Afrikaans",
  "Tagalog",
  "Cebuano",
  "Hausa",
  "Yoruba",
  "Igbo",
];

export function ToolsAndLanguagesEditor({
  tools,
  domains,
  languages,
  onUpdate,
}: ToolsAndLanguagesEditorProps) {
  const [toolInput, setToolInput] = useState("");
  const [domainInput, setDomainInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");

  const [showToolSuggestions, setShowToolSuggestions] = useState(false);
  const [showDomainSuggestions, setShowDomainSuggestions] = useState(false);
  const [showLanguageSuggestions, setShowLanguageSuggestions] = useState(false);

  // Filter available tools
  const availableTools = useMemo(() => {
    return PREDEFINED_TOOLS
      .filter(tool => !tools.includes(tool))
      .filter(tool => 
        toolInput.length === 0 || 
        tool.toLowerCase().includes(toolInput.toLowerCase())
      )
      .slice(0, 15);
  }, [tools, toolInput]);

  // Filter available domains
  const availableDomains = useMemo(() => {
    return PREDEFINED_DOMAINS
      .filter(domain => !domains.includes(domain))
      .filter(domain => 
        domainInput.length === 0 || 
        domain.toLowerCase().includes(domainInput.toLowerCase())
      )
      .slice(0, 15);
  }, [domains, domainInput]);

  // Filter available languages
  const availableLanguages = useMemo(() => {
    return PREDEFINED_LANGUAGES
      .filter(lang => !languages.includes(lang))
      .filter(lang => 
        languageInput.length === 0 || 
        lang.toLowerCase().includes(languageInput.toLowerCase())
      )
      .slice(0, 15);
  }, [languages, languageInput]);

  // Handle custom tool input
  const handleToolKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && toolInput.trim()) {
      e.preventDefault();
      const newTool = toolInput.trim();
      if (!tools.includes(newTool)) {
        onUpdate("toolsAndPlatforms", [...tools, newTool]);
      }
      setToolInput("");
      setShowToolSuggestions(false);
    }
  };

  // Handle custom domain input
  const handleDomainKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && domainInput.trim()) {
      e.preventDefault();
      const newDomain = domainInput.trim();
      if (!domains.includes(newDomain)) {
        onUpdate("domainKnowledge", [...domains, newDomain]);
      }
      setDomainInput("");
      setShowDomainSuggestions(false);
    }
  };

  // Handle custom language input
  const handleLanguageKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && languageInput.trim()) {
      e.preventDefault();
      const newLanguage = languageInput.trim();
      if (!languages.includes(newLanguage)) {
        onUpdate("languagesKnown", [...languages, newLanguage]);
      }
      setLanguageInput("");
      setShowLanguageSuggestions(false);
    }
  };

  // Add predefined tool
  const addTool = (tool: string) => {
    if (!tools.includes(tool)) {
      onUpdate("toolsAndPlatforms", [...tools, tool]);
    }
    setToolInput("");
    setShowToolSuggestions(false);
  };

  // Add predefined domain
  const addDomain = (domain: string) => {
    if (!domains.includes(domain)) {
      onUpdate("domainKnowledge", [...domains, domain]);
    }
    setDomainInput("");
    setShowDomainSuggestions(false);
  };

  // Add predefined language
  const addLanguage = (language: string) => {
    if (!languages.includes(language)) {
      onUpdate("languagesKnown", [...languages, language]);
    }
    setLanguageInput("");
    setShowLanguageSuggestions(false);
  };

  // Remove item
  const removeItem = (field: string, item: string) => {
    const currentItems = field === "toolsAndPlatforms" ? tools : 
                        field === "domainKnowledge" ? domains : languages;
    onUpdate(field, currentItems.filter((i: string) => i !== item));
  };

  return (
    <div className="space-y-6">
      {/* Tools and Platforms */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          Tools and Platforms
          <span className="text-xs text-gray-500 ml-2">
            (Select from options or type custom)
          </span>
        </label>

        <div className="relative">
          <input
            type="text"
            value={toolInput}
            onChange={(e) => {
              setToolInput(e.target.value);
              setShowToolSuggestions(true);
            }}
            onFocus={() => setShowToolSuggestions(true)}
            onKeyDown={handleToolKeyDown}
            placeholder="Type tool and press Enter..."
            className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />

          {/* Tool Suggestions Dropdown */}
          {showToolSuggestions && availableTools.length > 0 && (
            <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-slate-700 bg-[#0F172A] p-1 shadow-xl">
              {availableTools.map((tool) => (
                <button
                  key={tool}
                  type="button"
                  onClick={() => addTool(tool)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-slate-700/50 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5 text-gray-500" />
                  {tool}
                </button>
              ))}
              {toolInput && !PREDEFINED_TOOLS.includes(toolInput) && (
                <button
                  type="button"
                  onClick={() => {
                    if (toolInput.trim() && !tools.includes(toolInput.trim())) {
                      onUpdate("toolsAndPlatforms", [...tools, toolInput.trim()]);
                      setToolInput("");
                      setShowToolSuggestions(false);
                    }
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-green-400 hover:bg-slate-700/50 transition-colors border-t border-slate-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create "{toolInput}"
                </button>
              )}
            </div>
          )}
        </div>

        {/* Selected Tools */}
        {tools.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1.5">
              {tools.map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30"
                >
                  {tool}
                  <button
                    type="button"
                    onClick={() => removeItem("toolsAndPlatforms", tool)}
                    className="hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="mt-1 text-xs text-gray-500">
          {tools.length} tools selected
        </p>
      </div>

      {/* Domain Knowledge */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          Domain Knowledge
          <span className="text-xs text-gray-500 ml-2">
            (Select from options or type custom)
          </span>
        </label>

        <div className="relative">
          <input
            type="text"
            value={domainInput}
            onChange={(e) => {
              setDomainInput(e.target.value);
              setShowDomainSuggestions(true);
            }}
            onFocus={() => setShowDomainSuggestions(true)}
            onKeyDown={handleDomainKeyDown}
            placeholder="Type domain and press Enter..."
            className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />

          {/* Domain Suggestions Dropdown */}
          {showDomainSuggestions && availableDomains.length > 0 && (
            <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-slate-700 bg-[#0F172A] p-1 shadow-xl">
              {availableDomains.map((domain) => (
                <button
                  key={domain}
                  type="button"
                  onClick={() => addDomain(domain)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-slate-700/50 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5 text-gray-500" />
                  {domain}
                </button>
              ))}
              {domainInput && !PREDEFINED_DOMAINS.includes(domainInput) && (
                <button
                  type="button"
                  onClick={() => {
                    if (domainInput.trim() && !domains.includes(domainInput.trim())) {
                      onUpdate("domainKnowledge", [...domains, domainInput.trim()]);
                      setDomainInput("");
                      setShowDomainSuggestions(false);
                    }
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-green-400 hover:bg-slate-700/50 transition-colors border-t border-slate-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create "{domainInput}"
                </button>
              )}
            </div>
          )}
        </div>

        {/* Selected Domains */}
        {domains.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1.5">
              {domains.map((domain) => (
                <span
                  key={domain}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/15 text-purple-400 border border-purple-500/30"
                >
                  {domain}
                  <button
                    type="button"
                    onClick={() => removeItem("domainKnowledge", domain)}
                    className="hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="mt-1 text-xs text-gray-500">
          {domains.length} domains selected
        </p>
      </div>

      {/* Languages Known */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          Languages Known
          <span className="text-xs text-gray-500 ml-2">
            (Select from options or type custom)
          </span>
        </label>

        <div className="relative">
          <input
            type="text"
            value={languageInput}
            onChange={(e) => {
              setLanguageInput(e.target.value);
              setShowLanguageSuggestions(true);
            }}
            onFocus={() => setShowLanguageSuggestions(true)}
            onKeyDown={handleLanguageKeyDown}
            placeholder="Type language and press Enter..."
            className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />

          {/* Language Suggestions Dropdown */}
          {showLanguageSuggestions && availableLanguages.length > 0 && (
            <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-slate-700 bg-[#0F172A] p-1 shadow-xl">
              {availableLanguages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => addLanguage(lang)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-slate-700/50 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5 text-gray-500" />
                  {lang}
                </button>
              ))}
              {languageInput && !PREDEFINED_LANGUAGES.includes(languageInput) && (
                <button
                  type="button"
                  onClick={() => {
                    if (languageInput.trim() && !languages.includes(languageInput.trim())) {
                      onUpdate("languagesKnown", [...languages, languageInput.trim()]);
                      setLanguageInput("");
                      setShowLanguageSuggestions(false);
                    }
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-green-400 hover:bg-slate-700/50 transition-colors border-t border-slate-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create "{languageInput}"
                </button>
              )}
            </div>
          )}
        </div>

        {/* Selected Languages */}
        {languages.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1.5">
              {languages.map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/30"
                >
                  {lang}
                  <button
                    type="button"
                    onClick={() => removeItem("languagesKnown", lang)}
                    className="hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="mt-1 text-xs text-gray-500">
          {languages.length} languages selected
        </p>
      </div>
    </div>
  );
}