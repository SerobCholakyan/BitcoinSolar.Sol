# ---- Builder stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install root deps (dashboard + shared)
COPY package.json package-lock.json* ./
RUN npm install

# Copy everything (including app/ and ai-orchestrator/)
COPY . .

# Build Next.js dashboard
RUN npm run build

# ---- Runner stage ----
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy built app + node_modules
COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]
