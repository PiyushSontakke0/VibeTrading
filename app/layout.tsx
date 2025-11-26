import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // renamed for clarity
import localFont from "next/font/local";
import "./globals.css";

// Geist fonts (Latin / English)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// PingFang SC – Chinese system font (macOS / iOS default)
const pingFang = localFont({
  variable: "--font-pingfang",
  style: "normal",
  display: "swap",
  src: [
    {
      path: "../public/fonts/PingFang-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/PingFangSC-Fonts/PingFang Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/PingFangSC-Fonts/PingFang Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  // Optional: fallback if custom files aren't used
  fallback: [
    "PingFang SC",
    "Hiragino Sans GB",
    "Microsoft YaHei",
    "Apple SD Gothic Neo",
    "system-ui",
    "sans-serif",
  ],
});

export const metadata: Metadata = {
  title: "Your App",
  description: "Beautiful Next.js app with Geist + PingFang",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${pingFang.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
