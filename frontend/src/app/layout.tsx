import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";

import { QueryProvider } from "@/shared/providers/query-provider";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Journal Assistant",
  description:
    "A calm editorial internship workspace for daily logs, weekly summaries, and final report writing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${newsreader.variable} theme antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
