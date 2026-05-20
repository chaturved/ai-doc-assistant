"use client";

interface Props {
  content: string;
  timestamp: string;
}

export function UserMessage({ content, timestamp }: Props) {
  return (
    <div className="msg-in flex justify-end">
      <div className="max-w-[72%]">
        <div className="rounded-[20px] rounded-br-[6px] px-4 py-3 bg-white/[0.07] border border-white/[0.08]">
          <p className="text-[14px] leading-relaxed text-white">{content}</p>
        </div>
        <div className="flex justify-end mt-1">
          <span className="text-[10px] text-white/30 tabular-nums">
            {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
    </div>
  );
}
