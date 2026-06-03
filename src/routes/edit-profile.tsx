import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Camera,
  Lock,
  Pencil,
  Plus,
  X,
  Linkedin,
  Github,
  Globe,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/edit-profile")({
  head: () => ({
    meta: [
      { title: "Edit Profile · Referd" },
      { name: "description", content: "Edit your Referd profile" },
    ],
  }),
  component: EditProfilePage,
});

const POPULAR_SKILLS = [
  "javascript","node.js","mongodb","react","python","docker","aws","typescript",
  "graphql","redis","postgresql","react native","spring boot","hibernate orm",
  "java","c++","html5","css","firebase","git","postman","rest apis",
  "jwt authentication","data structures & algorithms","oops",
  "full-stack development","backend development","c","sql","machine learning","pandas",
];

const POPULAR_TOOLS = ["Figma","Jira","Notion","VS Code","Slack","Linear","GitHub","Postman","Docker Desktop"];

function SectionLabel({ icon: _Icon, title }: { icon?: unknown; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent">
        <Pencil className="h-3.5 w-3.5 text-primary" />
      </span>
      <span className="text-base font-medium">{title}</span>
    </div>
  );
}

function Chips({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSel = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              isSel
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function LockedField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Label className="text-sm">{label}</Label>
        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <Input value={value} readOnly className="mt-1.5 bg-muted/40 cursor-not-allowed" />
      <p className="mt-1 text-xs text-muted-foreground">
        Automatically fetched from current experience
      </p>
    </div>
  );
}

