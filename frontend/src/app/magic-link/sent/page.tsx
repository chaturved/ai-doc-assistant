"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { sendMagicLink } from "@/lib/api/auth";
import { useState } from "react";
import { toast } from "sonner";
import { AuthBackground } from "@/components/auth/AuthBackground";


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
    <div className="relative min-h-screen flex items-center justify-center px-6 py-12 bg-bg overflow-hidden">
      <AuthBackground />
      <div className="relative z-10 w-full max-w-[420px] card-lg shadow-[0_8px_40px_rgba(0,0,0,0.45)] p-8 sm:p-10 text-center">
        <span className="text-[15px] font-bold mb-10 block">Paperwise</span>

        <div className="w-14 h-14 rounded-full border-system flex items-center justify-center mx-auto mb-5 bg-violet-800/[0.12]">
          <Mail className="h-6 w-6 text-violet-400" />
        </div>

        <h2 className="text-2xl font-bold mb-2">Check your email</h2>

        {email && (
          <p className="text-sm text-muted mb-1">
            We sent a sign-in link to <span className="text-white font-medium">{email}</span>
          </p>
        )}

        <p className="text-sm text-faint mb-8">
          Click the link in that email to sign in. The link expires in 15 minutes.
        </p>

        <button
          onClick={handleResend}
          disabled={resending || !email}
          className="text-sm text-muted hover:text-white disabled:opacity-50 transition mb-6 block mx-auto"
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
