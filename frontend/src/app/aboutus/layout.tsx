import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Referd | Alumni Powered Referral Network",
  description:
    "Learn how Referd connects students, freshers, and professionals through trusted employee referrals and alumni networks.",
  openGraph: {
    title: "About Referd | Alumni Powered Referral Network",
    description:
      "Referd helps candidates get trusted job referrals through verified professionals.",
    url: "https://referd.in/about",
    siteName: "Referd",
    type: "website",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}