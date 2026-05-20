import { Info, Sparkles } from "lucide-react";

interface CalloutTipProps {
  title?: string;
  text: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

export default function CalloutTip({
  title = "Tip",
  text,
  buttonLabel = "Insert example",
  onButtonClick,
}: CalloutTipProps) {
  return (
    <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl p-4 backdrop-blur-md">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-indigo-300 flex-shrink-0" />
        <div>
          <div className="text-sm font-medium text-zinc-200">{title}</div>
          <p className="text-sm text-zinc-400 mt-1">{text}</p>
          {buttonLabel && (
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onButtonClick}
                className="text-xs text-indigo-300 hover:text-indigo-200 inline-flex items-center gap-1"
              >
                <Sparkles className="h-3.5 w-3.5 flex-shrink-0" /> {buttonLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
