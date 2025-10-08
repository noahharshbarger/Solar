// src/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const makeAurora = require("./auroraClient");
let aurora;
try { aurora = makeAurora(); } catch (e) { console.warn("Aurora client not initialized:", e.message); }

const { buildComparison } = require("./compare");

const app = express();
app.use(express.json());
app.use(cors()); // tighten to FE origin(s) later
app.use(express.static("public")); //testing in the browser

// ---------- helpers ----------
function safeDetail(err) {
  if (err.response?.data) {
    try { return JSON.stringify(err.response.data); } catch {}
    return String(err.response.data);
  }
  return err.message || "unknown_error";
}
function apiStatus(err) { return Number(err.response?.status) || 502; }

// ---------- root ----------
app.get("/", (_req, res) => {
  res
    .type("text")
    .send("Aurora backend running. Try /health, /search, /aurora/projects, /aurora/projects/:id/designs, /aurora/modules, /compare/:designId");
});

// ---------- health ----------
app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: "up" });
  } catch (e) {
    res.status(500).json({ ok: false, db: "down", error: e.message });
  }
});

// ---------- search (page + page_size + has_more) ----------
app.get("/search", async (req, res) => {
  try {
    const q = (req.query.q || "").toString().trim();
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.page_size) || 20));
    const skip = (page - 1) * pageSize;

    const where = q ? { OR: [{ sku: { contains: q } }, { name: { contains: q } }] } : {};
    const [total, items] = await Promise.all([
      prisma.part.count({ where }),
      prisma.part.findMany({ where, skip, take: pageSize, orderBy: { sku: "asc" } }),
    ]);

    res.json({
      total,
      page,
      page_size: pageSize,
      has_more: page * pageSize < total,
      items: items.map((p) => ({
        sku: p.sku,
        name: p.name,
        unit_price: p.unitPrice,
        origin_country: p.originCountry,
        is_domestic: p.isDomestic,
        weight_kg: p.weightKg,
      })),
    });
  } catch (e) {
    res.status(500).json({ type: "about:blank", title: "search_failed", status: 500, detail: e.message });
  }
});

// ---------- aurora: projects (page/per_page + has_more) ----------
app.get("/aurora/projects", async (req, res) => {
  try {
    if (!aurora) throw new Error("Aurora not initialized");
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const per_page = Math.min(250, Math.max(1, parseInt(req.query.per_page) || 50));
    const data = await aurora.listProjects({ page, per_page });
    res.json({
      projects: data.items,
      page: data.page,
      per_page: data.per_page,
      total: data.total ?? undefined,
      has_more: data.has_more,
    });
  } catch (e) {
    res.status(apiStatus(e)).json({ type: "about:blank", title: "aurora_projects_failed", status: apiStatus(e), detail: safeDetail(e) });
  }
});

// ---------- aurora: designs (page/per_page + has_more) ----------
app.get("/aurora/projects/:projectId/designs", async (req, res) => {
  try {
    if (!aurora) throw new Error("Aurora not initialized");
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const per_page = Math.min(250, Math.max(1, parseInt(req.query.per_page) || 50));
    const data = await aurora.listDesigns(req.params.projectId, { page, per_page });
    res.json({
      designs: data.items,
      page: data.page,
      per_page: data.per_page,
      total: data.total ?? undefined,
      has_more: data.has_more,
    });
  } catch (e) {
    res.status(apiStatus(e)).json({ type: "about:blank", title: "aurora_designs_failed", status: apiStatus(e), detail: safeDetail(e) });
  }
});

// ---------- aurora: components (limit + next_cursor + has_more) ----------
app.get("/aurora/modules", async (req, res) => {
  try {
    if (!aurora) throw new Error("Aurora not initialized");
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 50));
    const cursor = req.query.cursor || undefined;
    const page = await aurora.listModules({ limit, cursor });
    res.json({ modules: page.items, limit: page.limit, next_cursor: page.next_cursor, has_more: page.has_more });
  } catch (e) {
    res.status(apiStatus(e)).json({ type: "about:blank", title: "aurora_modules_failed", status: apiStatus(e), detail: safeDetail(e) });
  }
});

