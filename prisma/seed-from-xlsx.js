// prisma/seed-from-xlsx.js
const { PrismaClient } = require("@prisma/client");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

function norm(s) {
  return String(s ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function parseBoolDomestic(val) {
  if (val == null) return null;
  const s = norm(val);
  if (["d","domestic","yes","y","us","usa","true","t"].includes(s)) return true;
  if (["nd","non-domestic","no","n","non domestic","false","f"].includes(s)) return false;
  return null;
}

function parsePrice(val) {
  if (val == null || val === "") return null;
  const num = Number(String(val).replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(num) ? num : null;
}

function findHeaderRow(rows, requiredHeaders) {
  // Find the first row that contains *all* required headers (normalized)
  const needed = requiredHeaders.map(norm);
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].map(norm);
    const ok = needed.every((h) => row.includes(h));
    if (ok) return i;
  }
  return -1;
}

function pickPriceHeaders(headers) {
  // Prefer explicit names if present
  const preferred = ["curtis price", "anthony price"];
  const lower = headers.map(norm);
  for (const p of preferred) {
    const idx = lower.indexOf(p);
    if (idx !== -1) return [headers[idx]];
  }
  // Otherwise, any header containing "price" but not "domestic"
  const candidates = [];
  headers.forEach((h) => {
    const s = norm(h);
    if (s.includes("price") && !s.includes("domestic")) candidates.push(h);
  });
  return candidates; // may be multiple (e.g., Price, Price_1)
}

async function main() {
  const mappingPath = path.join(process.cwd(), "data", "raw", "mapping.json");
  if (!fs.existsSync(mappingPath)) throw new Error(`Missing mapping file: ${mappingPath}`);
  const map = JSON.parse(fs.readFileSync(mappingPath, "utf8"));

  const xlsxPath = path.join(process.cwd(), "data", "raw", "material list (1).xlsx");
  if (!fs.existsSync(xlsxPath)) throw new Error(`Missing Excel: ${xlsxPath}`);

  const wb = XLSX.readFile(xlsxPath, { cellDates: false, cellNF: false, cellText: false });
  const wsName = typeof map.sheetName === "number" ? wb.SheetNames[map.sheetName] : map.sheetName;
  const ws = wb.Sheets[wsName];
  if (!ws) throw new Error(`Sheet not found: ${wsName} (available: ${wb.SheetNames.join(", ")})`);

  // Read as array-of-arrays (no headers). This avoids the A2/A3 range issue entirely.
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false, defval: null });
  if (!rows.length) throw new Error("Sheet appears empty.");

  // Figure out which row is the header by looking for 3 key columns
  const required = [map.columns.partType, map.columns.brand, map.columns.sku];
  const headerRowIndex = findHeaderRow(rows, required);
  if (headerRowIndex === -1) {
    throw new Error(
      `Could not find a header row containing: ${required.join(", ")}. ` +
      `First 5 rows for reference: ` + JSON.stringify(rows.slice(0,5))
    );
  }

  const header = rows[headerRowIndex];
  const headerIndex = {};
  header.forEach((h, i) => (headerIndex[norm(h)] = i));

  // Validate mandatory headers exist
  const getIdx = (label) => {
    const idx = headerIndex[norm(label)];
    if (idx == null) throw new Error(`Header "${label}" not found. Actual headers: ${header.join(" | ")}`);
    return idx;
  };

  const idxSku = getIdx(map.columns.sku);
  const idxBrand = getIdx(map.columns.brand);
  const idxPartType = getIdx(map.columns.partType);

  // Price: explicit or auto-detect
  let priceCols = [];
  if (map.columns.price && map.columns.price !== "__AUTO__") {
    const idx = getIdx(map.columns.price);
    priceCols = [header[idx]];
  } else {
    priceCols = pickPriceHeaders(header);
    if (!priceCols.length) {
      throw new Error(`Couldn't auto-detect a price column from headers: ${header.join(" | ")}`);
    }
  }
  const priceIdxs = priceCols
    .map((h) => headerIndex[norm(h)])
    .filter((x) => x != null);

  // Domestic column (exact label from mapping)
  const idxDomestic = getIdx(map.columns.domestic);

  let created = 0, updated = 0, skipped = 0;

  // Data starts on the next row after the header
  for (let r = headerRowIndex + 1; r < rows.length; r++) {
    const row = rows[r] || [];
    const rawSku = row[idxSku];
    const sku = String(rawSku ?? "").trim();
    if (!sku) { skipped++; continue; }

    const brand = String(row[idxBrand] ?? "").trim();
    const partType = String(row[idxPartType] ?? "").trim();

    // pick first numeric among candidate price columns
    let unitPrice = null;
    for (const pi of priceIdxs) {
      const p = parsePrice(row[pi]);
      if (p != null) { unitPrice = p; break; }
    }

    const dom = parseBoolDomestic(row[idxDomestic]);
    const name = [brand, partType].filter(Boolean).join(" ") || sku;
    const originCountry = dom === true ? "US" : dom === false ? "NONUS" : "UNKNOWN";

    const prev = await prisma.part.findUnique({ where: { sku } });
    await prisma.part.upsert({
      where: { sku },
      create: { sku, name, unitPrice, weightKg: null, originCountry, isDomestic: dom ?? false },
      update: { name, unitPrice, originCountry, isDomestic: dom ?? false },
    });
    prev ? updated++ : created++;
  }

  console.log(`Done. created=${created}, updated=${updated}, skipped_missing_sku=${skipped}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
