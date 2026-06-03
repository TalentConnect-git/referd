import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Briefcase,
  BadgeCheck,
  Trophy,
  CheckCircle2,
  FileText,
  Linkedin,
  Github,
  Globe,
  User,
  Sparkles,
  Globe2,
  Users,
  Target,
  Layers,
  Wrench,
  Factory,
  Link as LinkIcon,
  Award,
  BookOpen,
  Languages as LanguagesIcon,
  Phone,
  Mail,
  Cake,
  Building2,
  Clock,
  MapPin,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Profile · Referd" },
      { name: "description", content: "Your Referd profile" },
    ],
  }),
  component: ProfilePage,
});

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="uppercase tracking-wider text-xs">{title}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
}

function Chip({ children, variant = "muted" }: { children: ReactNode; variant?: "muted" | "primary" }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm ${
        variant === "primary"
          ? "bg-accent text-accent-foreground"
          : "bg-secondary text-secondary-foreground"
      }`}
    >
      {children}
    </span>
  );
}

const skills = ["TypeScript","React","Node.js","PostgreSQL","Go","System Design","REST","GraphQL","Python","Docker","AWS","Redis"];
const tools = ["VS Code","GitHub","Postman","Figma","Jira","Notion","Docker Desktop"];
const industries = ["Software","FinTech","E-commerce"];
const domains = ["FinTech","EdTech","Payments"];
const languages = [
  { name: "English", level: "Fluent" },
  { name: "Hindi", level: "Native" },
  { name: "French", level: "Beginner" },
];
const preferredLocations = ["Bengaluru","Remote","Delhi NCR"];
const achievements = [
  "Winner – Smart India Hackathon 2024 (Software Edition)",
  "Top 1% – Google Code Jam 2023 Qualification Round",
  "AWS Certified Cloud Practitioner (2024)",
];

function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <Button asChild>
            <Link to="/edit-profile">Edit profile</Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {/* HEADER */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-start gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-accent-foreground">
                  AK
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">Aman Kumar</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    B.Tech CSE · VIPS '25 · Looking for SDE roles
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="gap-1 bg-accent text-accent-foreground">
                      <BadgeCheck className="h-3.5 w-3.5" /> Verified alumni
                    </Badge>
                    <Badge variant="secondary" className="gap-1 bg-accent text-accent-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Email verified
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">Profile completion</span>
                  <span className="text-primary font-semibold">82%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary" style={{ width: "82%" }} />
                </div>
              </div>
            </div>

            {/* BASIC */}
            <Section icon={User} title="Basic">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" value="Aman Kumar" />
                <Field label="Email" value={<span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-muted-foreground" />aman@example.com</span>} />
                <Field label="Phone" value={<span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-muted-foreground" />+91 98765 43210</span>} />
                <Field label="Gender" value="Male" />
                <Field label="Date of Birth" value={<span className="inline-flex items-center gap-1.5"><Cake className="h-3.5 w-3.5 text-muted-foreground" />Apr 15, 2003</span>} />
              </div>
            </Section>

            {/* CAREER */}
            <Section icon={Briefcase} title="Career">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Current Company" value={<span className="inline-flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-muted-foreground" />Razorpay</span>} />
                <Field label="Total Years of Experience" value="1 year" />
                <Field label="Notice Period" value={<span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-muted-foreground" />30 days</span>} />
                <Field label="Serving Notice Period" value="No" />
              </div>
            </Section>

            {/* EXPERIENCE */}
            <Section icon={Briefcase} title="Experience">
              <div className="space-y-4">
                <div className="border-l-2 border-primary pl-4">
                  <div className="font-medium">Software Engineering Intern · Razorpay</div>
                  <div className="text-sm text-muted-foreground">Summer 2024 · Bengaluru</div>
                  <p className="mt-1 text-sm">
                    Built payment reconciliation services in Go and contributed to internal SDKs.
                  </p>
                </div>
                <div className="border-l-2 border-border pl-4">
                  <div className="font-medium">Open Source Contributor · TanStack</div>
                  <div className="text-sm text-muted-foreground">2023–present</div>
                  <p className="mt-1 text-sm">
                    Maintainer-reviewed contributions to TanStack Query and Router.
                  </p>
                </div>
              </div>
            </Section>

            {/* INTERNATIONAL */}
            <Section icon={Globe2} title="International Experience">
              <p className="text-sm">
                Summer 2023 research exchange at NUS Singapore – worked on distributed systems benchmarks.
              </p>
            </Section>

            {/* LEADERSHIP */}
            <Section icon={Users} title="Leadership Experience">
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>President, GDSC VIPS (2023–2024) – led a 40-member team and hosted 12+ events.</li>
                <li>Hackathon Lead, CodeChef VIPS Chapter (2022–2023).</li>
              </ul>
            </Section>

            {/* SKILLS */}
            <Section icon={Sparkles} title="Skills">
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => <Chip key={s}>{s}</Chip>)}
              </div>
            </Section>

            {/* EMPLOYEE PREFERENCES */}
            <Section icon={Target} title="Employee Preferences">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Expected Salary" value="₹ 15,00,000 / yr" />
                <Field label="Open to Shift" value="Flexible" />
                <Field label="Employment Type" value="Full-time" />
                <Field label="Looking For" value="Full-time" />
                <Field label="Search Job Roles" value="Backend Engineer, SDE-1" />
              </div>
              <div className="mt-4">
                <div className="mb-2 text-xs text-muted-foreground">Preferred Locations</div>
                <div className="flex flex-wrap gap-2">
                  {preferredLocations.map((l) => (
                    <Chip key={l} variant="primary">
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{l}</span>
                    </Chip>
                  ))}
                </div>
              </div>
            </Section>

            {/* DOMAIN KNOWLEDGE */}
            <Section icon={Layers} title="Domain Knowledge">
              <div className="flex flex-wrap gap-2">
                {domains.map((d) => <Chip key={d} variant="primary">{d}</Chip>)}
              </div>
            </Section>

            {/* TOOLS */}
            <Section icon={Wrench} title="Tools & Platforms">
              <div className="flex flex-wrap gap-2">
                {tools.map((t) => <Chip key={t}>{t}</Chip>)}
              </div>
            </Section>

            {/* INDUSTRY */}
            <Section icon={Factory} title="Industry">
              <div className="flex flex-wrap gap-2">
                {industries.map((i) => <Chip key={i}>{i}</Chip>)}
              </div>
            </Section>

            {/* LINKS */}
            <Section icon={LinkIcon} title="Links">
              <div className="space-y-2 text-sm">
                <a href="#" className="flex items-center gap-2 text-foreground hover:text-primary">
                  <Linkedin className="h-4 w-4 text-primary" /> linkedin.com/in/amankumar
                </a>
                <a href="#" className="flex items-center gap-2 text-foreground hover:text-primary">
                  <Github className="h-4 w-4 text-primary" /> github.com/amankumar
                </a>
                <a href="#" className="flex items-center gap-2 text-foreground hover:text-primary">
                  <Globe className="h-4 w-4 text-primary" /> amankumar.dev
                </a>
              </div>
            </Section>

            {/* ACHIEVEMENTS */}
            <Section icon={Award} title="Achievements">
              <ul className="space-y-2 text-sm">
                {achievements.map((a) => (
                  <li key={a} className="flex gap-2">
                    <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {/* PUBLICATIONS */}
            <Section icon={BookOpen} title="Publications">
              <div className="space-y-3">
                <div>
                  <a href="#" className="font-medium hover:text-primary">
                    Scaling Idempotent Payment Webhooks
                  </a>
                  <div className="text-xs text-muted-foreground">Razorpay Engineering Blog · Aug 2024</div>
                  <p className="mt-1 text-sm">
                    A practical guide to designing webhook delivery pipelines with at-least-once guarantees.
                  </p>
                </div>
              </div>
            </Section>

            {/* LANGUAGES */}
            <Section icon={LanguagesIcon} title="Languages Known">
              <div className="flex flex-wrap gap-2">
                {languages.map((l) => (
                  <div key={l.name} className="rounded-full bg-secondary px-3 py-1 text-sm">
                    <span className="font-medium">{l.name}</span>
                    <span className="text-muted-foreground"> · {l.level}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* EDUCATION */}
            <Section icon={GraduationCap} title="Education">
              <div className="space-y-4">
                <div>
                  <div className="font-medium">Vivekananda Institute of Professional Studies</div>
                  <div className="text-sm text-muted-foreground">
                    B.Tech, Computer Science · 2021–2025
                  </div>
                </div>
                <div>
                  <div className="font-medium">DPS R.K. Puram</div>
                  <div className="text-sm text-muted-foreground">Class XII · Science · 2019–2021</div>
                </div>
              </div>
            </Section>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Referral success score
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold">8.4</span>
                <span className="text-muted-foreground">/ 10</span>
              </div>
              <div className="text-xs text-muted-foreground">Top 15% on Referd</div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-border p-3 text-center">
                  <Trophy className="mx-auto h-4 w-4 text-primary" />
                  <div className="mt-1 text-xs">12 referrals</div>
                </div>
                <div className="rounded-lg border border-border p-3 text-center">
                  <CheckCircle2 className="mx-auto h-4 w-4 text-primary" />
                  <div className="mt-1 text-xs">7 hired</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Documents
              </div>
              <div className="mt-3 flex items-start gap-3 rounded-lg border border-border p-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm">
                  <div className="font-medium">Aman_Kumar_Resume.pdf</div>
                  <div className="text-xs text-muted-foreground">Updated 2 days ago</div>
                </div>
              </div>
              <Button variant="outline" className="mt-3 w-full">
                Upload new resume
              </Button>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Connected
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <Linkedin className="h-4 w-4 text-primary" />
                <span>linkedin.com/in/amankumar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
