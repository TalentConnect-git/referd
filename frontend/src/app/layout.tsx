import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Footer from "@/components/layout/Footer";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Referd",
  description: "Referd platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}