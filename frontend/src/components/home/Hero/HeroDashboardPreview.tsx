"use client";

import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function HeroDashboardPreview() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative mx-auto mt-8 w-full max-w-5xl sm:mt-10">
        <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)]/80 shadow-xl backdrop-blur-xl">
          <div className="h-[550px] w-full animate-pulse bg-[var(--background-soft)]" />
        </div>
      </div>
    );
  }

  const isDark = theme === "dark";

  const imageSrc = isDark
    ? "/assets/dashboard-dark.png"
    : "/assets/dashboard-light.png";

  return (
    <div className="relative mx-auto mt-8 w-full max-w-5xl sm:mt-10">
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-xl">
        <Image
          src={imageSrc}
          alt="Dashboard Preview"
          width={1400}
          height={1000}
          quality={100}
          priority
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px"
          className="relative z-10 block h-auto w-full"
        />
      </div>
    </div>
  );
}