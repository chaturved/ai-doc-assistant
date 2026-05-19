"use client";

import { useEffect, useState } from "react";
import { getUsage } from "@/lib/api/users";
import { useAuth } from "@/context/AuthContext";
import type { Usage } from "@/types";

const T = { primary: "#5b21b6", accent: "#f59e0b" };

function UsageBar({ used, limit, label }: { used: number; limit: number; label: string }) {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const barColor = pct > 85 ? "#ef4444" : T.primary;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted">{label}</span>
        <span className="text-faint">{used} of {limit}</span>
      </div>
      <div className="h-[5px] rounded-full bg-white/[0.06] overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
      </div>
    </div>
  );
}

function formatStorage(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function BillingPage() {
  useAuth();
  const [usage, setUsage] = useState<Usage | null>(null);

  useEffect(() => {
    getUsage().then(setUsage).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Plan & Billing</h1>

      <div className="card p-4 mb-6 max-w-sm">
        <p className="text-lg font-bold">Free</p>
        <p className="text-sm text-muted">$0 / month</p>
      </div>

      {usage && (
        <div className="space-y-4 max-w-sm mb-8">
          <p className="text-xs font-semibold text-muted uppercase tracking-[0.08em]">Usage this month</p>
          <UsageBar used={usage.documents.used} limit={usage.documents.limit} label="Documents" />
          <UsageBar used={usage.queries_today.used} limit={usage.queries_today.limit} label="Queries today" />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Storage</span>
              <span className="text-faint">
                {formatStorage(usage.storage_bytes.used)} of {formatStorage(usage.storage_bytes.limit)}
              </span>
            </div>
            <div className="h-[5px] rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full rounded-full transition-all"
                   style={{ width: `${Math.min(100, (usage.storage_bytes.used / usage.storage_bytes.limit) * 100)}%`, background: T.primary }} />
            </div>
          </div>
        </div>
      )}

      <div className="card p-5 max-w-sm" style={{ borderColor: `rgba(245,158,11,0.25)` }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded flex items-center justify-center text-[11px]"
               style={{ background: `rgba(245,158,11,0.15)`, color: T.accent }}>⚡</div>
          <p className="text-sm font-bold">Growth — $12/month</p>
          <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(245,158,11,0.12)", color: T.accent }}>Coming soon</span>
        </div>
        <ul className="space-y-2 text-[13px] text-muted mb-5">
          {["Unlimited documents", "Unlimited queries", "50 MB per file", "DOCX support", "Conversation history forever", "Priority support"].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span style={{ color: "#34d399" }}>✓</span> {f}
            </li>
          ))}
        </ul>
        <button className="btn-primary !h-9 !py-0 !rounded-[8px] !text-[13px]">
          Join waitlist
        </button>
      </div>
    </div>
  );
}
