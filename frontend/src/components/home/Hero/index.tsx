"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Play, Check } from "lucide-react";
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
      {/* Light Grid */}
      <div className="absolute inset-0 light-grid">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Dark Grid */}
      <div className="absolute inset-0 dark-grid">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--background)]/60 via-transparent to-[var(--background)]/70" />

      {/* Main Container */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        
        {/* Hero Content */}
        <div className="w-full max-w-4xl text-center">
          {/* Heading */}
          <h1 className="text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl md:text-6xl lg:text-[64px]">
            <span className="block text-[var(--text-secondary)]">
              Your alumni network
            </span>

            <span className="block mt-1">
              is your next opportunity.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:mt-7 sm:text-base sm:leading-8">
            Find alumni working inside companies. Discover referral
            opportunities.
            <span className="block">
              Referred faster — through people who actually know you.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row">
            <button
              onClick={handleGetStarted}
              className="btn-primary group flex h-11 items-center justify-center gap-2 rounded-lg px-7 text-sm font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            >
              Get Started

              <ArrowRight
                size={20}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>

            <button
              type="button"
              disabled
              className="btn-secondary flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-lg px-7 text-sm font-medium opacity-60"
            >
              <Play size={19} />
              Watch demo
            </button>
          </div>

          {/* Trust Points */}
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-[var(--text-secondary)] sm:mt-10 sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--primary)] text-[var(--primary)]">
                <Check size={13} strokeWidth={2.5} />
              </span>
              Real Alumni, Real Referrers
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--primary)] text-[var(--primary)]">
                <Check size={13} strokeWidth={2.5} />
              </span>
              Expert-Interviewed Candidates
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--primary)] text-[var(--primary)]">
                <Check size={13} strokeWidth={2.5} />
              </span>
              No Cold Applications
            </div>
          </div>
        </div>

        {/* Dashboard Preview - Below Hero Content */}
        <div className="mt-14 w-full max-w-6xl sm:mt-16 lg:mt-20">
          <HeroDashboardPreview />
        </div>
      </div>
    </section>
  );
}