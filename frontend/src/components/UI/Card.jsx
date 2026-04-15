export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-[20px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-6 hover:shadow-[0_8px_30px_-4px_rgba(62,139,111,0.12)] hover:border-[#3E8B6F]/20 transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}
