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

export default function Topbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const pageTitle = TITLES.find((x) => pathname.startsWith(x.prefix))?.title || "Dashboard";
  
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-md px-8 py-4 shadow-sm">
      <div>
        <div className="text-2xl font-extrabold text-gray-900 tracking-tight">{pageTitle}</div>
        <div className="text-xs font-medium text-gray-500 mt-1">Admin • {user?.email || "admin@print.com"}</div>
      </div>
      <Button variant="ghost" onClick={logout}>
        Logout
      </Button>
    </header>
  );
}
