"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { label: "Profile", href: "/settings/profile" },
  { label: "Password", href: "/settings/password" },
  { label: "Billing", href: "/settings/billing" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2.5 mb-8">
          <Link href="/dashboard">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
          </Link>
          <span className="text-sm font-semibold text-zinc-100">Paperwise</span>
          <span className="text-zinc-700 mx-1">›</span>
          <span className="text-sm text-zinc-500">Settings</span>
        </div>
        <div className="flex gap-8">
          <nav className="w-40 flex-shrink-0">
            <ul className="space-y-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-3 py-2 rounded-lg text-sm transition ${pathname === item.href ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}`}
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
