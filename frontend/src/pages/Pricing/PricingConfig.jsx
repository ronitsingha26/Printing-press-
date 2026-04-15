import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import { useAuth } from "../../hooks/useAuth";
import * as api from "../../mock/api";
import Loader from "../../components/UI/Loader";

export default function PricingConfig() {
  const { isAdmin } = useAuth();
  const [pricing, setPricing] = useState(null);
  const [finishing, setFinishing] = useState([]);
  const [newFinish, setNewFinish] = useState({ name: "", rate: "" });
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [p, f] = await Promise.all([api.getPricing(), api.listFinishing()]);
      setPricing(p);
      setFinishing(f);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function savePricing() {
    try {
      await api.updatePricing(pricing);
      toast.success("Saved");
      load();
    } catch (e) {
      toast.error(e?.message || "Save failed");
    }
  }

  async function addFinish() {
    try {
      const next = [
        ...finishing,
        {
          id: finishing.length ? Math.max(...finishing.map((x) => x.id)) + 1 : 1,
          name: newFinish.name,
          rate: Number(newFinish.rate),
        },
      ];
      await api.updateFinishing(next);
      setNewFinish({ name: "", rate: "" });
      toast.success("Added");
      load();
    } catch {
      toast.error("Add failed");
    }
  }

  async function updateFinish(f) {
    try {
      await api.updateFinishing(finishing.map((x) => (x.id === f.id ? { ...f, rate: Number(f.rate) } : x)));
      toast.success("Updated");
      load();
    } catch {
      toast.error("Update failed");
    }
  }

  async function removeFinish(id) {
    if (!confirm("Delete finishing option?")) return;
    try {
      await api.updateFinishing(finishing.filter((x) => x.id !== id));
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  }

  if (!isAdmin) {
    return (
      <Card>
        <div className="text-gray-900 font-semibold">Admin only</div>
        <div className="text-gray-500 text-sm mt-1">You don’t have access to pricing configuration.</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-3xl font-extrabold text-gray-900 tracking-tight">Pricing Config</div>
        <div className="text-[15px] font-medium text-gray-500 mt-1">Manage GSM rates, finishing, wastage and profit</div>
      </div>

      <Card>
        <div className="text-lg font-bold text-gray-900 mb-4">GSM Rules</div>
        {loading || !pricing ? (
          <Loader />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-400 font-bold border-b border-gray-100">
                    <th className="pb-3 pr-4 uppercase tracking-wider text-xs w-32">GSM</th>
                    <th className="pb-3 pr-4 uppercase tracking-wider text-xs">Paper / sqm (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {pricing.gsmRates.map((r, idx) => (
                    <tr key={r.gsm} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-4 pr-4 font-bold text-gray-900">{r.gsm}</td>
                      <td className="py-4 pr-4">
                        <input
                          className="w-32 rounded-[12px] bg-gray-50 border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#3E8B6F] focus:ring-4 focus:ring-[#3E8B6F]/10 focus:bg-white transition-all shadow-sm font-semibold"
                          value={r.paper_rate_per_sqm}
                          onChange={(e) =>
                            setPricing((p) => ({
                              ...p,
                              gsmRates: p.gsmRates.map((x, i) =>
                                i === idx ? { ...x, paper_rate_per_sqm: Number(e.target.value) } : x
                              ),
                            }))
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Print Rates</div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="B&W (₹/side)"
                    value={pricing.printRates.bw}
                    onChange={(e) =>
                      setPricing((p) => ({ ...p, printRates: { ...p.printRates, bw: Number(e.target.value) } }))
                    }
                    className="w-full rounded-[12px] bg-white border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#3E8B6F] shadow-sm font-semibold block mt-1"
                    labelClassName="text-xs font-semibold text-gray-500 block"
                  />
                  <Input
                    label="Color (₹/side)"
                    value={pricing.printRates.color}
                    onChange={(e) =>
                      setPricing((p) => ({ ...p, printRates: { ...p.printRates, color: Number(e.target.value) } }))
                    }
                    className="w-full rounded-[12px] bg-white border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#3E8B6F] shadow-sm font-semibold block mt-1"
                    labelClassName="text-xs font-semibold text-gray-500 block"
                  />
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Global Settings</div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Wastage %"
                    value={pricing.wastage_pct}
                    onChange={(e) => setPricing((p) => ({ ...p, wastage_pct: Number(e.target.value) }))}
                    className="w-full rounded-[12px] bg-white border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#3E8B6F] shadow-sm font-semibold block mt-1"
                    labelClassName="text-xs font-semibold text-gray-500 block"
                  />
                  <Input
                    label="Profit %"
                    value={pricing.profit_pct}
                    onChange={(e) => setPricing((p) => ({ ...p, profit_pct: Number(e.target.value) }))}
                    className="w-full rounded-[12px] bg-white border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#3E8B6F] shadow-sm font-semibold block mt-1"
                    labelClassName="text-xs font-semibold text-gray-500 block"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button className="w-full font-bold shadow-md h-full text-base" onClick={savePricing}>
                  Save Pricing
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      <Card>
        <div className="text-lg font-bold text-gray-900 mb-4">Finishing Options</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 items-end">
          <Input 
             label="Name" 
             value={newFinish.name} 
             onChange={(e) => setNewFinish((x) => ({ ...x, name: e.target.value }))} 
             className="w-full rounded-[16px] bg-gray-50 border border-gray-200 px-4 py-3 text-[15px] font-medium text-gray-900 outline-none focus:border-[#3E8B6F] focus:ring-4 focus:ring-[#3E8B6F]/10 focus:bg-white transition-all shadow-sm block mt-1"
             labelClassName="text-sm font-semibold text-gray-500 block"
          />
          <Input 
             label="Rate (₹)" 
             value={newFinish.rate} 
             onChange={(e) => setNewFinish((x) => ({ ...x, rate: e.target.value }))} 
             className="w-full rounded-[16px] bg-gray-50 border border-gray-200 px-4 py-3 text-[15px] font-medium text-gray-900 outline-none focus:border-[#3E8B6F] focus:ring-4 focus:ring-[#3E8B6F]/10 focus:bg-white transition-all shadow-sm block mt-1"
             labelClassName="text-sm font-semibold text-gray-500 block"
          />
          <Button onClick={addFinish} className="py-3 shadow-md font-bold mb-1 border-t-2">Add Option</Button>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-400 font-bold border-b border-gray-100">
                <th className="pb-3 pr-4 uppercase tracking-wider text-xs">Name</th>
                <th className="pb-3 pr-4 uppercase tracking-wider text-xs w-32">Rate (₹)</th>
                <th className="pb-3 pr-4 uppercase tracking-wider text-xs w-48">Actions</th>
              </tr>
            </thead>
            <tbody>
              {finishing.map((f) => (
                <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 pr-4">
                    <input className="w-full max-w-xs rounded-[12px] bg-gray-50 border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#3E8B6F] focus:bg-white transition-all shadow-sm font-semibold"
                      value={f.name}
                      onChange={(e) => setFinishing((all) => all.map((x) => (x.id === f.id ? { ...x, name: e.target.value } : x)))}
                    />
                  </td>
                  <td className="py-4 pr-4">
                    <input className="w-24 rounded-[12px] bg-gray-50 border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#3E8B6F] focus:bg-white transition-all shadow-sm font-semibold"
                      value={f.rate}
                      onChange={(e) => setFinishing((all) => all.map((x) => (x.id === f.id ? { ...x, rate: e.target.value } : x)))}
                    />
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="ghost" className="px-3" onClick={() => updateFinish(f)}>Save</Button>
                      <Button variant="danger" className="px-3" onClick={() => removeFinish(f.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!finishing.length ? (
                <tr>
                  <td className="py-8 text-center text-gray-500 font-medium" colSpan={3}>No finishing options yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
