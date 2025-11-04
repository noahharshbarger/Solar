# Multi-stage build for Node.js backend (Express/Prisma example)
FROM node:18-alpine AS dependencies

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and lockfile from context
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .


# Generate Prisma client
RUN npx prisma generate

# (Optional) Build your backend if needed
# RUN npm run build

# Remove devDependencies for production
RUN npm prune --production && npm cache clean --force

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 backend

# Copy built application and node_modules from builder
COPY --from=builder --chown=backend:nodejs /app ./

USER backend

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "start"]