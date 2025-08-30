import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InvoiceSense AI - Intelligent Invoice Processing",
  description: "AI-powered invoice data extraction with Airtable integration. Process invoices with intelligent automation and premium analytics.",
  keywords: ["InvoiceSense", "AI", "invoice processing", "automation", "Airtable", "analytics"],
  authors: [{ name: "InvoiceSense AI Team" }],
  openGraph: {
    title: "InvoiceSense AI",
    description: "AI-powered invoice data extraction with Airtable integration",
    url: "https://invoicesense.ai",
    siteName: "InvoiceSense AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InvoiceSense AI",
    description: "AI-powered invoice data extraction with Airtable integration",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-900 text-slate-100`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
