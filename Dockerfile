# Multi-stage build for optimized production image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /workspace

# Ensure bash and certs are available for devcontainer features and tooling
RUN apk add --no-cache bash ca-certificates

# Copy package files for dependency installation
COPY package.json yarn.lock ./

# Install dependencies with frozen lockfile
RUN corepack enable && \
    corepack prepare yarn@1.22.22 --activate && \
    yarn --version && \
    yarn install --frozen-lockfile --production=false && \
    yarn cache clean

# Copy source code
COPY . .

# Initialize MSW (Mock Service Worker)
RUN npx msw init public

# Build application for production
RUN yarn build

# Production stage
FROM nginx:alpine AS production

# Install security updates
RUN apk update && apk upgrade && apk add --no-cache curl

# Copy built application
COPY --from=builder /workspace/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Run NGINX with default user configuration. The master process runs as root
# and worker processes drop privileges per the base image configuration.

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -fsS http://localhost:8080/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]