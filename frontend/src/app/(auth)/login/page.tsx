"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, FileText, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { login, sendMagicLink } from "@/lib/paperwise-api";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

const floatingDocs = [
  { title: "Q3 Financial Report", type: "PDF", rot: "-6deg", pos: "top-[12%] left-[8%]", color: "from-indigo-500/20 to-indigo-500/5", border: "border-indigo-500/20", delay: "0s" },
  { title: "Legal Contract", type: "DOCX", rot: "5deg", pos: "top-[30%] right-[8%]", color: "from-violet-500/20 to-violet-500/5", border: "border-violet-500/20", delay: "1.2s" },
  { title: "Product Roadmap", type: "PDF", rot: "4deg", pos: "bottom-[28%] left-[10%]", color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/20", delay: "0.6s" },
  { title: "Onboarding Guide", type: "MD", rot: "-4deg", pos: "bottom-[14%] right-[10%]", color: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/20", delay: "1.8s" },
];

export default function LoginPage() {
  const router = useRouter();
  const { refetchUser } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [magicEmail, setMagicEmail] = useState("");
  const [magicLoading, setMagicLoading] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      await refetchUser();
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      toast.error(msg || "Incorrect email or password");
    }
  };

  const handleMagicLink = async () => {
    const email = magicEmail || getValues("email");
    if (!email) { toast.error("Enter your email first"); return; }
    setMagicLoading(true);
    try {
      await sendMagicLink(email);
      router.push("/magic-link/sent?email=" + encodeURIComponent(email));
    } catch {
      toast.error("Failed to send magic link");
    } finally {
      setMagicLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex">
      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0px) rotate(var(--rot)); }
          50% { transform: translateY(-12px) rotate(var(--rot)); }
        }
        .doc-float { animation: float 6s ease-in-out infinite; }
      `}</style>

      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-[480px] flex-shrink-0 relative bg-gradient-to-br from-[#0d0d14] to-[#09090b] border-r border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-transparent to-violet-950/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-3xl" />

        {/* Floating doc cards */}
        {floatingDocs.map((doc) => (
          <div
            key={doc.title}
            className={`doc-float absolute ${doc.pos} w-[180px]`}
            style={{ "--rot": doc.rot, animationDelay: doc.delay } as React.CSSProperties}
          >
            <div className={`rounded-xl bg-gradient-to-br ${doc.color} border ${doc.border} backdrop-blur-sm p-3`}>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-3.5 w-3.5 text-zinc-400" />
                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{doc.type}</span>
              </div>
              <p className="text-xs font-medium text-zinc-300">{doc.title}</p>
            </div>
          </div>
        ))}

        {/* Center content */}
        <div className="relative flex-1 flex flex-col items-center justify-center px-12 text-center">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-5">
            <span className="text-white text-lg font-bold">P</span>
          </div>
          <h1 className="text-2xl font-semibold text-zinc-100 mb-3">Paperwise</h1>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-[260px]">
            Chat with your documents. Get cited answers instantly.
          </p>
          <div className="mt-10 rounded-2xl bg-zinc-900/50 ring-1 ring-white/[0.07] p-5 max-w-[280px] text-left">
            <p className="text-sm text-zinc-300 leading-relaxed italic">
              &ldquo;Paperwise cut my research time in half.&rdquo;
            </p>
            <p className="mt-3 text-xs text-zinc-600">— Sarah K., PhD Student</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span className="text-base font-semibold text-zinc-100">Paperwise</span>
          </div>

          <h2 className="text-2xl font-semibold text-zinc-100 mb-1">Sign in</h2>
          <p className="text-sm text-zinc-500 mb-8">Welcome back to Paperwise.</p>

          {/* Google OAuth */}
          <a
            href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/auth/google`}
            className="flex items-center justify-center gap-3 w-full h-11 rounded-xl bg-zinc-900/80 ring-1 ring-white/10 text-sm text-zinc-200 hover:ring-white/20 hover:bg-zinc-900 transition-all mb-5"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-zinc-700">or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full h-11 rounded-xl bg-zinc-900/60 ring-1 ring-white/[0.08] pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-700 outline-none focus:ring-indigo-500/40 transition"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-zinc-400">Password</label>
                <Link href="/forgot-password" className="text-xs text-zinc-600 hover:text-zinc-400 transition">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <input
                  {...register("password")}
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full h-11 rounded-xl bg-zinc-900/60 ring-1 ring-white/[0.08] pl-10 pr-10 text-sm text-zinc-200 placeholder:text-zinc-700 outline-none focus:ring-indigo-500/40 transition"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-sm font-medium text-white flex items-center justify-center gap-2 transition"
            >
              {isSubmitting ? <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-zinc-700">or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Magic link */}
          <div className="flex gap-2">
            <input
              type="email"
              value={magicEmail}
              onChange={(e) => setMagicEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 h-10 rounded-xl bg-zinc-900/60 ring-1 ring-white/[0.08] px-3 text-sm text-zinc-200 placeholder:text-zinc-700 outline-none focus:ring-indigo-500/40 transition"
            />
            <button
              onClick={handleMagicLink}
              disabled={magicLoading}
              className="h-10 px-4 rounded-xl bg-zinc-800 ring-1 ring-white/10 text-sm text-zinc-300 hover:ring-white/20 disabled:opacity-50 transition whitespace-nowrap"
            >
              {magicLoading ? "Sending…" : "Send magic link"}
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-zinc-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-zinc-300 hover:text-white transition">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
