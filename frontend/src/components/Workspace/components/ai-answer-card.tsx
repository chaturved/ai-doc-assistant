import { AlertTriangle } from "lucide-react";

interface AIAnswerCardProps {
  answer: string;
  warning?: string;
}

export default function AIAnswerCard({ answer, warning }: AIAnswerCardProps) {
  return (
    <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl p-5 md:p-6 backdrop-blur-md">
      <div className="text-sm font-medium text-zinc-300 leading-6 whitespace-pre-wrap min-h-[80px]">
        {answer}
      </div>

      {warning && (
        <div className="mt-3 rounded-md bg-amber-500/10 ring-1 ring-amber-400/20 p-3 text-sm text-amber-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            {warning}
          </div>
        </div>
      )}
    </div>
  );
}
