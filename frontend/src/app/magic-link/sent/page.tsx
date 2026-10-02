"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { sendMagicLink } from "@/lib/api/auth";
import { useState } from "react";
import { toast } from "sonner";
import { AuthBackground } from "@/components/auth/auth-background";


function MagicLinkSentContent() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      await sendMagicLink(email);
      toast.success("Link resent!");
    } catch {
      toast.error("Failed to resend");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-bg px-5 py-12 xl:pl-[45%]">
      <AuthBackground />
      <div className="relative z-10 w-full max-w-[440px] rounded-lg border border-ink/10 bg-bg p-7 text-center shadow-[0_24px_70px_-55px_rgba(71,42,13,0.25)] sm:p-10">
        <Link href="/" className="mb-10 block font-display text-xl font-medium tracking-[-0.05em]">paperwise<span className="text-accent">.</span></Link>

        <div className="w-14 h-14 rounded-full border-system flex items-center justify-center mx-auto mb-5 bg-accent/10">
          <Mail className="h-6 w-6 text-accent" />
        </div>

        <h2 className="mb-2 font-display text-[30px] font-medium tracking-[-0.03em]">Check your email</h2>

        {email && (
          <p className="text-sm text-muted mb-1">
            We sent a sign-in link to <span className="text-ink font-medium">{email}</span>
          </p>
        )}

        <p className="text-sm text-faint mb-8">
          Click the link in that email to sign in. The link expires in 15 minutes.
        </p>

        <button
          onClick={handleResend}
          disabled={resending || !email}
          className="text-sm text-muted hover:text-ink disabled:opacity-50 transition mb-6 block mx-auto"
        >
          {resending ? "Sending…" : "Didn't get it? Resend"}
        </button>

        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-faint hover:text-muted transition">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default function MagicLinkSentPage() {
  return (
    <Suspense>
      <MagicLinkSentContent />
    </Suspense>
  );
}
