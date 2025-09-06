import LibraryHeaderSkeleton from "./components/LibraryHeader/LibraryHeaderSkeleton";
import LibraryTabsSkeleton from "./components/LibraryTabs/LibraryTabsSkeleton";

export default function SidebarLeftSkeleton() {
  return (
    <aside className="hidden lg:block col-span-3">
      <div className="sticky top-20 space-y-6">
        <LibraryHeaderSkeleton />
        <LibraryTabsSkeleton />
      </div>
    </aside>
  );
}
