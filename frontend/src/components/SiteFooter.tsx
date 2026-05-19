import Link from "next/link";

const NAV_LINKS = [
  { label: "Features",     href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing",      href: "/pricing" },
  { label: "FAQ",          href: "/pricing#faq" },
];

const SOCIAL = [
  { label: "X",  path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  { label: "in", path: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" },
  { label: "gh", path: "M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" },
];

interface SiteFooterProps {
  /** Optional CTA block rendered above the divider */
  cta?: React.ReactNode;
  /** Show logo + description + nav links section (default true) */
  showLogoSection?: boolean;
  /** Show social icons instead of legal links in the bottom row (default false) */
  showSocial?: boolean;
  /** Background gradient class (default "footer") */
  gradient?: "footer" | "pricing";
}

export function SiteFooter({
  cta,
  showLogoSection = true,
  showSocial = false,
  gradient = "footer",
}: SiteFooterProps) {
  const bgClass = gradient === "footer" ? "bg-footer-gradient" : "bg-pricing-cta";

  return (
    <footer className={`relative overflow-hidden border-t-system ${bgClass}`}>
      {cta && (
        <>
          <div className="max-w-[1100px] mx-auto px-9 py-20 text-center">{cta}</div>
          <div className="border-t-system" />
        </>
      )}

      {showLogoSection && (
        <div className="max-w-[1100px] mx-auto px-9 pt-10 pb-0">
          <div className="flex justify-between items-start mb-10">
            <div className="max-w-[280px]">
              <span className="text-sm font-bold block mb-3">Paperwise</span>
              <p className="text-[13px] text-muted leading-[1.7]">
                Upload any document. Ask anything. Get cited answers instantly.
              </p>
            </div>
            <nav className="flex gap-7 pt-1">
              {NAV_LINKS.map((l) => (
                <Link key={l.label} href={l.href} className="text-[13px] text-muted hover:text-white transition">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="max-w-[1100px] mx-auto px-9 py-6 flex items-center justify-between border-t-system">
        <span className="text-xs text-faint">© 2026 Paperwise. All rights reserved.</span>
        {showSocial ? (
          <div className="flex gap-3">
            {SOCIAL.map((s) => (
              <a key={s.label} href="#" className="w-[30px] h-[30px] rounded-full border-system flex items-center justify-center">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                  <path d={s.path} fill={["X", "in", "gh"].includes(s.label) ? "none" : "currentColor"} />
                </svg>
              </a>
            ))}
          </div>
        ) : (
          <div className="flex gap-5">
            <Link href="/privacy" className="text-xs text-faint hover:text-muted transition">Privacy</Link>
            <Link href="/terms" className="text-xs text-faint hover:text-muted transition">Terms</Link>
            <a href="mailto:hello@paperwise.ai" className="text-xs text-faint hover:text-muted transition">Contact</a>
          </div>
        )}
      </div>
    </footer>
  );
}
