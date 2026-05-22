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
    <main className="flex-1 min-w-0 flex flex-col overflow-hidden relative">
      {/* Gradient background — same as dashboard */}
      <div className="absolute inset-0 bg-hero-gradient opacity-50 pointer-events-none" style={{ filter: "blur(72px)" }} />
      <div className="absolute inset-0 bg-amber-glow pointer-events-none" />

      {/* Full-bleed glass card */}
      <div
        className="absolute inset-0 flex overflow-hidden"
        style={{ background: "rgba(17,17,19,0.55)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
      >
        {/* Settings nav — inside the card */}
        <nav className="w-[200px] flex-shrink-0 pt-10 pl-16 pr-4">
          <p className="text-[13px] font-semibold text-white/85 mb-4">Settings</p>
          <ul className="space-y-0.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-3 py-2 rounded-lg text-[13px] font-medium transition ${
                    pathname === item.href
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/70 hover:bg-white/[0.05]"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto thin-scroll py-10 pr-10 pl-16">
          <div className="max-w-[520px]">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
