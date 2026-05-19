"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Features",     href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing",      href: "/pricing" },
  { label: "FAQ",          href: "/pricing#faq" },
];

interface SiteNavProps {
  showLogin?: boolean;
}

export function SiteNav({ showLogin = true }: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 h-[60px] flex items-center px-9 transition-all duration-300 ${
      scrolled ? "bg-bg/90 backdrop-blur-xl border-b-system" : ""
    }`}>
      <Link href="/" className="flex items-center shrink-0">
        <span className="text-[15px] font-bold">Paperwise</span>
      </Link>

      <div className="flex-1 flex items-center justify-center gap-8">
        {NAV_LINKS.map((l) => (
          <Link key={l.label} href={l.href}
            className="text-[13.5px] font-medium text-white/70 hover:text-white transition">
            {l.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {showLogin && (
          <Link href="/login" className="text-[13.5px] font-medium text-muted hover:text-white transition">
            Log in
          </Link>
        )}
        <Link href="/signup" className="btn-primary !text-[13.5px]">Get Started Free</Link>
      </div>
    </nav>
  );
}
