import { ThumbsDown, ThumbsUp } from "lucide-react";

const iconMap = {
  thumbsUp: <ThumbsUp className="h-4 w-4" />,
  thumbsDown: <ThumbsDown className="h-4 w-4" />,
} as const;

export interface FeedbackButton {
  label: string;
  icon: keyof typeof iconMap;
  onClick?: () => void;
}

interface FeedbackProps {
  title?: string;
  description?: string;
  buttons?: FeedbackButton[];
}

export default function Feedback({
  title = "Was this answer helpful?",
  description = "Your feedback improves responses and retrieval.",
  buttons = [
    { label: "Yes", icon: "thumbsUp" },
    { label: "No", icon: "thumbsDown" },
  ],
}: FeedbackProps) {
  return (
    <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl p-5 md:p-6 backdrop-blur-md flex items-center justify-between">
      <div>
        <div className="text-sm font-medium text-zinc-200">{title}</div>
        <div className="text-xs text-zinc-500">{description}</div>
      </div>
      <div className="flex items-center gap-2">
        {buttons.map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            className="rounded-md bg-zinc-900/60 ring-1 ring-white/10 px-3 py-2 text-sm text-zinc-300 hover:text-white transition inline-flex items-center gap-2"
          >
            {iconMap[btn.icon]}
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
