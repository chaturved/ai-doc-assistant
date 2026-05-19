"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, ChevronRight, CheckCircle2 } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

/* ─────────────────────────────────────────────────────────
   T: values only needed in JSX (SVG colors, unique gradients)
   Everything else lives in globals.css design tokens.
───────────────────────────────────────────────────────── */
const T = {
primary: "#ffffff",
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
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <div className="bg-bg text-white overflow-x-hidden min-h-screen">

      <SiteNav showLogin={false} />

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="h-svh overflow-hidden relative flex flex-col items-center">

        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none bg-hero-gradient" />
        <div className="absolute inset-0 pointer-events-none bg-vignette" />

        {/* Headline */}
        <div className="animate-fu text-center px-6 relative z-10 w-full max-w-[1080px] pt-hero">
          <h1 className="heading-hero">
            Chat with your documents.<br />Instantly.
          </h1>
          <p className="animate-fu-1 mt-[18px] text-muted max-w-[520px] mx-auto leading-[1.65] text-hero-sub">
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
        <div className="animate-fu-3 w-full max-w-[1160px] px-[18px] relative z-10 grid gap-[10px] mt-[clamp(16px,2.5vh,38px)] grid-cols-[5fr_2.8fr_4.2fr]">

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
                    {[["f1","#ffffff","#f59e0b"],["f2","#f59e0b","#f97316"],["f3","#e2e8f0","#f59e0b"],["f4","#ffffff","#ef4444"],["f5","#f59e0b","#ef4444"]].map(([id,s,e])=>(
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
            <CardHeader title="Document Pipeline" dot="rgba(255,255,255,0.35)" />
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
                    <stop offset="0%" stopColor={T.primary} /><stop offset="50%" stopColor="#f59e0b" /><stop offset="100%" stopColor={T.accent} />
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
        <div className="absolute bottom-0 inset-x-0 h-[100px] pointer-events-none z-20 bg-hero-fade" />
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
                        <stop offset="0%" stopColor={T.primary} /><stop offset="45%" stopColor="#f59e0b" /><stop offset="100%" stopColor={T.accent} />
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
              <CardHeader title="Query Volume" dot="rgba(255,255,255,0.35)" />
              <div className="p-[16px_20px]">
                <div className="text-[32px] font-black text-[#34d399] leading-none">+34%</div>
                <div className="text-xs text-muted mt-1 mb-[14px]">Over the last 7 days</div>
                <div className="flex items-end gap-1 h-16">
                  {[
                    {h:30,c:"#334155"},{h:48,c:"#334155"},{h:22,c:"#334155"},{h:55,c:"#334155"},{h:38,c:"#334155"},
                    {h:70,c:T.primary},{h:52,c:T.primary},{h:88,c:T.primary},{h:60,c:"rgba(255,255,255,0.35)"},{h:42,c:"rgba(255,255,255,0.35)"},
                    {h:76,c:T.primary},{h:95,c:T.primary},{h:65,c:T.primary},{h:82,c:"rgba(255,255,255,0.35)"},
                  ].map((b,i)=>(
                    <div key={i} className="flex-1 rounded-t-[2px] opacity-85" style={{ height:`${b.h}%`, background:b.c }} />
                  ))}
                </div>
                <div className="flex justify-between mt-[5px]">
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(v=><span key={v} className="text-[7px] text-faint">{v}</span>)}
                </div>
                <div className="flex gap-[14px] mt-2">
                  {[{c:T.primary,l:"This week"},{c:"rgba(255,255,255,0.35)",l:"Last week"}].map(({c,l})=>(
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
                        <stop offset="0%" stopColor={T.primary} /><stop offset="45%" stopColor="#f97316" /><stop offset="100%" stopColor={T.accent} />
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
                    {seg(310, 345, 128, 28, "#f59e0b", "o6", "Tagged")}
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
                  <div className="text-stat font-black tracking-[-0.04em] bg-gradient-to-br from-white/90 to-accent bg-clip-text text-transparent">{s.val}</div>
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
            <div className="relative card shadow-[0_8px_40px_rgba(0,0,0,0.45)] border-amber-500/35">
              <div className="absolute top-0 inset-x-0 h-px bg-shimmer-bar" />
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
                <div className={`shrink-0 ml-4 w-[22px] h-[22px] rounded-full border-system flex items-center justify-center transition-transform duration-200 ${faqOpen === i ? "rotate-45" : ""}`}>
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
      <SiteFooter
        showSocial
        cta={
          <>
            <h2 className="heading-cta mb-[10px]">Your documents deserve better than Ctrl+F.</h2>
            <p className="text-[15px] mb-8 text-white/55">Try Paperwise free for 14 days. No credit card required.</p>
            <div className="flex items-center justify-center gap-3">
              <a href="#how-it-works" className="btn-secondary">
                <span className="w-5 h-5 rounded-full border border-black/25 flex items-center justify-center shrink-0">
                  <Play size={8} strokeWidth={3} className="ml-px" />
                </span>
                See How It Works
              </a>
              <Link href="/signup" className="btn-primary">Get started</Link>
            </div>
          </>
        }
      />
    </div>
  );
}
