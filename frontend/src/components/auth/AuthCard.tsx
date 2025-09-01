interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl backdrop-blur-md p-6 sm:p-7">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl tracking-tight font-semibold text-zinc-50">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>}
      </div>

      {/* Content */}
      <div className="mt-6">{children}</div>
    </div>
  );
}
