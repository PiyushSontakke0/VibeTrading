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
