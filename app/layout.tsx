import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Nav from "@/components/Nav";
import MobileBottomNav from "@/components/MobileBottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Acquire Internal Dashboard Prototype — Prices, Launches & Resale",
  description: "Zayn, Sadiq and Zohayr's place for watch information, prices, demand, performance, and news.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[hsl(var(--background))]`}>
        <header className="sticky top-0 z-30 border-b border-[hsl(var(--border))] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-sm">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <Link href="/" className="font-bold text-lg tracking-tight shrink-0 text-[hsl(var(--foreground))] hover:text-[hsl(var(--accent))] transition-colors">
              Acquire
            </Link>
            <Nav />
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-10 pb-24 md:pb-10 bg-[hsl(var(--background))]">{children}</main>
        <MobileBottomNav />
      </body>
    </html>
  );
}
