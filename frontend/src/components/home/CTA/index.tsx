"use client"
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import  {useRouter}  from "next/navigation";

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
    if (isAuthenticated && role) {
      router.push(`/${role}/applications`);
    } else {
      router.push("/login");
    }
  };

  return (
    <section className="bg-[var(--background)] px-6 py-14 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--card)]/70 px-6 py-20 text-center sm:px-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:84px_84px]" />

          <div className="absolute left-1/2 top-0 h-60 w-60 -translate-x-1/2 rounded-full bg-[var(--primary)]/15 blur-[90px]" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="text-[32px] font-bold leading-tight tracking-[-0.04em] text-white md:text-[42px]">
              Your alumni network is waiting.
            </h2>

            <p className="mt-4 text-[15px] leading-7 text-[var(--text-primary)]">
              Join the early access list. We're onboarding students and alumni
              in waves.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={handleGetStarted}
                className="button-color flex h-12 items-center gap-3 rounded-xl px-6 text-[14px] font-semibold transition hover:opacity-90"
              >
                Join Referd today
                <ArrowRight size={18} />
              </button>

              <button
                // onClick={handleTalkToFounders}
                onClick={() => (window.location.href = "https://www.linkedin.com/in/alok-kamat-10046646/")}
                className="flex h-12 items-center rounded-xl border border-[var(--border)] bg-[var(--card)]/50 px-6 text-[14px] font-semibold text-white transition hover:bg-[var(--card-hover)]"
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
