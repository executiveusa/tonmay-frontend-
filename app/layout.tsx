import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tonmay-frontend.vercel.app"),
  title: {
    default: "Tonmay — Seattle Photographer for Portraits, Events & Brands",
    template: "%s | Tonmay",
  },
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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tonmay — Real People. Strong Images.",
    description:
      "Portrait, event, brand, and documentary photography across Seattle and Western Washington.",
    url: "/",
    siteName: "Tonmay Production",
    type: "website",
    images: [
      {
        url: "/images/tonmay-mountain-hero-4k.webp",
        alt: "Tonmay standing with his camera above a sea of clouds in the mountains",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tonmay — Real People. Strong Images.",
    description:
      "Portrait, event, brand, and documentary photography across Seattle and Western Washington.",
    images: ["/images/tonmay-mountain-hero-4k.webp"],
  },
  robots: {
    index: true,
    follow: true,
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
