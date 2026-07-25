"use client"
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function CTA() {
  const { role, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (isAuthenticated && role) {
      router.push(`/${role}/applications`);
    } else {
      router.push("/login");
    }
  };

  const handleTalkToFounders = () => {
    window.open("https://www.linkedin.com/in/alok-kamat-10046646/", "_blank", "noopener,noreferrer");
  };

  return (
    <section className="bg-[var(--background)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="surface-card relative overflow-hidden rounded-[32px] px-6 py-16 text-center sm:px-10 sm:py-20">
          {/* Grid Pattern Background - Light Mode */}
          <div 
            className="absolute inset-0 light-grid" 
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)
              `,
              backgroundSize: '84px 84px',
            }}
          />
          
          {/* Grid Pattern Background - Dark Mode */}
          <div 
            className="absolute inset-0 dark-grid" 
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '84px 84px',
            }}
          />

          {/* Glow Effect */}
          <div className="absolute left-1/2 top-0 h-60 w-60 -translate-x-1/2 rounded-full bg-[var(--primary-soft)] blur-[90px]" />

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold leading-tight tracking-[-0.04em] text-[var(--text-primary)] sm:text-4xl md:text-[42px]">
              Your alumni network is waiting.
            </h2>

            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)] sm:mt-4 sm:text-[15px]">
              Join the early access list. We're onboarding students and alumni
              in waves.
            </p>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row">
              <button
                onClick={handleGetStarted}
                className="btn-primary group flex h-12 items-center gap-3 rounded-xl px-6 text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Join Referd today
                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                onClick={handleTalkToFounders}
                className="btn-secondary group flex h-12 items-center rounded-xl px-6 text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Talk to founders
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}