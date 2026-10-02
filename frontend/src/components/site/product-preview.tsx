import { ArrowUp, FileText, MessageSquareText, Plus, SquarePen } from "lucide-react";

export function ProductPreview() {
  return (
    <div aria-label="Illustrative Paperwise document chat preview" className="mx-auto w-full max-w-[1010px] overflow-hidden rounded-lg border border-ink/10 bg-workspace text-ink shadow-[0_24px_70px_rgba(0,0,0,0.1)]">
      <div className="grid min-h-[390px] sm:grid-cols-[188px_1fr]">
        <aside className="hidden border-r border-ink/10 bg-rail p-4 sm:block">
          <p className="mb-7 font-display text-[15px] font-medium tracking-[-0.04em]">paperwise<span className="text-accent">.</span></p>
          <div className="flex items-center gap-2 rounded-md bg-ink/[0.08] px-3 py-2.5 text-[11px] font-medium"><SquarePen size={13} /> New chat</div>
          <div className="mt-2 flex items-center gap-2 px-3 py-2.5 text-[11px] text-ink/70"><FileText size={13} /> Library <Plus size={12} className="ml-auto" /></div>
          <p className="mb-2 mt-9 px-3 text-[10px] text-ink/45">Recents</p>
          <p className="rounded-md bg-ink/[0.06] px-3 py-2 text-[11px] text-ink/75">Research summary</p>
          <p className="mt-1 px-3 py-2 text-[11px] text-ink/55">Team notes</p>
        </aside>
        <div className="flex min-w-0 flex-col">
          <div className="flex h-12 items-center justify-center"><span className="rounded-full bg-ink/[0.06] px-5 py-1.5 text-[10px] font-medium">Chat</span></div>
          <div className="flex flex-1 flex-col justify-center gap-5 px-5 py-5 sm:px-8 lg:px-12">
            <p className="text-center text-[18px] font-medium tracking-[-0.03em]">What would you like to know?</p>
            <div className="flex items-center gap-2 rounded-full bg-composer px-4 py-3 text-[11px] text-ink/45">
              <span className="flex-1">Ask Paperwise</span><span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white dark:text-[#211608]"><ArrowUp size={12} /></span>
            </div>
            <div className="mt-2 border-t border-ink/10 pt-4 text-[11px] leading-5">
              <p className="mb-2 flex items-center gap-2 font-medium"><MessageSquareText size={13} className="text-accent" /> Example answer</p>
              <p className="text-ink/65">The report points to three priorities: faster access to research, less repeated work, and clearer decisions.</p>
              <p className="mt-2 inline-flex items-center gap-1 rounded-md bg-accent/10 px-2 py-1 text-[10px] font-medium text-accent"><FileText size={11} /> Research report.pdf · page 8</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
