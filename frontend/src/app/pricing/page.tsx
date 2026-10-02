import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Sparkles } from "lucide-react";
import { PricingWaitlistForm } from "@/components/site/pricing-waitlist-form";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";

const freeFeatures = [
  "5 documents in your library",
  "20 questions every 24 hours",
  "PDF, TXT, and Markdown files",
  "10 MB per file",
  "7 days of conversation history",
];

const proFeatures = [
  "Unlimited documents and questions",
  "PDF, DOCX, TXT, and Markdown files",
  "50 MB per file",
  "Full conversation history",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <SiteNav />
      <main className="pt-16">
        <section className="px-5 pb-[60px] pt-16 md:px-8 md:pt-20">
          <div className="mx-auto max-w-[1280px]">
            <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end md:gap-12">
              <div>
                <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent"><span className="h-px w-8 bg-accent" /> Plans and pricing</p>
                <h1 className="max-w-4xl font-display text-[44px] font-medium leading-[1.02] tracking-[-0.045em] sm:text-[58px] lg:text-[72px]">Start small. Keep asking better questions.</h1>
              </div>
              <p className="max-w-[450px] text-[17px] leading-8 text-ink/60 md:pb-2 md:text-[19px]">Paperwise is free to explore. When you need more room for your work, Pro is on the way.</p>
            </div>
            <div className="mt-14 grid gap-4 text-left md:grid-cols-2">
              <article className="flex h-full flex-col rounded-md border border-ink/10 bg-card p-7 sm:p-9 lg:p-11">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink/65">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Available now
                </div>
                <h2 className="mt-8 font-display text-[32px] font-medium leading-tight tracking-[-0.03em]">Free</h2>
                <p className="mt-2 text-[15px] leading-7 text-ink/60">A useful place to begin, with no payment required.</p>
                <div className="mt-7 flex items-baseline gap-2 border-b border-ink/10 pb-7">
                  <span className="font-display text-[56px] font-medium leading-none tracking-[-0.05em]">$0</span>
                  <span className="text-sm text-ink/50">forever</span>
                </div>
                <ul className="mt-7 flex-1 space-y-4">
                  {freeFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-ink/75">
                      <Check size={17} className="mt-1 shrink-0 text-accent" />{feature}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="mt-10 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-bg transition hover:opacity-80">
                  Get started for free <ArrowUpRight size={16} />
                </Link>
              </article>

              <article className="relative flex h-full flex-col overflow-hidden rounded-md border border-amber-500/35 bg-[#f6ead5] p-7 text-[#241a0f] dark:border-amber-500/30 dark:bg-[#2d261c] dark:text-[#faf7f2] sm:p-9 lg:p-11">
                <div className="absolute inset-x-0 top-0 h-1 bg-amber-500" />
                <div className="relative inline-flex w-fit items-center gap-2 rounded-full border border-[#38210b]/25 px-3 py-1.5 text-xs font-medium text-[#38210b]/80 dark:border-white/20 dark:text-amber-200">
                  <Sparkles size={13} /> Coming soon
                </div>
                <h2 className="relative mt-8 font-display text-[32px] font-medium leading-tight tracking-[-0.03em]">Pro</h2>
                <p className="relative mt-2 text-[15px] leading-7 text-[#38210b]/75 dark:text-white/65">More room for the documents and questions you work with every day.</p>
                <div className="relative mt-7 border-b border-[#38210b]/20 pb-7 dark:border-white/15">
                  <span className="font-display text-[32px] font-medium leading-tight tracking-[-0.03em]">Join the waitlist</span>
                  <p className="mt-2 text-sm text-[#38210b]/65 dark:text-white/60">Pricing will be shared before launch.</p>
                </div>
                <ul className="relative mt-7 flex-1 space-y-4">
                  {proFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-[#38210b]/85 dark:text-white/80">
                      <Check size={17} className="mt-1 shrink-0 text-accent" />{feature}
                    </li>
                  ))}
                </ul>
                <div className="relative"><PricingWaitlistForm /></div>
              </article>
            </div>
          </div>
        </section>

        <section className="mt-8 px-5 md:px-8">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-6 border-t border-ink/15 pt-10 md:flex-row md:items-center md:justify-between">
            <div><h2 className="font-display text-[28px] font-medium tracking-[-0.03em] md:text-[36px]">Ready to see what your files know?</h2><p className="mt-2 text-[15px] leading-7 text-ink/60">Open your workspace and start with a question.</p></div>
            <Link href="/signup" className="inline-flex min-h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-bg transition hover:opacity-80">Get started <ArrowRight size={16} /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
