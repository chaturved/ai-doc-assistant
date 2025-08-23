"use client";

import { MessageCircle, Info, Sparkles } from "lucide-react";

export default function SidebarRight() {
  return (
    <aside className="hidden xl:block col-span-3">
      <div className="sticky top-20 space-y-6">
        {/* Recent Queries */}
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

        {/* Related Questions */}
        <div className="ring-1 ring-white/10 bg-gradient-to-b from-zinc-900/60 to-zinc-900/30 rounded-xl pt-4 pr-4 pb-4 pl-4 backdrop-blur-md">
          <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">
            Related questions
          </div>
          <div className="space-y-2">
            <RelatedLink text="How do I attach document citations to each paragraph?" />
            <RelatedLink text="Can I limit retrieval to a specific folder?" />
            <RelatedLink text="How are snippets ranked by relevance?" />
          </div>
        </div>

        {/* Callout / Tip */}
        <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl p-4 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-indigo-300 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-zinc-200">Tip</div>
              <p className="text-sm text-zinc-400 mt-1">
                Ask follow‑ups like “summarize sources” or “show more from
                onboarding.pdf”.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  className="text-xs text-indigo-300 hover:text-indigo-200 inline-flex items-center gap-1"
                >
                  <Sparkles className="h-3.5 w-3.5 flex-shrink-0" /> Insert
                  example
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function RelatedLink({ text }: { text: string }) {
  return (
    <a href="#" className="flex items-center gap-2 group">
      <MessageCircle className="h-4 w-4 text-indigo-300 flex-shrink-0" />
      <span className="text-sm text-zinc-300 group-hover:text-white transition">
        {text}
      </span>
    </a>
  );
}
