import { Filter, Search, Send, Sparkles } from "lucide-react";
import { useRef } from "react";

type IconKey = "filter" | "send" | "sparkles";

const iconMap = {
  filter: <Filter className="h-3.5 w-3.5" />,
  send: <Send className="h-3.5 w-3.5" />,
  sparkles: <Sparkles className="h-4.5 w-4.5 text-indigo-300" />,
};

interface BaseButtonProps {
  label?: string;
  icon?: IconKey;
  variant?: "primary" | "secondary";
  hiddenSm?: boolean;
}

export interface MainQueryAskButton extends BaseButtonProps {
  onClick?: (value: string) => void;
}

export interface MainQueryDocsButton extends BaseButtonProps {
  onClick?: () => void;
}

export interface MainQueryButtons {
  ask?: MainQueryAskButton;
  docs?: MainQueryDocsButton;
}

export interface MainQueryBarProps {
  placeholder?: string;
  leftIcon?: IconKey;
  buttons?: MainQueryButtons;
}

export default function MainQueryBar({
  placeholder = "",
  leftIcon = "sparkles",
  buttons = {},
}: MainQueryBarProps) {
  const queryInputRef = useRef<HTMLInputElement>(null);

  const handleAskClick = () => {
    const value = queryInputRef.current?.value || "";
    buttons.ask?.onClick?.(value);

    if (queryInputRef.current) {
      queryInputRef.current.value = "";
    }
  };

  const handleDocsClick = () => {
    buttons.docs?.onClick?.();
  };

  return (
    <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl backdrop-blur-md p-3 md:p-4">
      <div className="flex items-start gap-3">
        {/* Left icon */}
        <div className="hidden sm:flex">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 ring-1 ring-white/10 grid place-items-center">
            {iconMap[leftIcon]}
          </div>
        </div>

        <div className="flex-1">
          <div className="relative">
            {/* Search icon */}
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <Search className="h-4 w-4 text-zinc-400" />
            </div>

            {/* Input */}
            <input
              id="mainQuery"
              type="text"
              ref={queryInputRef}
              placeholder={placeholder}
              className="w-full rounded-lg bg-zinc-900/80 text-sm md:text-base pl-9 pr-28 h-12 outline-none ring-1 ring-white/10 focus:ring-indigo-500/40 placeholder:text-zinc-500 transition"
            />

            {/* Buttons */}
            <div className="absolute inset-y-0 right-2 flex items-center gap-2">
              {buttons.ask && (
                <button
                  onClick={handleAskClick}
                  className={`${
                    buttons.ask.hiddenSm
                      ? "hidden sm:inline-flex"
                      : "inline-flex"
                  } items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] text-zinc-300 ring-1 ring-white/10 hover:text-white transition ${
                    buttons.ask.variant === "primary"
                      ? "bg-indigo-600/90 ring-indigo-500/40 hover:bg-indigo-500 text-white"
                      : "bg-zinc-900/80 hover:ring-indigo-500/40"
                  }`}
                >
                  {buttons.ask.icon && iconMap[buttons.ask.icon]}{" "}
                  {buttons.ask.label}
                </button>
              )}

              {buttons.docs && (
                <button
                  onClick={handleDocsClick}
                  className={`${
                    buttons.docs.hiddenSm
                      ? "hidden sm:inline-flex"
                      : "inline-flex"
                  } items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] text-zinc-300 ring-1 ring-white/10 hover:text-white transition ${
                    buttons.docs.variant === "primary"
                      ? "bg-indigo-600/90 ring-indigo-500/40 hover:bg-indigo-500 text-white"
                      : "bg-zinc-900/80 hover:ring-indigo-500/40"
                  }`}
                >
                  {buttons.docs.icon && iconMap[buttons.docs.icon]}{" "}
                  {buttons.docs.label}
                </button>
              )}
            </div>
          </div>

          {/* Dropzone */}
          <div
            id="dropzone"
            className="mt-3 hidden rounded-md border border-dashed border-white/10 bg-zinc-900/40 p-3 text-xs text-zinc-400"
          >
            Drag & drop files here to add to your library
          </div>
        </div>
      </div>
    </div>
  );
}
