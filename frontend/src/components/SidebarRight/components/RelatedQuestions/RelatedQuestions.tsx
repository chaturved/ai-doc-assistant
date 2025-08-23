import RelatedLink from "./RelatedLink";

export default function RelatedQuestions() {
  return (
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
  );
}
