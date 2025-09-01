import Actions, { ActionsProps } from "./components/Actions";
import Brand from "./components/Brand";
import Status from "./components/Status";
import UserDropdown from "./components/UserDropdown";

export interface HeaderProps {
  showStatus?: boolean;
  actions?: ActionsProps;
  showUserDropdown?: boolean;
}

export default function Header({
  showStatus = false,
  actions = {},
  showUserDropdown = false,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center gap-3">
          <Brand />
          {showStatus && <Status count={12} />}
          <div className="flex-1" />
          <Actions {...actions} />
          {showUserDropdown && (
            <UserDropdown
              email="you@company.com"
              avatarUrl="https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=128&auto=format&fit=crop"
            />
          )}
        </div>
      </div>
    </header>
  );
}
