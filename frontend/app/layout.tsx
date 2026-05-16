import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BugFix AI - AI-Powered Code Analysis",
  description: "Analyze and fix bugs in your code with AI-powered insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      style={{ height: '100%' }}
    >
      <body style={{ minHeight: '100%', background: 'var(--background)' }}>
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column', marginLeft: '280px' }}>
            <Topbar />
            <main style={{ flex: '1 1 0%', overflowY: 'auto' }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
