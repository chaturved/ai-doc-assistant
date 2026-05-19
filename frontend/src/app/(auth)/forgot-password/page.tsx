"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { forgotPassword } from "@/lib/paperwise-api";

const schema = z.object({ email: z.string().email("Enter a valid email address") });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await forgotPassword(data.email);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6">
      <div className="w-full max-w-[380px]">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">P</span>
          </div>
          <span className="text-base font-semibold text-zinc-100">Paperwise</span>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-100 mb-2">Check your inbox</h2>
            <p className="text-sm text-zinc-500 mb-6">
              If an account exists for that email, you&apos;ll receive a reset link shortly.
            </p>
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition">
              <ArrowLeft className="h-4 w-4" /> Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-zinc-100 mb-1">Reset your password</h2>
            <p className="text-sm text-zinc-500 mb-8">Enter your email and we&apos;ll send you a reset link.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                  <input {...register("email")} type="email" placeholder="you@example.com" className="w-full h-11 rounded-xl bg-zinc-900/60 ring-1 ring-white/[0.08] pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-700 outline-none focus:ring-indigo-500/40 transition" />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-sm font-medium text-white flex items-center justify-center gap-2 transition">
                {isSubmitting ? <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <>Send reset link <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-400 transition">
                <ArrowLeft className="h-4 w-4" /> Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
