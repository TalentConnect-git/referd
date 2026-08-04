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

export default function Home() {
  const { loading, user, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && role) {
      router.replace(`/${role}/dashboard`);
    }
  }, [loading, user, role, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
      </div>
    );
  }

  // Don't render landing page while redirecting
  if (user) {
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

      <Footer/>
    </>
  );
}