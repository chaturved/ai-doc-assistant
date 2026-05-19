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
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center gap-[9px] mb-8">
          <Link href="/dashboard" className="flex items-center gap-[9px]">            <span className="text-sm font-bold">Paperwise</span>
          </Link>
          <span className="text-faint mx-1">›</span>
          <span className="text-sm text-muted">Settings</span>
        </div>

        <div className="flex gap-8">
          <nav className="w-40 flex-shrink-0">
            <ul className="space-y-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-3 py-2 rounded-[8px] text-sm transition ${
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
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
