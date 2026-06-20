import type { Metadata } from "next";
import { Inter, Poppins, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AIAssistant } from "@/components/khojney/ai-assistant";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://khojney.com"),
  title: {
    default: "Khojney — Everything About Nepal, In One Place",
    template: "%s | Khojney",
  },
  description:
    "Prepare for exams, discover colleges, compare schools, find scholarships, explore careers, and access knowledge from across Nepal.",
  keywords: [
    "Nepal",
    "Khojney",
    "Nepal exams",
    "Loksewa",
    "CMAT",
    "Engineering Entrance",
    "MBBS Entrance",
    "Driving License Nepal",
    "Nepal colleges",
    "Nepal scholarships",
    "Nepal schools",
    "Nepal universities",
  ],
  authors: [{ name: "Khojney Team" }],
  creator: "Khojney",
  openGraph: {
    type: "website",
    locale: "en_NP",
    url: "https://khojney.com",
    siteName: "Khojney",
    title: "Khojney — Everything About Nepal, In One Place",
    description:
      "Prepare for exams, discover colleges, compare schools, find scholarships, and access knowledge from across Nepal.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Khojney — Everything About Nepal, In One Place",
    description:
      "Prepare for exams, discover colleges, compare schools, find scholarships, and access knowledge from across Nepal.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} ${notoDevanagari.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <AIAssistant />
        <Toaster />
        <SonnerToaster richColors position="top-right" />
      </body>
    </html>
  );
}
