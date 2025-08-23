import {
  Database,
  Upload,
  Plus,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center gap-3">
          {/* Brand */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="h-7 w-7 rounded-md bg-gradient-to-b from-zinc-800 to-zinc-900 ring-1 ring-white/10 grid place-items-center">
              <span className="text-[11px] tracking-tight font-semibold text-zinc-50">
                AI
              </span>
            </div>
            <span className="hidden md:block text-sm font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">
              Docs Assistant
            </span>
          </a>

          {/* Header status */}
          <div className="hidden lg:flex items-center ml-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900/70 px-2.5 py-1 text-[11px] text-zinc-300 ring-1 ring-white/10">
              <Database className="h-3.5 w-3.5 text-emerald-300" />
              <span id="docs-count">12</span> docs indexed
            </span>
          </div>

          <div className="flex-1"></div>

          {/* Actions + User dropdown */}
          <div className="hidden md:flex items-center gap-2">
            <button className="h-9 rounded-md px-3 text-sm text-zinc-100 bg-indigo-600/90 hover:bg-indigo-500 transition inline-flex items-center gap-2">
              <Upload className="h-4 w-4" /> Upload Docs
            </button>
            <button className="h-9 rounded-md px-3 text-sm text-zinc-300 ring-1 ring-white/10 hover:bg-zinc-900/80 hover:text-zinc-100 transition inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> New Search
            </button>

            <details className="relative">
              <summary className="list-none">
                <button className="h-9 rounded-md px-3 text-sm text-zinc-300 ring-1 ring-white/10 hover:bg-zinc-900/80 hover:text-zinc-100 transition inline-flex items-center gap-2">
                  <Image
                    src="https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=128&auto=format&fit=crop"
                    alt="avatar"
                    width={20}
                    height={20}
                    className="h-5 w-5 rounded-full object-cover ring-1 ring-white/10"
                  />
                  <span className="hidden sm:inline">you@company.com</span>
                  <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                </button>
              </summary>
              <div className="absolute right-0 mt-2 w-52 rounded-lg bg-zinc-950 ring-1 ring-white/10 shadow-xl p-1">
                <a
                  className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50 transition"
                  href="#"
                >
                  <User className="h-4 w-4 text-zinc-400" /> Profile
                </a>
                <a
                  className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50 transition"
                  href="#"
                >
                  <Settings className="h-4 w-4 text-zinc-400" /> Settings
                </a>
                <div className="my-1 h-px bg-white/5"></div>
                <a
                  className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition"
                  href="#"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </a>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
