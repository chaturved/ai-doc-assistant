// Snippets.tsx
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
    <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl p-5 md:p-6 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <h3 className="text-xl tracking-tight font-semibold text-zinc-100">
          {title}
        </h3>
        <span className="text-xs text-zinc-400">{subtitle}</span>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {snippets.map((s, i) => (
          <SnippetCard key={i} snippet={s} />
        ))}
      </div>
    </div>
  );
}
