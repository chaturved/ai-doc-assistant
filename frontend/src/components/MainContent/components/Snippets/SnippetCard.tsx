import { ArrowUpRight } from "lucide-react";

export default function SnippetCard({
  name,
  icon,
  snippet,
}: {
  name: string;
  icon: React.ReactNode;
  snippet: string;
}) {
  return (
    <div className="rounded-lg bg-zinc-900/60 ring-1 ring-white/10 p-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-200 inline-flex items-center gap-2">
          {icon} {name}
        </div>
        <a
          href="#"
          className="text-[11px] text-indigo-300 hover:text-indigo-200 inline-flex items-center gap-1"
        >
          View in doc <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
      <p className="mt-1 text-sm text-zinc-400 line-clamp-4">{snippet}</p>
    </div>
  );
}
