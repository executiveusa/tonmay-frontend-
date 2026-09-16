import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tonmay — Seattle Photographer for Portraits, Events & Brands",
  description:
    "Portrait, event, brand, and documentary photography across Seattle and Western Washington. View recent work and check availability.",
  keywords: [
    "Seattle photographer",
    "Western Washington photographer",
    "Seattle portrait photographer",
    "Seattle event photographer",
    "documentary photographer Washington",
    "Seattle videographer",
    "documentary filmmaker Washington",
  ],
  openGraph: {
    title: "Tonmay — Real People. Strong Images.",
    description:
      "Portrait, event, brand, and documentary photography across Seattle and Western Washington.",
    type: "website",
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
