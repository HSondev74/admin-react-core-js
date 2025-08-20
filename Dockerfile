# Base stage
FROM node:18-alpine AS base
WORKDIR /app

# Development stage
FROM base AS development
ENV NODE_ENV=development
COPY package.json bun.lockb ./
RUN npm install -g bun && bun install
COPY . .
EXPOSE 3000
CMD ["bun", "start", "--host"]

# Build stage
FROM base AS builder
ENV NODE_ENV=production
COPY package.json bun.lockb ./
RUN npm install -g bun && bun install --frozen-lockfile
COPY . .
RUN bun run build

# Production stage
FROM nginx:stable-alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
