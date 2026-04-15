export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-[#3E8B6F] to-[#2A6550] text-white shadow-md hover:shadow-[0_8px_20px_rgba(62,139,111,0.3)] hover:-translate-y-0.5 active:translate-y-0"
      : variant === "ghost"
        ? "bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
        : variant === "danger"
        ? "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:text-red-700 hover:shadow-sm"
        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-sm";

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
