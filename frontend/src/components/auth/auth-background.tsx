import { FileText, MessageSquare, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function AuthBackground() {
  return (
    <>
      <div className="absolute right-5 top-5 z-20"><ThemeToggle /></div>
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[45%] overflow-hidden border-r border-ink/10 bg-[#f4ede1] text-[#241a0f] dark:bg-[#2d261c] dark:text-[#faf7f2] xl:flex xl:flex-col xl:justify-between xl:p-12">
        <div className="relative">
          <span className="font-display text-xl font-medium tracking-[-0.05em]">paperwise<span className="text-[#b45309] dark:text-[#fbbf24]">.</span></span>
          <div className="mt-6 h-px w-10 bg-[#b45309] dark:bg-[#fbbf24]" />
        </div>
        <div className="relative max-w-[540px]">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#92400e] dark:text-amber-300">Your document workspace</p>
          <h1 className="font-display text-[clamp(3rem,4.2vw,5rem)] font-medium leading-[1.03] tracking-[-0.045em]">A good answer has a source.</h1>
          <p className="mt-7 max-w-[390px] text-base leading-8 text-[#38210b]/70 dark:text-white/65">Bring your files together. Ask what matters. See where each answer begins.</p>
          <div className="mt-10 max-w-[430px] rounded-lg border border-[#d7c7af] bg-white p-5 text-[#241a0f] shadow-[0_18px_45px_rgba(71,42,13,0.1)] dark:border-white/10 dark:bg-[#25211c] dark:text-white">
            <div className="flex items-center gap-2 border-b border-black/10 pb-3 text-xs font-medium dark:border-white/10"><FileText size={15} className="text-[#b45309] dark:text-[#fbbf24]" /> Research report.pdf <span className="ml-auto text-black/40 dark:text-white/40">Page 8</span></div>
            <p className="mt-5 flex items-center gap-2 text-xs font-semibold"><MessageSquare size={14} className="text-[#b45309] dark:text-[#fbbf24]" /> What changed this quarter?</p>
            <p className="mt-3 border-l-2 border-amber-500 bg-amber-50 px-3 py-2 text-xs leading-6 text-[#6b4b24] dark:bg-amber-500/10 dark:text-amber-200">The team focused on faster access to research and clearer decisions.</p>
            <p className="mt-4 flex items-center gap-2 text-[11px] font-medium text-[#92400e] dark:text-amber-300"><ShieldCheck size={13} /> Cited from the original document</p>
          </div>
        </div>
        <p className="relative text-xs text-[#38210b]/55 dark:text-white/45">Find the answer. Keep the evidence.</p>
      </div>
    </>
  );
}
