import type { Metadata, Viewport } from "next";
import { Manrope, Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

const fontDisplay = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});
const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
// Page titles (h1)
const fontHeading = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-heading",
  display: "swap",
});
const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

/* Applies the stored / system theme before first paint to avoid a flash. */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("mitcrux-theme");if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.classList.add(t)}catch(e){document.documentElement.classList.add("dark")}})();`;

export const metadata: Metadata = {
  title: {
    default: "Mitcrux ● AI-Powered Software & Digital Solutions",
    template: "%s | Mitcrux",
  },
  description:
    "Africa's fastest AI-powered tech partner. Rapid MVPs, intelligent AI agents, AdSense approval, automation systems, networking, and smart solutions, built to move your business forward.",
  keywords: [
    "software development Nigeria",
    "AI agents Abuja",
    "MVP development",
    "web app development Nigeria",
    "AI automation",
    "social media management Nigeria",
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
    title: "Mitcrux: AI-Powered Tech Partner",
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
    { media: "(prefers-color-scheme: light)", color: "#f3f6fb" },
    { media: "(prefers-color-scheme: dark)", color: "#081329" },
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontHeading.variable} ${fontMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
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
