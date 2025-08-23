import Actions from "./components/Actions";
import Brand from "./components/Brand";
import Status from "./components/Status";
import UserDropdown from "./components/UserDropdown";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center gap-3">
          <Brand />
          <Status />
          <div className="flex-1" />
          <Actions />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
