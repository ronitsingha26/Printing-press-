import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Badge from "../../components/UI/Badge";
import CostBreakdown from "../../components/CostBreakdown";
import * as api from "../../mock/api";
import Loader from "../../components/UI/Loader";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await api.getJob(id);
      setJob(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function toInvoice() {
    try {
      await api.generateInvoice(id);
      toast.success("Invoice Generated");
      load();
    } catch (e) {
      toast.error(e?.message || "Invoice failed");
    }
  }

  async function downloadPdf() {
    await api.downloadPdfSim("quotation");
    toast.success("PDF Downloaded");
  }

  if (loading) {
    return <div className="p-10"><Loader /></div>;
  }

  if (!job) {
    return <div className="text-gray-500 font-medium">Job not found.</div>;
  }

  const costs = {
    paperCost: job.paperCost,
    printCost: job.printCost,
    wastageCost: job.wastageCost,
    finishingCost: job.finishingCost,
    profit: job.profit,
    gst: job.gst,
    finalPrice: job.finalPrice,
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-3xl font-extrabold text-gray-900 tracking-tight">Job #{job.id}</div>
            <div className="mt-1 text-[15px] font-medium text-gray-500">{job.customer_name || "-"}</div>
          </div>
          <Badge tone={job.status}>{String(job.status).toUpperCase()}</Badge>
        </div>

        <Card>
          <div className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Job Details</div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-[15px]">
            <div className="text-gray-500 font-semibold">GSM</div>
            <div className="text-gray-900 font-bold">{job.gsm}</div>
            <div className="text-gray-500 font-semibold">Sheet</div>
            <div className="text-gray-900 font-bold">
              {job.sheet_width} × {job.sheet_height} mm <span className="text-gray-400 font-medium">({job.sheet || "Custom"})</span>
            </div>
            <div className="text-gray-500 font-semibold">Print Type</div>
            <div className="text-gray-900 font-medium">{job.print_type}</div>
            <div className="text-gray-500 font-semibold">Color Type</div>
            <div className="text-gray-900 font-medium">{job.color_type}</div>
            <div className="text-gray-500 font-semibold">Quantity</div>
            <div className="text-gray-900 font-bold">{job.quantity}</div>
          </div>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button className="font-bold py-3 shadow-md" onClick={downloadPdf}>Download Quotation PDF</Button>
          <Button variant="ghost" className="font-semibold py-3" onClick={toInvoice}>
            Convert to Invoice
          </Button>
        </div>
      </div>

      <div className="xl:sticky xl:top-24 h-fit">
        <CostBreakdown costs={costs} gstApplied={Number(job.gst) > 0} />
      </div>
    </div>
  );
}
