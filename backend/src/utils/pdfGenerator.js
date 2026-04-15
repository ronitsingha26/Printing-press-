const PDFDocument = require("pdfkit");

function money(n) {
  const v = Number(n || 0);
  return v.toLocaleString("en-IN", { style: "currency", currency: "INR" });
}

function buildTable(doc, rows, startX, startY, colWidths) {
  const rowH = 22;
  let y = startY;

  rows.forEach((row, idx) => {
    const isHeader = idx === 0;
    doc
      .font(isHeader ? "Helvetica-Bold" : "Helvetica")
      .fontSize(10)
      .fillColor(isHeader ? "#111827" : "#111827");

    let x = startX;
    row.forEach((cell, cIdx) => {
      doc
        .rect(x, y, colWidths[cIdx], rowH)
        .strokeColor("#E5E7EB")
        .stroke();
      doc.text(String(cell), x + 8, y + 6, {
        width: colWidths[cIdx] - 16,
        align: cIdx === row.length - 1 ? "right" : "left",
      });
      x += colWidths[cIdx];
    });

    if (isHeader) {
      doc
        .rect(startX, y, colWidths.reduce((a, b) => a + b, 0), rowH)
        .fillOpacity(0.06)
        .fill("#7c3aed")
        .fillOpacity(1);
    }

    y += rowH;
  });

  return y;
}

function generateQuotationPDF({ companyName, job, customer, finishingNames }) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  doc.font("Helvetica-Bold").fontSize(18).fillColor("#111827");
  doc.text(companyName || "Printing Press", { align: "left" });

  doc.moveDown(0.5);
  doc.font("Helvetica").fontSize(10).fillColor("#6B7280");
  doc.text(`Quotation #J${job.id}`);
  doc.text(`Date: ${new Date(job.created_at || Date.now()).toLocaleDateString("en-IN")}`);

  doc.moveDown(1);
  doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827");
  doc.text("Customer");
  doc.font("Helvetica").fontSize(10);
  doc.text(customer?.name || "-");
  if (customer?.phone) doc.text(customer.phone);
  if (customer?.email) doc.text(customer.email);
  if (customer?.address) doc.text(customer.address);

  doc.moveDown(1);
  doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827");
  doc.text("Job Details");
  doc.font("Helvetica").fontSize(10);
  doc.text(`GSM: ${job.gsm}`);
  doc.text(`Sheet: ${job.sheet_width} × ${job.sheet_height} mm`);
  doc.text(`Print: ${job.print_type} side`);
  doc.text(`Color: ${job.color_type}`);
  doc.text(`Quantity: ${job.quantity}`);
  if (finishingNames?.length) doc.text(`Finishing: ${finishingNames.join(", ")}`);

  doc.moveDown(1);
  doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827");
  doc.text("Cost Breakdown");

  const rows = [
    ["Item", "Amount"],
    ["Paper Cost", money(job.paper_cost)],
    ["Print Cost", money(job.print_cost)],
    ["Wastage Cost", money(job.wastage_cost)],
    ["Finishing Cost", money(job.finishing_cost)],
    ["Profit", money(job.profit)],
    ["GST", money(job.gst)],
    ["Final Price", money(job.final_price)],
  ];

  const yEnd = buildTable(doc, rows, 50, doc.y + 10, [360, 140]);

  doc.y = yEnd + 20;
  doc.font("Helvetica").fontSize(10).fillColor("#6B7280");
  doc.text("This is a system-generated quotation.", { align: "left" });

  return doc;
}

function generateInvoicePDF({ companyName, invoice, job, customer, finishingNames }) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  doc.font("Helvetica-Bold").fontSize(18).fillColor("#111827");
  doc.text(companyName || "Printing Press", { align: "left" });

  doc.moveDown(0.5);
  doc.font("Helvetica").fontSize(10).fillColor("#6B7280");
  doc.text(`Invoice #: ${invoice.invoice_number}`);
  doc.text(`Date: ${new Date(invoice.generated_at || Date.now()).toLocaleDateString("en-IN")}`);

  doc.moveDown(1);
  doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827");
  doc.text("Bill To");
  doc.font("Helvetica").fontSize(10);
  doc.text(customer?.name || "-");
  if (customer?.phone) doc.text(customer.phone);
  if (customer?.email) doc.text(customer.email);
  if (customer?.address) doc.text(customer.address);

  doc.moveDown(1);
  doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827");
  doc.text("Job Reference");
  doc.font("Helvetica").fontSize(10);
  doc.text(`Job ID: ${job.id}`);
  doc.text(`GSM: ${job.gsm} | Sheet: ${job.sheet_width} × ${job.sheet_height} mm`);
  doc.text(`Print: ${job.print_type} | Color: ${job.color_type} | Qty: ${job.quantity}`);
  if (finishingNames?.length) doc.text(`Finishing: ${finishingNames.join(", ")}`);

  doc.moveDown(1);
  doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827");
  doc.text("Amount");

  const rows = [
    ["Item", "Amount"],
    ["Subtotal (incl. wastage + finishing)", money(Number(job.paper_cost) + Number(job.print_cost) + Number(job.wastage_cost) + Number(job.finishing_cost))],
    ["Profit", money(job.profit)],
    ["GST", money(job.gst)],
    ["Total", money(invoice.total)],
  ];
  buildTable(doc, rows, 50, doc.y + 10, [360, 140]);

  doc.moveDown(2);
  doc.font("Helvetica").fontSize(10).fillColor("#6B7280");
  doc.text("This is a system-generated invoice.", { align: "left" });

  return doc;
}

module.exports = { generateQuotationPDF, generateInvoicePDF };

