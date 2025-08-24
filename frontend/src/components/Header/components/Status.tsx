import { Database } from "lucide-react";

interface StatusProps {
  count: number;
  label?: string;
}

export default function Status({ count, label = "docs indexed" }: StatusProps) {
  return (
    <div className="hidden lg:flex items-center ml-1">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900/70 px-2.5 py-1 text-[11px] text-zinc-300 ring-1 ring-white/10">
        <Database className="h-3.5 w-3.5 text-emerald-300" />
        <span id="docs-count">{count}</span> {label}
      </span>
    </div>
  );
}
