"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Compass, Globe } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col">
      <Navbar />

      <div className="flex-1 mt-10 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center">
          {/* Animated 404 with CSS */}
          <div className="relative mx-auto w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
            {/* Floating Orbs */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Orb 1 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-[var(--primary)]/10 animate-pulse-slow"></div>
                
                {/* Orb 2 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-[var(--primary)]/20 animate-pulse-slower"></div>
                
                {/* Orb 3 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[var(--primary)]/30 animate-pulse-slowest"></div>

                {/* 404 Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <span className="text-7xl sm:text-8xl md:text-9xl font-bold text-[var(--text-primary)] tracking-tight animate-float">
                      4
                    </span>
                    <span className="text-7xl sm:text-8xl md:text-9xl font-bold text-[var(--primary)] tracking-tight animate-float-delay">
                      0
                    </span>
                    <span className="text-7xl sm:text-8xl md:text-9xl font-bold text-[var(--text-primary)] tracking-tight animate-float">
                      4
                    </span>
                  </div>
                </div>

                {/* Floating particles */}
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-5 left-5 w-2 h-2 rounded-full bg-[var(--primary)] animate-float-particle" style={{ animationDelay: '0s' }}></div>
                  <div className="absolute top-10 right-10 w-3 h-3 rounded-full bg-[var(--primary)]/70 animate-float-particle" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute bottom-10 left-10 w-2.5 h-2.5 rounded-full bg-[var(--primary)]/60 animate-float-particle" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute bottom-5 right-5 w-2 h-2 rounded-full bg-[var(--primary)]/80 animate-float-particle" style={{ animationDelay: '1.5s' }}></div>
                  <div className="absolute top-1/2 left-5 w-1.5 h-1.5 rounded-full bg-[var(--primary)]/50 animate-float-particle" style={{ animationDelay: '0.8s' }}></div>
                  <div className="absolute top-1/3 right-8 w-2 h-2 rounded-full bg-[var(--primary)]/70 animate-float-particle" style={{ animationDelay: '1.2s' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-2">
            <div className="inline-block rounded-full bg-[var(--primary-soft)] px-5 py-2 text-sm font-medium text-[var(--primary)] border border-[var(--primary-border)] animate-pulse-badge">
              <span className="flex items-center gap-2">
                <Compass className="h-4 w-4" />
                Page Not Found
              </span>
            </div>
          </div>

          {/* Message */}
          <div className="mt-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
              Oops! You've wandered off
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={goBack}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-6 py-3 text-sm font-medium text-[var(--text-primary)] transition-all hover:border-[var(--primary-border)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] hover:scale-105 shadow-sm group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Go Back
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[var(--primary-dark)] hover:scale-105 shadow-lg shadow-[var(--primary)]/25 group"
            >
              <Home className="h-4 w-4 transition-transform group-hover:scale-110" />
              Go to Homepage
            </Link>
          </div>

          

          
          
        </div>
      </div>

      <Footer />
    </main>
  );
}