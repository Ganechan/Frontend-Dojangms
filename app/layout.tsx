import React from "react";
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
  title: "Dojang Joko Tingkir Salatiga Taekwondo Club",
  description:
    "Membangun Karakter Melalui Seni Bela Diri. Dojang Taekwondo Joko Tingkir Salatiga menawarkan program latihan profesional untuk semua usia.",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-colors-sheme: light)",
      },
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-colors-sheme: dark)",
      },
      {
        url: "/icon.svg",
        media: "/image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
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
