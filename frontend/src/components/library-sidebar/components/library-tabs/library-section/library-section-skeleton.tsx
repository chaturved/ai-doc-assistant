export default function LibrarySectionSkeleton() {
  return (
    <div className="p-3 animate-pulse">
      {/* Section Title */}
      <div className="h-3 w-20 bg-zinc-700 rounded mb-2"></div>

      {/* Fake items */}
      <div className="space-y-1">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-md px-2.5 py-2"
          >
            <span className="inline-flex items-center gap-2">
              {/* Icon placeholder */}
              <div className="h-4 w-4 bg-zinc-700 rounded"></div>
              {/* Filename placeholder */}
              <div className="h-3 w-32 bg-zinc-700 rounded"></div>
            </span>
            {/* File size placeholder */}
            <div className="h-3 w-8 bg-zinc-800 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
