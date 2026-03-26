import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "Mitcrux ● AI-Powered Software & Digital Solutions",
    template: "%s | Mitcrux",
  },
  description:
    "Africa's fastest AI-powered tech partner. Rapid MVPs, intelligent AI agents, AdSense approval, automation systems, networking, and smart solutions — built to move your business forward.",
  keywords: [
    "software development Nigeria",
    "AI agents Abuja",
    "MVP development",
    "web app development Nigeria",
    "AI automation",
    "AdSense approval",
    "smart home Nigeria",
    "IT consulting Abuja",
    "Mitcrux",
  ],
  authors: [{ name: "Mitcrux", url: "https://mitcrux.com" }],
  creator: "Mitcrux",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://mitcrux.com",
    siteName: "Mitcrux",
    title: "Mitcrux ● AI-Powered Software & Digital Solutions",
    description:
      "Rapid MVPs. Intelligent AI Agents. AdSense Approval. Automation Systems. delivered globally.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mitcrux — AI-Powered Tech Partner",
    description: "Build fast. Build smart. Build with AI.",
    creator: "@mitcrux",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#080f1e" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <Navbar />
          <ScrollProgress />
          <main className="relative">{children}</main>
          <Footer />
          <WhatsAppButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
