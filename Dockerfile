# ============================
# Stage 1: Build dependencies
# ============================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy source code
COPY . .

# ============================
# Stage 2: Production Image
# ============================
FROM node:20-alpine

WORKDIR /app

# Copy only built files and node_modules from builder
COPY --from=builder /app /app

# Expose service port
EXPOSE 3000

# Default environment
ENV NODE_ENV=production

# Start app
CMD ["node", "src/server.js"]
