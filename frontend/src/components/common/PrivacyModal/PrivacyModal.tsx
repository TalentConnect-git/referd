"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type PrivacyModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PrivacyModal({
  isOpen,
  onClose,
}: PrivacyModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="flex max-h-[75vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--background)] text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h2 className="text-[22px] font-bold tracking-[-0.04em] text-white">
            Privacy Policy
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[var(--text-primary)] transition hover:bg-white/10 hover:text-white"
            aria-label="Close privacy modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="space-y-5 text-[13px] leading-6 text-[var(--text-primary)]">
            <section>
              <h3 className="mb-2 text-[16px] font-semibold text-white">
                Introduction
              </h3>
              <p>
                RawRecruit is committed to protecting the privacy of users who
                access our platform, including students, colleges, companies,
                employers, and visitors.
              </p>
              <p className="mt-2">
                This Privacy Policy explains how we collect, use, store, and
                protect your personal information when you use RawRecruit.
              </p>
            </section>

            <section>
              <h3 className="mb-2 text-[16px] font-semibold text-white">
                Information We Collect
              </h3>

              <p className="font-medium text-white">Information You Provide</p>
              <ul className="ml-5 mt-1 list-disc space-y-1">
                <li>Name, email address, and phone number.</li>
                <li>Educational details for students.</li>
                <li>Company or college information.</li>
                <li>Job preferences, resumes, and profiles.</li>
                <li>Messages, support requests, and feedback.</li>
              </ul>

              <p className="mt-4 font-medium text-white">
                Information Collected Automatically
              </p>
              <ul className="ml-5 mt-1 list-disc space-y-1">
                <li>IP address and device information.</li>
                <li>Browser type and usage data.</li>
                <li>Pages visited and actions performed.</li>
                <li>Cookies and similar tracking technologies.</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-2 text-[16px] font-semibold text-white">
                How We Use Your Information
              </h3>
              <ul className="ml-5 list-disc space-y-1">
                <li>Provide and operate recruitment services.</li>
                <li>Facilitate hiring, placements, and career services.</li>
                <li>Improve platform functionality and user experience.</li>
                <li>Communicate updates, alerts, and support messages.</li>
                <li>Maintain security and prevent misuse.</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-2 text-[16px] font-semibold text-white">
                Information Sharing
              </h3>
              <p>We do not sell personal data.</p>
              <p className="mt-2">Information may be shared:</p>
              <ul className="ml-5 mt-1 list-disc space-y-1">
                <li>
                  Between colleges, companies, and candidates for recruitment
                  purposes.
                </li>
                <li>With trusted service providers for platform operations.</li>
                <li>When required by law or regulatory authorities.</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-2 text-[16px] font-semibold text-white">
                Data Security
              </h3>
              <p>
                We implement reasonable technical and organizational measures to
                protect personal information from unauthorized access, misuse,
                or disclosure. However, no system is completely secure.
              </p>
            </section>

            <section>
              <h3 className="mb-2 text-[16px] font-semibold text-white">
                Cookies Policy
              </h3>
              <p>RawRecruit uses cookies to:</p>
              <ul className="ml-5 mt-1 list-disc space-y-1">
                <li>Improve site performance.</li>
                <li>Understand user behavior.</li>
                <li>Personalize user experience.</li>
              </ul>
              <p className="mt-2">
                You may disable cookies through your browser settings.
              </p>
            </section>

            <section>
              <h3 className="mb-2 text-[16px] font-semibold text-white">
                Your Rights
              </h3>
              <ul className="ml-5 list-disc space-y-1">
                <li>Access or update your information.</li>
                <li>Request correction or deletion of your data.</li>
                <li>Withdraw consent where applicable.</li>
              </ul>
              <p className="mt-2">
                Requests can be sent to{" "}
                <a
                  href="mailto:privacy@rawrecruit.com"
                  className="font-semibold text-[var(--primary)] hover:underline"
                >
                  privacy@rawrecruit.com
                </a>
                .
              </p>
            </section>

            <section>
              <h3 className="mb-2 text-[16px] font-semibold text-white">
                Changes to This Policy
              </h3>
              <p>
                We may update this Privacy Policy periodically. Changes will be
                posted on this page with an updated date.
              </p>
            </section>

            <section>
              <h3 className="mb-2 text-[16px] font-semibold text-white">
                Contact Us
              </h3>
              <p>
                For privacy-related questions, contact{" "}
                <a
                  href="mailto:support@rawrecruit.com"
                  className="font-semibold text-[var(--primary)] hover:underline"
                >
                  support@rawrecruit.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>

        <div className="border-t border-[var(--border)] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="button-color h-10 w-full rounded-lg text-[13px] font-semibold text-black transition hover:brightness-110"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}