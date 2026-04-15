import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import CostBreakdown from "../../components/CostBreakdown";
import * as api from "../../mock/api";
import Loader from "../../components/UI/Loader";

export default function NewJob() {
  const nav = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [pricing, setPricing] = useState(null);
  const [finishing, setFinishing] = useState([]);
  const [gstApplied, setGstApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      customer_id: "",
      gsm: "",
      sheet: "A4",
      sheet_width: 210,
      sheet_height: 297,
      num_sheets: 1,
      print_type: "single",
      color_type: "bw",
      quantity: 1000,
      wastage_pct: "",
      finishing_ids: [],
      job_type: "Visiting Cards",
    },
  });

  const form = watch();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [c, p, f] = await Promise.all([
          api.listCustomers(),
          api.getPricing(),
          api.listFinishing(),
        ]);
        setCustomers(c);
        setPricing(p);
        setFinishing(f);
        if (c?.[0]?.id) setValue("customer_id", String(c[0].id));
        if (p?.gsmRates?.[0]?.gsm) setValue("gsm", String(p.gsmRates[0].gsm));
      } finally {
        setLoading(false);
      }
    })();
  }, [setValue]);

  const pricingRule = useMemo(() => {
    return pricing?.gsmRates?.find((r) => String(r.gsm) === String(form.gsm));
  }, [pricing, form.gsm]);

  const costs = useMemo(() => {
    if (!form.customer_id || !form.gsm || !form.sheet_width || !form.sheet_height || !form.quantity) {
      return { paperCost: 0, printCost: 0, wastageCost: 0, finishingCost: 0, profit: 0, gst: 0, finalPrice: 0 };
    }
    const c = api.calculateCosts({
      gsm: Number(form.gsm),
      sheet_width: Number(form.sheet_width),
      sheet_height: Number(form.sheet_height),
      print_type: form.print_type,
      color_type: form.color_type,
      quantity: Number(form.quantity),
      wastage_pct: form.wastage_pct,
      finishing_ids: form.finishing_ids,
      gst_applied: gstApplied,
    });
    return c || { paperCost: 0, printCost: 0, wastageCost: 0, finishingCost: 0, profit: 0, gst: 0, finalPrice: 0 };
  }, [form, gstApplied]);

  async function onSubmit(values) {
    try {
      const payload = {
        ...values,
        customer_id: Number(values.customer_id),
        gsm: Number(values.gsm),
        sheet_width: Number(values.sheet_width),
        sheet_height: Number(values.sheet_height),
        quantity: Number(values.quantity),
        wastage_pct: values.wastage_pct === "" ? undefined : Number(values.wastage_pct),
        finishing_ids: values.finishing_ids?.map(Number) || [],
        gst_applied: gstApplied,
        status: "quoted",
      };
      const job = await api.createJob(payload);
      toast.success("Job Created");
      nav(`/jobs/${job.id}`);
    } catch (e) {
      toast.error(e?.message || "Create job failed");
    }
  }

  const finishingIds = Array.isArray(form.finishing_ids) ? form.finishing_ids : [];

  const inputClasses = "w-full rounded-[16px] bg-gray-50 border border-gray-200 px-4 py-3 text-[15px] font-medium text-gray-900 outline-none focus:border-[#3E8B6F] focus:ring-4 focus:ring-[#3E8B6F]/10 focus:bg-white transition-all shadow-sm";
  const labelTextClasses = "mb-1 text-sm font-semibold text-gray-500 tracking-wide";

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
      <div className="space-y-6">
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">New Job</div>
          <div className="text-sm sm:text-[15px] font-medium text-gray-500 mt-1">Create a job and get an instant quotation</div>
        </div>

        <Card>
          {loading ? (
            <Loader />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <label className="block">
                <div className={labelTextClasses}>Customer (search)</div>
                <input
                  className={inputClasses}
                  placeholder="Type to filter..."
                  onChange={(e) => {
                    const q = e.target.value.toLowerCase();
                    api.listCustomers().then((all) => {
                      setCustomers(all.filter((c) => c.name.toLowerCase().includes(q)));
                    });
                  }}
                />
                <select
                  className={`mt-2 ${inputClasses}`}
                  {...register("customer_id", { required: true })}
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <div className={labelTextClasses}>Job Type</div>
                <select className={inputClasses} {...register("job_type")}>
                  <option>Visiting Cards</option>
                  <option>Posters</option>
                  <option>Brochures</option>
                </select>
              </label>

              <label className="block">
                <div className={labelTextClasses}>GSM</div>
                <select
                  className={inputClasses}
                  {...register("gsm", { required: true })}
                >
                  {[80, 100, 120, 250].map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <div className={labelTextClasses}>Sheet Size</div>
                <select
                  className={inputClasses}
                  {...register("sheet")}
                  onChange={(e) => {
                    const v = e.target.value;
                    setValue("sheet", v);
                    if (v === "A4") {
                      setValue("sheet_width", 210);
                      setValue("sheet_height", 297);
                    } else if (v === "A3") {
                      setValue("sheet_width", 297);
                      setValue("sheet_height", 420);
                    }
                  }}
                >
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                  <option value="Custom">Custom</option>
                </select>
              </label>

              <label className="block">
                <div className={labelTextClasses}>Sheet Width (mm)</div>
                <input
                  className={inputClasses}
                  type="number"
                  step="0.01"
                  {...register("sheet_width", { required: true })}
                />
              </label>

              <label className="block">
                <div className={labelTextClasses}>Sheet Height (mm)</div>
                <input
                  className={inputClasses}
                  type="number"
                  step="0.01"
                  {...register("sheet_height", { required: true })}
                />
              </label>

              <label className="block">
                <div className={labelTextClasses}>Sheets</div>
                <input
                  className={inputClasses}
                  type="number"
                  min={1}
                  {...register("num_sheets")}
                />
              </label>

              <div className="hidden md:block" />

              <label className="block">
                <div className={labelTextClasses}>Print Type</div>
                <select
                  className={inputClasses}
                  {...register("print_type", { required: true })}
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                </select>
              </label>

              <label className="block">
                <div className={labelTextClasses}>Color Type</div>
                <select
                  className={inputClasses}
                  {...register("color_type", { required: true })}
                >
                  <option value="bw">B&W</option>
                  <option value="color">Color</option>
                </select>
              </label>

              <label className="block">
                <div className={labelTextClasses}>Quantity</div>
                <input
                  className={inputClasses}
                  type="number"
                  {...register("quantity", { required: true })}
                />
              </label>

              <label className="block">
                <div className={labelTextClasses}>Wastage % (optional)</div>
                <input
                  className={inputClasses}
                  type="number"
                  step="0.01"
                  placeholder={pricing ? `default ${pricing.wastage_pct}%` : ""}
                  {...register("wastage_pct")}
                />
              </label>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="text-lg font-bold text-gray-900 mb-4">Finishing Options</div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {finishing.map((f) => {
                  const checked = finishingIds.includes(String(f.id)) || finishingIds.includes(f.id);
                  return (
                    <label
                      key={f.id}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 cursor-pointer transition-all ${checked ? "bg-[#3E8B6F]/5 border-[#3E8B6F] shadow-sm" : "bg-gray-50 border-gray-200 hover:border-[#3E8B6F]/40"}`}
                    >
                      <span className={`text-[15px] ${checked ? "text-[#3E8B6F] font-bold" : "text-gray-700 font-medium"}`}>
                        {f.name} <span className="text-gray-400 font-normal ml-1">₹{Number(f.rate).toFixed(0)}</span>
                      </span>
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-[#3E8B6F]"
                        checked={Boolean(checked)}
                        onChange={(e) => {
                          const next = new Set(finishingIds.map(String));
                          if (e.target.checked) next.add(String(f.id));
                          else next.delete(String(f.id));
                          setValue("finishing_ids", Array.from(next));
                        }}
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-6 border-t border-gray-100">
              <Button type="submit" className="w-full sm:w-auto font-bold py-3 shadow-md">Generate Quotation</Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full sm:w-auto py-3 font-semibold"
                onClick={handleSubmit(async (values) => {
                  const payload = {
                    ...values,
                    customer_id: Number(values.customer_id),
                    gsm: Number(values.gsm),
                    sheet_width: Number(values.sheet_width),
                    sheet_height: Number(values.sheet_height),
                    quantity: Number(values.quantity),
                    wastage_pct: values.wastage_pct === "" ? undefined : Number(values.wastage_pct),
                    finishing_ids: values.finishing_ids?.map(Number) || [],
                    gst_applied: gstApplied,
                    status: "draft",
                  };
                  await api.createJob(payload);
                  toast.success("Draft Saved");
                  nav("/jobs");
                })}
              >
                Save as Draft
              </Button>
            </div>
            </form>
          )}
        </Card>
      </div>

      <div className="xl:sticky xl:top-24 h-fit">
        <CostBreakdown
          costs={costs}
          gstApplied={gstApplied}
          onToggleGst={() => setGstApplied((v) => !v)}
        />
      </div>
    </div>
  );
}
