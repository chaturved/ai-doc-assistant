"use client";

import { useState } from "react";
import Link from "next/link";
import { joinWaitlist } from "@/lib/paperwise-api";
import { toast } from "sonner";

const FREE_FEATURES = [
  "5 documents",
  "20 queries per day",
  "10 MB per file",
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
    a: "Paperwise uses an open-source language model (Mistral 7B) combined with vector search over your own documents. The AI is not trained on your data — it only reads your documents at query time.",
  },
  {
    q: "What happens when I hit my free limit?",
    a: "You'll see a clear message when you're near your limit. Queries reset daily at midnight UTC. Document and storage limits require upgrading to Pro.",
  },
  {
    q: "Do you offer student or nonprofit discounts?",
    a: "Yes — email us at hello@paperwise.ai with proof of enrollment or nonprofit status and we'll set you up with a discount code when Pro launches.",
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
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-sm font-semibold text-zinc-100">Paperwise</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-zinc-200 transition">Log in</Link>
            <Link href="/signup" className="h-8 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm text-white font-medium transition flex items-center">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-zinc-100 mb-3">Simple, honest pricing</h1>
          <p className="text-zinc-500 text-base mb-8">Start free. Upgrade when you need more.</p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 bg-zinc-900 ring-1 ring-white/[0.07] rounded-full px-1.5 py-1.5">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${!yearly ? "bg-zinc-700 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition flex items-center gap-2 ${yearly ? "bg-zinc-700 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              Yearly
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full ring-1 ring-emerald-500/20">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 max-w-2xl mx-auto">
          {/* Free */}
          <div className="rounded-2xl bg-zinc-900/60 ring-1 ring-white/[0.08] p-7 flex flex-col">
            <div className="mb-6">
              <p className="text-sm font-medium text-zinc-400 mb-1">Free</p>
              <div className="flex items-end gap-1.5">
                <span className="text-4xl font-bold text-zinc-100">$0</span>
                <span className="text-zinc-500 text-sm mb-1.5">/ month</span>
              </div>
              <p className="text-xs text-zinc-600 mt-1">No credit card required</p>
            </div>

            <ul className="space-y-3 flex-1 mb-7">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-400">
                  <span className="h-4 w-4 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-zinc-300 text-[10px]">✓</span>
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <Link href="/signup" className="w-full h-10 rounded-xl bg-zinc-800 ring-1 ring-white/[0.08] hover:bg-zinc-700 text-sm text-zinc-200 font-medium transition flex items-center justify-center">
              Get started free
            </Link>
          </div>

          {/* Pro */}
          <div className="rounded-2xl bg-indigo-950/40 ring-1 ring-indigo-500/30 p-7 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-indigo-300">Pro</p>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full ring-1 ring-indigo-500/30">Coming soon</span>
              </div>
              <div className="flex items-end gap-1.5">
                <span className="text-4xl font-bold text-zinc-100">${yearly ? "9" : "12"}</span>
                <span className="text-zinc-500 text-sm mb-1.5">/ month{yearly ? ", billed yearly" : ""}</span>
              </div>
              {yearly && <p className="text-xs text-emerald-400 mt-1">$108/year — save $36</p>}
            </div>

            <ul className="space-y-3 flex-1 mb-7">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <span className="h-4 w-4 rounded-full bg-indigo-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-300 text-[10px]">✓</span>
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            {joined ? (
              <div className="w-full h-10 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20 text-sm text-emerald-400 flex items-center justify-center">
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
                  className="flex-1 h-10 rounded-xl bg-zinc-900/60 ring-1 ring-white/[0.08] px-3 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:ring-indigo-500/40 transition"
                />
                <button
                  onClick={handleWaitlist}
                  disabled={joining || !waitlistEmail}
                  className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-sm text-white font-medium transition"
                >
                  {joining ? "…" : "Join waitlist"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-zinc-100 mb-6 text-center">Frequently asked questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-xl bg-zinc-900/60 ring-1 ring-white/[0.07] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-zinc-200">{faq.q}</span>
                  <span className={`text-zinc-500 transition-transform ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-zinc-500 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-20">
          <p className="text-zinc-600 text-sm mb-4">Still have questions?</p>
          <a href="mailto:hello@paperwise.ai" className="text-indigo-400 hover:text-indigo-300 text-sm transition">
            hello@paperwise.ai
          </a>
        </div>
      </div>
    </div>
  );
}
