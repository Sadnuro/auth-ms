FROM node:lts-alpine3.21 AS base

ENV DIR /app
WORKDIR $DIR

# ─── Development: hot-reload, source mounted as volume ────────────────────────
FROM base AS devimage

ENV NODE_ENV=development
ENV CI=true
COPY package.json ./
RUN npm install --no-package-lock
COPY . .
CMD ["sh", "-c", "npx prisma generate && npm run start:dev"]

# ─── Builder: full install + compile TypeScript ────────────────────────────────
FROM base AS builder

# npm ci installs ALL deps (devDeps included) so @nestjs/cli and prisma are available
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Generate Prisma client types before tsc.
# prisma.config.ts calls env("DATABASE_URL") at generate time — dummy value satisfies it.
# No DB connection is made; only the schema file is read.
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate
RUN npm run build

# ─── Prod deps: clean install, no devDeps, no build artifacts ─────────────────
FROM base AS proddeps

COPY package.json package-lock.json ./
# --omit=dev installs only production dependencies cleanly.
# `prisma` CLI was moved to devDependencies, so it is NOT installed here,
# saving ~60-100 MB of engine binaries from the final image.
RUN npm ci --omit=dev && \
    # Remove packages that are only needed at migration/generate time, not at runtime.
    # With @prisma/adapter-pg, the WASM compiler (.prisma/client) handles queries.
    # - @prisma/engines: native schema-engine binary (for prisma migrate/generate)
    # - @prisma/fetch-engine: downloads engine binaries (not needed at runtime)
    # - prisma: CLI tool, kept as devOptional peer dep but unused at runtime
    rm -rf node_modules/@prisma/engines \
           node_modules/@prisma/fetch-engine \
           node_modules/prisma

# ─── Production image: minimal, optimized ─────────────────────────────────────
FROM base AS prodimage

ENV NODE_ENV=production
# Clean production node_modules (no devDeps, no CLI tools, no build residue)
COPY --from=proddeps /app/node_modules node_modules
# Overlay the Prisma generated client — it lives in .prisma/client and is
# generated at build time; @prisma/client re-exports from it at runtime.
COPY --from=builder /app/node_modules/.prisma node_modules/.prisma
# Compiled application
COPY --from=builder /app/dist dist
COPY --from=builder /app/package.json .
USER node
CMD ["node", "dist/main"]