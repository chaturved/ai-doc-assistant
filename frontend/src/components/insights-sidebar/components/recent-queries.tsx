interface RecentQueriesProps {
  queries: string[];
}

export default function RecentQueries({ queries }: RecentQueriesProps) {
  return (
    <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl p-4 backdrop-blur-md">
      <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">
        Recent queries
      </div>
      <nav className="space-y-2 text-sm">
        {queries.map((query, i) => (
          <a
            key={i}
            href="#"
            className="block text-zinc-300 hover:text-white transition line-clamp-1"
          >
            {query}
          </a>
        ))}
      </nav>
    </div>
  );
}
