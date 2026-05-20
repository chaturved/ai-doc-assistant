"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { joinWaitlist } from "@/lib/api/misc";
import { toast } from "sonner";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";

const T = {
  accent: "#f59e0b",
  primary: "#5b21b6",
  border: "rgba(255,255,255,0.08)",
};

const FREE_FEATURES = [
  "Up to 5 documents",
  "20 queries / month",
  "1 workspace",
  "PDF, TXT, MD support",
  "7-day conversation history",
  "Community support",
];

const PRO_FEATURES = [
  "Unlimited documents",
  "Unlimited queries",
  "50 MB per file",
  "PDF, DOCX, TXT, MD support",
  "Conversation history forever",
  "Priority email support",
];

const FAQS = [
  {
    q: "What file types are supported?",
    a: "Free plan supports PDF, TXT, and Markdown files. Pro adds DOCX support. All files are processed server-side — nothing is stored in your browser.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Your documents are stored in your account and never shared with other users or used to train AI models. You can delete your account and all data at any time.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Of course. Pro is billed monthly or yearly with no lock-in. Cancel from settings and your plan stays active until the end of the billing period.",
  },
  {
    q: "How is the AI trained?",
    a: "Paperwise uses vector search over your own documents. The AI is not trained on your data — it only reads your documents at query time.",
  },
  {
    q: "What happens when I hit my free limit?",
    a: "You'll see a clear message when you're near your limit. Queries reset monthly on your billing date. Document limits require upgrading to Pro.",
  },
  {
    q: "Do you offer student or nonprofit discounts?",
    a: "Yes — email us at hello@paperwise.ai with proof of enrollment or nonprofit status and we'll set you up with a discount code.",
  },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleWaitlist = async () => {
    if (!waitlistEmail) return;
    setJoining(true);
    try {
      await joinWaitlist(waitlistEmail);
      setJoined(true);
      toast.success("You're on the list!");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="bg-bg text-white overflow-x-hidden min-h-screen">

      <SiteNav />

      {/* Hero */}
      <section className="section-padding pt-[120px] text-center border-b-system relative">
        <div className="absolute inset-0 pointer-events-none bg-hero-gradient opacity-50" />
        <div className="absolute inset-0 pointer-events-none bg-vignette" />
        <div className="absolute bottom-0 inset-x-0 h-[80px] pointer-events-none bg-hero-fade" />
        <div className="relative max-w-[1100px] mx-auto">
          <p className="section-label mb-[14px]">Pricing</p>
          <h1 className="heading-section mb-4">One plan for every stage of your work</h1>
          <p className="text-[15px] text-muted max-w-[480px] mx-auto mb-10">
            Start free, upgrade when you need more. No hidden fees, no lock-in.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-[10px] border-system bg-white/[0.04]">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-[8px] text-[13px] font-semibold transition ${
                !yearly ? "bg-primary text-bg" : "text-muted hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-[8px] text-[13px] font-semibold transition flex items-center gap-2 ${
                yearly ? "bg-primary text-bg" : "text-muted hover:text-white"
              }`}
            >
              Yearly
              <span className="text-[10px] font-bold px-[7px] py-[2px] rounded-full bg-emerald-400/[0.15] text-emerald-400">
                Save 25%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Plan cards */}
      <section className="section-padding">
        <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Free */}
          <div className="card p-7 flex flex-col">
            <div className="mb-6">
              <p className="text-sm font-semibold text-muted mb-2">Starter</p>
              <div className="flex items-end gap-1.5">
                <span className="text-[36px] font-black leading-none">$0</span>
                <span className="text-muted text-sm mb-1">/ month</span>
              </div>
              <p className="text-[11px] text-faint mt-1">No credit card required</p>
            </div>
            <div className="divider mb-5" />
            <ul className="space-y-[10px] flex-1 mb-7">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-[13px] text-muted">
                  <CheckCircle2 size={14} color="rgba(255,255,255,0.25)" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="btn-primary w-full !block !text-center">
              Start Free
            </Link>
          </div>

          {/* Pro — Popular */}
          <div className="relative card flex flex-col border-amber-500/35">
            <div className="absolute top-0 inset-x-0 h-px bg-shimmer-bar" />
            <div className="p-7 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-muted">Growth</span>
                <span className="text-[11px] font-bold rounded-full px-[10px] py-[3px] bg-amber-500/[0.15] text-accent">Popular</span>
              </div>
              <div className="flex items-end gap-1.5 mb-1">
                <span className="text-[36px] font-black leading-none">${yearly ? "9" : "12"}</span>
                <span className="text-muted text-sm mb-1">/ month{yearly ? ", billed yearly" : ""}</span>
              </div>
              {yearly && <p className="text-[11px] mb-1 text-emerald-400">$108/year — save $36</p>}
              <p className="text-[11px] text-faint mt-1 mb-6">
                For power users and researchers who need more.
              </p>
              <div className="divider mb-5" />
              <p className="text-[11px] font-bold text-faint uppercase tracking-[0.08em] mb-[14px]">Everything in Starter plus…</p>
              <ul className="space-y-[10px] flex-1 mb-7">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[13px] text-white/75">
                    <CheckCircle2 size={14} color={T.accent} />
                    {f}
                  </li>
                ))}
              </ul>
              {joined ? (
                <div className="w-full h-11 rounded-[8px] flex items-center justify-center text-sm font-semibold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                  You&apos;re on the list ✓
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleWaitlist()}
                    placeholder="your@email.com"
                    className="flex-1 h-11 rounded-[8px] bg-white/[0.05] border border-white/[0.08] px-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary/50 transition"
                  />
                  <button
                    onClick={handleWaitlist}
                    disabled={joining || !waitlistEmail}
                    className="btn-primary !py-0 h-11 !rounded-[8px] disabled:opacity-50 whitespace-nowrap"
                  >
                    {joining ? "…" : "Join"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Enterprise */}
          <div className="card p-7 flex flex-col">
            <div className="mb-6">
              <p className="text-sm font-semibold text-muted mb-2">Enterprise</p>
              <div className="flex items-end gap-1.5">
                <span className="text-[36px] font-black leading-none">$40</span>
                <span className="text-muted text-sm mb-1">/ month</span>
              </div>
              <p className="text-[11px] text-faint mt-1">Custom security & compliance</p>
            </div>
            <div className="divider mb-5" />
            <p className="text-[11px] font-bold text-faint uppercase tracking-[0.08em] mb-[14px]">Everything in Growth plus…</p>
            <ul className="space-y-[10px] flex-1 mb-7">
              {["Unlimited documents","Custom AI model tuning","Dedicated success manager","SOC 2 & GDPR compliance","Role-based permissions","Audit logs & SSO"].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-[13px] text-muted">
                  <CheckCircle2 size={14} color="rgba(255,255,255,0.25)" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="mailto:hello@paperwise.ai" className="btn-secondary w-full !block !text-center">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-t-system border-b-system section-padding">
        <div className="max-w-[1100px] mx-auto">
          <div className="card-lg p-[48px] text-center">
            <h2 className="heading-md mb-3">Built for people who live inside documents</h2>
            <p className="text-muted text-[15px] mb-10">Less time hunting for answers. More time using them.</p>
            <div className="grid grid-cols-3">
              {[
                { val: "-70%", label: "Time Searching" },
                { val: "+3×",  label: "Faster Answers" },
                { val: "94%",  label: "Citation Accuracy" },
              ].map((s, i) => (
                <div key={i} className={`px-8 ${i < 2 ? "border-r-system" : ""}`}>
                  <div className="text-stat font-black tracking-[-0.04em] bg-gradient-to-br from-white/90 to-accent bg-clip-text text-transparent">{s.val}</div>
                  <div className="text-[13px] text-muted mt-[6px]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section-padding">
        <div className="max-w-[700px] mx-auto">
          <div className="text-center mb-14">
            <p className="section-label mb-[14px]">FAQ</p>
            <h2 className="heading-section mb-3">Everything you need to know</h2>
            <p className="text-[15px] text-muted">Quick answers about documents, privacy, and plans.</p>
          </div>
          {FAQS.map((item, i) => (
            <div key={i} className="border-b-system">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between py-5 bg-transparent border-none text-white text-left">
                <span className="text-[15px] font-semibold">{item.q}</span>
                <div className={`shrink-0 ml-4 w-[22px] h-[22px] rounded-full border-system flex items-center justify-center transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}>
                  <span className="text-sm text-muted leading-none -mt-px">+</span>
                </div>
              </button>
              {openFaq === i && (
                <p className="text-sm text-muted leading-[1.7] pb-5">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <SiteFooter
        cta={
          <>
            <h2 className="heading-cta mb-[10px]">Your documents deserve better than Ctrl+F.</h2>
            <p className="text-[15px] text-muted mb-8">Try Paperwise free. No credit card required.</p>
            <Link href="/signup" className="btn-primary">Get started free</Link>
          </>
        }
      />
    </div>
  );
}
