import Link from "next/link";


export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center" style={{ background: "#080810" }}>
      <div className="animate-fu">
<div className="text-[96px] font-black leading-none tracking-[-0.04em] bg-gradient-to-br from-white/20 to-white/5 bg-clip-text text-transparent mb-4">
          404
        </div>
        <p className="text-muted text-[15px] mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist.<br />It may have been moved or deleted.
        </p>
        <Link href="/" className="btn-primary !rounded-[10px]">
          ← Go home
        </Link>
      </div>
    </div>
  );
}