app.get("/aurora/inverters", async (req, res) => {
  try {
    if (!aurora) throw new Error("Aurora not initialized");
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 50));
    const cursor = req.query.cursor || undefined;
    const page = await aurora.listInverters({ limit, cursor });
    res.json({ inverters: page.items, limit: page.limit, next_cursor: page.next_cursor, has_more: page.has_more });
  } catch (e) {
    res.status(apiStatus(e)).json({ type: "about:blank", title: "aurora_inverters_failed", status: apiStatus(e), detail: safeDetail(e) });
  }
});

app.get("/aurora/dc-optimizers", async (req, res) => {
  try {
    if (!aurora) throw new Error("Aurora not initialized");
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 50));
    const cursor = req.query.cursor || undefined;
    const page = await aurora.listDcOptimizers({ limit, cursor });
    res.json({ dc_optimizers: page.items, limit: page.limit, next_cursor: page.next_cursor, has_more: page.has_more });
  } catch (e) {
    res.status(apiStatus(e)).json({ type: "about:blank", title: "aurora_dc_optimizers_failed", status: apiStatus(e), detail: safeDetail(e) });
  }
});

// ================== IMPORTANT ORDER: more specific FIRST ==================

// ---------- NEW: compare projects (page/per_page) ----------
app.get("/compare/projects", async (req, res) => {
  try {
    if (!aurora) throw new Error("Aurora not initialized");
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const per_page = Math.min(50, Math.max(1, parseInt(req.query.per_page) || 10));
    const designs_per_project = Math.min(5, Math.max(1, parseInt(req.query.designs_per_project) || 1));

    const proj = await aurora.listProjects({ page, per_page });

    const items = [];
    for (const p of proj.items) {
      const d = await aurora.listDesigns(p.id, { page: 1, per_page: designs_per_project });
      const summaries = [];
      for (const z of d.items) {
        const raw = await aurora.getDesignPricing(z.id);
        const pricing = raw && raw.pricing ? raw.pricing : raw;
        const cmp = await buildComparison(raw);
        summaries.push({
          design_id: z.id,
          name: z.name,
          ppw: pricing.price_per_watt ?? null,
          base_system_price: pricing.system_price ?? pricing.system_cost ?? null,
          totals: cmp.summary,
        });
      }
      items.push({
        project_id: p.id,
        project_name: p.name,
        designs: summaries,
      });
    }

    res.json({
      page: proj.page,
      per_page: proj.per_page,
      has_more: proj.has_more,
      items,
    });
  } catch (e) {
    res.status(apiStatus(e)).json({ type: "about:blank", title: "compare_projects_failed", status: apiStatus(e), detail: safeDetail(e) });
  }
});

// ---------- compare single design ----------
app.get("/compare/:designId", async (req, res) => {
  try {
    if (!aurora) throw new Error("Aurora not initialized");
    const raw = await aurora.getDesignPricing(req.params.designId);
    const p = raw && raw.pricing ? raw.pricing : raw;

    const cmp = await buildComparison(raw);

    res.json({
      design_id: req.params.designId,
      pricing_method: p.pricing_method ?? p.pricing_mode ?? null,
      ppw: p.price_per_watt ?? null,
      base_system_price: p.system_price ?? p.system_cost ?? null,
      incentives: p.incentives ?? [],
      component_count: Array.isArray(p?.pricing_by_component) ? p.pricing_by_component.length : 0,
      ...cmp, // { items, summary }
    });
  } catch (e) {
    res.status(apiStatus(e)).json({ type: "about:blank", title: "compare_failed", status: apiStatus(e), detail: safeDetail(e) });
  }
});

// ================== END ORDER SENSITIVE SECTION ==================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
