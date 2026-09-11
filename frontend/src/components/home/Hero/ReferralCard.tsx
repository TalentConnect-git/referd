"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import {
  ArrowRight,
  BriefcaseBusiness,
  ShieldCheck,
  UserCheck,
  UserRoundPlus,
  Gift,
} from "lucide-react";

interface ReferralCardProps {
  onPostJob: () => void;
}

export default function ReferralCard({ onPostJob }: ReferralCardProps) {
  const router = useRouter();
  const { isAuthenticated, role, loading } = useAuth();

  const goToReferralJobs = () => {
    if (loading) return;

    if (isAuthenticated && role) {
      router.push(`/${role}/jobs/referral-jobs`);
    } else {
      router.push("/signup");
    }
  };

  const handlePostReferralJob = () => {
    if (loading) return;

    if (!isAuthenticated || !role) {
      router.push("/signup");
      return;
    }

    if (role.toLowerCase() !== "professional") {
      import("react-hot-toast").then(({ toast }) => {
        toast.error("Only professionals can post a referral job");
      });
      return;
    }

    router.push(`/${role}/post-referral`);
  };

  const alumni = [
    {
      letter: "A",
      bg: "bg-[var(--primary-soft)]",
      text: "text-[var(--primary)]",
    },
    {
      letter: "R",
      bg: "bg-[var(--info-soft)]",
      text: "text-[var(--info)]",
    },
    {
      letter: "S",
      bg: "bg-[var(--warning-soft)]",
      text: "text-[var(--warning)]",
    },
    {
      letter: "M",
      bg: "bg-[var(--success-soft)]",
      text: "text-[var(--success)]",
    },
    {
      letter: "K",
      bg: "bg-[var(--danger-soft)]",
      text: "text-[var(--danger)]",
    },
  ];

  const miniFlow: {
    icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
    label: string;
    highlight?: boolean;
  }[] = [
    {
      icon: BriefcaseBusiness,
      label: "You post Open role",
    },
    {
      icon: ShieldCheck,
      label: "Referd interviews every applicant",
      highlight: true,
    },
    {
      icon: UserCheck,
      label: "You review Qualified talent",
    },
    {
      icon: UserRoundPlus,
      label: "You refer the right fit",
    },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      {/* Ambient glow */}
      <div
        className="
          pointer-events-none absolute
          -right-16 top-1/3
          h-32 w-56
          rounded-full
          bg-[var(--primary)]
          opacity-[0.025]
          blur-[100px]
        "
      />

      <div className="flex flex-col gap-3">
        {/* =====================================================
            CARD 1 — CANDIDATE
        ====================================================== */}

        <div
          className="
            group relative
            w-full overflow-hidden
            rounded-2xl
            border border-[var(--border)]
            bg-[var(--card)]
            shadow-[0_6px_24px_rgba(34,197,94,0.08)] dark:shadow-[0_10px_28px_rgba(0,0,0,0.35)]
            transition-shadow duration-500
            hover:border-[var(--border-strong)]
            hover:shadow-[0_16px_40px_rgba(34,197,94,0.14)] dark:hover:shadow-[0_18px_44px_rgba(0,0,0,0.45)]
            animate-card-enter
          "
        >
          {/* Top border highlight */}
          <div
            className="
              pointer-events-none absolute
              inset-x-0 top-0 h-px
              bg-gradient-to-r
              from-transparent
              via-[var(--border-strong)]
              to-transparent
              opacity-60
            "
          />

          <div className="relative p-3.5 sm:p-4">
            <div
              className="
                grid grid-cols-1 gap-3.5
                md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]
                md:items-center
              "
            >
              {/* LEFT */}
              <div>
                <h2
                  className="
                    text-[20px]
                    font-bold
                    leading-[1.12]
                    tracking-[-0.03em]
                    text-[var(--text-primary)]
                    sm:text-[22px]
                  "
                >
                  Get referred.
                  <br />
                  <span
                    className="
                      bg-gradient-to-r
                      from-[var(--primary)]
                      to-[var(--primary-light)]
                      bg-clip-text
                      text-transparent
                    "
                  >
                    Get hired.
                  </span>
                </h2>

                <p
                  className="
                    mt-2
                    text-[11.5px]
                    leading-[1.5]
                    text-[var(--text-secondary)]
                  "
                >
                  Discover referral jobs matched to you, apply to any role, and
                  find alumni working at the company.
                </p>

                {/* Explore opportunities button — neutral professional */}
                <button
                  type="button"
                  onClick={goToReferralJobs}
                  className="
                    group/cta
                    mt-3.5
                    inline-flex
                    items-center
                    justify-center
                    gap-1.5
                    rounded-full
                    border
                    border-[var(--text-primary)]
                    bg-[var(--text-primary)]
                    px-3
                    py-1.5
                    text-[11.5px]
                    font-semibold
                    tracking-[-0.01em]
                    text-[var(--card)]
                    shadow-[0_2px_8px_rgba(0,0,0,0.12)]
                    transition-all
                    duration-300
                    motion-safe:hover:-translate-y-0.5
                    hover:opacity-90
                    hover:shadow-[0_8px_20px_rgba(0,0,0,0.20)]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[var(--text-primary)]
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-[var(--card)]
                  "
                >
                  Explore opportunities
                  <ArrowRight
                    size={11}
                    className="
                      shrink-0
                      opacity-90
                      transition-all
                      duration-300
                      group-hover/cta:translate-x-0.5
                      group-hover/cta:opacity-100
                    "
                  />
                </button>
              </div>

              {/* RIGHT — Mini card */}
              <div
                className="
                  rounded-[14px]
                  border border-[var(--border)]
                  bg-[var(--card)]
                  p-2.5 shadow-[0_2px_10px_rgba(34,197,94,0.06)] dark:shadow-[0_3px_14px_rgba(0,0,0,0.25)]
                "
              >
                <div className="flex items-start gap-2">
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border border-[var(--border)]
                      bg-[var(--card)]
                      text-[var(--text-secondary)]
                    "
                  >
                    <BriefcaseBusiness size={13} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className="
                        truncate
                        text-[11.5px]
                        font-semibold
                        text-[var(--text-primary)]
                      "
                    >
                      Software Engineer
                    </p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-[9.5px]
                        text-[var(--text-muted)]
                      "
                    >
                      Bengaluru, India
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex">
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1
                      rounded-full
                      border
                      border-[var(--border)]
                      bg-[var(--card-soft)]
                      px-2
                      py-0.5
                      text-[8.5px]
                      font-semibold
                      text-[var(--text-secondary)]
                    "
                  >
                    Referral opportunity
                  </span>
                </div>

                <div className="my-2 h-px bg-[var(--divider)]" />

                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1.5">
                    {alumni.map((item) => (
                      <div
                        key={item.letter}
                        className={`
                          flex
                          h-5
                          w-5
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-[var(--card-soft)]
                          ${item.bg}
                          ${item.text}
                          text-[7px]
                          font-semibold
                        `}
                      >
                        {item.letter}
                      </div>
                    ))}
                  </div>

                  <span
                    className="
                      flex
                      h-5
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[var(--border)]
                      bg-[var(--card)]
                      px-1.5
                      text-[8px]
                      font-semibold
                      text-[var(--text-secondary)]
                    "
                  >
                    +12
                  </span>
                </div>

                <p
                  className="
                    mt-2
                    text-[9.5px]
                    leading-[1.4]
                    text-[var(--text-muted)]
                  "
                >
                  12 alumni at this company
                </p>

                {/* Apply for referral button — neutral professional */}
                <button
                  type="button"
                  onClick={goToReferralJobs}
                  className="
                    group/cta
                    mt-3.5
                    inline-flex
                    items-center
                    justify-center
                    gap-1.5
                    rounded-full
                    border
                    border-[var(--text-primary)]
                    bg-[var(--text-primary)]
                    px-3
                    py-1.5
                    text-[11.5px]
                    font-semibold
                    tracking-[-0.01em]
                    text-[var(--card)]
                    shadow-[0_2px_8px_rgba(0,0,0,0.12)]
                    transition-all
                    duration-300
                    motion-safe:hover:-translate-y-0.5
                    hover:opacity-90
                    hover:shadow-[0_8px_20px_rgba(0,0,0,0.20)]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[var(--text-primary)]
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-[var(--card)]
                  "
                >
                  Apply for referral
                  <ArrowRight
                    size={11}
                    className="
                      shrink-0
                      opacity-90
                      transition-all
                      duration-300
                      group-hover/cta:translate-x-0.5
                      group-hover/cta:opacity-100
                    "
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            CARD 2 — EMPLOYEE
        ====================================================== */}

        <div
          className="
            group relative
            w-full overflow-hidden
            rounded-2xl
            border border-[var(--border)]
            bg-[var(--card)]
            shadow-[0_6px_24px_rgba(34,197,94,0.08)] dark:shadow-[0_10px_28px_rgba(0,0,0,0.35)]
            transition-shadow duration-500
            hover:border-[var(--border-strong)]
            hover:shadow-[0_16px_40px_rgba(34,197,94,0.14)] dark:hover:shadow-[0_18px_44px_rgba(0,0,0,0.45)]
            animate-card-enter
          "
        >
          {/* Top border highlight */}
          <div
            className="
              pointer-events-none absolute
              inset-x-0 top-0 h-px
              bg-gradient-to-r
              from-transparent
              via-[var(--border-strong)]
              to-transparent
              opacity-60
            "
          />

          <div className="relative p-3.5 sm:p-4">
            <div
              className="
                grid grid-cols-1 gap-3.5
                md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]
                md:items-center
              "
            >
              {/* LEFT */}
              <div>
                <h2
                  className="
                    text-[20px]
                    font-bold
                    leading-[1.12]
                    tracking-[-0.03em]
                    text-[var(--text-primary)]
                    sm:text-[22px]
                  "
                >
                  Help your company
                  <br />
                  hire through your{" "}
                  <span
                    className="
                      bg-gradient-to-r
                      from-[var(--primary)]
                      to-[var(--primary-light)]
                      bg-clip-text
                      text-transparent
                    "
                  >
                    network.
                  </span>
                </h2>

                <p
                  className="
                    mt-2
                    text-[11.5px]
                    leading-[1.5]
                    text-[var(--text-secondary)]
                  "
                >
                  Share open roles from your company. Referd interviews every
                  applicant first, so you review qualified candidates and refer
                  the right fit.
                </p>

                {/* Post an open role button — neutral professional */}
                <button
                  type="button"
                  onClick={handlePostReferralJob}
                  className="
                    group/cta
                    mt-3.5
                    inline-flex
                    items-center
                    justify-center
                    gap-1.5
                    rounded-full
                    border
                    border-[var(--text-primary)]
                    bg-[var(--text-primary)]
                    px-3
                    py-1.5
                    text-[11.5px]
                    font-semibold
                    tracking-[-0.01em]
                    text-[var(--card)]
                    shadow-[0_2px_8px_rgba(0,0,0,0.12)]
                    transition-all
                    duration-300
                    motion-safe:hover:-translate-y-0.5
                    hover:opacity-90
                    hover:shadow-[0_8px_20px_rgba(0,0,0,0.20)]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[var(--text-primary)]
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-[var(--card)]
                  "
                >
                  Post an open role
                  <ArrowRight
                    size={11}
                    className="
                      shrink-0
                      opacity-90
                      transition-all
                      duration-300
                      group-hover/cta:translate-x-0.5
                      group-hover/cta:opacity-100
                    "
                  />
                </button>
              </div>

              {/* RIGHT — Mini card + mini flow */}
              <div
                className="
                  rounded-[14px]
                  border border-[var(--border)]
                  bg-[var(--card)]
                  p-2.5 shadow-[0_2px_10px_rgba(34,197,94,0.06)] dark:shadow-[0_3px_14px_rgba(0,0,0,0.25)]
                "
              >
                <p
                  className="
                    mb-2
                    text-[9.5px]
                    font-medium
                    text-[var(--text-muted)]
                  "
                >
                  Your open role
                </p>
                <div className="flex mb-2 items-start justify-between gap-2">
                  <div className="flex min-w-0 items-start gap-2">
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border border-[var(--border)]
                        bg-[var(--card)]
                        text-[var(--text-secondary)]
                      "
                    >
                      <BriefcaseBusiness size={13} />
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          text-[11.5px]
                          font-semibold
                          text-[var(--text-primary)]
                        "
                      >
                        Product Designer
                      </p>

                      <p
                        className="
                          mt-0.5
                          truncate
                          text-[9.5px]
                          text-[var(--text-muted)]
                        "
                      >
                        Bengaluru, India
                      </p>
                    </div>
                  </div>

                  {/* Neutral "Active" badge */}
                  <span
                    className="
                      shrink-0
                      rounded-full
                      border border-[var(--border)]
                      bg-[var(--card-soft)]
                      px-2
                      py-0.5
                      text-[8.5px]
                      font-semibold
                      text-[var(--text-secondary)]
                    "
                  >
                    Active
                  </span>
                </div>

                {/* Mini flow — only TEXT is highlighted, icon stays neutral */}
                <div className="mt-4 flex items-start justify-between gap-0.5">
                  {miniFlow.map((step, index) => {
                    const Icon = step.icon;
                    const isLast = index === miniFlow.length - 1;
                    const isHighlighted = step.highlight === true;

                    return (
                      <div
                        key={step.label}
                        className="flex flex-1 items-center"
                      >
                        <div className="flex flex-1 flex-col items-center text-center">
                          {/* Icon — always neutral */}
                          <div
                            className="
                              flex
                              h-6
                              w-6
                              items-center
                              justify-center
                              rounded-full
                              border border-[var(--border)]
                              bg-[var(--card)]
                              text-[var(--text-secondary)]
                            "
                          >
                            <Icon size={11} strokeWidth={2} />
                          </div>

                          {/* Label — only this gets highlighted */}
                          <p
                            className={`
                              mt-1
                              text-[7px]
                              leading-[1.2]
                              ${
                                isHighlighted
                                  ? "font-bold text-[var(--primary)]"
                                  : "font-medium text-[var(--text-muted)]"
                              }
                            `}
                          >
                            {step.label}
                          </p>
                        </div>

                        {!isLast && (
                          <ArrowRight
                            size={9}
                            strokeWidth={2.2}
                            className="
                              mt-[-14px]
                              shrink-0
                              text-[var(--text-subtle)]
                            "
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Reward strip */}
                <div
                  className="
                    mt-2.5
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-[var(--border)]
                    bg-[var(--card-soft)]
                    px-2
                    py-1.5
                  "
                >
                  <span
                    className="
                      flex
                      h-5
                      w-5
                      shrink-0
                      items-center
                      justify-center
                      rounded-md
                      border border-[var(--border)]
                      bg-[var(--card)]
                      text-[var(--text-secondary)]
                    "
                  >
                    <Gift size={10} />
                  </span>

                  <p
                    className="
                      min-w-0
                      flex-1
                      truncate
                      text-[9px]
                      font-semibold
                      text-[var(--text-secondary)]
                    "
                  >
                    Get rewarded when your referral gets hired.
                  </p>

                  <ArrowRight
                    size={10}
                    className="
                      shrink-0
                      text-[var(--text-subtle)]
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}