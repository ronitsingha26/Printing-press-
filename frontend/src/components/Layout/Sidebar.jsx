import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const baseLink =
  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 border-l-2 border-transparent";

export default function Sidebar({ onClose }) {
  const { isAdmin } = useAuth();

  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/jobs", label: "Jobs" },
    { to: "/customers", label: "Customers" },
    ...(isAdmin ? [{ to: "/pricing", label: "Pricing" }] : []),
    { to: "/invoices", label: "Invoices" },
    { to: "/reports", label: "Reports" },
  ];

  return (
    <aside className="bg-white h-full w-64 shrink-0 border-r border-gray-200 p-5 flex flex-col">
      <div className="px-3 py-4 mb-4 flex items-center justify-between">
        <div>
          <div className="text-xl font-black text-gray-900 tracking-tight leading-none">Printing Press</div>
          <div className="text-xs font-semibold text-[#3E8B6F] tracking-wide mt-1 uppercase">Pricing System</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 text-gray-400 hover:bg-gray-100 rounded-md">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <nav className="mt-2 space-y-1.5 flex flex-col gap-1 flex-1 overflow-y-auto">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            onClick={onClose}
            className={({ isActive }) =>
              isActive
                ? `${baseLink} !bg-[#3E8B6F]/5 !border-[#3E8B6F] !text-[#3E8B6F] !font-bold`
                : baseLink
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
