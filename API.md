cat > API.md << 'EOF'
# Aurora Comparator — Backend API (MVP)

This doc is the source of truth for FE. All responses are JSON. Status codes follow HTTP conventions. Errors use Problem Details format (RFC 9457). Pagination is page/offset for lists and cursor for Aurora components.  

## Base URL (local)
`http://localhost:3000`

---

## 1) GET /search
Search parts from our DB (with domestic vs non-domestic flags).

**Query**
- `q` (string, optional)
- `page` (int, default 1)
- `page_size` (int, default 20, max 100)

**200 Response**
```json
{
  "total": 123,
  "page": 1,
  "page_size": 20,
  "items": [
    {
      "sku": "HYUND HIS-T435NF(BK)",
      "name": "Hyundai HiS-T435NF(BK)",
      "unit_price": 132.92,
      "origin_country": "UNKNOWN",
      "is_domestic": false,
      "weight_kg": null
    }
  ]
}
