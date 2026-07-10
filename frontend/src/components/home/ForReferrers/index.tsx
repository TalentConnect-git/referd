"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Award, BarChart2, Briefcase, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RevealItem } from "@/components/ui/RevealSection";

const cards = [
  {
    icon: Briefcase,
    text: "Post referral opportunities from your company",
  },
  {
    icon: Users,
    text: "Help candidates from your network get hired",
  },
  {
    icon: BarChart2,
    text: "Track referral requests in one clean dashboard",
  },
  {
    icon: Award,
    text: "Earn referral rewards from your organization",
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
    <section className="bg-[var(--background)] px-6 py-14 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left — copy */}
          <RevealItem delay={0}>
            <div>
              <p className="mb-4 font-mono text-[12px] font-semibold uppercase tracking-[0.35em] text-[var(--primary)]">
                For Professionals
              </p>

              <h2 className="text-[36px] font-extrabold leading-[1.1] tracking-[-0.04em] text-white md:text-[46px] lg:text-[52px]">
                Help someone get hired.{" "}
                <br className="hidden sm:block" />
                Build your professional legacy.
              </h2>

              <p className="mt-5 max-w-md text-[15px] leading-7 text-[var(--text-primary)]">
                Referd makes it effortless for employees to open doors for
                talented candidates and get rewarded for it.
              </p>

              <button
                onClick={handleCTA}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-[15px] font-semibold text-black transition hover:bg-[var(--primary-dark)]"
              >
                Become a Referrer
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </RevealItem>

          {/* Right — 2×2 cards */}
          <div className="grid grid-cols-2 gap-4">
            {cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <RevealItem key={card.text} delay={0.08 + index * 0.07}>
                  <div className="flex h-full flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-[var(--primary)]/40 hover:bg-[var(--card-hover)]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(49,170,64,0.20)] bg-[var(--primary-soft)] text-[var(--primary)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-[14px] font-medium leading-6 text-white/85">
                      {card.text}
                    </p>
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
