import { FileCode, FileText, Folder, Table } from "lucide-react";

const iconMap = {
  pdf: <FileText className="h-4 w-4 text-rose-300" />,
  md: <FileCode className="h-4 w-4 text-indigo-300" />,
  data: <Table className="h-4 w-4 text-emerald-300" />,
  folder: <Folder className="h-4 w-4 text-zinc-400" />,
} as const;

export interface LibraryItem {
  name: string;
  size: string;
}

export interface LibrarySectionProps {
  title: string;
  icon: keyof typeof iconMap;
  items: LibraryItem[];
}

export function LibrarySection({ title, icon, items }: LibrarySectionProps) {
  return (
    <div className="p-3">
      <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">
        {title}
      </div>
      <div className="space-y-1">
        {items.map((item, idx) => (
          <a
            key={idx}
            className="group flex items-center justify-between rounded-md px-2.5 py-2 text-sm text-zinc-300 hover:bg-zinc-900/70 hover:text-white transition cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              {iconMap[icon]} {item.name}
            </span>
            <span className="text-[10px] text-zinc-500">{item.size}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
