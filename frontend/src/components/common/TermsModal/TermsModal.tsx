"use client";

import { useEffect } from "react";
import { X, CheckCircle } from "lucide-react";

type TermsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAgree?: () => void;
};

export default function TermsModal({
  isOpen,
  onClose,
  onAgree,
}: TermsModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAgree = () => {
    onAgree?.();
    onClose();
  };

  return (
    <div className="modal-overlay fixed inset-0 z-[200] flex items-center justify-center bg-overlay p-4 backdrop-blur-sm">
      <div className="modal-content flex max-h-[75vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-theme bg-background text-primary shadow-xl">
        <div className="flex items-center justify-between border-b border-divider px-5 py-4">
          <h2 className="text-[22px] font-bold tracking-[-0.04em] text-primary">
            Terms & Conditions
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="btn-ghost rounded-full p-2 text-primary transition hover:bg-card-hover hover:text-secondary"
            aria-label="Close terms modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="space-y-5 text-[13px] leading-6 text-primary">
            <section>
              <h3 className="mb-2 text-[16px] font-semibold text-secondary">
                Acceptance of Terms
              </h3>
              <p>
                By accessing or using RawRecruit, you agree to comply with these
                Terms & Conditions. If you do not agree, please do not use the
                platform.
              </p>
            </section>

            <section>
              <h3 className="mb-2 text-[16px] font-semibold text-secondary">
                Platform Usage
              </h3>
              <p>
                RawRecruit provides recruitment, placement, and career
                development services for students, fresh graduates, colleges,
                institutions, companies, and employers.
              </p>
            </section>

            <section>
              <h3 className="mb-2 text-[16px] font-semibold text-secondary">
                User Responsibilities
              </h3>
              <ul className="ml-5 list-disc space-y-1">
                <li>Provide accurate and up-to-date information.</li>
                <li>Maintain confidentiality of login credentials.</li>
                <li>Do not misuse the platform or submit false data.</li>
                <li>Respect other users and platform rules.</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-2 text-[16px] font-semibold text-secondary">
                Account Suspension
              </h3>
              <p>
                RawRecruit reserves the right to suspend or terminate accounts if
                false information is provided, policies are violated, or harmful
                activity is detected.
              </p>
            </section>

            <section>
              <h3 className="mb-2 text-[16px] font-semibold text-secondary">
                Intellectual Property
              </h3>
              <p>
                All content, logos, designs, and platform materials belong to
                RawRecruit and may not be copied, modified, or distributed
                without permission.
              </p>
            </section>

            <section>
              <h3 className="mb-2 text-[16px] font-semibold text-secondary">
                Third-Party Links
              </h3>
              <p>
                The platform may contain links to third-party websites.
                RawRecruit is not responsible for external content or privacy
                practices.
              </p>
            </section>

            <section>
              <h3 className="mb-2 text-[16px] font-semibold text-secondary">
                Limitation of Liability
              </h3>
              <ul className="ml-5 list-disc space-y-1">
                <li>Hiring or placement decisions made by users.</li>
                <li>Losses arising from misuse of the platform.</li>
                <li>Technical disruptions beyond reasonable control.</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-2 text-[16px] font-semibold text-secondary">
                Governing Law
              </h3>
              <p>
                These Terms shall be governed by the laws of India, and disputes
                shall be subject to the jurisdiction of Indian courts.
              </p>
            </section>

            <section>
              <h3 className="mb-2 text-[16px] font-semibold text-secondary">
                Contact Information
              </h3>
              <p>
                For questions related to Terms & Conditions, contact{" "}
                <a
                  href="mailto:support@rawrecruit.com"
                  className="font-semibold text-primary hover:underline"
                >
                  support@rawrecruit.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>

        <div className="flex gap-3 border-t border-divider px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary h-10 flex-1 rounded-lg border border-theme text-[13px] font-semibold text-primary transition hover:bg-card-hover"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleAgree}
            className="btn-primary flex h-10 flex-1 items-center justify-center rounded-lg text-[13px] font-semibold text-inverse transition hover:brightness-110"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
}