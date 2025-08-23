import { MessageCircle } from "lucide-react";

export default function RelatedLink({ text }: { text: string }) {
  return (
    <a href="#" className="flex items-center gap-2 group">
      <MessageCircle className="h-4 w-4 text-indigo-300 flex-shrink-0" />
      <span className="text-sm text-zinc-300 group-hover:text-white transition">
        {text}
      </span>
    </a>
  );
}
