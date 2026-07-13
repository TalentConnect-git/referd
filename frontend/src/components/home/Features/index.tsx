"use client";

import {
  Activity,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";
import { RevealItem } from "@/components/ui/RevealSection";

export default function Features() {
  const iconClass =
    "mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(49,170,64,0.20)] bg-[var(--primary-soft)] text-[var(--primary)]";

  return (
    <section
      id="product"
      className="bg-[var(--background)] px-6 py-14 sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 font-mono text-[12px] font-semibold uppercase tracking-[0.35em] text-[var(--primary)]">
          The Platform
        </p>

        <h2 className="max-w-4xl text-[32px] font-bold leading-tight tracking-[-0.04em] text-white md:text-[40px]">
          What exactly is Referd?
        </h2>

        <p className="mt-4 text-[15px] font-mono leading-7 text-[var(--text-primary)]">
          A focused network for one thing: turning your school alumni into
          actual job offers.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-4 lg:auto-rows-[215px]">
          {/* 1st — Alumni Network (top-left, large) */}
          <RevealItem delay={0} className="lg:col-span-2 lg:row-span-2">
            <div className="relative h-full overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)]/70 p-6 sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[var(--primary)]/10 blur-[80px]"
              />

              <div className="relative z-10 grid h-full gap-6 xl:grid-cols-[1fr_0.92fr] xl:items-center">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className={iconClass}>
                      <Users size={24} />
                    </div>

                    <h3 className="mb-3 text-[21px] font-semibold tracking-[-0.03em] text-white">
                      Alumni Network
                    </h3>

                    <p className="max-w-sm text-[14px] leading-6 text-[var(--text-primary)]">
                      Find alumni — from your college or your past companies —
                      working where you want to be next. Verified identity keeps
                      every conversation warm, relevant, and trusted.
                    </p>
                  </div>

                  <p className="mt-6 font-mono text-[11px] leading-5 tracking-wide text-[var(--text-primary)]">
                    Warm introductions from people who know you — from campus or
                    from your last job.
                  </p>
                </div>

                <div className="space-y-2.5 rounded-2xl border border-[var(--border)] bg-[var(--background-soft)]/80 p-3">
                  {[
                    "Priya S. - Product Engineer @ Razorpay",
                    "Aman K. - SDE-II @ Amazon",
                    "Neha R. - Data Analyst @ Zomato",
                  ].map((profile) => (
                    <div
                      key={profile}
                      className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2.5"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
                        <GraduationCap size={16} />
                      </div>
                      <p className="text-[12px] leading-5 text-white/85">
                        {profile}
                      </p>
                    </div>
                  ))}

                  <div className="mt-3 rounded-xl border border-[rgba(49,170,64,0.24)] bg-[var(--primary-soft)] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--primary)]">
                    Verified alumni network
                  </div>
                </div>
              </div>
            </div>
          </RevealItem>

          {/* 2nd — Referral Jobs (top-right) */}
          <RevealItem delay={0.12} className="lg:col-span-2">
            <div className="relative h-full overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)]/70 p-6">
              <div className="grid h-full gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <div className={iconClass}>
                    <Briefcase size={24} />
                  </div>

                  <h3 className="mb-2 text-[20px] font-semibold tracking-[-0.03em] text-white">
                    Referral Jobs
                  </h3>

                  <p className="max-w-md text-[14px] leading-6 text-[var(--text-primary)]">
                    Discover active roles posted by employees willing to refer
                    candidates from their network.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2.5 sm:w-48">
                  {["AI", "UX", "BE", "DS", "PM", "QA"].map((label) => (
                    <div
                      key={label}
                      className="flex aspect-square items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--background-soft)] font-mono text-[11px] font-semibold text-white/80"
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealItem>

          {/* 5th — The Outcome (centre green card, last) */}
          <RevealItem delay={0.55}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-[rgba(49,170,64,0.32)] bg-[linear-gradient(135deg,rgba(49,170,64,0.20),rgba(13,19,36,0.72))] p-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-14 -right-14 h-44 w-44 rounded-full bg-[var(--primary)]/15 blur-[60px]"
              />

              <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-2xl border border-[rgba(49,170,64,0.26)] bg-[var(--background)]/70 text-[var(--primary)]">
                  <CheckCircle2 size={12} />
                </div>

                <h3 className="mb-1 text-[12px] font-semibold tracking-[-0.03em] text-white">
                  The Outcome
                </h3>

                <p className="text-[9px] font-medium leading-6 text-white/82">
                  The hiring system was built around applications. But careers
                  are built around relationships. Millions of candidates apply
                  every day. Most never reach the right person.Referd changes
                  hiring from: Cold application → Trusted introduction.
                </p>
              </div>
            </div>
          </RevealItem>

          {/* 4th — Trusted Referrals (right column) */}
          <RevealItem delay={0.36} className="lg:row-span-2">
            <div className="flex h-full flex-col rounded-3xl border border-[var(--border)] bg-[var(--card)]/70 p-6">
              <div className={iconClass}>
                <ShieldCheck size={24} />
              </div>

              <h3 className="mb-3 text-[20px] font-semibold tracking-[-0.03em] text-white">
                Trusted Referrals
              </h3>

              <p className="text-[14px] leading-6 text-[var(--text-primary)]">
                Every request is screened by a Referd Expert — a real interview,
                a rating, a written review. Only vetted candidates reach the
                referrer.
              </p>

              <div className="mt-6 flex flex-1 flex-col justify-end gap-2.5">
                {[
                  "Referd Expert Interview",
                  "Verified Candidature",
                  "Referrer&#39;s Reputation, Protected",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background-soft)]/75 px-3 py-2.5"
                  >
                    <CheckCircle2
                      size={16}
                      className="shrink-0 text-[var(--primary)]"
                    />
                    <span className="text-[13px] text-white/82">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </RevealItem>

          {/* 3rd — End-to-End Tracking (bottom, wide) */}
          <RevealItem delay={0.22} className="lg:col-span-3">
            <div className="flex h-full flex-col justify-between rounded-3xl border border-[var(--border)] bg-[var(--card)]/70 p-6">
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.2fr] lg:items-center">
                <div>
                  <div className={iconClass}>
                    <Activity size={24} />
                  </div>

                  <h3 className="mb-2 text-[20px] font-semibold tracking-[-0.03em] text-white">
                    End-to-End Tracking
                  </h3>

                  <p className="max-w-md text-[14px] leading-6 text-[var(--text-primary)]">
                    Track every step from request accepted to final internal
                    submission, without wondering where things stand.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    "Profile Completed",
                    "Request Sent",
                    "Direct Intro Delivered ",
                  ].map((step, index) => (
                    <div
                      key={step}
                      className="relative rounded-2xl border border-[var(--border)] bg-[var(--background-soft)]/75 px-4 py-3.5"
                    >
                      <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary-soft)] font-mono text-[11px] font-semibold text-[var(--primary)]">
                        {index + 1}
                      </div>
                      <p className="text-[13px] font-medium leading-5 text-white/85">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealItem>
        </div>
      </div>
    </section>
  );
}
