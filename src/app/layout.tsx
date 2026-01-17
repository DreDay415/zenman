import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SEQUENCE_FRAME_URLS } from "../lib/sequenceFrames";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const preloadFrames = SEQUENCE_FRAME_URLS.slice(0, 3);

export const metadata: Metadata = {
  title: "OceanPark Digital — Scrollytelling Portfolio",
  description:
    "OceanPark Digital is a creative design agency crafting cinematic digital experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {preloadFrames.map((href) => (
          <link key={href} rel="preload" as="image" href={href} />
        ))}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
