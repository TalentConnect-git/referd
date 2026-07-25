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
    "mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--primary)]";

  return (
    <section
      id="product"
      className="bg-[var(--background)] px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.35em] text-[var(--primary)] sm:mb-4">
          The Platform
        </p>

        <h2 className="max-w-4xl text-3xl font-bold leading-tight tracking-[-0.04em] text-[var(--text-primary)] sm:text-4xl md:text-[40px]">
          What exactly is Referd?
        </h2>

        <p className="mt-3 font-mono text-sm leading-7 text-[var(--text-secondary)] sm:mt-4 sm:text-[15px]">
          A focused network for one thing: turning your school alumni into
          actual job offers.
        </p>

        <div
          className="
            mt-8 grid grid-cols-1 gap-4
            sm:mt-10 sm:gap-5
            lg:grid-cols-4
            lg:grid-rows-[185px_245px_215px]
          "
        >
          {/* Alumni Network */}
          <RevealItem
            delay={0}
            className="
              lg:col-span-2
              lg:col-start-1
              lg:row-span-2
              lg:row-start-1
            "
          >
            <div className="surface-card relative h-full overflow-hidden rounded-3xl p-5 sm:p-6 lg:p-8">
              {/* Glow Effect */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[var(--primary-soft)] blur-[80px]"
              />

              <div className="relative z-10 grid h-full gap-6 xl:grid-cols-[1fr_0.92fr] xl:items-center">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className={iconClass}>
                      <Users size={24} />
                    </div>

                    <h3 className="mb-2 text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:mb-3 sm:text-[21px]">
                      Alumni Network
                    </h3>

                    <p className="max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
                      Find alumni — from your college or your past companies —
                      working where you want to be next. Verified identity keeps
                      every conversation warm, relevant, and trusted.
                    </p>
                  </div>

                  <p className="mt-4 font-mono text-[11px] leading-5 tracking-wide text-[var(--text-muted)] sm:mt-6">
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

                      <p className="text-xs leading-5 text-[var(--text-primary)]">
                        {profile}
                      </p>
                    </div>
                  ))}

                  <div className="mt-3 rounded-xl border border-[var(--primary-border)] bg-[var(--primary-soft)] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--primary)]">
                    Verified alumni network
                  </div>
                </div>
              </div>
            </div>
          </RevealItem>

          {/* Referral Jobs — Smaller card */}
          <RevealItem
            delay={0.12}
            className="
              lg:col-span-2
              lg:col-start-3
              lg:row-start-1
            "
          >
            <div className="surface-card relative h-full overflow-hidden rounded-3xl p-4 sm:p-5">
              <div className="grid h-full gap-4 sm:grid-cols-[minmax(0,1fr)_176px] sm:items-center sm:gap-5">
                <div className="min-w-0">
                  <div
                    className="
                      mb-3 flex h-9 w-9
                      items-center justify-center
                      rounded-xl
                      border border-[var(--primary-border)]
                      bg-[var(--primary-soft)]
                      text-[var(--primary)]
                    "
                  >
                    <Briefcase size={20} />
                  </div>

                  <h3 className="mb-1.5 text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                    Referral Jobs
                  </h3>

                  <p className="max-w-md text-sm leading-5 text-[var(--text-secondary)]">
                    Discover active roles posted by employees willing to refer
                    candidates from their network.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:w-44">
                  {["AI", "UX", "BE", "DS", "PM", "QA"].map((label) => (
                    <div
                      key={label}
                      className="
                        flex aspect-square items-center justify-center
                        rounded-xl
                        border border-[var(--border)]
                        bg-[var(--background-soft)]
                        font-mono text-[10px] font-semibold
                        text-[var(--text-muted)]
                      "
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealItem>

          {/* The Outcome — Larger card */}
          <RevealItem
            delay={0.55}
            className="
              lg:col-start-3
              lg:row-start-2
            "
          >
            <div
              className="
                surface-card relative h-full w-full overflow-hidden
                rounded-3xl
                border border-[var(--primary-border)]
                bg-gradient-to-br from-[var(--primary-soft)] to-[var(--background-soft)]
                p-4 sm:p-5
              "
            >
              <div
                aria-hidden="true"
                className="
                  pointer-events-none absolute
                  -bottom-14 -right-14
                  h-44 w-44 rounded-full
                  bg-[var(--primary-soft)]
                  blur-[60px]
                "
              />

              <div className="relative z-10 flex h-full flex-col justify-center">
                <div
                  className="
                    mb-2 flex h-8 w-8
                    items-center justify-center
                    rounded-xl
                    border border-[var(--primary-border)]
                    bg-[var(--card)]/70
                    text-[var(--primary)]
                  "
                >
                  <CheckCircle2 size={15} />
                </div>

                <h3 className="mb-2 text-base font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                  The Outcome
                </h3>

                <p className="text-sm leading-5 text-[var(--text-secondary)]">
                  The hiring system was built around applications. But careers
                  are built around relationships. Millions of candidates apply
                  every day. Most never reach the right person. Referd changes
                  hiring from:{" "}
                  <strong className="font-bold text-[var(--text-primary)]">
                    Cold application → Trusted introduction.
                  </strong>
                </p>
              </div>
            </div>
          </RevealItem>

          {/* Trusted Referrals */}
          <RevealItem
            delay={0.36}
            className="
              lg:col-start-4
              lg:row-span-2
              lg:row-start-2
            "
          >
            <div className="surface-card flex h-full flex-col rounded-3xl p-5 sm:p-6">
              <div className={iconClass}>
                <ShieldCheck size={24} />
              </div>

              <h3 className="mb-2 text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:mb-3 sm:text-[20px]">
                Trusted Referrals
              </h3>

              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                Every request is screened by a Referd Expert — a real interview,
                a rating, a written review. Only vetted candidates reach the
                referrer.
              </p>

              <div className="mt-4 flex flex-1 flex-col justify-end gap-2.5 sm:mt-6">
                {[
                  "Referd Expert Interview",
                  "Verified Candidature",
                  "Referrer's Reputation, Protected",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background-soft)]/75 px-3 py-2.5"
                  >
                    <CheckCircle2
                      size={16}
                      className="shrink-0 text-[var(--primary)]"
                    />

                    <span className="text-sm text-[var(--text-secondary)]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </RevealItem>

          {/* End-to-End Tracking */}
          <RevealItem
            delay={0.22}
            className="
              lg:col-span-3
              lg:col-start-1
              lg:row-start-3
            "
          >
            <div className="surface-card flex h-full flex-col justify-between rounded-3xl p-5 sm:p-6">
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.2fr] lg:items-center">
                <div>
                  <div className={iconClass}>
                    <Activity size={24} />
                  </div>

                  <h3 className="mb-2 text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-[20px]">
                    End-to-End Tracking
                  </h3>

                  <p className="max-w-md text-sm leading-6 text-[var(--text-secondary)]">
                    Track every step from request accepted to final internal
                    submission, without wondering where things stand.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    "Profile Completed",
                    "Request Sent",
                    "Direct Intro Delivered",
                  ].map((step, index) => (
                    <div
                      key={step}
                      className="relative rounded-2xl border border-[var(--border)] bg-[var(--background-soft)]/75 px-4 py-3.5"
                    >
                      <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary-soft)] font-mono text-[11px] font-semibold text-[var(--primary)]">
                        {index + 1}
                      </div>

                      <p className="text-sm font-medium leading-5 text-[var(--text-secondary)]">
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