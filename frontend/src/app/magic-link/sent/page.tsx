"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { sendMagicLink } from "@/lib/paperwise-api";
import { useState } from "react";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6">
      <div className="w-full max-w-[380px] text-center">
        <div className="h-14 w-14 rounded-full bg-indigo-500/10 ring-1 ring-indigo-500/20 flex items-center justify-center mx-auto mb-5">
          <Mail className="h-7 w-7 text-indigo-400" />
        </div>

        <h2 className="text-2xl font-semibold text-zinc-100 mb-2">Check your email</h2>

        {email && (
          <p className="text-sm text-zinc-500 mb-1">
            We sent a sign-in link to <span className="text-zinc-300">{email}</span>
          </p>
        )}

        <p className="text-sm text-zinc-600 mb-8">
          Click the link in that email to sign in. The link expires in 15 minutes.
        </p>

        <button
          onClick={handleResend}
          disabled={resending || !email}
          className="text-sm text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition mb-6 block mx-auto"
        >
          {resending ? "Sending…" : "Didn't get it? Resend"}
        </button>

        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-400 transition">
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
