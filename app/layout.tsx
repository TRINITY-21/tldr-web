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
  title: "tldr — Summarize any article in seconds",
  description:
    "AI-powered article summarizer. Paste a URL, get a summary instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="orb" style={{ width: 400, height: 400, background: "#7c3aed", top: "20%", left: "-10%" }} />
          <div className="orb orb-delay-1" style={{ width: 350, height: 350, background: "#4f46e5", top: "30%", right: "-5%" }} />
          <div className="orb orb-delay-2" style={{ width: 300, height: 300, background: "#06b6d4", bottom: "20%", left: "30%" }} />
        </div>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
