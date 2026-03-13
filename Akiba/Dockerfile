# ============================================================
# STAGE 1 — Dependencies
# Install only production-safe deps first for better layer caching
# ============================================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copy manifest files only (best-practice for cache efficiency)
COPY package.json package-lock.json ./

# Install ALL deps (including devDeps needed for build)
RUN npm ci --frozen-lockfile


# ============================================================
# STAGE 2 — Builder
# Compile the Angular SSR application
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Reuse the node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the full source code
COPY . .

# Build in production mode (outputs to /app/dist/Akiba)
RUN npm run build


# ============================================================
# STAGE 3 — Runner (final, minimal image)
# Only contains what is needed to run the SSR server
# ============================================================
FROM node:20-alpine AS runner

# Security best-practice: run as non-root user
RUN addgroup --system --gid 1001 akiba && \
    adduser  --system --uid 1001 akiba

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Copy compiled output from builder
COPY --from=builder --chown=akiba:akiba /app/dist ./dist

# Copy package manifests and install ONLY production dependencies
COPY --chown=akiba:akiba package.json package-lock.json ./
RUN npm ci --omit=dev --frozen-lockfile && \
    npm cache clean --force

# Switch to non-root user
USER akiba

EXPOSE 4000

# Health check — ensures the container is truly ready
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:4000/ || exit 1

# Start the Angular SSR server
CMD ["node", "dist/Akiba/server/server.mjs"]
