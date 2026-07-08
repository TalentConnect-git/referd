// app/support/page.tsx

"use client";

import Link from "next/link";
import {
  Mail,
  Clock,
  Headphones,
  MessageCircle,
  ArrowRight,
  Building2,
  Briefcase,
  CheckCircle,
  Sparkles,
  Send,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// ---------- SVG Icons ----------
const InstagramIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedInIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);



export default function SupportPage() {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0f16] text-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#38e878]/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#12381f]/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#38e878]/3 blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative mb-16 text-center">
          <div className="absolute left-1/2 top-0 -z-10 h-32 w-32 -translate-x-1/2 rounded-full bg-[#38e878]/10 blur-2xl" />
          
          <h1 className="mb-4 bg-gradient-to-r from-white via-white to-[#38e878] bg-clip-text text-5xl font-bold text-transparent sm:text-6xl">
            We're Here To Help
          </h1>
          
          <p className="mx-auto max-w-2xl text-[17px] leading-relaxed text-[#94a3b8]">
            Get the support you need. Our team is ready to assist you with any
            questions about Referd's platform.
          </p>

          {/* Quick Stats */}
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 rounded-full bg-[#0d1520] px-4 py-2 border border-[#1a2533]">
              <CheckCircle className="h-4 w-4 text-[#38e878]" />
              <span className="text-sm text-[#94a3b8]">98% Satisfaction</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[#0d1520] px-4 py-2 border border-[#1a2533]">
              <Clock className="h-4 w-4 text-[#38e878]" />
              <span className="text-sm text-[#94a3b8]">2hr Avg Response</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[#0d1520] px-4 py-2 border border-[#1a2533]">
              <Users className="h-4 w-4 text-[#38e878]" />
              <span className="text-sm text-[#94a3b8]">500+ Happy Clients</span>
            </div>
          </div>
        </div>

        {/* Main Support Grid */}
        <div className="mb-16 grid gap-8 md:grid-cols-2">
          {/* Email Support Card */}
          <div className="group relative rounded-2xl border border-[#1a2533] bg-gradient-to-br from-[#0d1520] to-[#0a0f16] p-8 transition-all hover:border-[#38e878]/40 hover:shadow-xl hover:shadow-[#38e878]/5">
            <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
              <Sparkles className="h-5 w-5 text-[#38e878]" />
            </div>
            
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#12381f] to-[#1a4a2e] transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#38e878]/20">
              <Mail className="h-7 w-7 text-[#38e878]" />
            </div>
            
            <h3 className="mb-3 text-xl font-semibold text-white">
              Email Support
            </h3>
            
            <p className="mb-5 text-[15px] leading-relaxed text-[#94a3b8]">
              Our support team is available to answer your questions and resolve
              any issues you might have.
            </p>
            
            <div className="space-y-3">
              <a
                href="mailto:support@rawrecruit.in"
                className="group/email inline-flex w-full items-center justify-between rounded-xl border border-[#1a2533] bg-[#0a0f16] px-5 py-3.5 transition-all hover:border-[#38e878]/30 hover:bg-[#12381f]/10"
              >
                <span className="flex items-center gap-3 text-[15px] text-[#94a3b8] transition-colors group-hover/email:text-white">
                  <Send className="h-4 w-4 text-[#38e878]" />
                  support@rawrecruit.in
                </span>
                <ArrowRight className="h-4 w-4 text-[#38e878] opacity-0 transition-all group-hover/email:opacity-100" />
              </a>
              
              <div className="flex items-center gap-3 text-sm text-[#94a3b8]">
                <Clock className="h-4 w-4 text-[#38e878]" />
                <span>Response within 24 hours</span>
              </div>
            </div>
          </div>

          {/* Social Media Card */}
          <div className="group relative rounded-2xl border border-[#1a2533] bg-gradient-to-br from-[#0d1520] to-[#0a0f16] p-8 transition-all hover:border-[#38e878]/40 hover:shadow-xl hover:shadow-[#38e878]/5">
            <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
              <Sparkles className="h-5 w-5 text-[#38e878]" />
            </div>
            
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#12381f] to-[#1a4a2e] transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#38e878]/20">
              <MessageCircle className="h-7 w-7 text-[#38e878]" />
            </div>
            
            <h3 className="mb-3 text-xl font-semibold text-white">
              Social Media
            </h3>
            
            <p className="mb-5 text-[15px] leading-relaxed text-[#94a3b8]">
              Connect with us on social platforms for updates, tips, and quick
              responses.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.instagram.com/referd.d?igsh=MzcyODNzcHpmYjQ5"
                target="_blank"
                rel="noopener noreferrer"
                className="group/insta inline-flex flex-1 items-center justify-center gap-3 rounded-xl border border-[#1a2533] bg-[#0a0f16] px-5 py-3.5 text-[14px] font-medium text-[#94a3b8] transition-all hover:border-[#e4405f]/40 hover:bg-[#e4405f]/5 hover:text-white hover:shadow-lg hover:shadow-[#e4405f]/10"
              >
                <InstagramIcon className="h-5 w-5 text-[#e4405f]" />
                <span>Instagram</span>
              </a>
              <a
                href="https://www.linkedin.com/company/referd-rawrecruit/"
                target="_blank"
                rel="noopener noreferrer"
                className="group/linkedin inline-flex flex-1 items-center justify-center gap-3 rounded-xl border border-[#1a2533] bg-[#0a0f16] px-5 py-3.5 text-[14px] font-medium text-[#94a3b8] transition-all hover:border-[#0a66c2]/40 hover:bg-[#0a66c2]/5 hover:text-white hover:shadow-lg hover:shadow-[#0a66c2]/10"
              >
                <LinkedInIcon className="h-5 w-5 text-[#0a66c2]" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Support Hours */}
        <div className="relative mb-16 overflow-hidden rounded-2xl border border-[#1a2533] bg-gradient-to-r from-[#0d1520] via-[#12381f]/20 to-[#0d1520] p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#38e878]/5 blur-3xl" />
          
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#12381f]">
                <Clock className="h-7 w-7 text-[#38e878]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Support Hours</h3>
                <p className="text-sm text-[#94a3b8]">We're here to help when you need us</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-8">
              <div className="text-center">
                <p className="text-sm font-medium text-[#38e878]">Mon - Sat</p>
                <p className="text-sm text-[#94a3b8]">9:00 AM - 7:00 PM</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[#38e878]">Sunday</p>
                <p className="text-sm text-[#94a3b8]">Closed</p>
              </div>
              <div className="hidden h-12 w-px bg-[#1a2533] sm:block" />
              <div className="text-center">
                <p className="text-sm font-medium text-[#38e878]">Emergency</p>
                <p className="text-sm text-[#94a3b8]">support@rawrecruit.in</p>
              </div>
            </div>
          </div>
        </div>

        {/* About Referd Section */}
        <div className="relative overflow-hidden rounded-2xl border border-[#1a2533] bg-gradient-to-br from-[#0d1520] via-[#12381f]/10 to-[#0a0f16] p-10">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#38e878]/5 blur-3xl" />
          
          <div className="relative">
            <div className="mb-8 text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#12381f] px-4 py-1.5">
                <Sparkles className="h-4 w-4 text-[#38e878]" />
                <span className="text-xs font-medium text-[#38e878]">About Us</span>
              </div>
              <h2 className="text-2xl font-bold text-white">About Referd</h2>
              <p className="mt-2 text-[15px] text-[#94a3b8]">
                Transforming campus hiring and career building across India
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Campus Hiring Platform */}
              <a
                href="https://rawrecruit.in"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-xl border border-[#1a2533] bg-[#0a0f16] p-6 transition-all hover:border-[#38e878]/30 hover:bg-[#12381f]/10 hover:shadow-xl hover:shadow-[#38e878]/5"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#38e878]/5 blur-2xl transition-all group-hover:bg-[#38e878]/10" />
                
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#12381f] to-[#1a4a2e] transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#38e878]/20">
                    <Building2 className="h-6 w-6 text-[#38e878]" />
                  </div>
                  
                  <h4 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-[#38e878]">
                    Campus Hiring Platform
                  </h4>
                  
                  <p className="text-[14px] leading-relaxed text-[#94a3b8]">
                    Built for companies, colleges, and students through one unified
                    recruitment system.
                  </p>
                  
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#38e878] opacity-0 transition-all group-hover:opacity-100">
                    Visit rawrecruit.in
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </a>

              {/* Career Build Platform */}
              <a
                href="https://careerkrafter.in"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-xl border border-[#1a2533] bg-[#0a0f16] p-6 transition-all hover:border-[#38e878]/30 hover:bg-[#12381f]/10 hover:shadow-xl hover:shadow-[#38e878]/5"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#38e878]/5 blur-2xl transition-all group-hover:bg-[#38e878]/10" />
                
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#12381f] to-[#1a4a2e] transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#38e878]/20">
                    <Briefcase className="h-6 w-6 text-[#38e878]" />
                  </div>
                  
                  <h4 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-[#38e878]">
                    Career Build Platform
                  </h4>
                  
                  <p className="text-[14px] leading-relaxed text-[#94a3b8]">
                    Streamline recruitment, track candidates, schedule interviews,
                    and manage the complete hiring process efficiently.
                  </p>
                  
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#38e878] opacity-0 transition-all group-hover:opacity-100">
                    Visit careerkrafter.in
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Component */}
     
    </div>
  );
}