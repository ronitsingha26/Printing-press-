import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Badge from "../components/UI/Badge";
import Loader from "../components/UI/Loader";
import { formatCurrency } from "../utils/formatCurrency";
import * as api from "../mock/api";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await api.listJobs();
        if (alive) setJobs(data);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const metrics = useMemo(
    () => ({
      todaysJobs: 18,
      totalRevenue: 145000,
      pendingInvoices: 6,
      profitThisMonth: 32500,
    }),
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</div>
          <div className="text-sm sm:text-[15px] font-medium text-gray-500 mt-1">
            Automate Your Printing Costs. Maximize Profit. Eliminate Errors.
          </div>
        </div>
        <Link to="/jobs/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto font-bold py-3 shadow-md">+ New Job</Button>
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            <Card className="px-6 py-5">
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Today's Jobs</div>
              <div className="mt-2 text-4xl font-black text-gray-900 tracking-tight">{metrics.todaysJobs}</div>
            </Card>
            <Card className="px-6 py-5">
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Revenue</div>
              <div className="mt-2 text-4xl font-black gradient-text tracking-tight">
                {formatCurrency(metrics.totalRevenue)}
              </div>
            </Card>
            <Card className="px-6 py-5">
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Pending Invoices</div>
              <div className="mt-2 text-4xl font-black text-gray-900 tracking-tight">
                {metrics.pendingInvoices}
              </div>
            </Card>
            <Card className="px-6 py-5">
              <div className="text-sm font-bold text-[#3E8B6F] uppercase tracking-wider mb-1">Profit This Month</div>
              <div className="mt-2 text-4xl font-black gradient-text tracking-tight">
                {formatCurrency(metrics.profitThisMonth)}
              </div>
            </Card>
          </div>

          <Card className="p-0 overflow-hidden border-t-4 border-t-[#3E8B6F]">
            <div className="p-6 pb-4 flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-gray-900">Recent Jobs</div>
                <div className="text-sm text-gray-500 font-medium">Latest 8 jobs</div>
              </div>
            </div>
            <div className="overflow-x-auto px-6 pb-6">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="text-gray-400 font-bold border-b border-gray-100">
                    <th className="pb-3 pr-4 uppercase tracking-wider text-xs">Customer</th>
                    <th className="pb-3 pr-4 uppercase tracking-wider text-xs">Job Type</th>
                    <th className="pb-3 pr-4 uppercase tracking-wider text-xs">Status</th>
                    <th className="pb-3 pr-4 uppercase tracking-wider text-xs">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.slice(0, 8).map((j) => (
                    <tr key={j.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 pr-4 font-semibold text-gray-900">{j.customer_name || "-"}</td>
                      <td className="py-4 pr-4 font-medium text-gray-600">{j.job_type || "-"}</td>
                      <td className="py-4 pr-4">
                        <Badge tone={j.status}>{String(j.status).toUpperCase()}</Badge>
                      </td>
                      <td className="py-4 pr-4 font-bold text-gray-900">{formatCurrency(j.finalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
