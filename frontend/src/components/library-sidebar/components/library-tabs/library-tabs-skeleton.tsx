import LibrarySectionSkeleton from "./library-section/library-section-skeleton";

export default function LibraryTabsSkeleton() {
  return (
    <nav className="ring-1 ring-white/10 divide-y divide-white/5 bg-zinc-950/40 rounded-xl backdrop-blur-md animate-pulse">
      {[...Array(3)].map((_, idx) => (
        <LibrarySectionSkeleton key={idx} />
      ))}
    </nav>
  );
}
