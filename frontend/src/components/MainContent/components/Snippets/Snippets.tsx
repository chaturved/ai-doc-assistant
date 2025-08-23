import { FileCode, FileText, Table } from "lucide-react";
import SnippetCard from "./SnippetCard";

export default function Snippets() {
  return (
    <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl p-5 md:p-6 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <h3 className="text-xl tracking-tight font-semibold text-zinc-100">
          Relevant snippets
        </h3>
        <span className="text-xs text-zinc-400">
          Top matches from your library
        </span>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Example snippet card */}
        <SnippetCard
          name="api-reference.md"
          icon={<FileCode className="h-4 w-4 text-indigo-300" />}
          snippet="To stream tokens, set stream: true and use Server‑Sent Events. The server should flush data using “data: {json}\n\n” format..."
        />
        <SnippetCard
          name="Onboarding Guide.pdf"
          icon={<FileText className="h-4 w-4 text-rose-300" />}
          snippet="The client subscribes via EventSource(url). Handle message and error events, and close the connection when “[DONE]” is received..."
        />
        <SnippetCard
          name="endpoints.csv"
          icon={<Table className="h-4 w-4 text-emerald-300" />}
          snippet="/v1/answers — supports stream responses via text/event‑stream and emits token and citation events for UI rendering..."
        />
      </div>
    </div>
  );
}
