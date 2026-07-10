import CTA from "@/components/home/CTA";
import Features from "@/components/home/Features";
import ForReferrers from "@/components/home/ForReferrers";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import ReferralJobs from "@/components/home/ReferralJobs";
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { RevealSection } from "@/components/ui/RevealSection";
import SectionDivider from "@/components/ui/SectionDivider";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero — already in viewport on load, no y-offset to avoid flash */}
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

      {/* Footer rendered from root layout */}
    </>
  );
}
