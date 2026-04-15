import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const baseLink =
  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 border-l-2 border-transparent";

export default function Sidebar() {
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
    <aside className="bg-white h-full w-64 shrink-0 border-r border-gray-200 p-5">
      <div className="px-3 py-4 mb-4">
        <div className="text-xl font-black text-gray-900 tracking-tight leading-none">Printing Press</div>
        <div className="text-xs font-semibold text-[#3E8B6F] tracking-wide mt-1 uppercase">Pricing System</div>
      </div>
      <nav className="mt-2 space-y-1.5 flex flex-col gap-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
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
