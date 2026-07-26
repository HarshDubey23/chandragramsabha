import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ग्राम पंचायत चंद्रा — डिजिटल शासन पोर्टल | Gram Panchayat Chandra",
  description:
    "विकास खण्ड शंकरगढ़, जनपद प्रयागराज, उत्तर प्रदेश | OSINT-Verified • DPDP 2023 Compliant • Bilingual (HI/EN) Digital Governance Portal",
  keywords: [
    "Gram Panchayat Chandra",
    "Shankargarh",
    "Prayagraj",
    "Uttar Pradesh",
    "MGNREGA",
    "PMAY-G",
    "Jal Jeevan Mission",
    "GPDP",
    "Digital Governance",
    "3145021064",
  ],
  authors: [{ name: "Gram Panchayat Chandra" }],
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
  applicationName: "Gram Panchayat Chandra",
  appleWebApp: {
    capable: true,
    title: "GP Chandra",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: true,
    address: false,
    email: true,
  },
  openGraph: {
    title: "Gram Panchayat Chandra — Digital Governance Portal",
    description:
      "OSINT-Verified bilingual portal for Gram Panchayat Chandra, Shankargarh, Prayagraj, UP",
    type: "website",
    locale: "hi_IN",
    siteName: "Gram Panchayat Chandra Portal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gram Panchayat Chandra — Digital Governance Portal",
    description: "OSINT-Verified bilingual portal — Shankargarh, Prayagraj, UP",
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/logo.svg"],
    apple: [
      { url: "/logo.svg" },
    ],
  },
  other: {
    "theme-color": "#c2410c",
    "msapplication-TileColor": "#c2410c",
    "msapplication-tap-highlight": "no",
  },
};

export const viewport: Viewport = {
  themeColor: "#c2410c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoDevanagari.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
        style={{ fontFamily: "var(--font-inter), var(--font-devanagari), system-ui, sans-serif" }}
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-right" richColors />
      </body>
    </html>
  );
}
