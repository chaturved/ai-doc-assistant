import { Clock, MessageSquare } from "lucide-react";

export interface ChatHistoryItem {
  id: string;
  title: string;
  lastUpdated: string; // ISO string or formatted date
}

interface ChatHistoryProps {
  chats: ChatHistoryItem[];
  onSelectChat?: (chat: ChatHistoryItem) => void;
}

export default function ChatHistory({ chats, onSelectChat }: ChatHistoryProps) {
  return (
    <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl p-4 backdrop-blur-md">
      <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">
        Chat History
      </div>
      <nav className="space-y-2 text-sm">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat?.(chat)}
            className="w-full flex items-center justify-between text-zinc-300 hover:text-white transition px-2 py-1 rounded-md text-left"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-indigo-300 flex-shrink-0" />
              <span className="line-clamp-1">{chat.title}</span>
            </div>
            <div className="text-[10px] text-zinc-500 flex-shrink-0">
              <Clock className="inline h-3 w-3 mr-1" /> {chat.lastUpdated}
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
}
