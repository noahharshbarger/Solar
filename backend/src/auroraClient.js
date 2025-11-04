// src/auroraClient.js
const axios = require("axios");

function makeAurora() {
  const base = process.env.AURORA_API_BASE || "https://api.aurorasolar.com";
  const tenantId = process.env.AURORA_TENANT_ID;
  const token = process.env.AURORA_API_TOKEN;
  const version = process.env.AURORA_API_VERSION || "2024.05";

  if (!tenantId || !token) throw new Error("Missing AURORA_TENANT_ID or AURORA_API_TOKEN in .env");

  const http = axios.create({
    baseURL: base.replace(/\/+$/, ""),
    timeout: 30000,
    headers: {
      Authorization: `Bearer ${token}`,
      "Aurora-Version": version, // response shape can vary by version
      Accept: "application/json",
    },
  });

  // ---------- Components (limit + possible cursor) ----------
  async function listModules({ limit = 50, cursor } = {}) {
    const { data } = await http.get(`/tenants/${tenantId}/components/modules`, { params: { limit, cursor } });
    // Normalize different shapes across versions
    const items = data.items || data.modules || [];
    return {
      items,
      next_cursor: data.next_cursor || null,
      limit,
      has_more: items.length >= Number(limit),
    };
  }
  async function listInverters({ limit = 50, cursor } = {}) {
    const { data } = await http.get(`/tenants/${tenantId}/components/inverters`, { params: { limit, cursor } });
    const items = data.items || data.inverters || [];
    return {
      items,
      next_cursor: data.next_cursor || null,
      limit,
      has_more: items.length >= Number(limit),
    };
  }
  async function listDcOptimizers({ limit = 50, cursor } = {}) {
    const { data } = await http.get(`/tenants/${tenantId}/components/dc_optimizers`, { params: { limit, cursor } });
    const items = data.items || data.dc_optimizers || [];
    return {
      items,
      next_cursor: data.next_cursor || null,
      limit,
      has_more: items.length >= Number(limit),
    };
  }

  // ---------- Pricing (normalize nested vs top-level) ----------
  async function getDesignPricing(designId) {
    const { data } = await http.get(`/tenants/${tenantId}/designs/${designId}/pricing`);
    return data.pricing || data; // normalize
  }

  // ---------- Projects & Designs (page/per_page) ----------
  async function listProjects({ page = 1, per_page = 50 } = {}) {
    const { data } = await http.get(`/tenants/${tenantId}/projects`, { params: { page, per_page } });
    const items = data.projects || data.items || [];
    // Docs: without page params, first 100; with per_page max 250. :contentReference[oaicite:4]{index=4}
    return {
      items,
      page: Number(data.page ?? page),
      per_page: Number(data.per_page ?? per_page),
      total: data.total ?? undefined, // not always provided
      has_more: items.length >= Number(per_page),
    };
  }

  async function listDesigns(projectId, { page = 1, per_page = 50 } = {}) {
    const { data } = await http.get(`/tenants/${tenantId}/projects/${projectId}/designs`, {
      params: { page, per_page },
    });
    const items = data.designs || data.items || [];
    return {
      items,
      page: Number(data.page ?? page),
      per_page: Number(data.per_page ?? per_page),
      total: data.total ?? undefined,
      has_more: items.length >= Number(per_page),
    };
  }

  function debugInfo() {
    return {
      base: http.defaults.baseURL,
      tenant: tenantId,
      version,
      hasToken: Boolean(token && token.length > 10),
    };
  }

  return {
    // components
    listModules, listInverters, listDcOptimizers,
    // pricing
    getDesignPricing,
    // entities
    listProjects, listDesigns,
    // debug
    debugInfo,
  };
}

module.exports = makeAurora;
