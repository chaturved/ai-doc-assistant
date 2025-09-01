export default function Divider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/10" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-zinc-950/80 px-2 text-zinc-400">
          Or continue with
        </span>
      </div>
    </div>
  );
}
