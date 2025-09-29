// src/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();
app.use(express.json());
// TODO: when FE URL is known, tighten CORS like:
// app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3001"] }));
app.use(cors());

// Health check
app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: "up" });
  } catch (e) {
    res.status(500).json({ ok: false, db: "down", error: e.message });
  }
});

// GET /search?q=<text>&page=1&page_size=20
app.get("/search", async (req, res) => {
  try {
    const q = (req.query.q || "").toString().trim();
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.page_size) || 20));
    const skip = (page - 1) * pageSize;

    // MySQL is case-insensitive by default under typical collations
    const where = q
      ? {
          OR: [
            { sku:  { contains: q } },
            { name: { contains: q } },
          ],
        }
      : {};

    const [total, parts] = await Promise.all([
      prisma.part.count({ where }),
      prisma.part.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { sku: "asc" },
      }),
    ]);

    res.json({
      total,
      page,
      page_size: pageSize,
      items: parts.map((p) => ({
        sku: p.sku,
        name: p.name,
        unit_price: p.unitPrice,
        origin_country: p.originCountry, // "US" | "NONUS" | "UNKNOWN"
        is_domestic: p.isDomestic,
        weight_kg: p.weightKg,
      })),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "search_failed", detail: e.message });
  }
});

// Optional: basic root response so "/" isn't 404
app.get("/", (_req, res) => {
  res.type("text").send("Aurora backend is running. Try /health or /search?q=rail");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
