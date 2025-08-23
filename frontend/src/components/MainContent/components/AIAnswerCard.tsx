import { AlertTriangle } from "lucide-react";

export default function AIAnswerCard() {
  return (
    <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl p-5 md:p-6 backdrop-blur-md">
      <div className="text-sm text-zinc-300 leading-6">
        • Use the EventSource API to open a unidirectional connection to your
        server. The browser will automatically reconnect on transient failures.
        <br />
        • The server should emit text/event-stream with lines prefixed by
        “data:”. Batch tokens or send one per line for real‑time rendering.
        <br />
        • In Node, prefer eventsource-parser to handle fragmented chunks and
        keep your UI responsive.
        <br />• Always close the stream on completion signal (e.g., [DONE]) and
        surface citations alongside the generated text.
      </div>
      <div className="hidden mt-3 rounded-md bg-amber-500/10 ring-1 ring-amber-400/20 p-3 text-sm text-amber-200">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 mt-0.5" /> No relevant info found in
          your docs. Try uploading more files or broadening the query.
        </div>
      </div>
    </div>
  );
}
