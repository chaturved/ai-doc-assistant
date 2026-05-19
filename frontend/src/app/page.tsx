"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, ChevronRight, CheckCircle2 } from "lucide-react";

/* ─────────────────────────────────────────────────────────
   T: values only needed in JSX (SVG colors, unique gradients)
   Everything else lives in globals.css design tokens.
───────────────────────────────────────────────────────── */
const T = {
  grad:    "linear-gradient(135deg, #6d28d9 0%, #b45309 100%)",
  primary: "#5b21b6",
  accent:  "#f59e0b",
  bg:      "#080810",
  muted:   "rgba(255,255,255,0.5)",
  faint:   "rgba(255,255,255,0.22)",
  border:  "rgba(255,255,255,0.08)",
};

/* ─────────────────────────────────────────────────────────
   SHARED COMPONENTS
───────────────────────────────────────────────────────── */

function CardHeader({ dot = T.accent, title }: { dot?: string; title: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b-system">
      <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center">
        <div className="w-[7px] h-[7px] rounded-full" style={{ background: dot }} />
      </div>
      <span className="text-[11px] font-semibold text-muted tracking-[0.01em]">{title}</span>
      <div className="ml-auto w-4 h-4 rounded-full border-system flex items-center justify-center">
        <span className="text-[8px] text-faint font-bold">i</span>
      </div>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`card shadow-[0_8px_40px_rgba(0,0,0,0.45)] ${className}`}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => setScrolled(window.scrollY > 20), { passive: true });
  }

  return (
    <div className="bg-bg text-white overflow-x-hidden min-h-screen">

      {/* ══════════════════════════════════════════
          NAV
      ══════════════════════════════════════════ */}
      <nav className={`fixed top-0 inset-x-0 z-50 h-[60px] flex items-center px-9 transition-all duration-300 ${
        scrolled ? "bg-bg/90 backdrop-blur-xl border-b-system" : ""
      }`}>
        <Link href="/" className="flex items-center gap-[9px] shrink-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm"
               style={{ background: T.grad }}>P</div>
          <span className="text-[15px] font-bold">Paperwise</span>
        </Link>

        <div className="flex-1 flex items-center justify-center gap-8">
          {[
            { label: "Features", href: "#features" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "Pricing", href: "#pricing" },
            { label: "FAQ", href: "#faq" },
          ].map((l) => (
            <a key={l.label} href={l.href}
               className="text-[13.5px] font-medium text-white/70">
              {l.label}
            </a>
          ))}
        </div>

        <Link href="/signup" className="btn-primary shrink-0 !text-[13.5px]">
          Get Started Free
        </Link>
      </nav>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="h-svh overflow-hidden relative flex flex-col items-center">

        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: "radial-gradient(ellipse 140% 110% at 50% 100%, #4c1db0 0%, #2a0e6e 20%, #7a3d00 42%, #080810 72%)" }} />
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 45%, rgba(8,8,16,0.75) 100%)" }} />

        {/* Headline */}
        <div className="animate-fu text-center px-6 relative z-10 w-full max-w-[1080px]"
             style={{ paddingTop: "clamp(120px,16vh,180px)" }}>
          <h1 className="heading-hero">
            Chat with your documents.<br />Instantly.
          </h1>
          <p className="animate-fu-1 mt-[18px] text-muted max-w-[520px] mx-auto leading-[1.65]"
             style={{ fontSize: "clamp(0.95rem,1.4vw,1.1rem)" }}>
            Upload any document and get cited, grounded answers in seconds — no setup, no data science, no guesswork.
          </p>
          <div className="animate-fu-2 flex items-center justify-center gap-[10px] mt-7">
            <a href="#how-it-works" className="btn-secondary !rounded-[10px] !text-[14.5px]">
              <span className="w-[22px] h-[22px] rounded-full border border-black/25 flex items-center justify-center shrink-0">
                <Play size={9} strokeWidth={3} className="ml-px" />
              </span>
              See How It Works
            </a>
            <Link href="/signup" className="btn-primary !rounded-[10px] !text-[14.5px]">
              Start Free Trial
            </Link>
          </div>
        </div>

        {/* Product preview cards */}
        <div className="animate-fu-3 w-full max-w-[1160px] px-[18px] relative z-10 grid gap-[10px]"
             style={{ marginTop: "clamp(16px,2.5vh,38px)", gridTemplateColumns: "5fr 2.8fr 4.2fr" }}>

          {/* Card A — Document Journey */}
          <Card>
            <CardHeader title="Document Journey" />
            <div className="flex h-[178px]">
              <div className="w-[88px] shrink-0 p-[14px_12px] flex flex-col gap-[18px]">
                {[{ label: "Query Rate", val: "47%", pct: 47 }, { label: "AI Accuracy", val: "94%", pct: 94 }].map((s) => (
                  <div key={s.label}>
                    <div className="text-[9px] text-muted mb-1">{s.label}</div>
                    <div className="text-xl font-extrabold leading-none">{s.val}</div>
                    <div className="mt-[5px] flex items-center gap-1">
                      <div className="flex-1 h-[3px] rounded-sm bg-white/[0.07] overflow-hidden">
                        <div className="h-full rounded-sm bg-accent" style={{ width: `${s.pct}%` }} />
                      </div>
                      <span className="text-[8px] text-accent">{s.val}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex-1 relative overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 260 178" preserveAspectRatio="none" className="absolute inset-0">
                  <defs>
                    {[["f1","#5b21b6","#f59e0b"],["f2","#6d28d9","#f59e0b"],["f3","#4c1d95","#f97316"],["f4","#7c3aed","#ef4444"],["f5","#6d28d9","#ef4444"]].map(([id,s,e])=>(
                      <linearGradient key={id} id={id} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={s} stopOpacity="0.7" />
                        <stop offset="100%" stopColor={e} stopOpacity="0.75" />
                      </linearGradient>
                    ))}
                  </defs>
                  {[["Q3 Report",8],["Board Deck",44],["Earnings",80],["Legal Docs",116],["HR Policy",152]].map(([name,y])=>(
                    <text key={String(name)} x="3" y={Number(y)+8} fontSize="7" fill={T.muted}>{name}</text>
                  ))}
                  <text x="195" y="46" fontSize="7" fill={T.muted}>Cited</text>
                  <text x="195" y="142" fontSize="7" fill={T.muted}>Skipped</text>
                  <path d="M62,2 C140,2 140,30 210,30 L210,62 C140,62 140,36 62,36 Z" fill="url(#f1)" />
                  <path d="M62,36 C140,36 140,44 210,44 L210,68 C140,68 140,60 62,60 Z" fill="url(#f2)" />
                  <path d="M62,60 C140,60 140,52 210,52 L210,74 C140,74 140,72 62,84 Z" fill="url(#f3)" />
                  <path d="M62,106 C140,106 140,120 210,118 L210,150 C140,150 140,132 62,130 Z" fill="url(#f4)" />
                  <path d="M62,130 C140,130 140,140 210,138 L210,160 C140,160 140,152 62,154 Z" fill="url(#f5)" />
                </svg>
              </div>
            </div>
          </Card>

          {/* Card B — stacked */}
          <div className="flex flex-col gap-[10px]">
            <Card className="flex-1">
              <CardHeader title="Query Volume" />
              <div className="p-[10px_14px]">
                <div className="text-[30px] font-extrabold leading-none mb-2">18</div>
                <div className="flex items-end gap-[3px] h-[38px]">
                  {[28,45,22,60,35,75,48,90,55,38].map((h,i)=>(
                    <div key={i} className="flex-1 rounded-t-[3px]"
                         style={{ height:`${h}%`, background: i===7?T.accent:i>=5?T.primary:"rgba(255,255,255,0.1)" }} />
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  {["9am","12pm","3pm"].map(v=><span key={v} className="text-[7px] text-faint">{v}</span>)}
                </div>
              </div>
            </Card>
            <Card className="flex-1">
              <CardHeader title="Answer Quality" />
              <div className="p-[12px_14px]">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold">94%</span>
                  <span className="text-[9px] text-muted font-medium">grounded</span>
                </div>
                <div className="flex items-center gap-[5px] mt-[6px]">
                  <div className="w-[6px] h-[6px] rounded-full bg-[#34d399]" />
                  <span className="text-[9px] font-semibold text-[#34d399]">↑ 1.2%</span>
                  <span className="text-[8px] text-faint">vs last month</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Card C — Document Pipeline */}
          <Card>
            <CardHeader title="Document Pipeline" dot="#60a5fa" />
            <div className="grid grid-cols-4 p-[10px_14px_8px] gap-[6px] border-b-system">
              {[{l:"Upload",v:"3",s:"docs"},{l:"Indexed",v:"487",s:"chunks"},{l:"Queried",v:"18",s:"today"},{l:"Cited",v:"47",s:"refs"}].map(s=>(
                <div key={s.l}>
                  <div className="text-[8px] text-muted mb-[2px]">{s.l}</div>
                  <div className="text-[13px] font-extrabold">{s.v}</div>
                  <div className="text-[7px] text-faint">{s.s}</div>
                </div>
              ))}
            </div>
            <div className="p-[10px_14px] h-[94px] relative overflow-hidden">
              <svg width="100%" height="100%" viewBox="0 0 280 80" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="fn" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={T.primary} /><stop offset="50%" stopColor="#db2777" /><stop offset="100%" stopColor={T.accent} />
                  </linearGradient>
                </defs>
                <path d="M0,0 Q140,2 270,14 L270,66 Q140,78 0,80 Z" fill="url(#fn)" opacity="0.6" />
                <path d="M0,0 Q120,2 220,16 L220,64 Q120,78 0,76 Z" fill="rgba(180,83,9,0.35)" />
                <path d="M0,2 Q90,4 170,20 L170,60 Q90,76 0,74 Z" fill="rgba(120,53,5,0.4)" />
                <path d="M0,4 Q60,6 120,24 L120,56 Q60,74 0,72 Z" fill="rgba(78,35,3,0.45)" />
                {[70,140,210].map(x=><line key={x} x1={x} y1="0" x2={x} y2="80" stroke={T.border} strokeWidth="0.8"/>)}
              </svg>
            </div>
          </Card>
        </div>

        {/* Bottom bleed */}
        <div className="absolute bottom-0 inset-x-0 h-[100px] pointer-events-none z-20"
             style={{ background: `linear-gradient(to top, ${T.bg} 22%, transparent)` }} />
      </section>

      {/* ══════════════════════════════════════════
          LOGO BAR
      ══════════════════════════════════════════ */}
      <section className="py-12 px-9 border-b-system">
        <p className="text-center text-[13px] text-faint mb-6">Trusted by researchers and teams across these organizations</p>
        <div className="flex items-center justify-center gap-11 flex-wrap">
          {[
            { icon: "⚡", name: "Lexify" },
            { icon: "📚", name: "Academix" },
            { icon: "🔬", name: "ResearchLab" },
            { icon: "⚖️", name: "LexDocs" },
            { icon: "🌐", name: "DataCite" },
            { icon: "📄", name: "PaperStack" },
          ].map((co) => (
            <div key={co.name} className="flex items-center gap-2 opacity-50">
              <span className="text-[18px]">{co.icon}</span>
              <span className="text-[15px] font-bold tracking-[-0.02em]">{co.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════ */}
      <section id="features" className="section-padding">
        <div className="max-w-[1100px] mx-auto">

          <div className="grid grid-cols-2 gap-10 mb-[52px] items-start">
            <div>
              <p className="section-label mb-[14px]">Why Paperwise</p>
              <h2 className="heading-section">Stop searching. Start asking.</h2>
            </div>
            <div className="pt-[6px]">
              <p className="text-base text-muted leading-[1.7]">
                Unlock real-time insights and AI-powered answers across every document in your library — no data science degree required.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">

            {/* Feature 1 — Document Coverage */}
            <Card>
              <CardHeader title="Document Coverage" />
              <div className="p-[16px_20px_8px]">
                <div className="grid grid-cols-4 mb-[14px] gap-1">
                  {[{l:"Documents",v:"12",s:"uploaded"},{l:"Chunks",v:"487",s:"indexed"},{l:"Queries",v:"18",s:"today"},{l:"Citations",v:"47",s:"returned"}].map(s=>(
                    <div key={s.l}>
                      <div className="text-[8px] text-muted mb-px">{s.l}</div>
                      <div className="text-sm font-extrabold">{s.v}</div>
                      <div className="text-[8px] text-faint">{s.s}</div>
                    </div>
                  ))}
                </div>
                <div className="h-[90px] relative overflow-hidden mb-4">
                  <svg width="100%" height="100%" viewBox="0 0 400 85" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="fc1" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={T.primary} /><stop offset="45%" stopColor="#db2777" /><stop offset="100%" stopColor={T.accent} />
                      </linearGradient>
                    </defs>
                    <path d="M0,0 Q200,1 390,10 L390,75 Q200,84 0,85 Z" fill="url(#fc1)" opacity="0.55" />
                    <path d="M0,0 Q180,2 320,14 L320,71 Q180,83 0,81 Z" fill="rgba(180,83,9,0.35)" />
                    <path d="M0,2 Q140,4 240,20 L240,65 Q140,81 0,79 Z" fill="rgba(120,53,5,0.4)" />
                    <path d="M0,5 Q100,7 160,26 L160,59 Q100,78 0,75 Z" fill="rgba(78,35,3,0.45)" />
                    {[100,200,300].map(x=><line key={x} x1={x} y1="0" x2={x} y2="85" stroke={T.border} strokeWidth="0.8"/>)}
                  </svg>
                </div>
              </div>
              <div className="p-[0_20px_20px]">
                <h3 className="text-[15px] font-bold mb-[6px]">Real-Time Document Insights</h3>
                <p className="text-[13px] text-muted leading-[1.6] mb-[14px]">Track how many documents are indexed, queried, and cited across your entire library.</p>
                <a href="#" className="link-accent">Learn more <ChevronRight size={13} /></a>
              </div>
            </Card>

            {/* Feature 2 — Answer Quality */}
            <Card>
              <CardHeader title="Answer Quality" dot="#34d399" />
              <div className="p-[16px_20px]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[38px] font-black leading-none">94.7%</div>
                    <div className="text-xs text-muted mt-1">Jan, 2026</div>
                    <div className="mt-[18px]">
                      <div className="text-[11px] text-muted mb-1">Accuracy trend</div>
                      <div className="flex items-center gap-[6px]">
                        <div className="w-2 h-2 rounded-full bg-[#34d399]" />
                        <span className="text-xs font-semibold text-[#34d399]">↑ 1.25%</span>
                        <span className="text-[11px] text-faint">vs Last month</span>
                      </div>
                    </div>
                  </div>
                  <svg width="88" height="88" viewBox="0 0 88 88">
                    <circle cx="44" cy="44" r="34" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
                    <circle cx="44" cy="44" r="34" fill="none" stroke="url(#dg)" strokeWidth="10"
                      strokeDasharray={`${0.947 * 2 * Math.PI * 34} ${2 * Math.PI * 34}`}
                      strokeLinecap="round" strokeDashoffset={2 * Math.PI * 34 * 0.25} transform="rotate(-90 44 44)" />
                    <defs>
                      <linearGradient id="dg" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={T.primary} /><stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <div className="p-[0_20px_20px]">
                <h3 className="text-[15px] font-bold mb-[6px]">AI Answer Accuracy</h3>
                <p className="text-[13px] text-muted leading-[1.6] mb-[14px]">Monitor how well the AI grounds its answers in your specific documents over time.</p>
                <a href="#" className="link-accent">Learn more <ChevronRight size={13} /></a>
              </div>
            </Card>

            {/* Feature 3 — Query Volume */}
            <Card>
              <CardHeader title="Query Volume" dot="#60a5fa" />
              <div className="p-[16px_20px]">
                <div className="text-[32px] font-black text-[#34d399] leading-none">+34%</div>
                <div className="text-xs text-muted mt-1 mb-[14px]">Over the last 7 days</div>
                <div className="flex items-end gap-1 h-16">
                  {[
                    {h:30,c:"#334155"},{h:48,c:"#334155"},{h:22,c:"#334155"},{h:55,c:"#334155"},{h:38,c:"#334155"},
                    {h:70,c:T.primary},{h:52,c:T.primary},{h:88,c:T.primary},{h:60,c:"#60a5fa"},{h:42,c:"#60a5fa"},
                    {h:76,c:T.primary},{h:95,c:T.primary},{h:65,c:T.primary},{h:82,c:"#60a5fa"},
                  ].map((b,i)=>(
                    <div key={i} className="flex-1 rounded-t-[2px] opacity-85" style={{ height:`${b.h}%`, background:b.c }} />
                  ))}
                </div>
                <div className="flex justify-between mt-[5px]">
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(v=><span key={v} className="text-[7px] text-faint">{v}</span>)}
                </div>
                <div className="flex gap-[14px] mt-2">
                  {[{c:T.primary,l:"This week"},{c:"#60a5fa",l:"Last week"}].map(({c,l})=>(
                    <div key={l} className="flex items-center gap-[5px]">
                      <div className="w-5 h-[3px] rounded-sm" style={{ background:c }} />
                      <span className="text-[10px] text-muted">{l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-[0_20px_20px]">
                <h3 className="text-[15px] font-bold mb-[6px]">Query Analytics</h3>
                <p className="text-[13px] text-muted leading-[1.6] mb-[14px]">Track query patterns over time and understand which documents get asked about most.</p>
                <a href="#" className="link-accent">Learn more <ChevronRight size={13} /></a>
              </div>
            </Card>

            {/* Feature 4 — Citation Pipeline */}
            <Card>
              <CardHeader title="Citation Pipeline" dot={T.accent} />
              <div className="p-[16px_20px_8px]">
                <div className="grid grid-cols-4 mb-[14px] gap-1">
                  {[{l:"Documents",v:"80",s:"uploaded"},{l:"Chunks",v:"3,210",s:"indexed"},{l:"Citations",v:"9,210",s:"returned"},{l:"Accuracy",v:"94%",s:"grounded"}].map(s=>(
                    <div key={s.l}>
                      <div className="text-[8px] text-muted mb-px">{s.l}</div>
                      <div className="text-[13px] font-extrabold leading-[1.2]">{s.v}</div>
                      <div className="text-[8px] text-faint">{s.s}</div>
                    </div>
                  ))}
                </div>
                <div className="h-[90px] relative overflow-hidden mb-4">
                  <svg width="100%" height="100%" viewBox="0 0 400 85" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="fc2" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={T.primary} /><stop offset="45%" stopColor="#ec4899" /><stop offset="100%" stopColor={T.accent} />
                      </linearGradient>
                    </defs>
                    <path d="M0,0 Q200,1 392,10 L392,75 Q200,84 0,85 Z" fill="url(#fc2)" opacity="0.55" />
                    <path d="M0,0 Q170,2 310,15 L310,70 Q170,83 0,81 Z" fill="rgba(180,83,9,0.35)" />
                    <path d="M0,2 Q130,4 230,22 L230,63 Q130,81 0,79 Z" fill="rgba(120,53,5,0.4)" />
                    {[100,200,300].map(x=><line key={x} x1={x} y1="0" x2={x} y2="85" stroke={T.border} strokeWidth="0.8"/>)}
                  </svg>
                </div>
              </div>
              <div className="p-[0_20px_20px]">
                <h3 className="text-[15px] font-bold mb-[6px]">Citation Pipeline</h3>
                <p className="text-[13px] text-muted leading-[1.6] mb-[14px]">Every answer comes with traceable citations — document name, page, and exact passage — so nothing goes unverified.</p>
                <a href="#" className="link-accent">Learn more <ChevronRight size={13} /></a>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          EXPLAINER — Connect / Index / Query
      ══════════════════════════════════════════ */}
      <section id="how-it-works" className="section-padding border-t-system">
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 gap-[60px] items-center">
          <div>
            <p className="section-label mb-[14px]">How It Works</p>
            <h2 className="heading-section mb-8">From upload to answer in seconds</h2>
            {[
              { title: "Connect Your Docs", desc: "Upload PDFs, Word files, or plain text. No configuration needed — just drop your files and they're ready to query." },
              { title: "Index Your Docs", desc: "Paperwise embeds your documents into a searchable vector index so the AI always retrieves the most relevant passages for any question." },
              { title: "Query & Cite", desc: "Ask questions in plain English and get cited answers grounded in your exact documents — every time." },
            ].map((item, i) => (
              <div key={i} className={i < 2 ? "mb-7" : ""}>
                <h3 className="text-[15px] font-bold mb-[7px]">{item.title}</h3>
                <p className="text-[13.5px] text-muted leading-[1.65] mb-2">{item.desc}</p>
                <a href="#" className="link-accent">Learn more <ChevronRight size={13} /></a>
              </div>
            ))}
          </div>

          {/* Segmented donut */}
          <div className="flex items-center justify-center">
            <svg width="340" height="340" viewBox="0 0 340 340">
              {(() => {
                const cx = 170, cy = 170;
                const seg = (sa: number, ea: number, r: number, w: number, color: string, k: string, label?: string) => {
                  const C = 2 * Math.PI * r;
                  const arcLen = C * (ea - sa) / 360;
                  const mid = ((sa + ea) / 2 - 90) * Math.PI / 180;
                  const lr = r + w / 2 + 14;
                  return (
                    <g key={k}>
                      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={w}
                        strokeDasharray={`${arcLen} ${C}`}
                        strokeDashoffset={C * (1 - sa / 360)}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${cx} ${cy})`}
                      />
                      {label && (
                        <text x={cx + lr * Math.cos(mid)} y={cy + lr * Math.sin(mid)}
                          fontSize="6.5" fill={T.muted}
                          textAnchor="middle" dominantBaseline="middle">{label}</text>
                      )}
                    </g>
                  );
                };
                return (
                  <>
                    {seg(0,   55,  128, 28, "#f97316", "o1", "Queries")}
                    {seg(70,  120, 128, 28, "#f59e0b", "o2", "Indexed")}
                    {seg(135, 177, 128, 28, "#3b82f6", "o3", "Cited")}
                    {seg(192, 237, 128, 28, "#06b6d4", "o4", "Stored")}
                    {seg(252, 295, 128, 28, T.primary, "o5", "Parsed")}
                    {seg(310, 345, 128, 28, "#db2777", "o6", "Tagged")}
                    {seg(8,   72,   90, 20, "#ea580c", "i1")}
                    {seg(87,  153,  90, 20, "#1d4ed8", "i2")}
                    {seg(168, 234,  90, 20, "#0e7490", "i3")}
                    {seg(249, 315,  90, 20, "#6d28d9", "i4")}
                    {seg(330, 355,  90, 20, "#78350f", "i5")}
                    <circle cx={cx} cy={cy} r="58" fill={T.bg} />
                  </>
                );
              })()}
            </svg>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS
      ══════════════════════════════════════════ */}
      <section className="section-padding relative">
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/[0.08] z-0" />
        <div className="max-w-[1100px] mx-auto relative z-10">
          <div className="card-lg p-[56px_48px] text-center">
            <h2 className="heading-md mb-[10px]">Built for people who live inside documents</h2>
            <p className="text-[15px] text-muted mb-11">Less time hunting for answers. More time using them.</p>
            <div className="grid grid-cols-3">
              {[
                { val: "-70%", label: "Time Searching" },
                { val: "+3×",  label: "Faster Answers" },
                { val: "94%",  label: "Citation Accuracy" },
              ].map((s, i) => (
                <div key={i} className={`px-8 ${i < 2 ? "border-r-system" : ""}`}>
                  <div className="font-black tracking-[-0.04em] bg-gradient-to-br from-white/90 to-accent bg-clip-text text-transparent"
                       style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>{s.val}</div>
                  <div className="text-[13px] text-muted mt-[6px]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PRICING
      ══════════════════════════════════════════ */}
      <section id="pricing" className="section-padding">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <p className="section-label mb-[14px]">Pricing</p>
            <h2 className="heading-section mb-3">One plan for every stage of your work</h2>
            <p className="text-[15px] text-muted max-w-[480px] mx-auto">Start free, upgrade when you need more. No hidden fees, no lock-in.</p>
          </div>
          <div className="grid grid-cols-3 gap-4">

            {/* Starter */}
            <Card>
              <div className="p-[28px_28px_24px]">
                <div className="text-sm font-semibold text-muted mb-2">Starter</div>
                <div className="mb-2">
                  <span className="text-[36px] font-black">$0</span>
                  <span className="text-sm text-muted"> per month</span>
                </div>
                <p className="text-[13px] text-muted leading-[1.6] mb-5">For individuals getting started with AI document chat.</p>
                <div className="divider mb-5" />
                <p className="text-[11px] font-bold text-faint uppercase tracking-[0.08em] mb-[14px]">FEATURES</p>
                {["Up to 5 documents","20 queries / month","1 workspace","PDF, DOCX, TXT, MD","Email support"].map(f=>(
                  <div key={f} className="flex items-center gap-2 mb-[10px]">
                    <CheckCircle2 size={14} color="rgba(255,255,255,0.3)" />
                    <span className="text-[13px] text-muted">{f}</span>
                  </div>
                ))}
                <Link href="/signup" className="btn-primary w-full justify-center mt-6 !block !text-center">
                  Start Free
                </Link>
              </div>
            </Card>

            {/* Growth — Popular */}
            <div className="relative card shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
                 style={{ border: "1px solid rgba(245,158,11,0.35)" }}>
              <div className="absolute top-0 inset-x-0 h-px"
                   style={{ background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)" }} />
              <div className="p-[28px_28px_24px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-muted">Growth</span>
                  <span className="text-[11px] font-bold bg-accent/20 text-accent rounded-full px-[10px] py-[3px]">Popular</span>
                </div>
                <div className="mb-2">
                  <span className="text-[36px] font-black">$12</span>
                  <span className="text-sm text-muted"> per month</span>
                </div>
                <p className="text-[13px] text-muted leading-[1.6] mb-5">For power users and researchers who need more documents and queries.</p>
                <div className="divider mb-5" />
                <p className="text-[11px] font-bold text-faint uppercase tracking-[0.08em] mb-[14px]">Everything in Starter plus...</p>
                {["Up to 50 documents","Unlimited queries","3 workspaces (multi-doc)","Advanced citation analytics","PDF, DOCX, TXT, MD","Priority support"].map(f=>(
                  <div key={f} className="flex items-center gap-2 mb-[10px]">
                    <CheckCircle2 size={14} color={T.accent} />
                    <span className="text-[13px] text-white/75">{f}</span>
                  </div>
                ))}
                <button className="btn-primary w-full mt-6 !font-bold">
                  Start 14-Day Trial
                </button>
              </div>
            </div>

            {/* Enterprise */}
            <Card>
              <div className="p-[28px_28px_24px]">
                <div className="text-sm font-semibold text-muted mb-2">Enterprise</div>
                <div className="mb-2">
                  <span className="text-[36px] font-black">$40</span>
                  <span className="text-sm text-muted"> per month</span>
                </div>
                <p className="text-[13px] text-muted leading-[1.6] mb-5">For high-volume teams with custom security and compliance needs.</p>
                <div className="divider mb-5" />
                <p className="text-[11px] font-bold text-faint uppercase tracking-[0.08em] mb-[14px]">Everything in Growth plus...</p>
                {["Unlimited documents","Custom AI model tuning","Dedicated success manager","SOC 2 & GDPR compliance","Role-based permissions","Audit logs & SSO"].map(f=>(
                  <div key={f} className="flex items-center gap-2 mb-[10px]">
                    <CheckCircle2 size={14} color="rgba(255,255,255,0.3)" />
                    <span className="text-[13px] text-muted">{f}</span>
                  </div>
                ))}
                <Link href="mailto:hello@paperwise.ai" className="btn-secondary w-full mt-6 !block !text-center">
                  Contact Sales
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════ */}
      <section id="faq" className="section-padding border-t-system">
        <div className="max-w-[700px] mx-auto">
          <div className="text-center mb-14">
            <h2 className="heading-section mb-3">Everything you need to know</h2>
            <p className="text-[15px] text-muted">Quick answers to the questions we get most about documents, privacy, and plans.</p>
          </div>
          {[
            { q: "What file types does Paperwise support?", a: "Paperwise supports PDF, DOCX, TXT, and Markdown files on all plans. You can upload directly from your computer — no cloud storage connection required to get started." },
            { q: "How accurate are the AI answers?", a: "Answers are grounded exclusively in your uploaded documents, not the open web. Every response includes citations pointing to the exact passage it came from, so you can verify accuracy instantly. Our average groundedness score is 94%." },
            { q: "How does Paperwise cite sources?", a: "Every answer includes inline citations — the document name, page number, and the exact text excerpt the AI used. You can click any citation to jump directly to that passage in the original file." },
            { q: "Is my data kept private?", a: "Yes. Your documents are encrypted at rest and in transit (TLS 1.2+) and stored in private, isolated storage. We never share your data with other users or use it to train AI models." },
            { q: "What happens when I hit my query limit?", a: "On the free Starter tier, new queries are paused once you reach 20 for the month. Your limit resets on your billing date. You can upgrade at any time from settings to immediately unlock more capacity." },
            { q: "Is there a free trial for paid plans?", a: "Yes — the Growth plan includes a 14-day free trial with no credit card required. If you decide not to continue, you automatically drop back to the free Starter tier with no charge." },
          ].map((item, i) => (
            <div key={i} className="border-b-system">
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full flex items-center justify-between py-5 bg-transparent border-none text-white text-left">
                <span className="text-[15px] font-semibold">{item.q}</span>
                <div className="shrink-0 ml-4 w-[22px] h-[22px] rounded-full border-system flex items-center justify-center transition-transform duration-200"
                     style={{ transform: faqOpen === i ? "rotate(45deg)" : "none" }}>
                  <span className="text-sm text-muted leading-none -mt-px">+</span>
                </div>
              </button>
              {faqOpen === i && (
                <p className="text-sm text-muted leading-[1.7] pb-5">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER  (gradient background, no card)
      ══════════════════════════════════════════ */}
      <footer className="relative overflow-hidden"
              style={{ background: "radial-gradient(ellipse 120% 90% at 50% 10%, #3b1f8a 0%, #6b3500 45%, #080810 75%)" }}>

        {/* CTA */}
        <div className="max-w-[1100px] mx-auto px-9 pt-20 pb-16 text-center">
          <h2 className="heading-cta mb-[10px]">Your documents deserve better than Ctrl+F.</h2>
          <p className="text-[15px] mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
            Try Paperwise free for 14 days. No credit card required.
          </p>
          <div className="flex items-center justify-center gap-3">
            <a href="#how-it-works" className="btn-secondary">
              <span className="w-5 h-5 rounded-full border border-black/25 flex items-center justify-center shrink-0">
                <Play size={8} strokeWidth={3} className="ml-px" />
              </span>
              See How It Works
            </a>
            <Link href="/signup" className="btn-primary">
              Get started
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-system" />

        {/* Footer links */}
        <div className="max-w-[1100px] mx-auto px-9 pt-10 pb-6">
          <div className="flex justify-between items-start mb-10">
            <div className="max-w-[280px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[13px] font-extrabold"
                     style={{ background: T.grad }}>P</div>
                <span className="text-sm font-bold">Paperwise</span>
              </div>
              <p className="text-[13px] text-muted leading-[1.7]">
                Upload any document. Ask anything. Get cited answers instantly.
              </p>
            </div>
            <nav className="flex gap-7 pt-1">
              {[
                { label: "Features",     href: "#features" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "Pricing",      href: "#pricing" },
                { label: "FAQ",          href: "#faq" },
              ].map(l=>(
                <a key={l.label} href={l.href} className="text-[13px] text-muted">{l.label}</a>
              ))}
            </nav>
          </div>

          <div className="border-t-system pt-6 flex items-center justify-between">
            <span className="text-xs text-faint">© 2026 Paperwise. All rights reserved.</span>
            <div className="flex gap-3">
              {[
                { label:"X",  path:"M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                { label:"in", path:"M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" },
                { label:"gh", path:"M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" },
                { label:"ph", path:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4-4h-2v-4h2v4z" },
              ].map((s)=>(
                <a key={s.label} href="#" className="w-[30px] h-[30px] rounded-full border-system flex items-center justify-center">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                    <path d={s.path} fill={["X","in","gh"].includes(s.label) ? "none" : "currentColor"} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
