"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { resetPassword } from "@/lib/paperwise-api";

const schema = z.object({
  new_password: z.string().min(8, "Password must be at least 8 characters"),
  confirm: z.string(),
}).refine((d) => d.new_password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });
type FormData = z.infer<typeof schema>;

function ResetPasswordContent() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (!token) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Invalid or missing reset token.</p>
          <Link href="/forgot-password" className="text-indigo-400 hover:text-indigo-300 text-sm">Request a new link</Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: FormData) => {
    try {
      await resetPassword(token, data.new_password);
      toast.success("Password updated. Please sign in.");
      router.push("/login");
    } catch {
      toast.error("Invalid or expired reset link.");
    }
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

        <h2 className="text-2xl font-semibold text-zinc-100 mb-1">Set a new password</h2>
        <p className="text-sm text-zinc-500 mb-8">Choose a strong password for your account.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {(["new_password", "confirm"] as const).map((field, i) => (
            <div key={field}>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                {i === 0 ? "New password" : "Confirm password"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <input
                  {...register(field)}
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full h-11 rounded-xl bg-zinc-900/60 ring-1 ring-white/[0.08] pl-10 pr-10 text-sm text-zinc-200 placeholder:text-zinc-700 outline-none focus:ring-indigo-500/40 transition"
                />
                {i === 0 && (
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                )}
              </div>
              {errors[field] && <p className="mt-1 text-xs text-red-400">{errors[field]?.message}</p>}
            </div>
          ))}

          <button type="submit" disabled={isSubmitting} className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-sm font-medium text-white flex items-center justify-center gap-2 transition">
            {isSubmitting ? <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <>Update password <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
