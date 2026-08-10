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
      <div className="relative mx-auto mt-8 w-full max-w-5xl scale-[0.95] sm:mt-10 sm:scale-[0.96] lg:scale-[0.92]">
        <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--card)]/80 shadow-xl backdrop-blur-xl overflow-hidden">
          <div className="w-full h-[550px] bg-[var(--background-soft)] animate-pulse" />
        </div>
      </div>
    );
  }

  const isDark = theme === "dark";

  const imageSrc = isDark ? "/assets/dashboard-dark.png" : "/assets/dashboard-light.png";

  return (
    <div className="relative mx-auto mt-8 w-full max-w-5xl scale-[0.95] sm:mt-10 sm:scale-[0.96] lg:scale-[0.92]">
      <div className="relative rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-xl overflow-hidden">
        <Image
          src={imageSrc}
          alt="Dashboard Preview"
          width={1400}
          height={1000}
          className="w-full h-auto relative z-10"
          priority
        />
      </div>
    </div>
  );
}