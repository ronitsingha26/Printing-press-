import { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import * as api from "../../mock/api";
import toast from "react-hot-toast";
import Loader from "../../components/UI/Loader";

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await api.listInvoices();
      setInvoices(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function download() {
    await api.downloadPdfSim("invoice");
    toast.success("PDF Downloaded");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-3xl font-extrabold text-gray-900 tracking-tight">Invoices</div>
          <div className="text-[15px] font-medium text-gray-500 mt-1">All generated invoices</div>
        </div>
      </div>

      <Card className="p-0 border-t-4 border-t-[#3E8B6F] overflow-hidden">
        {loading ? (
          <div className="p-10"><Loader /></div>
        ) : (
          <div className="overflow-x-auto px-6 pb-6">
            <table className="w-full text-left text-sm mt-4">
              <thead>
                <tr className="text-gray-400 font-bold border-b border-gray-100">
                  <th className="pb-3 pr-4 uppercase tracking-wider text-xs">Invoice No</th>
                  <th className="pb-3 pr-4 uppercase tracking-wider text-xs">Customer</th>
                  <th className="pb-3 pr-4 uppercase tracking-wider text-xs">Total</th>
                  <th className="pb-3 pr-4 uppercase tracking-wider text-xs">Date</th>
                  <th className="pb-3 pr-4 uppercase tracking-wider text-xs">PDF</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((i) => (
                  <tr key={i.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 pr-4 font-bold text-gray-900">{i.invoice_no}</td>
                    <td className="py-4 pr-4 font-medium text-gray-700">{i.customer_name || "-"}</td>
                    <td className="py-4 pr-4 font-bold text-gray-900">{formatCurrency(i.total)}</td>
                    <td className="py-4 pr-4 font-medium text-gray-500">
                      {String(i.date || "").slice(0, 10)}
                    </td>
                    <td className="py-4 pr-4">
                      <Button variant="ghost" onClick={() => download()}>
                        Download PDF
                      </Button>
                    </td>
                  </tr>
                ))}
                {!invoices.length ? (
                  <tr>
                    <td className="py-8 text-center text-gray-500 font-medium" colSpan={5}>
                      No invoices yet.
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
