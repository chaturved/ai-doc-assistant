"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { getUsage } from "@/lib/api/users";
import { useAuth } from "@/context/AuthContext";
import type { Usage } from "@/types";

function UsageBar({ used, limit, label }: { used: number; limit: number | null; label: string }) {
  if (limit === null) return null;
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const barColor = pct > 85 ? "bg-red-500" : "bg-accent";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-ink/65">{label}</span>
        <span className="text-ink/50">{used} of {limit}</span>
      </div>
      <div className="h-[5px] rounded-full overflow-hidden bg-ink/[0.06]">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StorageBar({ used, limit }: { used: number; limit: number | null }) {
  const usedMB = (used / (1024 * 1024)).toFixed(1);
  const limitMB = limit ? (limit / (1024 * 1024)).toFixed(0) : null;
  const pct = limit ? Math.min(100, (used / limit) * 100) : 0;
  const barColor = limit && (used / limit) > 0.85 ? "bg-red-500" : "bg-accent";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-ink/65">Storage</span>
        <span className="text-ink/50">{usedMB}{limitMB ? ` of ${limitMB} MB` : " MB"}</span>
      </div>
      {limit && (
        <div className="h-[5px] rounded-full overflow-hidden bg-ink/[0.06]">
          <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
}

const FREE_FEATURES = [
  "Up to 5 documents",
  "20 queries / day",
  "10 MB per file",
  "PDF, TXT, and Markdown files",
  "7 days of conversation history",
];

const PRO_FEATURES = [
  "Unlimited documents",
  "Unlimited queries",
  "50 MB per file",
  "PDF, DOCX, TXT, and Markdown files",
  "Full conversation history",
];

export default function BillingPage() {
  const { user } = useAuth();
  const [usage, setUsage] = useState<Usage | null>(null);

  useEffect(() => {
    getUsage().then(setUsage).catch(() => {});
  }, []);

  const isFree = user?.plan === "free";

  return (
    <div>
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent">Your account</p>
        <h1 className="font-display text-[32px] font-medium tracking-[-0.03em] text-ink">Plan &amp; billing</h1>
        <p className="mt-2 text-sm leading-6 text-ink/60">See your usage and what each plan includes.</p>
      </div>

      {usage && (
        <div className="mb-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-ink/50">Current usage</p>
          <div className="space-y-4">
            <UsageBar used={usage.documents.used} limit={usage.documents.limit} label="Documents" />
            <UsageBar used={usage.queries_today.used} limit={usage.queries_today.limit} label="Queries today" />
            <StorageBar used={usage.storage_bytes.used} limit={usage.storage_bytes.limit} />
          </div>
        </div>
      )}

      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-ink/50">Plans</p>
      <div className="grid gap-4">

        <div className="rounded-md border border-ink/10 bg-ink/[0.04] p-6 dark:bg-white/[0.06]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-display text-xl font-medium">Free</span>
              {isFree && <span className="badge-accent">Current</span>}
            </div>
            <div className="mb-2">
              <span className="font-display text-[32px] font-medium">$0</span>
              <span className="ml-1 text-sm text-muted">forever</span>
            </div>
            <p className="mb-4 text-sm leading-6 text-ink/60">A useful place to begin, with no payment required.</p>
            <div className="divider mb-3" />
            <p className="text-[11px] font-bold text-faint uppercase tracking-[0.08em] mb-2">Features</p>
            {FREE_FEATURES.map((f) => (
              <div key={f} className="mb-2 flex items-center gap-2">
                <Check size={15} className="shrink-0 text-accent" />
                <span className="text-[13px] text-ink/70">{f}</span>
              </div>
            ))}
          </div>

        <div className="rounded-md bg-gradient-to-br from-[#f59e0b] via-[#f9bc59] to-[#ffedc2] p-6 text-[#241a0f]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-display text-xl font-medium">Pro</span>
              <span className="rounded-full border border-[#38210b]/25 px-3 py-1 text-xs font-medium">Coming soon</span>
            </div>
            <p className="mb-4 text-sm leading-6 text-[#38210b]/75">More room for the documents and questions you work with every day. Pricing will be shared before launch.</p>
            <div className="mb-3 h-px bg-[#38210b]/20" />
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#38210b]/65">Everything in Free plus</p>
            {PRO_FEATURES.map((f) => (
              <div key={f} className="mb-2 flex items-center gap-2">
                <Check size={15} className="shrink-0" />
                <span className="text-[13px] text-[#38210b]/85">{f}</span>
              </div>
            ))}
            <Link href="/pricing" className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#241a0f] px-5 text-sm font-medium text-white transition hover:opacity-80">
              See Pro details <ArrowUpRight size={16} />
            </Link>
          </div>
      </div>
    </div>
  );
}
