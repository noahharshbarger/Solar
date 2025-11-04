const { PrismaClient } = require("@prisma/client");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

function parseBoolDomestic(val) {
  if (val == null) return null;
  const s = String(val).trim().toLowerCase();
  if (["d","domestic","yes","y","us","usa","true","t"].includes(s)) return true;
  if (["nd","non-domestic","no","n","non domestic","false","f"].includes(s)) return false;
  return null;
}
function parsePrice(val) {
  if (val == null || val === "") return null;
  const num = Number(String(val).replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(num) ? num : null;
}

async function main() {
  // ---- read mapping + workbook ----
  const mappingPath = path.join(process.cwd(), "data", "raw", "mapping.json");
  if (!fs.existsSync(mappingPath)) throw new Error(`Missing mapping file: ${mappingPath}`);
  const map = JSON.parse(fs.readFileSync(mappingPath, "utf8"));

  const xlsxPath = path.join(process.cwd(), "data", "raw", "material list (1).xlsx");
  if (!fs.existsSync(xlsxPath)) throw new Error(`Missing Excel: ${xlsxPath}`);

  const wb = XLSX.readFile(xlsxPath);
  const wsName = typeof map.sheetName === "number" ? wb.SheetNames[map.sheetName] : map.sheetName;
  const ws = wb.Sheets[wsName];
  if (!ws) throw new Error(`Sheet not found: ${wsName}`);

  // ---- read as rows and auto-detect header row ----
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false, defval: null });
  if (!rows.length) throw new Error("Sheet has no rows.");

  const requiredHeaders = [
    map.columns.sku,
    map.columns.brand,
    map.columns.partType,
    map.columns.price,
    map.columns.domestic,
  ].map((h) => (h || "").toString().trim());

  const headerRowIndex = rows.findIndex((row) => {
    const normalized = row.map((c) => (c == null ? "" : String(c).trim()));
    return requiredHeaders.every((h) => normalized.includes(h));
  });

  if (headerRowIndex === -1) {
    const preview = rows.slice(0, 10).map((r) => JSON.stringify(r)).join("\n");
    throw new Error(
      `Could not find a row containing all headers: ${requiredHeaders.join(", ")}.\n` +
      `First 10 rows preview:\n${preview}`
    );
  }

  const headerRow = rows[headerRowIndex].map((c) => (c == null ? "" : String(c).trim()));
  const idx = {
    sku: headerRow.indexOf(map.columns.sku),
    brand: headerRow.indexOf(map.columns.brand),
    partType: headerRow.indexOf(map.columns.partType),
    price: headerRow.indexOf(map.columns.price),
    domestic: headerRow.indexOf(map.columns.domestic),
  };

  let created = 0, updated = 0, skipped = 0;

  for (let r = headerRowIndex + 1; r < rows.length; r++) {
    const row = rows[r] || [];
    const sku = ((row[idx.sku] ?? "") + "").trim();
    if (!sku) { skipped++; continue; }

    const brand = ((row[idx.brand] ?? "") + "").trim();
    const partType = ((row[idx.partType] ?? "") + "").trim();
    const price = parsePrice(row[idx.price]);
    const dom = parseBoolDomestic(row[idx.domestic]);

    const name = [brand, partType].filter(Boolean).join(" ") || sku;
    const originCountry = dom === true ? "US" : dom === false ? "NONUS" : "UNKNOWN";

    const prev = await prisma.part.findUnique({ where: { sku } });
    await prisma.part.upsert({
      where: { sku },
      create: { sku, name, unitPrice: price, weightKg: null, originCountry, isDomestic: dom ?? false },
      update: { name, unitPrice: price, originCountry, isDomestic: dom ?? false },
    });
    prev ? updated++ : created++;
  }

  console.log(`Done. created=${created}, updated=${updated}, skipped_missing_sku=${skipped}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
