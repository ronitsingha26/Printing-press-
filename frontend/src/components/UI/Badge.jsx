const colors = {
  draft: "bg-gray-100 text-gray-600 border-gray-200",
  quoted: "bg-blue-50 text-blue-700 border-blue-200",
  invoiced: "bg-orange-50 text-orange-700 border-orange-200",
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function Badge({ children, tone = "draft" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${colors[tone] || colors.draft}`}
    >
      {children}
    </span>
  );
}
