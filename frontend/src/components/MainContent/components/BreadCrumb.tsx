import { ChevronRight } from "lucide-react";

export default function BreadCrumb() {
  return (
    <div className="text-xs text-zinc-500 flex items-center gap-2">
      <a href="#" className="hover:text-zinc-300 transition">
        Search
      </a>
      <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
      <span id="breadcrumb-current" className="text-zinc-400">
        Query #3
      </span>
    </div>
  );
}
