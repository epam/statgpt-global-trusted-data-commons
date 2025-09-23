FROM node:22-alpine AS base

# Set working directory
WORKDIR /app

# Copy only the package files first for dependency caching
COPY package.json package-lock.json ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the full app
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Build the Next.js app (runs as root)
RUN npm run build

# Fix permissions so cache files can be written at runtime
RUN mkdir -p /app/.next/cache && chmod -R 777 /app/.next

# Expose Next.js port
EXPOSE 3000

# Run as root (DO NOT switch to USER node for now)
CMD ["npm", "run", "start"]
