"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Users,
  ShieldCheck,
  BriefcaseBusiness,
  Link as LinkIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

interface TrustItem {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

const trustItems: TrustItem[] = [
  {
    icon: Users,
    title: "Real Alumni,",
    subtitle: "Real Referrers",
  },
  {
    icon: ShieldCheck,
    title: "Expert-Interviewed",
    subtitle: "Candidates",
  },
  {
    icon: BriefcaseBusiness,
    title: "No Cold",
    subtitle: "Applications",
  },
];

export default function HeroLeft() {
  const router = useRouter();
  const { user, role } = useAuth();

  const handleAskForReferral = () => {
    router.push("/referral-request");
  };

  const onGetStarted = () => {
    if (user) {
      router.push(`/${role}/jobs/referral-jobs`);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="relative z-10 w-full min-w-0">
      {/* Ambient glow — extremely subtle */}
      <div
        className="
          pointer-events-none
          absolute
          -left-20
          -top-14
          h-40
          w-64
          rounded-full
          bg-[var(--primary)]
          opacity-[0.03]
          blur-[100px]
        "
      />

      {/* =====================================================
          BADGE
      ====================================================== */}
      <div
        className="
          mb-4
          inline-flex
          max-w-full
          items-center
          gap-2
          rounded-full
          border
          border-[var(--border)]
          bg-[var(--card)]
          px-3
          py-1
          text-[11px]
          font-medium
          text-[var(--text-secondary)]
          shadow-[var(--shadow-xs)]
          animate-fade-in-up
        "
      >
        <span
          className="
            flex
            h-4
            w-4
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[var(--background-muted)]
            text-[var(--text-secondary)]
          "
        >
          <Users size={10} />
        </span>

        <span className="truncate">Built around your network</span>

        <span
          className="
            ml-0.5
            h-1
            w-1
            shrink-0
            rounded-full
            bg-[var(--text-subtle)]
          "
        />
      </div>

      {/* =====================================================
          HEADING
      ====================================================== */}
      <h1
        className="
          max-w-[620px]
          text-[34px]
          font-bold
          leading-[1.05]
          tracking-[-0.042em]
          text-[var(--text-primary)]
          sm:text-[42px]
          md:text-[50px]
          lg:text-[52px]
          xl:text-[56px]
        "
      >
        <span
          className="block animate-fade-in-up"
          style={{ animationDelay: "60ms" }}
        >
          Your next opportunity
        </span>

        <span
          className="mt-0.5 block animate-fade-in-up"
          style={{ animationDelay: "140ms" }}
        >
          is in{" "}
          <span className="text-[var(--text-primary)]">
            your network.
          </span>
        </span>
      </h1>

      {/* =====================================================
          DESCRIPTION
      ====================================================== */}
      <p
        className="
          mt-5
          max-w-[520px]
          text-[14px]
          leading-[1.65]
          text-[var(--text-secondary)]
          animate-fade-in-up
        "
        style={{ animationDelay: "220ms" }}
      >
        Connect with the right people, discover the right opportunities, and
        turn professional relationships into real career outcomes.
      </p>

      {/* =====================================================
          CTA BUTTONS
      ====================================================== */}
      <div
        className="
          mt-6
          flex
          w-full
          flex-col
          items-stretch
          gap-2.5
          animate-fade-in-up
          sm:flex-row
          sm:items-center
          sm:gap-3
        "
        style={{ animationDelay: "300ms" }}
      >
        {/* Ask for Referral — primary CTA */}
        <button
          type="button"
          onClick={handleAskForReferral}
          className="
            group/cta
            relative
            inline-flex
            h-10
            w-full
            min-w-0
            shrink-0
            items-center
            justify-center
            gap-1.5
            overflow-hidden
            whitespace-nowrap
            rounded-full
            bg-gradient-to-r
            from-[var(--primary-dark)]
            via-[var(--primary)]
            to-[var(--primary-light)]
            bg-[length:200%_auto]
            px-4
            text-[12px]
            font-medium
            leading-none
            text-[var(--text-on-primary)]
            shadow-[var(--shadow-md)]
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:bg-[position:100%_center]
            hover:shadow-[var(--shadow-lg)]
            active:scale-[0.98]
            sm:w-auto
            sm:px-5
          "
        >
          <span
            className="
              pointer-events-none
              absolute
              inset-0
              -translate-x-full
              bg-gradient-to-r
              from-transparent
              via-white/25
              to-transparent
              transition-transform
              duration-700
              group-hover/cta:translate-x-full
            "
          />

          <span className="relative">Ask for a Referral</span>

          <ArrowRight
            size={14}
            strokeWidth={2}
            className="
              relative
              shrink-0
              transition-transform
              duration-300
              group-hover/cta:translate-x-0.5
            "
          />
        </button>

        {/* Explore Opportunities — neutral secondary */}
        <button
          type="button"
          onClick={onGetStarted}
          className="
            group/explore
            inline-flex
            h-10
            w-full
            min-w-0
            shrink-0
            items-center
            justify-center
            gap-1.5
            overflow-hidden
            whitespace-nowrap
            rounded-full
            border
            border-[var(--border)]
            bg-[var(--card)]
            px-4
            text-[12px]
            font-medium
            leading-none
            text-[var(--text-secondary)]
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:border-[var(--border-strong)]
            hover:bg-[var(--card-hover)]
            hover:text-[var(--text-primary)]
            sm:w-auto
            sm:px-5
          "
        >
          <span className="relative">Explore Opportunities</span>

          <ArrowRight
            size={14}
            strokeWidth={2}
            className="
              relative
              shrink-0
              transition-transform
              duration-300
              group-hover/explore:translate-x-0.5
            "
          />
        </button>
      </div>

      {/* =====================================================
          SUB-LINE
      ====================================================== */}
      <div
        className="
          mt-4
          flex
          max-w-full
          items-start
          gap-2
          text-[11px]
          leading-[1.4]
          text-[var(--text-muted)]
          animate-fade-in-up
        "
        style={{ animationDelay: "340ms" }}
      >
        <LinkIcon
          size={12}
          className="
            mt-0.5
            shrink-0
            text-[var(--text-muted)]
          "
        />

        <span>Paste a job link. Find employees who can refer you.</span>
      </div>

      {/* =====================================================
          TRUST ROW
      ====================================================== */}
      <div
        className="
          mt-8
          grid
          w-full
          grid-cols-3
          gap-x-3
          gap-y-5
          animate-fade-in-up
          sm:gap-x-5
        "
        style={{ animationDelay: "380ms" }}
      >
        {trustItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex min-w-0 items-start gap-2"
            >
              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-[var(--border)]
                  bg-[var(--card)]
                  text-[var(--text-secondary)]
                  sm:h-9
                  sm:w-9
                "
              >
                <Icon size={14} strokeWidth={2} />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    truncate
                    text-[11px]
                    font-semibold
                    tracking-[-0.005em]
                    text-[var(--text-primary)]
                    sm:text-[12px]
                  "
                >
                  {item.title}
                </p>

                <p
                  className="
                    mt-0.5
                    text-[10px]
                    leading-[1.35]
                    text-[var(--text-muted)]
                    sm:text-[10.5px]
                  "
                >
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}