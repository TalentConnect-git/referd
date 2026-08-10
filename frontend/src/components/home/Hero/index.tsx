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
              linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Grid background - Dark Mode */}
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

      {/* Subtle gradient overlay for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/50 via-transparent to-[var(--background)]/50 pointer-events-none" />

      {/* Main Content - Flex Row Layout */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:flex-row lg:gap-12 lg:py-20">
        {/* Left Section - Text Content */}
        <div className="w-full max-w-3xl text-center lg:w-1/2 lg:text-left">
          {/* Heading */}
          <h1 className="text-3xl font-bold leading-[1.08] tracking-[-0.04em] text-[var(--text-primary)] sm:text-4xl md:text-[45px]">
            <span className="block text-[var(--text-secondary)]">
              Your alumni network
            </span>
            <span className="block">is your next opportunity.</span>
          </h1>

          <p className="mt-6 text-sm leading-8 text-[var(--text-secondary)] sm:mt-8 sm:text-base sm:leading-10">
            <span>
              Find alumni working inside companies. Discover referral
              opportunities.
            </span>
            <span> Referred faster — through people who actually know you.</span>
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row lg:justify-start">
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

            {/* Watch Demo Button - No Action */}
            <button
              className="btn-secondary group flex h-10 items-center gap-2 rounded-lg px-6 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 sm:gap-3 sm:px-8 sm:text-[14px] cursor-default opacity-70"
              style={{ pointerEvents: 'none' }}
            >
              <Play size={20} className="sm:size-[22px]" />
              Watch demo
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--text-secondary)] sm:mt-8 sm:gap-6 lg:justify-start">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-[var(--primary)] text-[var(--primary)]">
                <Check size={14} />
              </span>
              Real Alumni, Real Referrers
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-[var(--primary)] text-[var(--primary)]">
                <Check size={14} />
              </span>
              Expert-Interviewed Candidates
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-[var(--primary)] text-[var(--primary)]">
                <Check size={14} />
              </span>
              No Cold Applications
            </div>
          </div>
        </div>

        
        <div className="hidden w-full lg:mt-0 lg:block lg:w-1/2">
          <HeroDashboardPreview />
        </div>
      </div>
    </section>
  );
}