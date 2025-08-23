export default function LibrarySection({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: { name: string; size: string }[];
}) {
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
              {icon} {item.name}
            </span>
            <span className="text-[10px] text-zinc-500">{item.size}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
