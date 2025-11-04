import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

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
  const wsName = typeof map.sheetName === "number" ? wb.SheetNames[map.sheetName] : map.sheetName;
  const ws = wb.Sheets[wsName];
  if (!ws) throw new Error(`Sheet not found: ${wsName}`);

  const rows: any[] = XLSX.utils.sheet_to_json(ws, { range: map.headerStartsAt, defval: null });
  if (!rows.length) throw new Error("No rows parsed from Excel. Check headerStartsAt in mapping.json.");

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
