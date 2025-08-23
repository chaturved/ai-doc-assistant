export default function RecentQueries() {
  return (
    <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl pt-4 pr-4 pb-4 pl-4 backdrop-blur-md">
      <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">
        Recent queries
      </div>
      <nav className="space-y-2 text-sm">
        <a
          href="#"
          className="block text-zinc-300 hover:text-white transition line-clamp-1"
        >
          How do I stream server‑sent events in JavaScript?
        </a>
        <a
          href="#"
          className="block text-zinc-300 hover:text-white transition line-clamp-1"
        >
          What are the rate limits for the Answers endpoint?
        </a>
        <a
          href="#"
          className="block text-zinc-300 hover:text-white transition line-clamp-1"
        >
          How to authenticate SDK calls from the browser?
        </a>
      </nav>
    </div>
  );
}
