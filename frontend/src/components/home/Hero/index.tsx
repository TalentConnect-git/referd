"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Play, Check, Sparkles } from "lucide-react";
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

      {/* Gradient Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[var(--primary)]/10 blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[var(--primary)]/5 blur-3xl animate-pulse-slower"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--background)]/60 via-transparent to-[var(--background)]/70" />

      {/* Main Container */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        
        {/* Hero Content */}
        <div className="w-full max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--primary-soft)] px-4 py-1.5 text-xs font-medium text-[var(--primary)] mb-6 animate-fade-in">
           
            <span>Referral Network</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl md:text-6xl lg:text-[64px]">
            <span className="block text-[var(--text-secondary)] animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
              Your alumni network
            </span>

            <span className="block mt-1 animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
              is your next opportunity.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:mt-7 sm:text-base sm:leading-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Find alumni working inside companies. Discover referral opportunities.
            <span className="block">
              Referred faster — through people who actually know you.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <button
              onClick={handleGetStarted}
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-7 text-sm font-medium text-white shadow-sm transition-all hover:bg-[var(--primary-hover)] hover:shadow-md hover:scale-[1.03] active:scale-[0.97]"
            >
              Get Started
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>

            <button
              type="button"
              disabled
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-7 text-sm font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] opacity-60 cursor-not-allowed"
            >
              <Play size={18} />
              Watch demo
            </button>
          </div>

          {/* Trust Points */}
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-[var(--text-secondary)] sm:mt-10 sm:text-sm animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <div className="flex items-center gap-2 transition-all hover:text-[var(--primary)]">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--primary)] text-[var(--primary)]">
                <Check size={12} strokeWidth={2.5} />
              </span>
              Real Alumni, Real Referrers
            </div>

            <div className="flex items-center gap-2 transition-all hover:text-[var(--primary)]">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--primary)] text-[var(--primary)]">
                <Check size={12} strokeWidth={2.5} />
              </span>
              Expert-Interviewed Candidates
            </div>

            <div className="flex items-center gap-2 transition-all hover:text-[var(--primary)]">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--primary)] text-[var(--primary)]">
                <Check size={12} strokeWidth={2.5} />
              </span>
              No Cold Applications
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-12 w-full max-w-6xl sm:mt-16 lg:mt-20 animate-slide-in-up" style={{ animationDelay: '1.1s' }}>
          <HeroDashboardPreview />
        </div>
      </div>
    </section>
  );
}