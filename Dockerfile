# Multi-stage build for optimized production image

# Development stage - used for dev containers
FROM node:20-alpine AS development

# Set working directory
WORKDIR /workspace

# Install essential development tools for Alpine Linux
# - bash: required for VS Code terminal and scripts
# - ca-certificates: SSL/TLS support
# - curl: downloading tools and healthchecks
# - git: version control (required by VS Code)
# - openssh-client: SSH support for git operations
# - sudo: required for DevContainer permission fixes
RUN apk add --no-cache \
    bash \
    ca-certificates \
    curl \
    git \
    openssh-client \
    sudo

# Enable corepack and prepare yarn
RUN corepack enable && \
    corepack prepare yarn@1.22.22 --activate

# Configure sudo for node user (no password required)
RUN echo "node ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/node && \
    chmod 0440 /etc/sudoers.d/node

# Create node user home directory and set permissions
RUN mkdir -p /home/node/.ssh && \
    chown -R node:node /home/node /workspace

# Switch to node user
USER node

# Expose ports for development
EXPOSE 5173 6006

# Default command for development
CMD ["sh", "-c", "yarn install && yarn dev:docker"]

# Builder stage - for building the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /workspace

# Install bash and ca-certificates
RUN apk add --no-cache bash ca-certificates

# Copy package files for dependency installation
COPY package.json yarn.lock ./

# Install dependencies with frozen lockfile
RUN corepack enable && \
    corepack prepare yarn@1.22.22 --activate && \
    yarn install --frozen-lockfile --production=false && \
    yarn cache clean

# Copy source code
COPY . .

# Initialize MSW (Mock Service Worker)
RUN npx msw init public --save

# Build application for production
RUN yarn build

# Production stage
FROM nginx:alpine AS production

# Install security updates and curl for healthcheck
RUN apk update && apk upgrade && apk add --no-cache curl

# Copy built application from builder
COPY --from=builder /workspace/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -fsS http://localhost:8080/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]