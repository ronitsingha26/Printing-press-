import { forwardRef } from "react";

const Input = forwardRef(function Input({ label, className = "", labelClassName = "", ...props }, ref) {
  return (
    <label className="block">
      {label ? (
        <div className={`mb-1 text-[13px] font-bold text-gray-400 uppercase tracking-wider ${labelClassName}`}>{label}</div>
      ) : null}
      <input
        className={`w-full rounded-[12px] bg-white border border-gray-200 px-4 py-3 text-[15px] font-medium text-gray-900 outline-none focus:border-[#3E8B6F] shadow-sm transition-all focus:ring-4 focus:ring-[#3E8B6F]/10 ${className}`}
        ref={ref}
        {...props}
      />
    </label>
  );
});

export default Input;
