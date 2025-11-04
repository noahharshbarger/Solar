const { PrismaClient } = require("@prisma/client");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

type Mapping = {
  sheetName: number | string;
  headerStartsAt: string;               // e.g., "A1" or "A4"
  columns: { sku: string; brand: string; partType: string; price: string; domestic: string };
  priceCurrency?: string;
};

function parseBoolDomestic(val: any): boolean | null {
  if (val == null) return null;
  const s = String(val).trim().toLowerCase();
  if (["d","domestic","yes","y","us","usa","true","t"].includes(s)) return true;
  if (["nd","non-domestic","no","n","non domestic","false","f"].includes(s)) return false;
  return null;
}
function parsePrice(val: any): number | null {
  if (val == null || val === "") return null;
  const num = Number(String(val).replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(num) ? num : null;
}

async function main() {
  const mappingPath = path.join(process.cwd(), "data", "raw", "mapping.json");
  if (!fs.existsSync(mappingPath)) throw new Error(`Missing mapping file: ${mappingPath}`);
  const map: Mapping = JSON.parse(fs.readFileSync(mappingPath, "utf8"));

  const xlsxPath = path.join(process.cwd(), "data", "raw", "material list (1).xlsx");
  if (!fs.existsSync(xlsxPath)) throw new Error(`Missing Excel: ${xlsxPath}`);

  const wb = XLSX.readFile(xlsxPath);
  console.log("Available sheet names:", wb.SheetNames);
  
  const wsName = typeof map.sheetName === "number" ? wb.SheetNames[map.sheetName] : map.sheetName;
  console.log("Looking for sheet:", wsName);
  
  const ws = wb.Sheets[wsName];
  if (!ws) throw new Error(`Sheet not found: ${wsName}`);

  console.log("Found worksheet, trying to read from cell", map.headerStartsAt);
  // Read with headers from row 4
  const rows: any[] = XLSX.utils.sheet_to_json(ws, { 
    range: "A4:F1000", // Read from headers to end
    header: "A",  // Use A,B,C... as temp headers
    defval: null 
  });

  // Skip empty rows and rows before actual data
  const dataRows = rows.slice(4).filter(r => r.A || r.B || r.C);
  console.log("Found data rows:", dataRows.length);

  if (!dataRows.length) {
    console.log("Debug - First few cells content:");
    // Log some cell contents to debug
    for (let col of ['A','B','C','D','E','F']) {
      for (let row of [1,2,3,4,5,6,7,8]) {
        const cell = col + row;
        console.log(`Cell ${cell}:`, ws[cell] ? ws[cell].v : 'empty');
      }
    }
    throw new Error("No rows parsed from Excel. Check headerStartsAt in mapping.json.");
  }

  // Validate headers exist
  const headers = Object.keys(rows[0]);
  ["sku","brand","partType","price","domestic"].forEach(k => {
    const col = (map.columns as any)[k];
    if (!headers.includes(col)) throw new Error(`Column "${col}" not found. Headers: ${headers.join(", ")}`);
  });

  let created = 0, updated = 0, skipped = 0;

  for (const r of rows) {
    const sku = (r[map.columns.sku] ?? "").toString().trim();
    if (!sku) { skipped++; continue; }

    const brand = (r[map.columns.brand] ?? "").toString().trim();
    const partType = (r[map.columns.partType] ?? "").toString().trim();
    const price = parsePrice(r[map.columns.price]);
    const dom = parseBoolDomestic(r[map.columns.domestic]);

    const name = [brand, partType].filter(Boolean).join(" ") || sku;
    const originCountry = dom === true ? "US" : dom === false ? "NONUS" : "UNKNOWN";

    const prev = await prisma.part.findUnique({ where: { sku } });
    await prisma.part.upsert({
      where: { sku },
      create: { sku, name, unitPrice: price, weightKg: null, originCountry, isDomestic: dom ?? false },
      update: { name, unitPrice: price, originCountry, isDomestic: dom ?? false }
    });
    prev ? updated++ : created++;
  }

  console.log(`Done. created=${created}, updated=${updated}, skipped_missing_sku=${skipped}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
