"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  isStreaming: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  large?: boolean;
}

export function InputBox({ value, onChange, onSend, isStreaming, textareaRef, large = false }: Props) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, large ? 200 : 180) + "px";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); }
  };

  return (
    <div
      className={`rounded-lg border bg-card transition-all duration-150 ${active ? "border-accent/50 shadow-[0_0_0_3px_rgba(180,83,9,0.07)]" : "border-ink/15"}`}
    >
      {large && (
        <textarea
          ref={textareaRef}
          rows={3}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your documents…"
          className="w-full bg-transparent px-5 pt-4 pb-2 text-[14px] text-ink placeholder:text-ink/35 resize-none outline-none overflow-hidden min-h-[72px]"
        />
      )}
      <div className="flex items-center gap-3 px-4 py-3">
        {!large && (
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your documents…"
            className="flex-1 bg-transparent text-[14px] text-ink placeholder:text-ink/35 resize-none outline-none overflow-hidden min-h-[24px]"
          />
        )}
        {large && <p className="flex-1 text-xs text-ink/45">Answers are grounded in your library</p>}
        <button
          type="button"
          aria-label="Send question"
          onClick={onSend}
          disabled={isStreaming || !value.trim()}
          className={`h-[32px] w-[32px] rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
            value.trim() && !isStreaming
              ? "bg-primary text-bg hover:opacity-85"
              : "bg-ink/[0.08] text-ink/25 cursor-not-allowed"
          }`}
        >
          {isStreaming
            ? <span className="h-3.5 w-3.5 rounded-full border-2 border-ink/20 border-t-white/60 animate-spin" />
            : <Send size={13} />}
        </button>
      </div>
    </div>
  );
}
