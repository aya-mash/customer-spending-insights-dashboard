# Multi-stage build for optimized production image

# Development stage - used for dev containers
FROM node:20-alpine AS development

# Install git, openssh, and other essentials
RUN apk add --no-cache git openssh-client

# Set working directory
WORKDIR /workspace

# Enable corepack and prepare yarn
RUN corepack enable && \
    corepack prepare yarn@1.22.22 --activate

# Copy package files and install dependencies as root first
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Initialize MSW and set permissions
RUN npx msw init public --save && chown -R node:node /workspace

# Switch to the non-root user
USER node

# Expose ports for development
EXPOSE 5173 6006

# Default command to start the dev server
CMD ["yarn", "dev:docker"]

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