"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
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
        <span className="text-white/40">{label}</span>
        <span className="text-white/25">{used} of {limit}</span>
      </div>
      <div className="h-[5px] rounded-full overflow-hidden bg-white/[0.06]">
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
        <span className="text-white/40">Storage</span>
        <span className="text-white/25">{usedMB}{limitMB ? ` of ${limitMB} MB` : " MB"}</span>
      </div>
      {limit && (
        <div className="h-[5px] rounded-full overflow-hidden bg-white/[0.06]">
          <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
}

const FREE_FEATURES = [
  "Up to 5 documents",
  "20 queries / day",
  "10 MB storage",
  "PDF support",
  "Email support",
];

const PRO_FEATURES = [
  "Unlimited documents",
  "Unlimited queries",
  "50 MB per file",
  "PDF & DOCX support",
  "Conversation history forever",
  "Priority support",
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
      <h1 className="text-[22px] font-bold text-white mb-8">Plan & Billing</h1>

      {usage && (
        <div className="mb-10">
          <p className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.08em] mb-4">Usage this month</p>
          <div className="space-y-4">
            <UsageBar used={usage.documents.used} limit={usage.documents.limit} label="Documents" />
            <UsageBar used={usage.queries_today.used} limit={usage.queries_today.limit} label="Queries today" />
            <StorageBar used={usage.storage_bytes.used} limit={usage.storage_bytes.limit} />
          </div>
        </div>
      )}

      <p className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.08em] mb-4">Plans</p>
      <div className="grid grid-cols-2 gap-4">

        {/* Free / Free */}
        <div className="card shadow-[0_8px_40px_rgba(0,0,0,0.45)]">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-muted">Free</span>
              {isFree && <span className="badge-accent">Current</span>}
            </div>
            <div className="mb-2">
              <span className="text-[20px] font-black">$0</span>
              <span className="text-sm text-muted"> per month</span>
            </div>
            <p className="text-[12px] text-muted leading-[1.5] mb-3">For individuals getting started with AI document chat.</p>
            <div className="divider mb-3" />
            <p className="text-[11px] font-bold text-faint uppercase tracking-[0.08em] mb-2">Features</p>
            {FREE_FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-2 mb-1.5">
                <CheckCircle2 size={12} color="rgba(255,255,255,0.3)" />
                <span className="text-[12px] text-muted">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pro / Pro */}
        <div className="relative card shadow-[0_8px_40px_rgba(0,0,0,0.45)] border-amber-500/35">
          <div className="absolute top-0 inset-x-0 h-px bg-shimmer-bar" />
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-muted">Pro</span>
              <span className="text-[11px] font-bold bg-accent/20 text-accent rounded-full px-[10px] py-[3px]">Coming soon</span>
            </div>
            <div className="mb-2">
              <span className="text-[20px] font-black">$12</span>
              <span className="text-sm text-muted"> per month</span>
            </div>
            <p className="text-[12px] text-muted leading-[1.5] mb-3">For power users who need more documents and queries.</p>
            <div className="divider mb-3" />
            <p className="text-[11px] font-bold text-faint uppercase tracking-[0.08em] mb-2">Everything in Free plus...</p>
            {PRO_FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-2 mb-1.5">
                <CheckCircle2 size={12} color="#f59e0b" />
                <span className="text-[12px] text-white/75">{f}</span>
              </div>
            ))}
            <button
              disabled
              className="btn-primary w-full mt-6 opacity-40 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
