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
} from "lucide-react";

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
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}

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

            <Section icon={Briefcase} title="Experience">
              <div className="space-y-4">
                <div>
                  <div className="font-medium">Software Engineering Intern · Razorpay</div>
                  <div className="text-sm text-muted-foreground">Summer 2024 · Bengaluru</div>
                </div>
                <div>
                  <div className="font-medium">Open Source Contributor · TanStack</div>
                  <div className="text-sm text-muted-foreground">2023–present</div>
                </div>
              </div>
            </Section>

            <Section icon={BadgeCheck} title="Skills">
              <div className="flex flex-wrap gap-2">
                {["TypeScript", "React", "Node.js", "PostgreSQL", "Go", "System Design", "REST", "GraphQL"].map(
                  (s) => (
                    <span
                      key={s}
                      className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                    >
                      {s}
                    </span>
                  ),
                )}
              </div>
            </Section>
          </div>

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
