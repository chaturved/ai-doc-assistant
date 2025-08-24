import RelatedLink from "./RelatedLink";

export interface RelatedQuestionsProps {
  questions: string[];
}

export default function RelatedQuestions({ questions }: RelatedQuestionsProps) {
  return (
    <div className="ring-1 ring-white/10 bg-gradient-to-b from-zinc-900/60 to-zinc-900/30 rounded-xl p-4 backdrop-blur-md">
      <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">
        Related questions
      </div>
      <div className="space-y-2">
        {questions.map((q, idx) => (
          <RelatedLink key={idx} text={q} />
        ))}
      </div>
    </div>
  );
}
