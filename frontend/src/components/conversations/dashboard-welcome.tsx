"use client";

import { FileText, Search, ListChecks, Lightbulb, Scale, Link2, ShieldCheck } from "lucide-react";
import { InputBox } from "./input-box";

const suggestions = [
  { icon: FileText, label: "Summarize my Q3 report" },
  { icon: Search, label: "Find key risks" },
  { icon: ListChecks, label: "List action items" },
  { icon: Lightbulb, label: "What are the conclusions?" },
  { icon: Scale, label: "Compare two documents" },
  { icon: Link2, label: "Extract all citations" },
];

interface DashboardWelcomeProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (question?: string) => void;
  isStreaming: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function DashboardWelcome({ value, onChange, onSend, isStreaming, textareaRef }: DashboardWelcomeProps) {
  return (
    <div className="flex flex-1 items-center overflow-y-auto px-5 py-10 sm:px-10">
      <div className="mx-auto grid w-full max-w-[1020px] gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] lg:items-center lg:gap-14">
        <div className="max-w-[620px]">
          <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent"><span className="h-px w-8 bg-accent" /> Your workspace</p>
          <h1 className="font-display text-[38px] font-medium leading-[1.04] tracking-[-0.04em] sm:text-[52px]">What do you want to understand?</h1>
          <p className="mb-8 mt-5 max-w-lg text-[16px] leading-7 text-ink/60">Ask a question about your documents. Every answer keeps its source close.</p>
          <InputBox value={value} onChange={onChange} onSend={() => onSend()} isStreaming={isStreaming} textareaRef={textareaRef} large />
          <p className="mb-3 mt-7 text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">Try a question</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {suggestions.map((suggestion) => {
              const Icon = suggestion.icon;
              return <button key={suggestion.label} type="button" onClick={() => onSend(suggestion.label)} className="flex min-h-12 items-center gap-3 rounded-md border border-ink/10 bg-card px-4 text-left text-[13px] text-ink/75 transition hover:border-accent/40 hover:text-ink"><Icon size={16} className="shrink-0 text-accent" />{suggestion.label}</button>;
            })}
          </div>
        </div>
        <aside className="rounded-lg border border-ink/10 bg-[#f4ede1] p-7 text-[#241a0f] dark:bg-[#2d261c] dark:text-white sm:p-9">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#92400e] dark:text-amber-300"><ShieldCheck size={16} /> Answer with evidence</div>
          <h2 className="mt-7 font-display text-[27px] font-medium leading-tight tracking-[-0.03em]">A clear path back to the page.</h2>
          <p className="mt-3 text-sm leading-7 text-[#38210b]/70 dark:text-white/65">Find the detail, follow the citation, and know where your answer came from.</p>
          <div className="mt-8 rounded-md border border-[#d7c7af] bg-white p-5 text-[#241a0f] shadow-sm dark:border-white/10 dark:bg-[#25211c] dark:text-white">
            <p className="flex items-center gap-2 text-xs font-medium"><FileText size={15} className="text-accent" /> Research report.pdf <span className="ml-auto text-black/40 dark:text-white/40">Page 8</span></p>
            <p className="mt-5 border-l-2 border-amber-500 bg-amber-50 px-3 py-2 text-xs leading-6 text-[#6b4b24] dark:bg-amber-500/10 dark:text-amber-200">The source passage, right beside the answer.</p>
          </div>
          <p className="mt-5 text-[11px] text-[#38210b]/50 dark:text-white/45">Illustrative example</p>
        </aside>
      </div>
    </div>
  );
}
