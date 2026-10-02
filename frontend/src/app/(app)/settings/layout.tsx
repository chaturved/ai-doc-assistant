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
      className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-ink/10 bg-bg md:flex-row"
    >
      {/* Settings nav */}
      <nav className="relative z-10 shrink-0 border-b border-ink/10 bg-card px-4 pt-5 md:w-[210px] md:border-b-0 md:border-r md:px-0 md:pl-6 md:pr-4 md:pt-10">
        <p className="mb-5 font-display text-xl font-medium text-ink">Settings</p>
        <ul className="flex gap-1 md:block md:space-y-0.5">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-3 py-2 rounded-lg text-[13px] font-medium transition ${
                  pathname === item.href
                    ? "bg-accent/10 text-accent"
                    : "text-ink/65 hover:text-ink hover:bg-ink/[0.06]"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Page content */}
      <div className="thin-scroll relative z-10 flex-1 overflow-y-auto px-4 py-6 sm:px-8 md:py-10 md:pl-10">
        <div className="max-w-[520px]">
          {children}
        </div>
      </div>
    </main>
  );
}
