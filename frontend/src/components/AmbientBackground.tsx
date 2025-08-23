export default function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl opacity-25 bg-gradient-radial from-indigo-500/35 to-transparent"></div>
      <div className="absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-25 bg-gradient-radial from-emerald-500/30 to-transparent"></div>
    </div>
  );
}
