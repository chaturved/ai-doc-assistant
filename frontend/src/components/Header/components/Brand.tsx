export default function Brand() {
  return (
    <a href="#" className="flex items-center gap-2 group">
      <div className="h-7 w-7 rounded-md bg-gradient-to-b from-zinc-800 to-zinc-900 ring-1 ring-white/10 grid place-items-center">
        <span className="text-[11px] tracking-tight font-semibold text-zinc-50">
          AI
        </span>
      </div>
      <span className="hidden md:block text-sm font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">
        Docs Assistant
      </span>
    </a>
  );
}
