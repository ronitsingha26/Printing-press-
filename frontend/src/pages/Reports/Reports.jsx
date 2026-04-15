import { useEffect, useMemo, useState } from "react";
import Card from "../../components/UI/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import * as api from "../../mock/api";
import Loader from "../../components/UI/Loader";

const COLORS = ["#06b6d4", "#7c3aed"];

export default function Reports() {
  const [days, setDays] = useState(30);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [daily, setDaily] = useState([]);
  const [profit, setProfit] = useState([]);
  const [donut, setDonut] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const r = await api.reports({ days });
        setDaily(r.daily);
        setProfit(r.profit);
        setDonut(r.donut);
      } finally {
        setLoading(false);
      }
    })();
  }, [days]);

  const filteredDaily = useMemo(() => {
    if (!from && !to) return daily;
    const f = from || "0000-00-00";
    const t = to || "9999-99-99";
    return daily.filter((x) => x.day >= f && x.day <= t);
  }, [daily, from, to]);

  const filteredProfit = useMemo(() => {
    if (!from && !to) return profit;
    const f = from || "0000-00-00";
    const t = to || "9999-99-99";
    return profit.filter((x) => x.day >= f && x.day <= t);
  }, [profit, from, to]);

  const inputClasses = "ml-2 rounded-[12px] bg-white border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#3E8B6F] shadow-sm font-semibold";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Reports</div>
          <div className="text-sm sm:text-[15px] font-medium text-gray-500 mt-1">Revenue, profit, and job distribution</div>
        </div>
        <div className="flex flex-wrap items-end gap-3 bg-gray-50 p-3 border border-gray-100 shadow-sm rounded-2xl w-full">
          <label className="text-sm font-semibold text-gray-500 flex flex-col sm:flex-row sm:items-center gap-1">
            Range
            <select
              className={inputClasses}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            >
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-gray-500 flex flex-col sm:flex-row sm:items-center gap-1">
            From
            <input
              className={inputClasses}
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label className="text-sm font-semibold text-gray-500 flex flex-col sm:flex-row sm:items-center gap-1">
            To
            <input
              className={inputClasses}
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>
        </div>
      </div>

      {loading ? <Loader /> : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="text-lg font-bold text-gray-900">Daily Revenue</div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredDaily}>
                <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="revenue" fill="#3E8B6F" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="text-lg font-bold text-gray-900">Profit Trend</div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredProfit}>
                <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}} />
                <Line type="monotone" dataKey="profit" stroke="#2A6550" strokeWidth={4} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="text-lg font-bold text-gray-900">Jobs by Type</div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donut} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95} paddingAngle={4}>
                  {donut.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-5 flex gap-6 text-sm text-gray-600 font-semibold justify-center">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#06b6d4]" /> B&W
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#7c3aed]" /> Color
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-lg font-bold text-gray-900">Insights</div>
          <div className="mt-3 text-[15px] font-medium text-gray-500 leading-relaxed">
            Use the date filter to narrow charts. This is securely simulated placeholder data stored statically in your local browser state to provide instantaneous dashboard renders during your demonstration.
          </div>
        </Card>
      </div>
    </div>
  );
}
