import Card from "./UI/Card";
import { formatCurrency } from "../utils/formatCurrency";
import Toggle from "./UI/Toggle";

export default function CostBreakdown({
  costs,
  gstApplied,
  onToggleGst,
  compact = false,
}) {
  const items = [
    ["Paper Cost", costs.paperCost],
    ["Print Cost", costs.printCost],
    ["Wastage", costs.wastageCost],
    ["Finishing", costs.finishingCost],
    ["Profit", costs.profit],
    ["GST", costs.gst],
  ];

  return (
    <Card className={compact ? "p-4" : "p-6"}>
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="text-[15px] font-bold text-gray-900">Live Cost Preview</div>
        {onToggleGst ? (
          <Toggle checked={gstApplied} onChange={() => onToggleGst()} label="GST" />
        ) : null}
      </div>

      <div className="mt-2 space-y-3">
        {items.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between text-sm">
            <div className="text-gray-500 font-medium">{k}</div>
            <div className="text-gray-800 font-medium">{formatCurrency(v)}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-gray-100 pt-5">
        <div className="text-xs font-semibold text-gray-400 tracking-wider">FINAL PRICE</div>
        <div className="mt-1 text-3xl font-extrabold gradient-text final-glow tracking-tight">
          {formatCurrency(costs.finalPrice)}
        </div>
      </div>
    </Card>
  );
}
