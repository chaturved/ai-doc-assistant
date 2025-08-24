import { ChevronDown, FileCode, FileText } from "lucide-react";

type Source = {
  name: string;
  quote: string;
  icon: "code" | "text";
};

const sources: Source[] = [
  {
    name: "api-reference.md",
    quote:
      "Use text/event-stream and flush lines prefixed by data:. Emit [DONE] when complete for cleanup.",
    icon: "code",
  },
  {
    name: "Onboarding Guide.pdf",
    quote:
      "The client should listen to message events and append text incrementally to the UI.",
    icon: "text",
  },
];

export default function Sources() {
  return (
    <details className="rounded-xl bg-zinc-950/40 ring-1 ring-white/10 open:shadow-inner">
      <summary className="cursor-pointer flex pt-4 pr-5 pb-4 pl-5 backdrop-blur-md items-center justify-between">
        <div className="text-xl tracking-tight font-semibold text-zinc-100">
          Sources
        </div>
        <ChevronDown className="h-4 w-4 text-zinc-400" />
      </summary>

      <div className="px-5 pb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sources.map((src, i) => (
            <details
              key={i}
              className="rounded-lg bg-zinc-900/60 ring-1 ring-white/10"
            >
              <summary className="flex items-center justify-between px-3 py-2 cursor-pointer">
                <div className="text-sm font-medium text-zinc-200 inline-flex items-center gap-2">
                  {src.icon === "code" ? (
                    <FileCode className="h-4 w-4 text-indigo-300" />
                  ) : (
                    <FileText className="h-4 w-4 text-rose-300" />
                  )}
                  {src.name}
                </div>
                <ChevronDown className="h-4 w-4 text-zinc-400" />
              </summary>
              <div className="px-3 pb-3 text-sm text-zinc-400">{src.quote}</div>
            </details>
          ))}
        </div>
      </div>
    </details>
  );
}
