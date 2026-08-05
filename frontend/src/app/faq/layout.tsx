import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Referd - Employee Referral Network",
  description:
    "Find answers about Referd, India's alumni-powered referral hiring network, referrals, verified candidature, expert interviews, and referral jobs.",
  keywords: [
    "Referd FAQ",
    "employee referral platform",
    "referral jobs",
    "alumni network",
    "verified candidature",
    "job referrals",
  ],
  openGraph: {
    title: "FAQ | Referd - Employee Referral Network",
    description:
      "Learn how Referd connects students, freshers, and professionals through trusted employee referrals.",
    url: "https://referd.in/faq",
    siteName: "Referd",
    type: "website",
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}