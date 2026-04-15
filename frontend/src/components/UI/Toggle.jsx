export default function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-3 rounded-full border border-gray-100 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm hover:border-gray-200 hover:shadow transition-all"
    >
      <span className="text-gray-600 font-semibold">{label}</span>
      <span
        className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-all ${
          checked
            ? "bg-[#3E8B6F]/20 border-[#3E8B6F]/40"
            : "bg-gray-100 border-gray-200"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-gradient-to-r transition-all ${
            checked 
               ? "translate-x-5 from-[#3E8B6F] to-[#2A6550] shadow-[0_2px_8px_rgba(62,139,111,0.4)]" 
               : "translate-x-1 from-gray-300 to-gray-400 shadow-sm"
          }`}
        />
      </span>
    </button>
  );
}
