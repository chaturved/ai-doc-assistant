import Link from "next/link";

const columns = [
  { heading: "Product", links: [{ label: "Features", href: "/#technology" }, { label: "How it works", href: "/#how-it-works" }, { label: "Pricing", href: "/pricing" }] },
  { heading: "Account", links: [{ label: "Get started", href: "/signup" }, { label: "Log in", href: "/login" }, { label: "Contact", href: "mailto:hello@paperwise.ai" }] },
  { heading: "Legal", links: [{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }] },
];

interface SiteFooterProps {
  cta?: React.ReactNode;
}

export function SiteFooter({ cta }: SiteFooterProps) {
  return (
    <footer className="mt-[120px] bg-bg px-5 pb-8 text-ink md:px-8">
      <div className="mx-auto max-w-[1280px]">
        {cta && <div className="mb-16 rounded-md bg-ink/[0.04] px-8 py-[50px] text-center dark:bg-white/[0.06] md:py-[80px]">{cta}</div>}
        <div className="grid gap-12 border-t border-ink/10 py-12 md:grid-cols-[minmax(260px,1fr)_auto]">
          <div className="max-w-[320px]"><Link href="/" className="font-display text-2xl font-medium tracking-[-0.05em]">paperwise<span className="text-accent">.</span></Link><p className="mt-4 text-sm leading-7 text-ink/60">Ask better questions of your documents. Keep the source close.</p></div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-16">
            {columns.map((column) => <div key={column.heading}><h2 className="mb-4 text-[13px] font-semibold">{column.heading}</h2><ul className="space-y-2.5">{column.links.map((link) => <li key={link.label}><Link href={link.href} className="text-[13px] text-ink/60 transition hover:text-ink">{link.label}</Link></li>)}</ul></div>)}
          </div>
        </div>
        <div className="border-t border-ink/10 pt-6 text-xs text-ink/45">© {new Date().getFullYear()} Paperwise. All rights reserved.</div>
      </div>
    </footer>
  );
}
