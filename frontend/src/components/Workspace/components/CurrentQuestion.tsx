import {
  Bot,
  Shield,
  Waves,
  Star,
  Zap,
  BookOpen,
  Link,
  Check,
  AlertCircle,
  Sparkles,
  Copy,
  RefreshCcw,
} from "lucide-react";

const iconMap = {
  bot: <Bot className="h-3.5 w-3.5 text-zinc-400" />,
  shield: <Shield className="h-3.5 w-3.5 text-zinc-400" />,
  waves: <Waves className="h-3.5 w-3.5 text-zinc-400" />,
  star: <Star className="h-3.5 w-3.5 text-yellow-400" />,
  lightning: <Zap className="h-3.5 w-3.5 text-yellow-300" />,
  book: <BookOpen className="h-3.5 w-3.5 text-blue-400" />,
  link: <Link className="h-3.5 w-3.5 text-green-400" />,
  check: <Check className="h-3.5 w-3.5 text-emerald-400" />,
  warning: <AlertCircle className="h-3.5 w-3.5 text-red-400" />,
  sparkles: <Sparkles className="h-3.5 w-3.5 text-pink-400" />,
} as const;

export interface Badge {
  label: string;
  icon: keyof typeof iconMap;
}

interface CurrentQuestionProps {
  question: string;
  description?: string;
  badges?: Badge[];
  showActions?: boolean;
}

export default function CurrentQuestion({
  question,
  description,
  badges = [],
  showActions = true,
}: CurrentQuestionProps) {
  return (
    <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl p-5 md:p-6 backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl tracking-tight font-semibold text-zinc-50">
            {question}
          </h1>
          {description && (
            <p className="mt-2 text-sm md:text-base text-zinc-400 max-w-2xl">
              {description}
            </p>
          )}
          {badges.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {badges.map((b, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900/70 px-2.5 py-1 text-xs text-zinc-300 ring-1 ring-white/10"
                >
                  {iconMap[b.icon]} {b.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {showActions && (
          <div className="hidden sm:flex items-center gap-2">
            <button className="rounded-md bg-zinc-900/70 ring-1 ring-white/10 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:ring-indigo-500/40 transition inline-flex items-center gap-2">
              <Copy className="h-4 w-4" /> Copy
            </button>
            <button className="rounded-md bg-zinc-900/70 ring-1 ring-white/10 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:ring-emerald-500/40 transition inline-flex items-center gap-2">
              <RefreshCcw className="h-4 w-4" /> Regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
