import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileSearch, FileText, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";
import { ProductPreview } from "@/components/site/product-preview";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";

const steps = [
  { number: "01", title: "Bring your sources", description: "Add the reports, notes, and documents you want to understand. Your library keeps them together.", icon: FileText },
  { number: "02", title: "Ask what matters", description: "Use plain language to explore a topic, summarize a file, or find a specific detail.", icon: MessageSquare },
  { number: "03", title: "Check the evidence", description: "Follow each citation back to the passage behind the answer before you use it.", icon: ShieldCheck },
] as const;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <SiteNav />
      <main className="pt-16">
        <section className="px-5 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20">
          <div className="mx-auto grid max-w-[1280px] items-center gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
            <div className="max-w-[580px]">
              <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent"><span className="h-px w-8 bg-accent" /> A clearer way through your documents</p>
              <h1 className="font-display text-[44px] font-medium leading-[1.02] tracking-[-0.045em] sm:text-[58px] lg:text-[72px]">Make sense of the files that matter.</h1>
              <p className="mt-7 max-w-[500px] text-[17px] leading-8 text-ink/65 md:text-[19px]">Paperwise turns scattered documents into answers you can verify. Ask a question, see the source, and keep moving.</p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href="/signup" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-bg transition hover:opacity-80">Start with your documents <ArrowUpRight size={16} /></Link>
                <a href="#how-it-works" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/20 px-6 text-sm font-medium transition hover:bg-ink/5">See how it works <ArrowRight size={16} /></a>
              </div>
              <p className="mt-6 text-[13px] text-ink/45">Free to start · No payment details needed</p>
            </div>

            <div className="relative isolate overflow-hidden rounded-lg border border-ink/10 bg-[#f6ead5] p-5 dark:bg-[#2d261c] sm:p-8 lg:min-h-[550px] lg:pt-16">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-400/40 blur-3xl dark:bg-amber-500/20" />
              <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
              <div className="relative mb-5 flex items-center justify-between gap-3 text-xs font-medium text-[#6b4b24] dark:text-amber-200/70">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-orange-500" /> A workspace for your sources</span>
                <span className="hidden sm:inline">PAPERWISE / 01</span>
              </div>
              <div className="relative w-full lg:translate-x-8"><ProductPreview /></div>
              <div className="relative mt-5 flex items-center justify-end gap-2 text-xs font-medium text-[#6b4b24] dark:text-amber-200/70"><ShieldCheck size={15} /> Answers with a path back</div>
            </div>
          </div>
        </section>

        <section className="border-y border-ink/10 px-5 md:px-8">
          <div className="mx-auto grid max-w-[1280px] gap-0 md:grid-cols-3">
            {steps.map(({ number, title }, index) => (
              <div key={number} className={`flex items-center gap-4 py-5 ${index > 0 ? "border-t border-ink/10 md:border-l md:border-t-0 md:pl-8" : ""}`}>
                <span className="font-display text-[28px] font-medium text-accent/70">{number}</span>
                <span className="text-sm font-medium">{title}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
            <div className="max-w-[480px]">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">How Paperwise works</p>
              <h2 className="font-display text-[34px] font-medium leading-[1.1] tracking-[-0.035em] md:text-[48px]">A simple path from question to source.</h2>
              <p className="mt-5 text-[17px] leading-8 text-ink/60">The useful detail is already in your files. Paperwise helps you find it and see where it came from.</p>
              <Link href="/signup" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:opacity-70">Open your workspace <ArrowUpRight size={16} /></Link>
            </div>
            <div className="border-t border-ink/15">
              {steps.map(({ number, title, description, icon: Icon }) => (
                <div key={number} className="grid gap-4 border-b border-ink/15 py-7 sm:grid-cols-[56px_1fr_32px] sm:gap-6">
                  <span className="font-display text-[24px] text-accent">{number}</span>
                  <div><h3 className="font-display text-[22px] font-medium tracking-[-0.02em]">{title}</h3><p className="mt-2 max-w-lg text-[15px] leading-7 text-ink/60">{description}</p></div>
                  <Icon size={22} className="hidden text-ink/35 sm:block" strokeWidth={1.5} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="technology" className="px-5 pb-20 md:px-8 md:pb-28">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div><p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent">Built for real work</p><h2 className="max-w-2xl font-display text-[34px] font-medium leading-[1.1] tracking-[-0.035em] md:text-[48px]">Your library, conversation, and sources in one place.</h2></div>
              <p className="max-w-sm text-[15px] leading-7 text-ink/60">Less time hunting through tabs. More confidence in the answer you take away.</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <article className="relative min-h-[380px] overflow-hidden rounded-lg bg-[#f4ede1] p-7 text-[#241a0f] dark:bg-[#2d261c] dark:text-[#faf7f2] sm:p-10">
                <div className="max-w-[340px]"><FileSearch size={26} className="text-accent" /><h3 className="mt-5 font-display text-[29px] font-medium tracking-[-0.03em]">Find the exact passage.</h3><p className="mt-3 text-sm leading-7 text-[#38210b]/70 dark:text-white/65">Go from a clear answer to the original document without losing your place.</p></div>
                <div className="absolute -bottom-6 right-[-18px] w-[76%] max-w-[430px] rotate-[-4deg] rounded-lg border border-[#d7b98c] bg-white p-5 shadow-[0_20px_60px_rgba(71,42,13,0.16)] dark:border-white/10 dark:bg-[#25211c] sm:right-7">
                  <div className="flex items-center justify-between text-xs font-medium"><span className="flex items-center gap-2"><FileText size={15} className="text-accent" /> Research report.pdf</span><span className="text-black/40 dark:text-white/40">Page 8</span></div>
                  <div className="mt-5 space-y-2"><div className="h-2 w-full rounded-full bg-ink/10" /><div className="h-2 w-[85%] rounded-full bg-ink/10" /><div className="rounded-sm border-l-2 border-amber-500 bg-amber-100 px-3 py-2 text-xs leading-5 text-[#6b4b24] dark:bg-amber-500/15 dark:text-amber-200">Clear evidence helps teams reach better decisions.</div><div className="h-2 w-[60%] rounded-full bg-ink/10" /></div>
                </div>
              </article>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <article className="rounded-lg border border-ink/10 bg-card p-7 sm:p-8"><MessageSquare size={25} className="text-accent" /><h3 className="mt-5 font-display text-[24px] font-medium tracking-[-0.02em]">Keep the conversation going.</h3><p className="mt-3 text-sm leading-7 text-ink/60">Ask a follow-up and build on what you have already learned.</p></article>
                <article className="rounded-lg border border-ink/10 bg-card p-7 sm:p-8"><Sparkles size={25} className="text-accent" /><h3 className="mt-5 font-display text-[24px] font-medium tracking-[-0.02em]">Bring scattered work together.</h3><p className="mt-3 text-sm leading-7 text-ink/60">One place for your files and the questions that make them useful.</p></article>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 md:px-8">
          <div className="mx-auto grid max-w-[1280px] gap-8 rounded-lg bg-[#29231c] px-8 py-12 text-[#faf7f2] dark:bg-[#f1e7d7] dark:text-[#241a0f] md:grid-cols-[1fr_auto] md:items-end md:px-12 md:py-16">
            <div><p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-amber-400 dark:text-[#92400e]">Ready when you are</p><h2 className="max-w-2xl font-display text-[34px] font-medium leading-[1.1] tracking-[-0.035em] md:text-[48px]">Your next answer starts with a document.</h2><p className="mt-4 text-[16px] leading-7 text-white/65 dark:text-[#38210b]/70">Start free and see what is already waiting in your files.</p></div>
            <Link href="/signup" className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-full bg-amber-400 px-6 text-sm font-semibold text-[#241a0f] transition hover:opacity-85 dark:bg-[#241a0f] dark:text-white">Get started <ArrowUpRight size={16} /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
