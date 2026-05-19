"use client";

import { useEffect, useState } from "react";
import { getUsage } from "@/lib/paperwise-api";
import { useAuth } from "@/context/AuthContext";
import type { Usage } from "@/lib/types";

function UsageBar({ used, limit, label }: { used: number; limit: number; label: string }) {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-400">{label}</span>
        <span className="text-zinc-600">{used} of {limit}</span>
      </div>
      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${pct > 85 ? "bg-red-500" : "bg-indigo-500"}`} style={{ width: `${pct}%` }} />
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
      <h1 className="text-xl font-semibold text-zinc-100 mb-6">Plan & Billing</h1>

      <div className="rounded-xl bg-zinc-900/60 ring-1 ring-white/[0.07] p-4 mb-6 max-w-sm">
        <p className="text-lg font-semibold text-zinc-100">Free</p>
        <p className="text-sm text-zinc-500">$0 / month</p>
      </div>

      {usage && (
        <div className="space-y-4 max-w-sm mb-8">
          <p className="text-sm font-medium text-zinc-400">Usage this month</p>
          <UsageBar used={usage.documents.used} limit={usage.documents.limit} label="Documents" />
          <UsageBar used={usage.queries_today.used} limit={usage.queries_today.limit} label="Queries today" />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Storage</span>
              <span className="text-zinc-600">{formatStorage(usage.storage_bytes.used)} of {formatStorage(usage.storage_bytes.limit)}</span>
            </div>
            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${Math.min(100, (usage.storage_bytes.used / usage.storage_bytes.limit) * 100)}%` }} />
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl bg-zinc-900/60 ring-1 ring-white/[0.07] p-5 max-w-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">⚡</span>
          <p className="text-sm font-semibold text-zinc-100">Pro — $12/month</p>
        </div>
        <ul className="space-y-2 text-sm text-zinc-400 mb-4">
          {["Unlimited documents", "Unlimited queries", "50 MB per file", "DOCX support", "Conversation history forever", "Priority support"].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> {f}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <button className="h-9 px-4 rounded-xl bg-indigo-600/80 ring-1 ring-indigo-500/40 text-sm text-white hover:bg-indigo-600 transition">
            Join Pro waitlist
          </button>
          <span className="text-xs text-zinc-700">Coming soon</span>
        </div>
      </div>
    </div>
  );
}
