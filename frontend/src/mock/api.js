import {
  DEMO_USER,
  INITIAL_CUSTOMERS,
  INITIAL_FINISHING,
  INITIAL_PRICING,
  JOB_TYPES,
} from "./data";

const LS_KEYS = {
  auth: "pp_demo_auth",
  customers: "pp_demo_customers",
  jobs: "pp_demo_jobs",
  invoices: "pp_demo_invoices",
  pricing: "pp_demo_pricing",
  finishing: "pp_demo_finishing",
};

function delay() {
  const ms = 300 + Math.floor(Math.random() * 500);
  return new Promise((r) => setTimeout(r, ms));
}

function readLS(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeeded() {
  if (!localStorage.getItem(LS_KEYS.customers)) writeLS(LS_KEYS.customers, INITIAL_CUSTOMERS);
  if (!localStorage.getItem(LS_KEYS.pricing)) writeLS(LS_KEYS.pricing, INITIAL_PRICING);
  if (!localStorage.getItem(LS_KEYS.finishing)) writeLS(LS_KEYS.finishing, INITIAL_FINISHING);
  if (!localStorage.getItem(LS_KEYS.jobs)) {
    const seededJobs = [
      {
        id: 101,
        customer_id: 1,
        customer_name: "Raj Printing Works",
        job_type: "Visiting Cards",
        gsm: 300,
        sheet: "A4",
        print_type: "double",
        color_type: "color",
        quantity: 2000,
        status: "quoted",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        ...calculateCosts({
          gsm: 100,
          sheet_width: 210,
          sheet_height: 297,
          print_type: "double",
          color_type: "color",
          quantity: 2000,
          finishing_ids: [1, 2],
          gst_applied: true,
        }),
      },
      {
        id: 102,
        customer_id: 2,
        customer_name: "Shree Offset Press",
        job_type: "Posters",
        gsm: 120,
        sheet: "A3",
        print_type: "single",
        color_type: "color",
        quantity: 500,
        status: "invoiced",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        ...calculateCosts({
          gsm: 120,
          sheet_width: 297,
          sheet_height: 420,
          print_type: "single",
          color_type: "color",
          quantity: 500,
          finishing_ids: [3],
          gst_applied: false,
        }),
      },
      {
        id: 103,
        customer_id: 3,
        customer_name: "Kumar Graphics",
        job_type: "Brochures",
        gsm: 80,
        sheet: "A4",
        print_type: "double",
        color_type: "bw",
        quantity: 3000,
        status: "paid",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
        ...calculateCosts({
          gsm: 80,
          sheet_width: 210,
          sheet_height: 297,
          print_type: "double",
          color_type: "bw",
          quantity: 3000,
          finishing_ids: [1, 4],
          gst_applied: true,
        }),
      },
    ];
    writeLS(LS_KEYS.jobs, seededJobs);
  }
  if (!localStorage.getItem(LS_KEYS.invoices)) {
    const seededInvoices = [
      {
        id: 1,
        invoice_no: "INV-0001",
        job_id: 102,
        customer_name: "Shree Offset Press",
        total: readLS(LS_KEYS.jobs, []).find((j) => j.id === 102)?.finalPrice || 0,
        date: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
      },
    ];
    writeLS(LS_KEYS.invoices, seededInvoices);
  }
}

export function isAuthed() {
  const auth = readLS(LS_KEYS.auth, null);
  return Boolean(auth?.ok);
}

export function getAuthedUser() {
  const auth = readLS(LS_KEYS.auth, null);
  return auth?.user || null;
}

export async function login(email, password) {
  await delay();
  if (email === "admin@print.com" && password === "123456") {
    const auth = { ok: true, user: DEMO_USER };
    writeLS(LS_KEYS.auth, auth);
    return auth;
  }
  const err = new Error("Invalid credentials");
  err.status = 401;
  throw err;
}

export async function logout() {
  await delay();
  localStorage.removeItem(LS_KEYS.auth);
  return { ok: true };
}

export function calculateCosts({
  gsm,
  sheet_width,
  sheet_height,
  print_type,
  color_type,
  quantity,
  wastage_pct,
  finishing_ids,
  gst_applied,
}) {
  const pricing = readLS(LS_KEYS.pricing, INITIAL_PRICING);
  const finishing = readLS(LS_KEYS.finishing, INITIAL_FINISHING);

  const gsmRule = pricing.gsmRates.find((r) => Number(r.gsm) === Number(gsm)) || pricing.gsmRates[0];
  const paperRate = Number(gsmRule?.paper_rate_per_sqm || 0);
  const bwRate = Number(pricing.printRates.bw);
  const colorRate = Number(pricing.printRates.color);

  const width_mm = Number(sheet_width || 0);
  const height_mm = Number(sheet_height || 0);
  const qty = Number(quantity || 0);

  const sheetArea = (width_mm / 1000) * (height_mm / 1000);
  const paperCost = paperRate * sheetArea * qty;
  const sides = print_type === "double" ? 2 : 1;
  const printCost = (color_type === "color" ? colorRate : bwRate) * qty * sides;
  const wPct = wastage_pct === undefined || wastage_pct === null || wastage_pct === "" ? Number(pricing.wastage_pct) : Number(wastage_pct);
  const wastageCost = (paperCost + printCost) * (wPct / 100);

  const fIds = Array.isArray(finishing_ids) ? finishing_ids.map(Number) : [];
  const finishingCost = fIds.reduce((s, id) => {
    const opt = finishing.find((x) => Number(x.id) === Number(id));
    return s + Number(opt?.rate || 0);
  }, 0);

  const subtotal = paperCost + printCost + wastageCost + finishingCost;
  const profit = subtotal * (Number(pricing.profit_pct) / 100);
  const gst = gst_applied ? (subtotal + profit) * 0.18 : 0;
  const finalPrice = subtotal + profit + gst;

  return {
    paperCost,
    printCost,
    wastageCost,
    finishingCost,
    profit,
    gst,
    finalPrice,
  };
}

export async function listCustomers() {
  ensureSeeded();
  await delay();
  return readLS(LS_KEYS.customers, INITIAL_CUSTOMERS);
}

export async function createCustomer(payload) {
  ensureSeeded();
  await delay();
  const items = readLS(LS_KEYS.customers, INITIAL_CUSTOMERS);
  const id = Math.max(...items.map((x) => x.id)) + 1;
  const c = { id, ...payload };
  writeLS(LS_KEYS.customers, [c, ...items]);
  return c;
}

export async function updateCustomer(id, payload) {
  ensureSeeded();
  await delay();
  const items = readLS(LS_KEYS.customers, INITIAL_CUSTOMERS).map((x) =>
    x.id === Number(id) ? { ...x, ...payload } : x
  );
  writeLS(LS_KEYS.customers, items);
  return items.find((x) => x.id === Number(id));
}

export async function deleteCustomer(id) {
  ensureSeeded();
  await delay();
  const items = readLS(LS_KEYS.customers, INITIAL_CUSTOMERS).filter((x) => x.id !== Number(id));
  writeLS(LS_KEYS.customers, items);
  return { ok: true };
}

export async function getPricing() {
  ensureSeeded();
  await delay();
  return readLS(LS_KEYS.pricing, INITIAL_PRICING);
}

export async function updatePricing(next) {
  ensureSeeded();
  await delay();
  writeLS(LS_KEYS.pricing, next);
  return next;
}

export async function listFinishing() {
  ensureSeeded();
  await delay();
  return readLS(LS_KEYS.finishing, INITIAL_FINISHING);
}

export async function updateFinishing(next) {
  ensureSeeded();
  await delay();
  writeLS(LS_KEYS.finishing, next);
  return next;
}

export async function listJobs() {
  ensureSeeded();
  await delay();
  return readLS(LS_KEYS.jobs, []);
}

export async function getJob(id) {
  ensureSeeded();
  await delay();
  return readLS(LS_KEYS.jobs, []).find((j) => j.id === Number(id)) || null;
}

export async function createJob(payload) {
  ensureSeeded();
  await delay();
  const jobs = readLS(LS_KEYS.jobs, []);
  const customers = readLS(LS_KEYS.customers, INITIAL_CUSTOMERS);
  const id = Math.max(...jobs.map((x) => x.id)) + 1;
  const customer = customers.find((c) => c.id === Number(payload.customer_id));

  const costs = calculateCosts(payload);
  const job = {
    id,
    customer_id: Number(payload.customer_id),
    customer_name: customer?.name || "Unknown",
    job_type: payload.job_type || JOB_TYPES[id % JOB_TYPES.length],
    gsm: Number(payload.gsm),
    sheet: payload.sheet || "Custom",
    sheet_width: Number(payload.sheet_width),
    sheet_height: Number(payload.sheet_height),
    print_type: payload.print_type,
    color_type: payload.color_type,
    quantity: Number(payload.quantity),
    wastage_pct: payload.wastage_pct === "" ? null : payload.wastage_pct,
    finishing_ids: payload.finishing_ids || [],
    gst_applied: Boolean(payload.gst_applied),
    status: payload.status || "draft",
    created_at: new Date().toISOString(),
    ...costs,
  };
  writeLS(LS_KEYS.jobs, [job, ...jobs]);
  return job;
}

export async function deleteJob(id) {
  ensureSeeded();
  await delay();
  const jobs = readLS(LS_KEYS.jobs, []).filter((j) => j.id !== Number(id));
  writeLS(LS_KEYS.jobs, jobs);
  return { ok: true };
}

export async function listInvoices() {
  ensureSeeded();
  await delay();
  return readLS(LS_KEYS.invoices, []);
}

export async function generateInvoice(jobId) {
  ensureSeeded();
  await delay();
  const invoices = readLS(LS_KEYS.invoices, []);
  const jobs = readLS(LS_KEYS.jobs, []);
  const job = jobs.find((j) => j.id === Number(jobId));
  if (!job) throw new Error("Job not found");

  const exists = invoices.find((i) => i.job_id === Number(jobId));
  if (exists) return exists;

  const id = invoices.length ? Math.max(...invoices.map((x) => x.id)) + 1 : 1;
  const invoice = {
    id,
    invoice_no: `INV-${String(id).padStart(4, "0")}`,
    job_id: job.id,
    customer_name: job.customer_name,
    total: job.finalPrice,
    date: new Date().toISOString(),
  };
  writeLS(LS_KEYS.invoices, [invoice, ...invoices]);

  // update job status
  const nextJobs = jobs.map((j) => (j.id === job.id ? { ...j, status: "invoiced" } : j));
  writeLS(LS_KEYS.jobs, nextJobs);

  return invoice;
}

export async function downloadPdfSim(kind) {
  await delay();
  return { ok: true, kind };
}

export async function reports({ days = 30 } = {}) {
  ensureSeeded();
  await delay();
  const jobs = readLS(LS_KEYS.jobs, []);

  // generate last N days series using existing jobs grouped by day
  const byDay = new Map();
  const byProfit = new Map();

  for (const j of jobs) {
    const d = String(j.created_at).slice(0, 10);
    byDay.set(d, (byDay.get(d) || 0) + Number(j.finalPrice || 0));
    byProfit.set(d, (byProfit.get(d) || 0) + Number(j.profit || 0));
  }

  const today = new Date();
  const series = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    series.push({
      day: key,
      revenue: Math.round(byDay.get(key) || 0),
      profit: Math.round(byProfit.get(key) || 0),
    });
  }

  const bw = jobs.filter((j) => j.color_type === "bw").length;
  const color = jobs.filter((j) => j.color_type === "color").length;

  return {
    daily: series.map((x) => ({ day: x.day, revenue: x.revenue })),
    profit: series.map((x) => ({ day: x.day, profit: x.profit })),
    donut: [
      { name: "B&W", value: bw },
      { name: "Color", value: color },
    ],
  };
}

