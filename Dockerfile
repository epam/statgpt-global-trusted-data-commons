FROM node:24.21-alpine3.24 AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Fix permissions as root
RUN chmod -R +x /app/node_modules/.bin

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

FROM node:22.23.3-alpine3.24 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Upgrade OS packages with known CVEs in the base image (openssl CVE-2026-14456,
# zlib CVE-2026-85091). zlib is preinstalled, so `apk add` would not update it.
# The standalone server starts with node directly and needs no install, so remove
# npm/npx: project overrides do not patch its bundled dependencies (picomatch,
# tar, brace-expansion, ip-address, sigstore, pacote).
RUN apk upgrade --no-cache libcrypto3 libssl3 zlib \
    && rm -rf /usr/local/lib/node_modules/npm \
    && rm -f /usr/local/bin/npm /usr/local/bin/npx

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]

