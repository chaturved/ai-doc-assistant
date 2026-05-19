import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6 text-center">
      <div>
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-base font-bold">P</span>
        </div>
        <h1 className="text-6xl font-bold text-zinc-800 mb-3">404</h1>
        <p className="text-sm text-zinc-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist.<br />It may have been moved or deleted.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-zinc-900 ring-1 ring-white/10 text-sm text-zinc-300 hover:ring-white/20 transition">
          ← Go home
        </Link>
      </div>
    </div>
  );
}
