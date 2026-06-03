import CTA from "@/components/home/CTA";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import ReferralJobs from "@/components/home/ReferralJobs";
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";


export default function Home() {
  return (
    <>
    <Navbar/>
    <Hero/>
    <Features/>
    <ReferralJobs/>
    <HowItWorks/>
    <Testimonials/>
    <CTA/>
    <Footer/>
    </>
    
  );
}
