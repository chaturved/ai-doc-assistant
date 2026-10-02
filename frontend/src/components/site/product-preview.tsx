import { ArrowUp, FileText, MessageSquare, Plus, Sparkles } from "lucide-react";

export function ProductPreview() {
  return (
    <div aria-label="Illustrative Paperwise document chat preview" className="mx-auto w-full max-w-[1010px] overflow-hidden rounded-md border border-white/60 bg-white text-[#171717] shadow-[0_24px_80px_rgba(71,42,13,0.16)] dark:border-white/15 dark:bg-[#25211c] dark:text-white">
      <div className="flex h-10 items-center gap-1.5 border-b border-black/10 bg-[#faf7f1] px-4 dark:border-white/10 dark:bg-[#2b261f]">
        <span className="h-2 w-2 rounded-full bg-[#ded5c7] dark:bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-[#ded5c7] dark:bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-[#ded5c7] dark:bg-white/20" />
        <span className="mx-auto text-[10px] font-medium tracking-wide text-black/40 dark:text-white/40">Paperwise workspace</span>
      </div>
      <div className="grid min-h-[365px] grid-cols-1 sm:grid-cols-[190px_1fr] lg:grid-cols-[190px_1fr_190px]">
        <aside className="hidden border-r border-black/10 bg-[#f5f0e8] p-4 text-xs dark:border-white/10 dark:bg-[#2b261f] sm:block">
          <p className="mb-8 flex items-center gap-2 font-display text-sm font-medium">
            <span className="grid h-6 w-6 place-items-center rounded-sm bg-[#171717] text-white dark:bg-white dark:text-[#171717]"><Sparkles size={12} /></span>
            paperwise.
          </p>
          <p className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/40">Your library <Plus size={12} /></p>
          <div className="flex items-center gap-2 rounded-sm bg-white px-2 py-2.5 font-medium shadow-sm dark:bg-white/10"><FileText size={13} className="text-[#c2410c] dark:text-[#fbbf24]" /> Research report.pdf</div>
          <div className="mt-1 flex items-center gap-2 px-2 py-2.5 text-black/50 dark:text-white/50"><FileText size={13} /> Team notes.docx</div>
          <p className="mt-8 border-t border-black/10 pt-4 text-[10px] font-semibold uppercase tracking-wider text-black/40 dark:border-white/10 dark:text-white/40">Conversations</p>
          <p className="mt-3 text-black/70 dark:text-white/70">Research summary</p>
        </aside>
        <div className="flex min-w-0 flex-col bg-white dark:bg-[#25211c]">
          <div className="flex h-12 items-center gap-2 border-b border-black/10 px-5 text-xs font-medium dark:border-white/10"><MessageSquare size={14} className="text-[#c2410c] dark:text-[#fbbf24]" /> Research summary</div>
          <div className="flex flex-1 flex-col justify-center gap-4 px-5 py-6 md:px-9">
            <div className="ml-auto max-w-[85%] rounded-md bg-[#f5f0e8] px-3 py-2.5 text-[11px] leading-5 dark:bg-white/10">What are the key findings in this report?</div>
            <div className="max-w-[450px] text-[12px] leading-6">
              <p className="mb-2 flex items-center gap-2 font-semibold"><Sparkles size={14} className="text-[#c2410c] dark:text-[#fbbf24]" /> Paperwise</p>
              <p className="text-black/70 dark:text-white/70">The report identifies three priorities: easier access to information, less repetitive work, and decisions backed by clear evidence.</p>
              <div className="mt-3 inline-flex rounded-sm border border-[#f3d49e] bg-[#fff7e8] px-2.5 py-1 text-[10px] font-medium text-[#92400e] dark:border-[#fbbf24]/20 dark:bg-[#fbbf24]/10 dark:text-[#fcd34d]">Research report.pdf · page 8</div>
            </div>
          </div>
          <div className="mx-5 mb-4 flex h-10 items-center justify-between rounded-sm border border-black/15 px-3 text-[11px] text-black/40 dark:border-white/20 dark:text-white/40 md:mx-9">Ask a follow-up question… <span className="grid h-6 w-6 place-items-center rounded-full bg-[#171717] text-white dark:bg-white dark:text-[#171717]"><ArrowUp size={12} /></span></div>
        </div>
        <aside className="hidden border-l border-black/10 bg-[#faf7f1] p-4 dark:border-white/10 dark:bg-[#2b261f] lg:block">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/40">Source in this answer</p>
          <div className="rounded-sm border border-black/10 bg-white p-3 text-[11px] shadow-sm dark:border-white/10 dark:bg-white/5">
            <p className="flex items-center gap-2 font-semibold"><FileText size={13} className="text-[#c2410c] dark:text-[#fbbf24]" /> Research report.pdf</p>
            <p className="mt-1 text-black/40 dark:text-white/40">Page 8</p>
            <p className="mt-4 border-l-2 border-[#c2410c] pl-2 leading-5 text-black/65 dark:border-[#fbbf24] dark:text-white/65">“Clear evidence helps teams reach better decisions…”</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
