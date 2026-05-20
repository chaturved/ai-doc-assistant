import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";

interface UserDropdownProps {
  email: string;
  avatarUrl: string;
}

export default function UserDropdown({ email, avatarUrl }: UserDropdownProps) {
  return (
    <details className="relative">
      <summary className="h-9 cursor-pointer list-none rounded-md px-3 text-sm text-zinc-300 ring-1 ring-white/10 hover:bg-zinc-900/80 hover:text-zinc-100 transition inline-flex items-center gap-2">
        <Image
          src={avatarUrl}
          alt="avatar"
          width={20}
          height={20}
          className="h-5 w-5 rounded-full object-cover ring-1 ring-white/10"
        />
        <span className="hidden sm:inline">{email}</span>
        <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
      </summary>

      <div className="absolute right-0 mt-2 w-52 rounded-lg bg-zinc-950 ring-1 ring-white/10 shadow-xl p-1">
        <a
          href="/profile"
          className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50 transition"
        >
          <User className="h-4 w-4 text-zinc-400" /> Profile
        </a>
        <a
          href="/settings"
          className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50 transition"
        >
          <Settings className="h-4 w-4 text-zinc-400" /> Settings
        </a>
        <div className="my-1 h-px bg-white/5"></div>
        <a
          href="/logout"
          className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition"
        >
          <LogOut className="h-4 w-4" /> Logout
        </a>
      </div>
    </details>
  );
}
