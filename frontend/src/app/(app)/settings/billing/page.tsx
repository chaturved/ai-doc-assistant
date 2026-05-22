"use client";

import { useEffect, useState } from "react";
import { getUsage } from "@/lib/api/users";
import { useAuth } from "@/context/AuthContext";
import type { Usage } from "@/types";

function UsageBar({ used, limit, label }: { used: number; limit: number | null; label: string }) {
  if (limit === null) return null;
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const barColor = pct > 85 ? "#ef4444" : "#f59e0b";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/40">{label}</span>
        <span className="text-white/25">{used} of {limit}</span>
      </div>
      <div className="h-[5px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
      </div>
    </div>
  );
}

function formatStorage(bytes: number, limitBytes: number | null): string {
  if (limitBytes === null) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} of ${(limitBytes / (1024 * 1024)).toFixed(0)} MB`;
}

const PRO_FEATURES = [
  "Unlimited documents",
  "Unlimited queries",
  "50 MB per file",
  "DOCX support",
  "Conversation history forever",
  "Priority support",
];

const FREE_FEATURES = [
  "5 documents",
  "20 queries / day",
  "10 MB storage",
  "PDF support",
];

export default function BillingPage() {
  const { user } = useAuth();
  const [usage, setUsage] = useState<Usage | null>(null);

  useEffect(() => {
    getUsage().then(setUsage).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-[22px] font-bold text-white mb-8">Plan & Billing</h1>

      {/* Usage */}
      {usage && (
        <div className="mb-10">
          <p className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.08em] mb-4">Usage this month</p>
          <div className="space-y-4">
            <UsageBar used={usage.documents.used} limit={usage.documents.limit} label="Documents" />
            <UsageBar used={usage.queries_today.used} limit={usage.queries_today.limit} label="Queries today" />
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40">Storage</span>
                <span className="text-white/25">{formatStorage(usage.storage_bytes.used, usage.storage_bytes.limit)}</span>
              </div>
              {usage.storage_bytes.limit && (
                <div className="h-[5px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (usage.storage_bytes.used / usage.storage_bytes.limit) * 100)}%`,
                      background: (usage.storage_bytes.used / usage.storage_bytes.limit) > 0.85 ? "#ef4444" : "#f59e0b",
                    }} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Plan comparison */}
      <p className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.08em] mb-4">Plans</p>
      <div className="flex gap-4">

        {/* Free plan */}
        <div
          className="flex-1 rounded-[14px] p-5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: user?.plan === "free" ? "1px solid rgba(245,158,11,0.4)" : "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-bold text-white">Free</span>
            {user?.plan === "free" && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>
                Current
              </span>
            )}
          </div>
          <p className="text-[22px] font-bold text-white mb-4">$0<span className="text-[13px] font-normal text-white/30">/mo</span></p>
          <ul className="space-y-2">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-[13px] text-white/50">
                <span className="text-white/25">✓</span> {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro plan */}
        <div
          className="flex-1 rounded-[14px] p-5"
          style={{
            background: "rgba(245,158,11,0.06)",
            border: "1px solid rgba(245,158,11,0.25)",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-bold text-white">Pro</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>
              Coming soon
            </span>
          </div>
          <p className="text-[22px] font-bold text-white mb-4">$12<span className="text-[13px] font-normal text-white/30">/mo</span></p>
          <ul className="space-y-2 mb-5">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-[13px] text-white/70">
                <span className="text-emerald-400">✓</span> {f}
              </li>
            ))}
          </ul>
          <button
            disabled
            className="w-full py-2.5 rounded-[10px] text-[13px] font-bold text-white/30 cursor-not-allowed"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Coming Soon
          </button>
        </div>

      </div>
    </div>
  );
}
