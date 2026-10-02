"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const signedOutLinks = [
  { label: "Get started", href: "/signup" },
  { label: "Log in", href: "/login" },
];

const signedInLinks = [
  { label: "Workspace", href: "/dashboard" },
  { label: "Profile", href: "/settings/profile" },
];

export function SiteAccountLinks() {
  const { user, loading } = useAuth();
  const links = loading ? [] : user ? signedInLinks : signedOutLinks;

  return (
    <>
      {links.map((link) => <li key={link.href}><Link href={link.href} className="text-[13px] text-ink/60 transition hover:text-ink">{link.label}</Link></li>)}
      <li><a href="mailto:hello@paperwise.ai" className="text-[13px] text-ink/60 transition hover:text-ink">Contact</a></li>
    </>
  );
}
