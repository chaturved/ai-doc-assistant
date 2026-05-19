"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight, Upload, MessageSquare, CheckCircle2,
  Link2, History, Lock, Search, Zap, Bot, ChevronRight, Star,
} from "lucide-react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 overflow-x-hidden">
      <style>{`
        @keyframes gradient-drift {
          0%,100% { transform:translate(0%,0%) scale(1); }
          33% { transform:translate(3%,-3%) scale(1.05); }
          66% { transform:translate(-3%,3%) scale(0.97); }
        }
        @keyframes float-slow { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-12px); } }
        @keyframes fade-up { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
        .animate-float-slow { animation: float-slow 7s ease-in-out infinite; }
        .animate-fade-up { animation: fade-up 0.7s ease-out forwards; }
        .animate-fade-up-delay-1 { animation: fade-up 0.7s ease-out 0.15s both; }
        .animate-fade-up-delay-2 { animation: fade-up 0.7s ease-out 0.3s both; }
        .animate-fade-up-delay-3 { animation: fade-up 0.7s ease-out 0.45s both; }
        .cursor-blink { animation: blink 1.1s ease-in-out infinite; }
        .gradient-text {
          background: linear-gradient(135deg,#fafafa 0%,#a1a1aa 60%,#6366f1 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .hero-glow { background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%); }
        .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-hover:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(0,0,0,0.4),0 0 0 1px rgba(99,102,241,0.2); }
      `}</style>

      {/* Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl" : "bg-transparent"}`}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-white text-xs font-bold">P</span>
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-zinc-100">Paperwise</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/pricing" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">Pricing</Link>
              <Link href="/login" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">Log in</Link>
              <Link href="/signup" className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
                Start for free <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-20%] left-[10%] h-[600px] w-[600px] rounded-full blur-[120px] opacity-30" style={{ background: "radial-gradient(circle, #4338ca, transparent 70%)", animation: "gradient-drift 15s ease-in-out infinite" }} />
          <div className="absolute top-[10%] right-[5%] h-[400px] w-[400px] rounded-full blur-[100px] opacity-20" style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)", animation: "gradient-drift 12s ease-in-out infinite 3s" }} />
        </div>
        <div className="pointer-events-none absolute inset-0 hero-glow" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-1.5 text-xs text-indigo-300 mb-8">
            <Zap className="h-3 w-3" /> AI-powered document intelligence
          </div>
          <h1 className="animate-fade-up-delay-1 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            Your documents,<br /><span className="gradient-text">finally answerable.</span>
          </h1>
          <p className="animate-fade-up-delay-2 mx-auto max-w-2xl text-lg md:text-xl text-zinc-400 leading-relaxed mb-10">
            Upload any PDF, Word doc, or text file and chat with it in plain English. Get cited answers in seconds — powered by AI, grounded in your documents.
          </p>
          <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Link href="/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-base font-semibold text-white hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/25">
              Start for free <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-base font-medium text-zinc-300 hover:bg-white/10 hover:text-zinc-100 transition-all">
              See how it works
            </a>
          </div>
          <p className="animate-fade-up-delay-3 text-xs text-zinc-600">No credit card required · 5 documents free · Setup in 60 seconds</p>

          {/* Product mockup */}
          <div className="animate-float-slow mt-16 relative mx-auto max-w-4xl">
            <div className="absolute -inset-8 rounded-3xl bg-indigo-500/8 blur-3xl" />
            <div className="relative rounded-2xl bg-zinc-900 ring-1 ring-white/10 overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-zinc-950/50">
                <div className="flex gap-1.5">
                  {[0,1,2].map(i => <div key={i} className="h-3 w-3 rounded-full bg-zinc-700" />)}
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-6 max-w-[280px] rounded-md bg-zinc-800 flex items-center px-3 gap-2">
                    <Lock className="h-3 w-3 text-zinc-500" />
                    <span className="text-xs text-zinc-500">app.paperwise.ai/dashboard</span>
                  </div>
                </div>
              </div>
              <div className="flex h-[340px]">
                <div className="w-40 border-r border-white/5 bg-zinc-950/50 p-3 flex-shrink-0">
                  <div className="flex items-center gap-1.5 px-2 py-2 mb-2">
                    <div className="h-4 w-4 rounded bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                      <span className="text-[7px] font-bold text-white">P</span>
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-200">Paperwise</span>
                  </div>
                  <div className="rounded-md bg-indigo-600/90 px-2 py-1.5 text-[10px] text-center text-white font-medium mb-2">+ New chat</div>
                  <div className="text-[9px] text-zinc-600 px-2 mb-1 uppercase tracking-wider">Today</div>
                  <div className="rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2 py-1.5 mb-1"><div className="text-[10px] text-indigo-300 truncate">Q3 financial analysis</div></div>
                  <div className="px-2 py-1.5"><div className="text-[10px] text-zinc-500 truncate">Legal contract review</div></div>
                </div>
                <div className="flex-1 flex flex-col bg-[#09090b]">
                  <div className="flex-1 p-4 space-y-3 overflow-hidden">
                    <div className="flex justify-end"><div className="max-w-[70%] rounded-2xl rounded-tr-sm bg-indigo-600/20 border border-indigo-500/20 px-3 py-2"><p className="text-[10px] text-zinc-300">What are the main Q3 findings?</p></div></div>
                    <div className="rounded-xl bg-zinc-900/60 ring-1 ring-white/8 p-3">
                      <div className="flex items-center gap-1.5 mb-2"><div className="h-4 w-4 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center"><span className="text-[7px] font-bold text-white">P</span></div><span className="text-[10px] font-medium text-zinc-300">Paperwise</span></div>
                      <p className="text-[10px] text-zinc-400 leading-relaxed">Based on your documents <span className="inline-flex items-center h-3.5 px-1 rounded bg-indigo-500/20 text-indigo-300 text-[8px] font-mono">[1]</span>, revenue grew <strong className="text-zinc-200">23% YoY</strong> in Q3.</p>
                    </div>
                    <div className="flex justify-end"><div className="max-w-[70%] rounded-2xl rounded-tr-sm bg-indigo-600/20 border border-indigo-500/20 px-3 py-2"><p className="text-[10px] text-zinc-300">What drove enterprise growth?</p></div></div>
                    <div className="rounded-xl bg-zinc-900/60 ring-1 ring-white/8 p-3">
                      <div className="flex items-center gap-1.5 mb-2"><div className="h-4 w-4 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center"><span className="text-[7px] font-bold text-white">P</span></div><span className="text-[10px] font-medium text-zinc-300">Paperwise</span></div>
                      <p className="text-[10px] text-zinc-400">Enterprise growth was driven by<span className="cursor-blink inline-block w-1 h-3 bg-indigo-400 rounded-sm align-text-bottom ml-0.5" /></p>
                    </div>
                  </div>
                  <div className="border-t border-white/5 p-3"><div className="flex items-center gap-2 rounded-xl bg-zinc-900/80 ring-1 ring-white/8 px-3 py-2"><span className="text-[10px] text-zinc-600 flex-1">Ask anything about your documents...</span><div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center"><ArrowRight className="h-3 w-3 text-white" /></div></div></div>
                </div>
                <div className="w-36 border-l border-white/5 bg-zinc-900/30 p-3 flex-shrink-0">
                  <div className="text-[9px] font-medium text-zinc-200 border-b border-indigo-500 pb-1 mb-3 inline-block">Sources</div>
                  {[{n:1,doc:"Q3-report.pdf",s:"Revenue grew 23%..."},{n:2,doc:"Q3-report.pdf",s:"Enterprise +47..."},{n:3,doc:"board-deck.pdf",s:"Q4 target $52M..."}].map(s=>(
                    <div key={s.n} className="mb-2 rounded-lg bg-zinc-800/60 ring-1 ring-white/5 p-2">
                      <div className="flex items-center gap-1 mb-1"><span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded bg-indigo-500/20 text-indigo-300 text-[8px] font-bold">{s.n}</span><span className="text-[9px] text-zinc-300 truncate">{s.doc}</span></div>
                      <p className="text-[8px] text-zinc-500">{s.s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-28 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-4 py-1.5 text-xs text-zinc-400 mb-5">Simple by design</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Three steps to understanding</h2>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto">No setup, no training, no technical expertise required.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step:"01", icon:<Upload className="h-5 w-5 text-indigo-400" />, title:"Upload", desc:"Drop your PDFs, Word docs, or text files. We parse and index them instantly.", color:"from-indigo-500/20 to-indigo-500/5" },
              { step:"02", icon:<MessageSquare className="h-5 w-5 text-violet-400" />, title:"Ask", desc:"Chat naturally in plain English. Ask for summaries, comparisons, or specific facts.", color:"from-violet-500/20 to-violet-500/5" },
              { step:"03", icon:<CheckCircle2 className="h-5 w-5 text-emerald-400" />, title:"Get answers", desc:"Receive AI responses with cited passages from your documents. No guessing.", color:"from-emerald-500/20 to-emerald-500/5" },
            ].map((item, i) => (
              <div key={i} className={`card-hover relative rounded-2xl bg-gradient-to-b ${item.color} ring-1 ring-white/8 p-6`}>
                <div className="absolute top-4 right-4 text-5xl font-black text-white/5 select-none leading-none">{item.step}</div>
                <div className="h-10 w-10 rounded-xl bg-zinc-900/80 ring-1 ring-white/10 flex items-center justify-center mb-5">{item.icon}</div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
                {i < 2 && <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 h-6 w-6 items-center justify-center rounded-full bg-zinc-800 ring-1 ring-white/10 z-10"><ChevronRight className="h-3 w-3 text-zinc-500" /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-y border-white/5 bg-zinc-950/50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-4 py-1.5 text-xs text-zinc-400 mb-5">Built for power users</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Everything you need</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon:<Bot className="h-5 w-5 text-indigo-400" />, title:"AI-powered answers", desc:"Mistral LLM generates answers grounded exclusively in your documents." },
              { icon:<Link2 className="h-5 w-5 text-violet-400" />, title:"Source citations", desc:"Every answer includes [1][2] references to the exact passages it was drawn from." },
              { icon:<MessageSquare className="h-5 w-5 text-blue-400" />, title:"Multi-turn conversations", desc:"Follow up naturally. The AI remembers previous messages in the conversation." },
              { icon:<Search className="h-5 w-5 text-emerald-400" />, title:"Multi-document search", desc:"Ask across all your documents at once, or filter to a specific file." },
              { icon:<History className="h-5 w-5 text-amber-400" />, title:"Conversation history", desc:"All past chats saved, searchable, and organized by date automatically." },
              { icon:<Lock className="h-5 w-5 text-rose-400" />, title:"Private & secure", desc:"Your documents are never used to train AI models. They're only yours." },
            ].map((f, i) => (
              <div key={i} className="card-hover rounded-2xl bg-zinc-900/40 ring-1 ring-white/8 p-5">
                <div className="h-9 w-9 rounded-lg bg-zinc-900/80 ring-1 ring-white/10 flex items-center justify-center mb-4">{f.icon}</div>
                <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="py-28 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Start free. Scale when ready.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl bg-zinc-900/40 ring-1 ring-white/8 p-7">
              <div className="text-sm font-medium text-zinc-400 mb-1">Free</div>
              <div className="text-4xl font-bold text-zinc-100 mb-1">$0<span className="text-base font-normal text-zinc-500">/month</span></div>
              <div className="space-y-2 my-5">
                {["5 documents","20 queries/day","PDF, TXT, MD","7-day history"].map(f=><div key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-zinc-600 flex-shrink-0" /><span className="text-sm text-zinc-400">{f}</span></div>)}
              </div>
              <Link href="/signup" className="block w-full text-center rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-zinc-300 hover:bg-white/10 transition-colors">Get started free</Link>
            </div>
            <div className="relative rounded-2xl bg-gradient-to-b from-indigo-950/60 to-zinc-900/60 ring-1 ring-indigo-500/30 p-7 overflow-hidden">
              <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-indigo-500/20 px-2.5 py-1 text-[11px] font-medium text-indigo-300"><Star className="h-3 w-3" /> Most popular</div>
              <div className="text-sm font-medium text-indigo-400 mb-1">Pro</div>
              <div className="text-4xl font-bold text-zinc-100 mb-1">$12<span className="text-base font-normal text-zinc-500">/month</span></div>
              <div className="space-y-2 my-5">
                {["Unlimited documents","Unlimited queries","PDF, DOCX, TXT, MD","History forever","Priority support"].map(f=><div key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-400 flex-shrink-0" /><span className="text-sm text-zinc-300">{f}</span></div>)}
              </div>
              <button className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-sm font-medium text-white hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/20">Join waitlist — Coming soon</button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="mx-auto max-w-3xl text-center">
          <div className="relative rounded-3xl bg-gradient-to-b from-indigo-950/40 to-zinc-900/40 ring-1 ring-indigo-500/20 p-12 overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5" />
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Ready to stop ctrl+F-ing?</h2>
              <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">Join researchers, lawyers, and founders who chat with their documents instead of searching through them.</p>
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 text-base font-semibold text-white hover:from-indigo-500 hover:to-violet-500 transition-all shadow-xl shadow-indigo-500/20">
                Create your free account <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-4 text-sm text-zinc-600">No credit card required</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center"><span className="text-white text-[9px] font-bold">P</span></div>
            <span className="text-sm font-semibold text-zinc-400">Paperwise</span>
            <span className="text-zinc-700 text-sm ml-2">© 2025</span>
          </div>
          <div className="flex items-center gap-6">
            {["Pricing", "Privacy", "Terms"].map(l => <Link key={l} href={`/${l.toLowerCase()}`} className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">{l}</Link>)}
            <a href="mailto:hello@paperwise.ai" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
