export default function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full blur-3xl opacity-25 bg-gradient-to-br from-indigo-500/10 to-emerald-500/10"></div>
    </div>
  );
}
