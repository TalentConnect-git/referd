import Link from "next/link";
import { ArrowRight, Play, Check } from "lucide-react";
import HeroDashboardPreview from "./HeroDashboardPreview";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[var(--background)]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:84px_84px]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-5 pt-24 text-center">
        <div className="mb-12 inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--card)]/60 px-4 py-2 text-[12px] text-[#c7d4e5] backdrop-blur-xl">
          <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
          <span>Now in private beta · India</span>
        </div>

        <h1 className="max-w-5xl text-[35px] font-bold leading-[1.08] tracking-[-0.04em] text-white md:text-[45px]">
          <span className="block text-[#c8d0dc]">Your alumni network</span>
          <span className="block">is your next opportunity.</span>
        </h1>

        <p className="mt-8 max-w-3xl text-[16px] leading-10 text-[var(--text-primary)]">
          <span> Find alumni working inside companies. Discover referral opportunities.</span>
          <span>referred faster — through people who actually know your school.</span>
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="button-color flex h-[40px] w-auto items-center gap-6 rounded-b-lg rounded-t-lg  font-mono px-8 text-[14px]  transition hover:opacity-90"
          >
            Get Started
            <ArrowRight size={24} />
          </Link>

          <button className="flex h-[40px] items-center gap-5 rounded-b-lg rounded-t-lg border border-[var(--border-strong)] bg-[var(--card)]/40 px-8 text-[14px] font-mono text-white backdrop-blur-xl transition hover:bg-[var(--card-hover)]">
            <Play size={22} />
            Watch demo
          </button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-10 text-[16px] text-[#b8c7d9]">
          <div className="flex items-center gap-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--primary)] text-[var(--primary)]">
              <Check size={14} />
            </span>
            Verified alumni only
          </div>

          <div className="flex items-center gap-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--primary)] text-[var(--primary)]">
              <Check size={14} />
            </span>
            Free for students
          </div>
        </div>
      </div>
      <HeroDashboardPreview/>
    </section>
  );
}