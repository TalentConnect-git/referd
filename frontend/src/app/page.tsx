"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CTA from "@/components/home/CTA";
import Features from "@/components/home/Features";
import ForReferrers from "@/components/home/ForReferrers";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import ReferralJobs from "@/components/home/ReferralJobs";
import Testimonials from "@/components/home/Testimonials";
import Navbar from "@/components/layout/Navbar";
import { RevealSection } from "@/components/ui/RevealSection";
import SectionDivider from "@/components/ui/SectionDivider";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/layout/Footer";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const { loading, user, role } = useAuth();
  const router = useRouter();

  const searchParams = useSearchParams();
  const fromLogo = searchParams.get("from") === "logo";

  useEffect(() => {
    if (loading) return;

    if (user && role && !fromLogo) {
      router.replace(`/${role}/dashboard`);
    }
  }, [loading, user, role, fromLogo, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
      </div>
    );
  }

  // Don't render landing page while redirecting
  if (user && !fromLogo) {
    return null;
  }

  return (
    <>
      <Navbar />

      <Hero />

      <SectionDivider />

      <RevealSection>
        <Features />
      </RevealSection>

      <SectionDivider />

      <RevealSection>
        <ReferralJobs />
      </RevealSection>

      <SectionDivider />

      <RevealSection>
        <HowItWorks />
      </RevealSection>

      <SectionDivider />

      <RevealSection>
        <ForReferrers />
      </RevealSection>

      <SectionDivider />

      <RevealSection>
        <Testimonials />
      </RevealSection>

      <SectionDivider />

      <RevealSection>
        <CTA />
      </RevealSection>

      <Footer />
    </>
  );
}
