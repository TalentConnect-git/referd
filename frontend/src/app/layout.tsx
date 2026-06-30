import Footer from "@/components/layout/Footer";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import { GoogleOAuthProvider } from "@react-oauth/google";

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <GoogleOAuthProvider clientId={process.env.Next_GOOGLE_CLIENT_ID || ""} >
          <Providers>{children}</Providers>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}