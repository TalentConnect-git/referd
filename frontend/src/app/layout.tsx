// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import "./globals.css";
import OrganizationSchema from "@/components/seo/OrganizationSchema";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://referd.in"),

  title: {
    default: "Referd - Employee Referral Platform in India | Job Referrals",
    template: "%s | Referd",
  },

  description:
  "Referd is India's employee referral platform connecting students, freshers, and professionals with verified employees for trusted job referrals, internships, referral hiring, and career opportunities.",

  keywords: [
  "employee referral platform",
  "employee referral platform india",
  "job referral platform",
  "employee referrals",
  "job referrals",
  "referral hiring",
  "referral jobs",
  "alumni referral network",
  "internship referrals",
  "off campus jobs",
  "freshers jobs",
  "professional jobs",
  "career platform",
  "job referrals india",
  "Referd",
],

  authors: [{ name: "Referd" }],
  creator: "Referd",
  publisher: "Referd",

  alternates: {
    canonical: "https://referd.in",
  },

  openGraph: {
    title: "Referd - Employee Referral Platform in India",
   description:
  "Connect with verified employees, alumni, and professionals to get trusted job referrals and accelerate your career.",
    url: "https://referd.in",
    siteName: "Referd",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Referd - Employee Referral Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Referd",
    description: "Get employee referrals from top companies.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        

        {/* Prevent flash by adding a script that runs immediately */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
        (function() {
          try {
            const theme = localStorage.getItem('theme');
            if (theme) {
              document.documentElement.setAttribute('data-theme', theme);
            } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
              document.documentElement.setAttribute('data-theme', 'dark');
            } else {
              document.documentElement.setAttribute('data-theme', 'light');
            }
          } catch (e) {}
        })();
      `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <OrganizationSchema />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
