export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-3 text-white/60">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-violet-500" />
      <div className="text-sm">{label}</div>
    </div>
  );
}

