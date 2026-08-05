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
    default: "Referd | Get Employee Referrals from Top Companies",
    template: "%s | Referd",
  },

  description:
    "Connect with employees from top companies and get trusted job referrals. Referd helps students, freshers, and professionals accelerate their careers through employee referrals.",

  keywords: [
    "employee referral",
    "job referral",
    "referd",
    "career",
    "software engineer jobs",
    "freshers jobs",
    "professional jobs",
    "campus hiring",
    "job referrals India",
  ],

  authors: [{ name: "Referd" }],
  creator: "Referd",
  publisher: "Referd",

  alternates: {
    canonical: "https://referd.in",
  },

  openGraph: {
    title: "Referd | Get Employee Referrals",
    description:
      "Find trusted employee referrals from top companies and boost your chances of getting hired.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Referd",
              url: "https://referd.in",
              logo: "https://referd.in/logo.png",
              description:
                "Referd is an employee referral platform connecting students, freshers, and professionals with trusted job referrals.",
            }),
          }}
        />

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
