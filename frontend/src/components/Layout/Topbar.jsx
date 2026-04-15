import { useAuth } from "../../hooks/useAuth";
import Button from "../UI/Button";
import { useLocation } from "react-router-dom";

const TITLES = [
  { prefix: "/jobs/new", title: "New Job" },
  { prefix: "/jobs/", title: "Job Detail" },
  { prefix: "/jobs", title: "Jobs" },
  { prefix: "/customers", title: "Customers" },
  { prefix: "/pricing", title: "Pricing Config" },
  { prefix: "/invoices", title: "Invoices" },
  { prefix: "/reports", title: "Reports" },
  { prefix: "/", title: "Dashboard" },
];

export default function Topbar({ onOpenSidebar }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const pageTitle = TITLES.find((x) => pathname.startsWith(x.prefix))?.title || "Dashboard";
  
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-md px-4 md:px-8 py-4 shadow-sm w-full">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Open sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <div className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">{pageTitle}</div>
          <div className="text-[10px] md:text-xs font-medium text-gray-500 mt-0.5 md:mt-1 truncate max-w-[150px] md:max-w-none">Admin • {user?.email || "admin@print.com"}</div>
        </div>
      </div>
      <Button variant="ghost" onClick={logout} className="text-sm md:text-base px-3 py-1.5 md:px-4 md:py-2">
        Logout
      </Button>
    </header>
  );
}
