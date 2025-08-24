import { ChevronRight } from "lucide-react";

export type BreadCrumbItem = {
  label: string;
  href?: string;
};

interface BreadCrumbProps {
  items: BreadCrumbItem[];
}

export default function BreadCrumb({ items }: BreadCrumbProps) {
  return (
    <div className="text-xs text-zinc-500 flex items-center gap-2">
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-2">
          {item.href ? (
            <a href={item.href} className="hover:text-zinc-300 transition">
              {item.label}
            </a>
          ) : (
            <span className="text-zinc-400">{item.label}</span>
          )}
          {i < items.length - 1 && (
            <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
          )}
        </span>
      ))}
    </div>
  );
}
