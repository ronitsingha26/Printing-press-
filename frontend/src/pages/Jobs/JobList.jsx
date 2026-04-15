import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Badge from "../../components/UI/Badge";
import Input from "../../components/UI/Input";
import { formatCurrency } from "../../utils/formatCurrency";
import * as api from "../../mock/api";
import Loader from "../../components/UI/Loader";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ status: "", customer: "", date: "" });
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  async function load() {
    setLoading(true);
    try {
      const data = await api.listJobs();
      setJobs(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const okStatus = !filters.status || j.status === filters.status;
      const okCustomer =
        !filters.customer ||
        String(j.customer_name || "")
          .toLowerCase()
          .includes(filters.customer.toLowerCase());
      const okDate =
        !filters.date ||
        String(j.created_at || "").slice(0, 10) === String(filters.date);
      return okStatus && okCustomer && okDate;
    });
  }, [jobs, filters]);

  async function onDelete(id) {
    if (!confirm("Delete this job?")) return;
    try {
      await api.deleteJob(id);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  }

  async function onInvoice(jobId) {
    try {
      await api.generateInvoice(jobId);
      toast.success("Invoice Generated");
      load();
    } catch (e) {
      toast.error(e?.message || "Invoice failed");
    }
  }

  async function onDownloadJobPdf() {
    await api.downloadPdfSim("job");
    toast.success("PDF Downloaded");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Jobs</div>
          <div className="text-sm sm:text-[15px] font-medium text-gray-500 mt-1">Manage quotes, invoices, and status</div>
        </div>
        <Link to="/jobs/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto font-bold py-3 shadow-md">New Job</Button>
        </Link>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 items-end">
          <Input
            label="Filter by date"
            type="date"
            value={filters.date}
            onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))}
            className="rounded-[16px] border-gray-200 bg-gray-50 text-gray-900 py-3 px-4 focus:bg-white focus:border-[#3E8B6F] shadow-sm block w-full mt-1 outline-none focus:ring-4 focus:ring-[#3E8B6F]/10 transition-all font-medium"
            labelClassName="text-sm font-semibold text-gray-500"
          />
          <Input
            label="Filter by customer"
            placeholder="Search name..."
            value={filters.customer}
            onChange={(e) => setFilters((f) => ({ ...f, customer: e.target.value }))}
            className="rounded-[16px] border-gray-200 bg-gray-50 text-gray-900 py-3 px-4 focus:bg-white focus:border-[#3E8B6F] shadow-sm block w-full mt-1 outline-none focus:ring-4 focus:ring-[#3E8B6F]/10 transition-all font-medium"
            labelClassName="text-sm font-semibold text-gray-500"
          />
          <label className="block">
            <div className="text-sm font-semibold text-gray-500 mb-1">Status</div>
            <select
              className="w-full rounded-[16px] bg-gray-50 border border-gray-200 px-4 py-3 text-[15px] font-medium text-gray-900 outline-none focus:border-[#3E8B6F] focus:ring-4 focus:ring-[#3E8B6F]/10 focus:bg-white transition-all shadow-sm"
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            >
              <option value="">All</option>
              <option value="draft">Draft</option>
              <option value="quoted">Quoted</option>
              <option value="invoiced">Invoiced</option>
              <option value="paid">Paid</option>
            </select>
          </label>
        </div>
      </Card>

      <Card className="p-0 border-t-4 border-t-[#3E8B6F] overflow-hidden">
        {loading ? (
          <div className="p-10"><Loader /></div>
        ) : (
          <div className="overflow-x-auto px-6 pb-6">
            <table className="w-full text-left text-sm mt-4 whitespace-nowrap">
              <thead>
                <tr className="text-gray-400 font-bold border-b border-gray-100">
                  <th className="pb-3 pr-4 uppercase tracking-wider text-xs">Job ID</th>
                  <th className="pb-3 pr-4 uppercase tracking-wider text-xs">Customer</th>
                  <th className="pb-3 pr-4 uppercase tracking-wider text-xs">Type</th>
                  <th className="pb-3 pr-4 uppercase tracking-wider text-xs">Status</th>
                  <th className="pb-3 pr-4 uppercase tracking-wider text-xs">Price</th>
                  <th className="pb-3 pr-4 uppercase tracking-wider text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((j) => (
                  <tr key={j.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 pr-4 font-bold text-gray-900">#{j.id}</td>
                    <td className="py-4 pr-4 font-medium text-gray-700">{j.customer_name || "-"}</td>
                    <td className="py-4 pr-4 font-medium text-gray-600">{j.job_type || "-"}</td>
                    <td className="py-4 pr-4">
                      <Badge tone={j.status}>{String(j.status).toUpperCase()}</Badge>
                    </td>
                    <td className="py-4 pr-4 font-bold text-gray-900">{formatCurrency(j.finalPrice)}</td>
                    <td className="py-4 pr-4">
                      <div className="flex flex-wrap gap-2">
                        <Button variant="ghost" onClick={() => nav(`/jobs/${j.id}`)}>
                          View
                        </Button>
                        <Button variant="ghost" onClick={() => onInvoice(j.id)}>
                          Generate Invoice
                        </Button>
                        <Button variant="ghost" onClick={() => onDownloadJobPdf()}>
                          Download PDF
                        </Button>
                        <Button variant="danger" onClick={() => onDelete(j.id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filtered.length ? (
                  <tr>
                    <td className="py-8 text-center text-gray-500 font-medium" colSpan={6}>
                      No jobs found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
