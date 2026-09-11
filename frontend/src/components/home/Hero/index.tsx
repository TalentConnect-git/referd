"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import ReferralCard from "./ReferralCard";
import HeroDashboardPreview from "./HeroDashboardPreview";
import HeroLeft from "./HeroLeft";

export default function Hero() {
  const router = useRouter();
  const { isAuthenticated, role, loading } = useAuth();



  const handlePostJob = () => {
    if (loading) return;
    if (isAuthenticated && role) {
      router.push(`/${role.toLowerCase()}/referral/post`);
    } else {
      router.push("/signup");
    }
  };

  return (
    <section
      className="
        relative
        isolate
        mt-8
        overflow-hidden
        bg-[var(--background)]
        text-[var(--text-primary)]
        sm:mt-4
        lg:mt-5
      "
    >
      {/* =====================================================
          BACKGROUND — GRID + ATMOSPHERE
      ====================================================== */}
      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        {/* Base */}
        <div className="absolute inset-0 bg-[var(--background)]" />

        {/* Square grid — smaller cells on mobile, standard on desktop */}
        <div
          className="
            absolute inset-0
            bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]
            bg-[size:36px_36px]
            opacity-[0.28]
            [mask-image:radial-gradient(ellipse_90%_55%_at_50%_0%,#000_50%,transparent_100%)]
            dark:opacity-[0.16]
            sm:bg-[size:52px_52px]
            sm:opacity-[0.3]
          "
        />

        {/* Dot grid — hidden on very small to reduce noise */}
        <div
          className="
            absolute inset-0
            hidden
            bg-[radial-gradient(circle_at_center,var(--border-strong)_1px,transparent_1px)]
            bg-[size:13px_13px]
            opacity-[0.15]
            [mask-image:radial-gradient(ellipse_75%_50%_at_50%_15%,#000_40%,transparent_100%)]
            sm:block
          "
        />

        {/* Top atmosphere — smaller on mobile */}
        <div
          className="
            absolute left-1/2 top-[-180px]
            h-[360px] w-[520px]
            -translate-x-1/2
            rounded-full
            bg-[var(--primary)]
            opacity-[0.05]
            blur-[110px]
            sm:top-[-240px]
            sm:h-[500px]
            sm:w-[820px]
            sm:opacity-[0.045]
            sm:blur-[130px]
          "
        />

        {/* Right accent — hidden on mobile */}
        <div
          className="
            absolute -right-[200px] top-[18%]
            hidden h-[420px] w-[420px]
            rounded-full
            bg-[var(--primary-light)]
            opacity-[0.025]
            blur-[130px]
            sm:block
          "
        />

        {/* Top highlight */}
        <div
          className="
            absolute inset-x-0 top-0 h-[120px]
            bg-gradient-to-b
            from-[var(--card-soft)]
            to-transparent
            opacity-40
            sm:h-[160px]
          "
        />

        {/* Bottom fade */}
        <div
          className="
            absolute inset-x-0 bottom-0 h-20
            bg-gradient-to-t
            from-[var(--background)]
            to-transparent
            sm:h-28
          "
        />

        {/* Edge fades — softer on mobile */}
        <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[var(--background)] to-transparent sm:w-20" />
        <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[var(--background)] to-transparent sm:w-20" />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1440px]
          px-3
          pb-10
          pt-7
          sm:px-4
          sm:pb-12
          sm:pt-9
          md:px-5
          lg:px-6
          xl:px-8
          lg:pb-14
          lg:pt-11
        "
      >
        {/* HERO ROW */}
        <div
          className="
            mx-auto
            grid
            w-full
            max-w-[1280px]
            grid-cols-1
            items-center
            gap-8
            sm:gap-9
            lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]
            lg:gap-8
            xl:gap-10
          "
        >
          {/* LEFT — HeroLeft */}
          <div className="min-w-0 w-full">
            <HeroLeft/>
          </div>

          {/* RIGHT — ReferralCard */}
          <div
            className="
              min-w-0 w-full
              flex justify-center
              lg:justify-end
            "
          >
            <ReferralCard onPostJob={handlePostJob} />
          </div>
        </div>

        {/* DASHBOARD PREVIEW — hidden on mobile */}
        <div
          className="
            mx-auto
            mt-8
            hidden
            w-full
            max-w-[1280px]
            sm:block
            lg:mt-11
          "
        >
          <HeroDashboardPreview />
        </div>
      </div>
    </section>
  );
}