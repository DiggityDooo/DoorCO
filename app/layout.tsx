import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { GuidedTour } from "@/components/guided-tour";
import { RealDoorGuide } from "@/components/realdoor-guide";
import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "RealDoor — Application-Readiness Copilot",
  description:
    "Assistive, renter-side helper for LIHTC application readiness. Never decides eligibility.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <header className="site-header">
          <div className="wrap">
            <Link className="brand" href="/">
              RealDoor
            </Link>
            <span className="brand-sub">helps you prepare · never decides</span>
            <SiteNav />
          </div>
        </header>
        <div className="workspace">
          <main id="main" className="wrap workspace-main">
            {children}
          </main>
          <RealDoorGuide />
        </div>
        <footer className="site-footer wrap">
          <p>You confirm. A qualified human decides. RealDoor never approves or denies.</p>
        </footer>
        <GuidedTour />
      </body>
    </html>
  );
}
