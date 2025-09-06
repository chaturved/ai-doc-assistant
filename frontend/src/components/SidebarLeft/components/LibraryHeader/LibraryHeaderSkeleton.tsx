export default function LibraryHeaderSkeleton() {
  return (
    <div className="ring-1 ring-white/10 bg-zinc-950/40 rounded-xl p-3 backdrop-blur-md animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 w-16 bg-zinc-700 rounded mb-1"></div>
          <div className="h-3 w-28 bg-zinc-800 rounded"></div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900/60 px-2 py-1 ring-1 ring-white/10">
          <div className="h-3.5 w-3.5 bg-zinc-700 rounded"></div>
          <div className="h-3 w-6 bg-zinc-700 rounded"></div>
        </span>
      </div>

      {/* Buttons */}
      <div className="mt-3 flex gap-2">
        <div className="flex-1 h-8 bg-zinc-800 rounded-md"></div>
        <div className="flex-1 h-8 bg-zinc-800 rounded-md"></div>
      </div>
    </div>
  );
}
