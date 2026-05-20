"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg text-white flex items-center justify-center px-6 text-center">
      <div className="animate-fu">
        <div className="h-10 w-10 rounded-btn-md logo-grad flex items-center justify-center mx-auto mb-6">
          <span className="text-black text-base font-bold">P</span>
        </div>
        <h1 className="text-[96px] font-black leading-none tracking-[-0.04em] bg-gradient-to-br from-white/20 to-white/5 bg-clip-text text-transparent mb-4">500</h1>
        <p className="text-muted text-[15px] mb-8 leading-relaxed">
          Something went wrong on our end.<br />We&apos;ve been notified and are looking into it.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="btn-secondary">← Go home</Link>
          <button onClick={reset} className="btn-primary">Try again</button>
        </div>
      </div>
    </div>
  );
}
