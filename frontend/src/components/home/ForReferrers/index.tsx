"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Award, BarChart2, Briefcase, Users, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RevealItem } from "@/components/ui/RevealSection";

const cards = [
  {
    icon: Briefcase,
    title: "Post referral opportunities from your company",
    description: "Share open roles from your company and get first access to serious candidates.",
  },
  {
    icon: Users,
    title: "Help candidates from your network get hired",
    description: "Every candidate is screened by a Referd Expert Interview before reaching you — so you refer with confidence, not guesswork.",
  },
  {
    icon: BarChart2,
    title: "Track referral requests in one clean dashboard",
    description: "See every request and its status in one place — no chasing updates.",
  },
  {
    icon: Award,
    title: "Earn referral rewards from your organization",
    description: "Get credited when your referral leads to a hire, as per your company's policy.",
  },
];

export default function ForReferrers() {
  const router = useRouter();
  const { isAuthenticated, role, loading } = useAuth();

  const handleCTA = () => {
    if (loading) return;

    if (isAuthenticated && role) {
      router.push(`/${role.toLowerCase()}/home`);
    } else {
      router.push("/signup?role=professional");
    }
  };

  return (
    <section className="bg-[var(--background)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Left — copy */}
          <RevealItem delay={0}>
            <div>
              <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.35em] text-[var(--primary)] sm:mb-4">
                For Professionals
              </p>

              <h2 className="text-3xl font-extrabold leading-[1.1] tracking-[-0.04em] text-[var(--text-primary)] sm:text-4xl md:text-[46px] lg:text-[52px]">
                Help someone get hired.{" "}
                <br className="hidden sm:block" />
                Build your professional legacy.
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-[var(--text-secondary)] sm:mt-5 sm:text-[15px]">
                Referd makes it effortless for employees to open doors for
                talented candidates and get rewarded for it.
              </p>

              {/* Vetting line */}
              <div className="mt-3 flex items-start gap-2.5 max-w-md">
                <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--primary)]" />
                <p className="text-sm font-medium leading-7 text-[var(--primary)] sm:text-[15px]">
                  Every candidate is vetted by a Referd Expert first — so you refer
                  with confidence, not risk.
                </p>
              </div>

              <button
                onClick={handleCTA}
                className="btn-primary mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 sm:mt-8 sm:text-[15px]"
              >
                Become a Referrer
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </RevealItem>

          {/* Right — 2×2 cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <RevealItem key={card.title} delay={0.08 + index * 0.07}>
                  <div className="surface-card group flex h-full flex-col gap-3 rounded-2xl p-5 transition-all duration-200 hover:border-[var(--primary-border)] hover:shadow-md">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--primary)] transition-all duration-300 group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-6 text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--primary)]">
                        {card.title}
                      </p>
                      <p className="mt-1.5 text-sm leading-5 text-[var(--text-secondary)]">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}