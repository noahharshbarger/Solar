# Backend Overview

This document provides a quick overview of how the backend works for the Solar project.

## Tech Stack
- **Node.js** with **Express** (likely, based on typical structure)
- **Prisma ORM** for database access
- **PostgreSQL** (assumed from Prisma usage)
- **Docker** for containerization

## Main Components
- `backend/src/server.js`: Main Express server entry point.
- `backend/prisma/schema.prisma`: Database schema definition.
- `backend/prisma/seed-from-xlsx.js` & `.ts`: Scripts to seed the database from Excel files.
- `backend/data/`: Contains materials and mapping data used for seeding and lookups.
- `backend/docs/openapi.yaml`: OpenAPI spec for documenting API endpoints.

## Data Flow
1. **Startup**: The server starts via `server.js`, connects to the database using Prisma.
2. **Seeding**: Data can be seeded from Excel files using the provided scripts. These scripts read from `backend/data/raw/material list (1).xlsx` and `mapping.json`.
3. **API Endpoints**: The backend exposes RESTful endpoints (see `openapi.yaml`) for:
   - Projects
   - Designs
   - Parts/materials
   - Comparisons
4. **Database**: All persistent data is stored in PostgreSQL, accessed via Prisma models defined in `schema.prisma`.
5. **Docker**: The backend can be run in a container using `docker-compose.yml` or `docker-compose.backend-only.yml`.

## Development & Usage
- **Run Locally**: Use `npm install` and `npm run dev` in the `backend/` folder.
- **Seed Database**: Run the seed scripts to populate initial data.
- **API Docs**: Refer to `docs/openapi.yaml` for endpoint details.
- **Environment Variables**: Configure DB connection and other secrets in `.env` files.

## Key Files
- `backend/src/server.js`: Main server logic
- `backend/prisma/schema.prisma`: DB schema
- `backend/prisma/seed-from-xlsx.js`/`.ts`: Data import scripts
- `backend/data/`: Source data
- `backend/docs/openapi.yaml`: API documentation

---
For more details, see the code comments and API documentation in `backend/docs/openapi.yaml`.
