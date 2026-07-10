"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Briefcase,
  ChevronRight,
  GraduationCap,
  Handshake,
  HelpCircle,
  X,
} from "lucide-react";

const ONBOARDING_KEY = "referd_dashboard_onboarding_seen";

const steps = [
  {
    num: "01",
    title: "Browse referral jobs",
    description: "Find roles posted by alumni who can refer you directly to hiring managers.",
    icon: Briefcase,
  },
  {
    num: "02",
    title: "Find alumni",
    description: "Connect with alumni from your college working at companies you're interested in.",
    icon: GraduationCap,
  },
  {
    num: "03",
    title: "Request a referral",
    description: "Send one-tap referral requests with your profile context. Alumni see your match score.",
    icon: Handshake,
  },
  {
    num: "04",
    title: "Track your progress",
    description: "Keep referral requests, saved roles, and next actions easy to review.",
    icon: BarChart3,
  },
];

export default function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_KEY);
    if (!seen) {
      const timer = window.setTimeout(() => setIsOpen(true), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(ONBOARDING_KEY, "true");
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleOpen = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed bottom-24 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--primary)] shadow-lg backdrop-blur-xl transition-all hover:scale-110 hover:border-[var(--primary)] hover:shadow-[var(--primary)]/20 md:bottom-6"
        aria-label="Help"
      >
        <HelpCircle className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed left-1/2 top-1/2 z-[101] w-full max-w-md -translate-x-1/2 -translate-y-1/2"
            >
              <div className="mx-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <h2 className="text-[16px] font-semibold text-white">
                      Welcome to Referd
                    </h2>
                  </div>
                  <button
                    onClick={handleClose}
                    className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--card-hover)] hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Progress dots */}
                <div className="flex justify-center gap-2 px-6 pt-5">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentStep
                          ? "w-6 bg-[var(--primary)]"
                          : "w-1.5 bg-[var(--border)]"
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <div className="px-6 py-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <span className="mb-3 block font-mono text-[12px] text-[var(--primary)]">
                        {steps[currentStep].num}
                      </span>
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
                        <StepIcon className="h-5 w-5" />
                      </div>
                      <h3 className="mb-2 text-[18px] font-semibold text-white">
                        {steps[currentStep].title}
                      </h3>
                      <p className="text-[14px] leading-6 text-[var(--text-primary)]">
                        {steps[currentStep].description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-[var(--border)] px-6 py-4">
                  <button
                    onClick={handleClose}
                    className="text-[13px] font-medium text-[var(--text-muted)] hover:text-white"
                  >
                    Skip
                  </button>
                  <div className="flex gap-2">
                    {currentStep > 0 && (
                      <button
                        onClick={handlePrev}
                        className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[13px] font-medium text-white transition hover:bg-[var(--card-hover)]"
                      >
                        Back
                      </button>
                    )}
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-[13px] font-semibold text-black transition hover:bg-[var(--primary-dark)]"
                    >
                      {currentStep === steps.length - 1
                        ? "Get Started"
                        : "Next"}
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
