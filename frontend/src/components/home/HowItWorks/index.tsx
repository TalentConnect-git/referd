import {
  BarChart3,
  Briefcase,
  Search,
  Send,
  Trophy,
  UserPlus,
} from "lucide-react";

const steps = [
  {
    icon: <UserPlus size={20} />,
    step: "Step 1",
    title: "Create profile",
    description: "Verify with college email.",
  },
  {
    icon: <Search size={20} />,
    step: "Step 2",
    title: "Discover alumni",
    description: "Filter by company, role, batch.",
  },
  {
    icon: <Briefcase size={20} />,
    step: "Step 3",
    title: "Find referral jobs",
    description: "Real roles, real referrers.",
  },
  {
    icon: <Send size={20} />,
    step: "Step 4",
    title: "Request referral",
    description: "One-tap, with context.",
  },
  {
    icon: <BarChart3 size={20} />,
    step: "Step 5",
    title: "Track progress",
    description: "Watch every stage live.",
  },
  {
    icon: <Trophy size={20} />,
    step: "Step 6",
    title: "Get hired",
    description: "Land the offer.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-[var(--border)] bg-[var(--background)] px-6 py-16 sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="mb-5 font-mono text-[12px] font-semibold uppercase tracking-[0.35em] text-[var(--primary)]">
          Workflow
        </p>

        <h2 className="text-[30px] font-bold leading-tight tracking-[-0.04em] text-white md:text-[38px]">
          How Referd works.
        </h2>

        <p className="mt-5 text-[15px] leading-7 text-[var(--text-primary)]">
          From sign-up to signed offer — built around the actual referral
          journey.
        </p>

        <div className="relative mt-14 grid gap-8 md:grid-cols-3 lg:grid-cols-6">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-[var(--border)] lg:block" />

          {steps.map((item) => (
            <div key={item.step} className="relative z-10">
              <div className="mb-5 flex h-[48px] w-[48px] items-center justify-center rounded-xl border border-[var(--border-strong)] bg-[var(--card)] text-[var(--primary)]">
                {item.icon}
              </div>

              <p className="mb-1.5 font-mono text-[12px] text-[var(--text-primary)]">
                {item.step}
              </p>

              <h3 className="mb-1.5 text-[15px] font-semibold text-white">
                {item.title}
              </h3>

              <p className="text-[13px] leading-5 text-[var(--text-primary)]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}