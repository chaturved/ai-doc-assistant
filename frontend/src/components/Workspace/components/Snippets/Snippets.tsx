import { ChevronDown } from "lucide-react";
import SnippetCard, { Snippet } from "./SnippetCard";

interface SnippetsProps {
  title?: string;
  subtitle?: string;
  snippets: Snippet[];
}

export default function Snippets({
  title = "Relevant snippets",
  subtitle = "Top matches from your library",
  snippets,
}: SnippetsProps) {
  return (
    <details className="rounded-xl bg-zinc-950/40 ring-1 ring-white/10 open:shadow-inner">
      <summary className="cursor-pointer flex pt-4 pr-5 pb-4 pl-5 backdrop-blur-md items-center justify-between">
        <div className="text-xl tracking-tight font-semibold text-zinc-100">
          {title}
        </div>
        <ChevronDown className="h-4 w-4 text-zinc-400" />
      </summary>

      <div className="px-5 pb-5">
        {subtitle && (
          <div className="mb-4 text-xs text-zinc-400">{subtitle}</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {snippets.map((s, i) => (
            <SnippetCard key={i} snippet={s} />
          ))}
        </div>
      </div>
    </details>
  );
}