function EditProfilePage() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<string[]>(["typescript", "react", "node.js", "postgresql"]);
  const [tools, setTools] = useState<string[]>(["VS Code", "GitHub"]);
  const [industries, setIndustries] = useState<string[]>(["FinTech"]);
  const [domains, setDomains] = useState<string[]>(["FinTech", "EdTech"]);
  const [domainInput, setDomainInput] = useState("");
  const [locations, setLocations] = useState<string[]>(["Bengaluru"]);
  const [locInput, setLocInput] = useState("");
  const [languages, setLanguages] = useState<{ name: string; level: string }[]>([
    { name: "English", level: "Fluent" },
    { name: "Hindi", level: "Native" },
  ]);
  const [otherLinks, setOtherLinks] = useState<string[]>([]);
  const [skillQuery, setSkillQuery] = useState("");
  const [servingNotice, setServingNotice] = useState(false);
  const [intlExperience, setIntlExperience] = useState(false);

  const toggle = (arr: string[], setArr: (v: string[]) => void) => (v: string) =>
    setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const handleSave = () => {
    toast.success("Profile updated successfully!");
    setTimeout(() => navigate({ to: "/" }), 600);
  };

  const filteredSkills = POPULAR_SKILLS.filter((s) =>
    s.toLowerCase().includes(skillQuery.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="relative pb-28">
        <div className="mx-auto max-w-4xl px-6 py-8 lg:px-10">
          <div className="mb-6 flex items-center justify-between">
            <Button asChild variant="ghost" className="-ml-3 gap-2">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Profile
              </Link>
            </Button>
          </div>

          <h1 className="mb-6 text-2xl font-semibold">Edit Profile</h1>

          <Accordion type="multiple" className="space-y-3">
            {/* BASIC */}
            <AccordionItem value="basic" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="hover:no-underline">
                <SectionLabel title="Basic" />
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="group relative flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground transition hover:bg-muted/70"
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <Camera className="h-5 w-5" />
                      <span className="text-[10px] font-medium">Upload</span>
                    </div>
                  </button>
                  <div className="text-xs text-muted-foreground">
                    PNG or JPG, up to 5MB
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-sm">Name</Label>
                    <Input className="mt-1.5" defaultValue="Aman Kumar" />
                  </div>
                  <div>
                    <Label className="text-sm">Email</Label>
                    <Input className="mt-1.5" type="email" defaultValue="aman@example.com" />
                  </div>
                  <div>
                    <Label className="text-sm">Phone</Label>
                    <Input className="mt-1.5" defaultValue="+91 98765 43210" />
                  </div>
                  <div>
                    <Label className="text-sm">Gender</Label>
                    <Select defaultValue="male">
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="nb">Non-binary</SelectItem>
                        <SelectItem value="other">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm">Date of Birth</Label>
                    <Input className="mt-1.5" type="date" defaultValue="2003-04-15" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* CAREER */}
            <AccordionItem value="career" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="hover:no-underline">
                <SectionLabel title="Career" />
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <LockedField label="Current Company" value="Razorpay" />
                <div>
                  <Label className="text-sm">Total Years of Experience</Label>
                  <Input className="mt-1.5" type="number" defaultValue="1" min={0} />
                </div>
                <LockedField label="Notice Period (days)" value="30" />
                <div className="flex items-center justify-between rounded-lg bg-secondary px-4 py-3">
                  <span className="text-sm">Currently Serving Notice Period</span>
                  <Switch checked={servingNotice} onCheckedChange={setServingNotice} />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* SKILLS */}
            <AccordionItem value="skills" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="hover:no-underline">
                <SectionLabel title="Skills" />
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <Input
                  placeholder="Search or add skills"
                  value={skillQuery}
                  onChange={(e) => setSkillQuery(e.target.value)}
                />
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Popular skills
                </div>
                <Chips
                  options={filteredSkills}
                  selected={skills}
                  onToggle={toggle(skills, setSkills)}
                />
              </AccordionContent>
            </AccordionItem>

            {/* EXPERIENCE */}
            <AccordionItem value="experience" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="hover:no-underline">
                <SectionLabel title="Experience" />
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="space-y-3 rounded-lg border border-border p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div><Label className="text-sm">Job Title</Label><Input className="mt-1.5" defaultValue="Software Engineering Intern" /></div>
                    <div><Label className="text-sm">Company</Label><Input className="mt-1.5" defaultValue="Razorpay" /></div>
                    <div><Label className="text-sm">Start Date</Label><Input className="mt-1.5" type="date" /></div>
                    <div><Label className="text-sm">End Date</Label><Input className="mt-1.5" type="date" /></div>
                    <div className="sm:col-span-2"><Label className="text-sm">Location</Label><Input className="mt-1.5" defaultValue="Bengaluru" /></div>
                    <div className="sm:col-span-2"><Label className="text-sm">Description</Label><Textarea className="mt-1.5" rows={3} /></div>
                  </div>
                </div>
                <Button variant="outline" className="w-full gap-2"><Plus className="h-4 w-4" /> Add Experience</Button>
              </AccordionContent>
            </AccordionItem>

            {/* INTERNATIONAL */}
            <AccordionItem value="intl" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="hover:no-underline">
                <SectionLabel title="International Experience" />
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="flex items-center justify-between rounded-lg bg-secondary px-4 py-3">
                  <span className="text-sm">Have international work/study experience?</span>
                  <Switch checked={intlExperience} onCheckedChange={setIntlExperience} />
                </div>
                {intlExperience && (
                  <Textarea placeholder="Describe your international experience..." rows={4} />
                )}
              </AccordionContent>
            </AccordionItem>

            {/* LEADERSHIP */}
            <AccordionItem value="leadership" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="hover:no-underline">
                <SectionLabel title="Leadership Experience" />
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <Textarea placeholder="Tell us about leadership roles you've held..." rows={5} />
              </AccordionContent>
            </AccordionItem>

            {/* EMPLOYEE PREFERENCES */}
            <AccordionItem value="prefs" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="hover:no-underline">
                <SectionLabel title="Employee Preferences" />
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
                  <div>
                    <Label className="text-sm">Currency</Label>
                    <Select defaultValue="INR">
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm">Expected Salary</Label>
                    <Input className="mt-1.5" type="number" placeholder="e.g. 1500000" />
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Open To Shift</Label>
                  <Select>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day shift</SelectItem>
                      <SelectItem value="night">Night shift</SelectItem>
                      <SelectItem value="rotational">Rotational</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">Employment Type</Label>
                  <Select>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full-time</SelectItem>
                      <SelectItem value="part">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="intern">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">Search Job Roles</Label>
                  <Input className="mt-1.5" placeholder="e.g. Backend Engineer, SDE-1" />
                </div>
                <div>
                  <Label className="text-sm">Looking For</Label>
                  <Select>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ft">Full-time</SelectItem>
                      <SelectItem value="intern">Internship</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-lg bg-secondary/60 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <Label className="text-sm">Preferred Locations</Label>
                    <button
                      type="button"
                      onClick={() => {
                        if (locInput.trim()) {
                          setLocations([...locations, locInput.trim()]);
                          setLocInput("");
                        }
                      }}
                      className="flex items-center gap-1 text-sm text-primary"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {locations.map((l, i) => (
                      <span key={i} className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground">
                        {l}
                        <button type="button" onClick={() => setLocations(locations.filter((_, idx) => idx !== i))}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <Input
                    className="mt-3"
                    placeholder="Add a location"
                    value={locInput}
                    onChange={(e) => setLocInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && locInput.trim()) {
                        e.preventDefault();
                        setLocations([...locations, locInput.trim()]);
                        setLocInput("");
                      }
                    }}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* DOMAIN KNOWLEDGE */}
            <AccordionItem value="domain" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="hover:no-underline">
                <SectionLabel title="Domain Knowledge" />
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="flex flex-wrap gap-2">
                  {domains.map((d, i) => (
                    <span key={i} className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground">
                      {d}
                      <button type="button" onClick={() => setDomains(domains.filter((_, idx) => idx !== i))}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <Input
                  placeholder="e.g. FinTech, EdTech, HealthTech — press Enter"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && domainInput.trim()) {
                      e.preventDefault();
                      setDomains([...domains, domainInput.trim()]);
                      setDomainInput("");
                    }
                  }}
                />
              </AccordionContent>
            </AccordionItem>

            {/* TOOLS */}
            <AccordionItem value="tools" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="hover:no-underline">
                <SectionLabel title="Tools & Platforms" />
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <Chips options={POPULAR_TOOLS} selected={tools} onToggle={toggle(tools, setTools)} />
              </AccordionContent>
            </AccordionItem>

            {/* INDUSTRY */}
            <AccordionItem value="industry" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="hover:no-underline">
                <SectionLabel title="Industry" />
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <Chips
                  options={["Software","Finance","Healthcare","Education","E-commerce","Gaming","Media","Consulting","Manufacturing"]}
                  selected={industries}
                  onToggle={toggle(industries, setIndustries)}
                />
              </AccordionContent>
            </AccordionItem>

            {/* LINKS */}
            <AccordionItem value="links" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="hover:no-underline">
                <SectionLabel title="Links" />
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="LinkedIn URL" defaultValue="linkedin.com/in/amankumar" />
                </div>
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="GitHub URL" />
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Portfolio / personal website" />
                </div>
                {otherLinks.map((link, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="https://"
                      value={link}
                      onChange={(e) => {
                        const next = [...otherLinks];
                        next[i] = e.target.value;
                        setOtherLinks(next);
                      }}
                    />
                    <button type="button" onClick={() => setOtherLinks(otherLinks.filter((_, idx) => idx !== i))}>
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                ))}
                <Button variant="outline" className="w-full gap-2" onClick={() => setOtherLinks([...otherLinks, ""])}>
                  <Plus className="h-4 w-4" /> Add link
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* ACHIEVEMENTS */}
            <AccordionItem value="achievements" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="hover:no-underline">
                <SectionLabel title="Achievements" />
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <Textarea placeholder="List your notable achievements, awards, certifications..." rows={5} />
              </AccordionContent>
            </AccordionItem>

            {/* PUBLICATIONS */}
            <AccordionItem value="publications" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="hover:no-underline">
                <SectionLabel title="Publications" />
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="space-y-3 rounded-lg border border-border p-4">
                  <div><Label className="text-sm">Title</Label><Input className="mt-1.5" /></div>
                  <div><Label className="text-sm">URL</Label><Input className="mt-1.5" placeholder="https://" /></div>
                  <div><Label className="text-sm">Date</Label><Input className="mt-1.5" type="date" /></div>
                  <div><Label className="text-sm">Description</Label><Textarea className="mt-1.5" rows={3} /></div>
                </div>
                <Button variant="outline" className="w-full gap-2"><Plus className="h-4 w-4" /> Add Publication</Button>
              </AccordionContent>
            </AccordionItem>

            {/* LANGUAGES */}
            <AccordionItem value="languages" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="hover:no-underline">
                <SectionLabel title="Languages Known" />
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                {languages.map((lang, i) => (
                  <div key={i} className="grid grid-cols-[1fr_180px_auto] items-end gap-2">
                    <div>
                      <Label className="text-sm">Language</Label>
                      <Input
                        className="mt-1.5"
                        value={lang.name}
                        onChange={(e) => {
                          const next = [...languages];
                          next[i] = { ...next[i], name: e.target.value };
                          setLanguages(next);
                        }}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Proficiency</Label>
                      <Select
                        value={lang.level}
                        onValueChange={(v) => {
                          const next = [...languages];
                          next[i] = { ...next[i], level: v };
                          setLanguages(next);
                        }}
                      >
                        <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Fluent">Fluent</SelectItem>
                          <SelectItem value="Native">Native</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <button
                      type="button"
                      className="mb-2 text-muted-foreground hover:text-foreground"
                      onClick={() => setLanguages(languages.filter((_, idx) => idx !== i))}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => setLanguages([...languages, { name: "", level: "Intermediate" }])}
                >
                  <Plus className="h-4 w-4" /> Add Language
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* EDUCATION */}
            <AccordionItem value="education" className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="hover:no-underline">
                <SectionLabel title="Education" />
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="space-y-3 rounded-lg border border-border p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div><Label className="text-sm">Degree</Label><Input className="mt-1.5" defaultValue="B.Tech" /></div>
                    <div><Label className="text-sm">Institution</Label><Input className="mt-1.5" defaultValue="VIPS" /></div>
                    <div><Label className="text-sm">Field of Study</Label><Input className="mt-1.5" defaultValue="Computer Science" /></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><Label className="text-sm">Start Year</Label><Input className="mt-1.5" type="number" defaultValue="2021" /></div>
                      <div><Label className="text-sm">End Year</Label><Input className="mt-1.5" type="number" defaultValue="2025" /></div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full gap-2"><Plus className="h-4 w-4" /> Add Education</Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="sticky bottom-0 left-0 right-0 z-10 border-t border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center justify-end gap-3 px-6 py-4 lg:px-10">
            <Button variant="ghost" asChild>
              <Link to="/">Cancel</Link>
            </Button>
            <Button onClick={handleSave} className="min-w-32">Save</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
