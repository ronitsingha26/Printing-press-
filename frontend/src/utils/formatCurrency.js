export function formatCurrency(n) {
  const v = Number(n || 0);
  return v.toLocaleString("en-IN", { style: "currency", currency: "INR" });
}

