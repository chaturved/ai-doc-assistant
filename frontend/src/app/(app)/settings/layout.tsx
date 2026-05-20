"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
const nav = [
  { label: "Profile",  href: "/settings/profile" },
  { label: "Password", href: "/settings/password" },
  { label: "Billing",  href: "/settings/billing" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
      <main
        className="flex-1 min-w-0 rounded-[18px] flex flex-col overflow-hidden relative overflow-y-auto thin-scroll"
        style={{ background: "#080810", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="absolute inset-0 pointer-events-none bg-hero-gradient opacity-50" style={{ filter: "blur(72px)" }} />
        <div className="absolute inset-0 pointer-events-none bg-amber-glow z-0" />
        <div className="max-w-3xl mx-auto w-full px-8 py-10 relative z-10">
          <div className="flex items-center gap-[9px] mb-8">
            <span className="text-sm font-bold">Settings</span>
          </div>

          <div className="flex gap-8">
            <nav className="w-36 flex-shrink-0">
              <ul className="space-y-0.5">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-3 py-2 rounded-btn text-sm transition ${
                        pathname === item.href
                          ? "bg-white/[0.08] text-white font-medium"
                          : "text-muted hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </main>
  );
}
