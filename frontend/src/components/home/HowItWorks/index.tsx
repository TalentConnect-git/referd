"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  BarChart3,
  Briefcase,
  Trophy,
  Search,
  Send,
  UserPlus,
} from "lucide-react";

const steps = [
  {
    id: 1,
    num: "01",
    title: "Create profile",
    description:
      "Verify with your college or work identity and add the roles you are targeting.",
    icon: <UserPlus size={24} />,
  },
  {
    id: 2,
    num: "02",
    title: "Discover alumni",
    description:
      "Browse alumni from your college and past companies working at your target companies — see their role and current company before you reach out.",
    icon: <Search size={24} />,
  },
  {
    id: 3,
    num: "03",
    title: "Find referral jobs",
    description:
      "Explore real roles posted by employees who are open to referring.",
    icon: <Briefcase size={24} />,
  },
  {
    id: 4,
    num: "04",
    title: "Request referral",
    description:
      "Submit your request — a Referd Expert conducts a short role-specific interview and rates your candidature. Only vetted requests reach the referrer.",
    icon: <Send size={24} />,
  },
  {
    id: 5,
    num: "05",
    title: "Track progress",
    description:
      "Watch each stage live as your request moves through the referral flow.",
    icon: <BarChart3 size={24} />,
  },
  {
    id: 6,
    num: "06",
    title: "Get hired",
    description: "Land the offer with a warmer path into the company.",
    icon: <Trophy size={24} />,
  },
];

const cardVariants: Variants = {
  enter: { opacity: 0, y: 16 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 1, 0.5, 1] },
  },
  exit: { opacity: 0, y: -16, transition: { duration: 0.35 } },
};

export default function HowItWorks() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [active]);

  return (
    <section
      id="how-it-works"
      className="bg-[var(--background)] px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.35em] text-[var(--primary)] sm:mb-5">
          Workflow
        </p>

        <h2 className="text-3xl font-bold leading-tight tracking-[-0.04em] text-[var(--text-primary)] md:text-[38px]">
          How Referd works.
        </h2>

        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)] sm:mt-5 sm:text-[15px]">
          From sign-up to signed offer — built around the actual referral
          journey.
        </p>

        {/* Two-column layout: step list (left) + content pane (right) */}
        <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-[320px_1fr] lg:gap-8">
          {/* Left column: clickable step list */}
          <div className="flex flex-col gap-1.5 sm:gap-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActive(index)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-300 sm:gap-4 sm:px-4 sm:py-3 ${
                  index === active
                    ? "bg-[var(--card)]/70 border-l-2 border-[var(--primary)]"
                    : "hover:bg-[var(--card)]/40 border-l-2 border-transparent"
                }`}
              >
                <span
                  className={`font-mono text-xs transition-colors sm:text-sm ${
                    index === active
                      ? "text-[var(--primary)]"
                      : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
                  }`}
                >
                  {step.num}
                </span>
                <span
                  className={`text-sm font-medium transition-colors sm:text-[15px] ${
                    index === active
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                  }`}
                >
                  {step.title}
                </span>
              </button>
            ))}
          </div>

          {/* Right column: crossfading content pane */}
          <div className="relative min-h-[280px] overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)]/80 p-6 sm:p-8">
            <motion.div layout className="h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={steps[active].id}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative z-10"
                >
                  {/* Icon in rounded-square */}
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--primary)] sm:mb-6">
                    {steps[active].icon}
                  </div>

                  {/* Oversized faint numeral behind content */}
                  <div className="absolute right-2 top-2 select-none opacity-[0.04] sm:right-4 sm:top-4">
                    <span className="block text-6xl font-bold leading-none text-[var(--text-primary)] sm:text-[100px]">
                      {steps[active].num}
                    </span>
                  </div>

                  <h3 className="mb-2 text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:mb-3 sm:text-[22px]">
                    {steps[active].title}
                  </h3>

                  <p className="text-sm leading-7 text-[var(--text-secondary)] sm:text-[15px]">
                    {steps[active].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}