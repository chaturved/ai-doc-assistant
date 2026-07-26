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
      className="flex-1 min-w-0 rounded-[18px] flex overflow-hidden relative"
      style={{ background: "#080810", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="absolute inset-0 pointer-events-none bg-hero-gradient opacity-50" style={{ filter: "blur(72px)" }} />

      {/* Settings nav */}
      <nav className="relative z-10 w-[200px] flex-shrink-0 pt-10 pl-10 pr-4">
        <p className="text-[16px] font-semibold text-white mb-4">Settings</p>
        <ul className="space-y-0.5">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-3 py-2 rounded-lg text-[13px] font-medium transition ${
                  pathname === item.href
                    ? "text-white"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.06]"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Page content */}
      <div className="relative z-10 flex-1 overflow-y-auto thin-scroll py-10 pr-10 pl-10">
        <div className="max-w-[520px]">
          {children}
        </div>
      </div>
    </main>
  );
}
