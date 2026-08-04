"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Play, Check, Link } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import HeroDashboardPreview from "./HeroDashboardPreview";

export default function Hero() {
  const router = useRouter();
  const { isAuthenticated, role, loading } = useAuth();

  const handleGetStarted = () => {
    if (loading) return;

    if (isAuthenticated && role) {
      router.push(`/${role.toLowerCase()}/home`);
    } else {
      router.push("/signup");
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[var(--background)]">
      {/* Grid background - Light Mode */}
      <div className="absolute inset-0 light-grid">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)
            `,
            backgroundSize: "84px 84px",
          }}
        />
      </div>

      {/* Grid background - Dark Mode */}
      <div className="absolute inset-0 dark-grid">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "84px 84px",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 pt-20 text-center sm:px-5 sm:pt-24">
        {/* Heading */}
        <h1 className="max-w-5xl text-3xl font-bold leading-[1.08] tracking-[-0.04em] text-[var(--text-primary)] sm:text-4xl md:text-[45px]">
          <span className="block text-[var(--text-secondary)]">
            Your alumni network
          </span>
          <span className="block">is your next opportunity.</span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 max-w-3xl text-sm leading-8 text-[var(--text-secondary)] sm:mt-8 sm:text-base sm:leading-10">
          <span>
            Find alumni working inside companies. Discover referral
            opportunities.
          </span>
          <span> Referred faster — through people who actually know you.</span>
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-12 sm:flex-row">
          <button
            onClick={handleGetStarted}
            className="btn-primary group flex h-10 w-auto items-center gap-2 rounded-lg px-6 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 sm:gap-3 sm:px-8 sm:text-[14px]"
          >
            Get Started
            <ArrowRight
              size={20}
              className="transition-transform duration-200 group-hover:translate-x-1 sm:size-[24px]"
            />
          </button>

          <button
            onClick={() => window.open("https://www.google.com", "_blank")}
            className="btn-secondary group flex h-10 items-center gap-2 rounded-lg px-6 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 sm:gap-3 sm:px-8 sm:text-[14px]"
          >
            <Play size={20} className="sm:size-[22px]" />
            Watch demo
          </button>
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--text-secondary)] sm:mt-10 sm:gap-8 sm:text-base">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--primary)] text-[var(--primary)] flex-shrink-0">
              <Check size={14} />
            </span>
            Real Alumni, Real Referrers
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--primary)] text-[var(--primary)] flex-shrink-0">
              <Check size={14} />
            </span>
            Expert-Interviewed Candidates
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--primary)] text-[var(--primary)] flex-shrink-0">
              <Check size={14} />
            </span>
            No Cold Applications
          </div>
        </div>
      </div>

      {/* Dashboard preview mockup */}
      <HeroDashboardPreview />
    </section>
  );
}
