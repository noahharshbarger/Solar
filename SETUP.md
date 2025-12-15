# Solar Monorepo Setup Guide

Welcome! This guide will help you get the Solar project running locally using Docker. Follow each step carefully to ensure a smooth setup.

---

## Prerequisites

- **Docker & Docker Compose**: [Install Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Node.js (v18+) & npm**: [Install Node.js](https://nodejs.org/)
- **Git**: [Install Git](https://git-scm.com/)

---

## 1. Clone the Repository

```sh
git clone https://github.com/noahharshbarger/Solar.git
cd Solar
```

---

## 2. Environment Variables

Environment variables are required for both backend and frontend services.

### a. Copy Example Files

```sh
cp local/.env.example local/.env.development
cp local/.env.example local/.env.production
cp backend/.env.example backend/.env
```

### b. Add Real Credentials

- Edit `local/.env.development` and `local/.env.production` with your real Aurora API credentials and any other secrets.
- Edit `backend/.env` with the correct database and API values.
- **Never commit real `.env` files!**

---

## 3. Install Dependencies

No need to install dependencies manually—Docker will handle this for you. If you want to run frontend or backend outside Docker:

```sh
cd backend && npm install
cd ../frontend && npm install
```

---

## 4. Start the Project (Docker Compose)

From the project root:

```sh
docker-compose up --build
```

- This will start the backend, frontend, and MySQL database.
- The backend will be available at [http://localhost:3001](http://localhost:3001)
- The frontend will be available at [http://localhost:3000](http://localhost:3000)

---

## 5. Seed the Database

If the database is empty, seed it:

```sh
docker-compose exec backend node prisma/seed-from-xlsx.js
```

---

## 6. Development Tips

- **Live reload**: Both frontend and backend support hot reload in Docker.
- **Logs**: Use `docker-compose logs -f backend` or `frontend` to view logs.
- **Stopping**: Use `Ctrl+C` in the terminal, then `docker-compose down` to stop and clean up.

---

## 7. Troubleshooting

- **Port conflicts**: Make sure ports 3000 (frontend), 3001 (backend), and 3306 (MySQL) are free.
- **Environment issues**: Double-check your `.env` files if something isn’t working.
- **Database errors**: Try reseeding or restarting the database container.

---

## 8. Useful Commands

- Build only backend: `docker-compose -f docker-compose.backend-only.yml up --build`
- Run backend tests: `cd backend && npm test`
- Run frontend outside Docker: `cd frontend && npm run dev`

---

## 9. More Info

- See `/local/README.md` for environment variable details.
- See `/CONTRIBUTING.md` for contribution guidelines.

---

Happy coding! 🚀
