import LibraryHeaderSkeleton from "./components/library-header/library-header-skeleton";
import LibraryTabsSkeleton from "./components/library-tabs/library-tabs-skeleton";

export default function LibrarySidebarSkeleton() {
  return (
    <aside className="hidden lg:block col-span-3">
      <div className="sticky top-20 space-y-6">
        <LibraryHeaderSkeleton />
        <LibraryTabsSkeleton />
      </div>
    </aside>
  );
}
