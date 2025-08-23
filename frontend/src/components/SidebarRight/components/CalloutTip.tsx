import { Info, Sparkles } from "lucide-react";

export default function CalloutTip() {
  return (
    <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl p-4 backdrop-blur-md">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-indigo-300 flex-shrink-0" />
        <div>
          <div className="text-sm font-medium text-zinc-200">Tip</div>
          <p className="text-sm text-zinc-400 mt-1">
            Ask follow‑ups like “summarize sources” or “show more from
            onboarding.pdf”.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              className="text-xs text-indigo-300 hover:text-indigo-200 inline-flex items-center gap-1"
            >
              <Sparkles className="h-3.5 w-3.5 flex-shrink-0" /> Insert example
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
