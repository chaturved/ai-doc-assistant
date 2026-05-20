import { ArrowUpRight, FileCode, FileText, Table } from "lucide-react";

const iconMap = {
  code: <FileCode className="h-4 w-4 text-indigo-300 shrink-0" />,
  text: <FileText className="h-4 w-4 text-rose-300 shrink-0" />,
  table: <Table className="h-4 w-4 text-emerald-300 shrink-0" />,
  pdf: <FileText className="h-4 w-4 text-rose-300 shrink-0" />,
} as const;

export type Snippet = {
  name: string;
  snippet: string;
  icon: keyof typeof iconMap;
};

interface SnippetCardProps {
  snippet: Snippet;
}

export default function SnippetCard({ snippet }: SnippetCardProps) {
  return (
    <div className="rounded-lg bg-zinc-900/60 ring-1 ring-white/10 p-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-200 inline-flex items-center gap-2 min-w-0">
          {iconMap[snippet.icon] ?? (
            <FileText className="h-4 w-4 text-zinc-400 shrink-0" />
          )}
          <span className="truncate">{snippet.name}</span>
        </div>
        <a
          href="#"
          className="text-[11px] text-indigo-300 hover:text-indigo-200 inline-flex items-center gap-1 flex-shrink-0"
        >
          View in doc <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
      <p className="mt-1 text-sm text-zinc-400 line-clamp-4">
        {snippet.snippet}
      </p>
    </div>
  );
}
