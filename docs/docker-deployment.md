# Docker Deployment Guide

This guide explains how to build and run the Customer Spending Insights Dashboard using Docker.

## Prerequisites

- Docker 20.10+ installed
- Docker Compose 2.0+ installed

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The application will be available at http://localhost:3000

### Using Docker directly

```bash
# Build the image
docker build -t customer-spending-dashboard .

# Run the container
docker run -d \
  -p 3000:8080 \
  --name dashboard \
  customer-spending-dashboard

# View logs
docker logs -f dashboard

# Stop and remove
docker stop dashboard
docker rm dashboard
```

## Configuration

### Environment Variables

You can pass environment variables during build:

```bash
docker build \
  --build-arg VITE_ENV=production \
  --build-arg VITE_API_BASE_URL=/api \
  -t customer-spending-dashboard .
```

### Building for Different Environments

**Production:**
```bash
docker build -t customer-spending-dashboard:prod .
```

**Staging:**
```bash
docker build \
  --build-arg BUILD_MODE=staging \
  -t customer-spending-dashboard:staging .
```

**Development:**
```bash
docker build \
  --build-arg BUILD_MODE=development \
  -t customer-spending-dashboard:dev .
```

## Health Checks

The container includes a health check endpoint at `/health`:

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' dashboard

# Manual health check
curl http://localhost:3000/health
```

## Volume Mounts (Development)

For development with hot-reload, mount the source directory:

```bash
docker run -d \
  -p 5173:5173 \
  -v $(pwd):/app \
  -v /app/node_modules \
  --name dashboard-dev \
  customer-spending-dashboard
```

## Security

The container runs as a non-root user (`appuser` with UID 1001) for enhanced security.

### Security Headers

The nginx configuration includes:
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Content-Security-Policy (CSP)
- Referrer-Policy: strict-origin-when-cross-origin

## Troubleshooting

### Container won't start

Check logs:
```bash
docker logs dashboard
```

### Port already in use

Change the host port:
```bash
docker run -d -p 8080:8080 customer-spending-dashboard
```

### Permission issues

Ensure Docker has permission to access files:
```bash
# Linux/Mac
sudo chown -R $USER:$USER .

# Windows (PowerShell as Admin)
icacls . /grant Everyone:F /t
```

## Production Deployment

### Docker Hub

```bash
# Tag image
docker tag customer-spending-dashboard:latest yourusername/customer-spending-dashboard:v1.0.0

# Push to Docker Hub
docker push yourusername/customer-spending-dashboard:v1.0.0
```

### Private Registry

```bash
# Tag for private registry
docker tag customer-spending-dashboard:latest registry.example.com/customer-spending-dashboard:v1.0.0

# Push to registry
docker push registry.example.com/customer-spending-dashboard:v1.0.0
```

### Container Orchestration

**Kubernetes:**
See `k8s/` directory for Kubernetes manifests (if available)

**Docker Swarm:**
```bash
docker stack deploy -c docker-compose.yml dashboard-stack
```

## Performance

The Docker image is optimized using:
- Multi-stage builds (builder + production stages)
- Alpine Linux base images (small footprint)
- nginx for efficient static file serving
- Gzip compression enabled
- Static asset caching
- Production build optimization

**Image sizes:**
- Builder stage: ~600MB (discarded)
- Final image: ~50MB

## Maintenance

### Updating the image

```bash
# Pull latest changes
git pull

# Rebuild image
docker-compose build --no-cache

# Restart containers
docker-compose up -d
```

### Cleaning up

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove everything (careful!)
docker system prune -a --volumes
```

## Support

For issues related to Docker deployment, please:
1. Check the logs: `docker logs dashboard`
2. Verify nginx config: `docker exec dashboard nginx -t`
3. Open an issue on GitHub with logs and environment details
