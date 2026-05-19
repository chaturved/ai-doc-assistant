"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6 text-center">
      <div>
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-base font-bold">P</span>
        </div>
        <h1 className="text-6xl font-bold text-zinc-800 mb-3">500</h1>
        <p className="text-sm text-zinc-500 mb-8">
          Something went wrong on our end.<br />We&apos;ve been notified and are looking into it.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-zinc-900 ring-1 ring-white/10 text-sm text-zinc-300 hover:ring-white/20 transition">
            ← Go home
          </Link>
          <button
            onClick={reset}
            className="h-10 px-5 rounded-xl bg-indigo-600/80 ring-1 ring-indigo-500/40 text-sm text-white hover:bg-indigo-600 transition"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
