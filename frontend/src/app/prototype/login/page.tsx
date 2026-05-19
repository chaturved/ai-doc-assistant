"use client";

import { useState } from "react";
import { Mail, Lock, ArrowRight, Eye, EyeOff, FileText, Sparkles } from "lucide-react";

const floatingDocs = [
  {
    title: "Q3 Financial Report",
    type: "PDF",
    pages: "24 pages",
    color: "from-indigo-500/20 to-indigo-500/5",
    border: "border-indigo-500/20",
    style: { top: "12%", left: "8%", rotate: "-6deg" },
    animClass: "animate-float-a",
  },
  {
    title: "Legal Contract",
    type: "DOCX",
    pages: "18 pages",
    color: "from-violet-500/20 to-violet-500/5",
    border: "border-violet-500/20",
    style: { top: "28%", right: "6%", rotate: "5deg" },
    animClass: "animate-float-b",
  },
  {
    title: "Product Roadmap",
    type: "PDF",
    pages: "12 pages",
    color: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/20",
    style: { bottom: "28%", left: "12%", rotate: "4deg" },
    animClass: "animate-float-c",
  },
  {
    title: "Onboarding Guide",
    type: "MD",
    pages: "8 pages",
    color: "from-amber-500/20 to-amber-500/5",
    border: "border-amber-500/20",
    style: { bottom: "15%", right: "10%", rotate: "-4deg" },
    animClass: "animate-float-a",
  },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090b] flex">
      <style>{`
        @keyframes float-a {
          0%, 100% { transform: translateY(0px) rotate(var(--rot, 0deg)); }
          50% { transform: translateY(-14px) rotate(var(--rot, 0deg)); }
        }
        @keyframes float-b {
          0%, 100% { transform: translateY(0px) rotate(var(--rot, 0deg)); }
          50% { transform: translateY(-10px) rotate(var(--rot, 0deg)); }
        }
        @keyframes float-c {
          0%, 100% { transform: translateY(0px) rotate(var(--rot, 0deg)); }
          50% { transform: translateY(-16px) rotate(var(--rot, 0deg)); }
        }
        .animate-float-a { animation: float-a 7s ease-in-out infinite; }
        .animate-float-b { animation: float-b 5.5s ease-in-out infinite 1s; }
        .animate-float-c { animation: float-c 6.5s ease-in-out infinite 2s; }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fade-in 0.6s ease-out forwards; }
        .fade-in-1 { animation: fade-in 0.6s ease-out 0.1s both; }
        .fade-in-2 { animation: fade-in 0.6s ease-out 0.2s both; }
        .fade-in-3 { animation: fade-in 0.6s ease-out 0.3s both; }
        .fade-in-4 { animation: fade-in 0.6s ease-out 0.4s both; }
        .fade-in-5 { animation: fade-in 0.6s ease-out 0.5s both; }
        .input-focus:focus {
          outline: none;
          box-shadow: 0 0 0 1px rgba(99,102,241,0.5), 0 0 16px rgba(99,102,241,0.1);
          border-color: rgba(99,102,241,0.5);
        }
        .gradient-orb-1 {
          background: radial-gradient(circle, rgba(79,70,229,0.5) 0%, transparent 70%);
          animation: float-a 12s ease-in-out infinite;
        }
        .gradient-orb-2 {
          background: radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%);
          animation: float-b 15s ease-in-out infinite 3s;
        }
        .gradient-orb-3 {
          background: radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%);
          animation: float-c 10s ease-in-out infinite 6s;
        }
      `}</style>

      {/* Left panel — visual / marketing */}
      <div className="hidden lg:flex w-[54%] relative bg-[#080810] overflow-hidden flex-col">
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="gradient-orb-1 absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full blur-[80px] opacity-60" />
          <div className="gradient-orb-2 absolute bottom-[-5%] right-[-5%] h-[400px] w-[400px] rounded-full blur-[80px]" />
          <div className="gradient-orb-3 absolute top-[40%] left-[40%] h-[300px] w-[300px] rounded-full blur-[60px]" />
        </div>

        {/* Subtle grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Floating document cards */}
        {floatingDocs.map((doc, i) => (
          <div
            key={i}
            className={`absolute ${doc.animClass} pointer-events-none`}
            style={doc.style as React.CSSProperties}
          >
            <div className={`w-44 rounded-xl bg-gradient-to-b ${doc.color} border ${doc.border} backdrop-blur-sm p-3.5 shadow-2xl`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-lg bg-zinc-900/60 flex items-center justify-center">
                  <FileText className="h-3.5 w-3.5 text-zinc-400" />
                </div>
                <div>
                  <div className="text-[11px] font-medium text-zinc-200 leading-tight">{doc.title}</div>
                  <div className="text-[9px] text-zinc-500">{doc.type} · {doc.pages}</div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 rounded-full bg-white/10 w-full" />
                <div className="h-1.5 rounded-full bg-white/10 w-4/5" />
                <div className="h-1.5 rounded-full bg-white/10 w-3/5" />
              </div>
            </div>
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-12 py-10">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span className="text-base font-semibold tracking-tight text-zinc-100">Paperwise</span>
          </div>

          {/* Center content */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="mb-6 h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 ring-1 ring-indigo-500/20 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100 mb-3">
              Chat with your
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #818cf8, #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                documents.
              </span>
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              Upload any file and ask questions in plain English. Get cited answers instantly.
            </p>
          </div>

          {/* Testimonial */}
          <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/8 p-5">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-amber-400 text-xs">★</span>
              ))}
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              &ldquo;Paperwise cut my research time in half. I can now extract insights from 50-page reports in minutes instead of hours.&rdquo;
            </p>
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">SK</span>
              </div>
              <div>
                <div className="text-xs font-medium text-zinc-300">Sarah K.</div>
                <div className="text-[11px] text-zinc-600">PhD Student, Stanford</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — auth form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="text-base font-semibold text-zinc-100">Paperwise</span>
        </div>

        <div className="w-full max-w-[380px]">
          {!magicSent ? (
            <>
              <div className="fade-in mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-50 mb-1.5">Sign in to Paperwise</h1>
                <p className="text-sm text-zinc-500">Welcome back — your documents are waiting.</p>
              </div>

              {/* Google OAuth */}
              <button className="fade-in-1 w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-white/10 hover:border-white/20 transition-all mb-5">
                <svg viewBox="0 0 24 24" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="fade-in-2 flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-xs text-zinc-600">or</span>
                <div className="flex-1 h-px bg-white/8" />
              </div>

              {/* Form */}
              <div className="fade-in-2 space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="input-focus w-full rounded-lg border border-white/10 bg-zinc-900/60 pl-9 pr-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-zinc-400">Password</label>
                    <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-focus w-full rounded-lg border border-white/10 bg-zinc-900/60 pl-9 pr-10 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button className="fade-in-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-sm font-semibold text-white hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/20 mb-5">
                Sign in <ArrowRight className="h-3.5 w-3.5" />
              </button>

              {/* Divider */}
              <div className="fade-in-4 flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-xs text-zinc-600">or</span>
                <div className="flex-1 h-px bg-white/8" />
              </div>

              {/* Magic link */}
              <button
                onClick={() => email && setMagicSent(true)}
                className="fade-in-4 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-sm font-medium text-zinc-400 hover:bg-white/8 hover:text-zinc-200 transition-all mb-8"
              >
                <Sparkles className="h-4 w-4 text-indigo-400" />
                Send me a magic link
              </button>

              <p className="fade-in-5 text-center text-sm text-zinc-600">
                Don&rsquo;t have an account?{" "}
                <a href="#" className="text-zinc-300 hover:text-zinc-100 transition-colors">
                  Sign up
                </a>
              </p>
            </>
          ) : (
            /* Magic link sent state */
            <div className="text-center fade-in">
              <div className="mx-auto mb-5 h-16 w-16 rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-500/20 flex items-center justify-center">
                <Mail className="h-7 w-7 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-zinc-100 mb-2">Check your email</h2>
              <p className="text-sm text-zinc-500 mb-1">
                We sent a sign-in link to
              </p>
              <p className="text-sm font-medium text-zinc-300 mb-6">{email}</p>
              <p className="text-xs text-zinc-600 mb-6">
                Click the link in that email to sign in.
                The link expires in <span className="text-zinc-400">15 minutes</span>.
              </p>
              <button
                onClick={() => setMagicSent(false)}
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
              >
                ← Back to sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
