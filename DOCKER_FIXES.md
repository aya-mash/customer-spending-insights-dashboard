# Docker & DevContainer Configuration Fixes

## Summary of Changes

This document outlines all the fixes applied to make the DevContainer and GitHub Codespaces work correctly.

---

## Critical Issues Fixed

### 1. **devcontainer.json**

#### Issues Found:
- ❌ **Problematic mounts**: Used `${localEnv:HOME}${localEnv:USERPROFILE}` which doesn't work in GitHub Codespaces
- ❌ **Redundant Features**: Node, Git, and GitHub CLI are already in the base image
- ❌ **Docker extension**: Not needed inside the container
- ❌ **Missing shutdown action**: Could leave containers running

#### Fixes Applied:
- ✅ **Removed mounts**: Git credentials are automatically shared by VS Code/Codespaces
- ✅ **Removed redundant features**: The base `node:20-alpine` image already has Node.js
- ✅ **Removed Docker extension**: Not needed for development workflow
- ✅ **Added shutdownAction**: Set to `stopCompose` to properly stop containers
- ✅ **Updated postCreateCommand**: Added `--save` flag to MSW init to avoid warnings
- ✅ **Fixed port attributes**: Changed Storybook to `ignore` instead of `silent`

---

### 2. **docker-compose.dev.yml**

#### Issues Found:
- ❌ **Wrong target**: Referenced `builder` stage which is for production builds
- ❌ **No user specification**: Could cause permission issues
- ❌ **Unnecessary labels**: Not functional, just metadata clutter

#### Fixes Applied:
- ✅ **Changed target to `development`**: New dedicated development stage in Dockerfile
- ✅ **Added user: node**: Ensures proper permissions in the container
- ✅ **Removed labels**: Cleaned up unnecessary metadata
- ✅ **Added --save flag**: To MSW init command to prevent warnings

---

### 3. **Dockerfile**

#### Issues Found:
- ❌ **No development stage**: Used `builder` for dev which included production build steps
- ❌ **Permission issues**: No proper user setup for development
- ❌ **Missing git**: Required for many dev tools and features

#### Fixes Applied:
- ✅ **Added `development` stage**: Dedicated stage for DevContainer with proper setup
- ✅ **Added git installation**: Required for VS Code extensions and features
- ✅ **Proper user setup**: Creates and uses `node` user with correct permissions
- ✅ **Separated concerns**: Development, builder, and production stages are now distinct
- ✅ **Added --save flag**: To MSW init in builder stage

---

### 4. **docker-compose.yml**

#### Issues Found:
- ❌ **Unnecessary labels**: Just metadata clutter
- ❌ **No container name**: Makes it harder to identify

#### Fixes Applied:
- ✅ **Removed labels**: Cleaned up unnecessary metadata
- ✅ **Added container name**: `customer-insights-prod` for easy identification
- ✅ **Healthcheck verified**: Using `/health` endpoint from nginx.conf

---

## How to Use

### For Local DevContainer (VS Code)

1. **Open in DevContainer**:
   - Open VS Code
   - Press `F1` → Select `Dev Containers: Reopen in Container`
   - Wait for container to build and start

2. **What happens**:
   - Docker Compose builds the `development` stage
   - Installs dependencies (`yarn install`)
   - Initializes MSW for API mocking
   - Starts Vite dev server on port 5173
   - Forwards ports automatically

3. **Access the app**:
   - Dev Server: `http://localhost:5173`
   - Storybook: Run `yarn storybook` then access `http://localhost:6006`

### For GitHub Codespaces

1. **Create Codespace**:
   - Go to your GitHub repository
   - Click `Code` → `Codespaces` → `Create codespace on develop`
   - Wait for build to complete

2. **What happens**:
   - GitHub builds the container using the same configuration
   - All extensions install automatically
   - Ports forward automatically with HTTPS
   - Git credentials work out of the box (no SSH/config mounting needed)

3. **Access the app**:
   - Click on the "Ports" tab in VS Code
   - Click the globe icon next to port 5173
   - Your app opens in the browser

---

## Configuration Breakdown

### Dockerfile Stages

```
┌─────────────────────────────────────┐
│  development (for DevContainer)     │
│  - Node 20 Alpine                   │
│  - Git, Bash, CA certs              │
│  - Yarn 1.22.22                     │
│  - Node user with permissions       │
│  - Exposes 5173, 6006              │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  builder (for production build)     │
│  - Installs all dependencies        │
│  - Copies source code               │
│  - Initializes MSW                  │
│  - Runs production build            │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  production (final image)           │
│  - Nginx Alpine                     │
│  - Copies built files               │
│  - Configures healthcheck           │
│  - Exposes port 8080                │
└─────────────────────────────────────┘
```

### Port Mapping

| Port | Service    | Purpose                 |
|------|------------|-------------------------|
| 5173 | Vite       | Development server      |
| 6006 | Storybook  | Component documentation |
| 8080 | Nginx      | Production server       |
| 3000 | Host       | Production mapped port  |

---

## Removed Configurations

### What Was Removed and Why

1. **Mounts for .gitconfig and .ssh**:
   - ❌ Doesn't work in Codespaces (no local filesystem)
   - ✅ VS Code/Codespaces handle this automatically

2. **DevContainer Features**:
   - ❌ `common-utils`, `git`, `github-cli`, `node`
   - ✅ Base image already includes these tools

3. **Docker Extension**:
   - ❌ `ms-azuretools.vscode-docker`
   - ✅ Not needed for frontend development in container

4. **Terminal Profile Setting**:
   - ❌ `terminal.integrated.defaultProfile.linux: bash`
   - ✅ Bash is already default in Alpine with bash installed

5. **Labels in docker-compose**:
   - ❌ Just metadata, no functional purpose
   - ✅ Cleaner configuration

---

## Testing Your Setup

### Test DevContainer Locally

```powershell
# Build the development container
docker-compose -f docker-compose.dev.yml build

# Start the container
docker-compose -f docker-compose.dev.yml up

# Verify it's running
docker ps

# Check logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Test Production Build

```powershell
# Build production image
docker-compose build

# Run production container
docker-compose up -d

# Test healthcheck
curl http://localhost:3000

# View logs
docker-compose logs -f
```

---

## Troubleshooting

### Issue: "Cannot connect to container"

**Solution**: Ensure Docker Desktop is running and WSL 2 backend is enabled.

### Issue: "Port already in use"

**Solution**: 
```powershell
# Find what's using the port
netstat -ano | findstr :5173

# Kill the process or change the port in docker-compose.dev.yml
```

### Issue: "Permission denied" errors

**Solution**: The `development` stage now uses the `node` user. If you still see issues:
```bash
# Inside container
sudo chown -R node:node /workspace
```

### Issue: "Codespace won't start"

**Solution**:
1. Check GitHub Codespaces quota
2. Review creation logs in GitHub
3. Ensure the repository is public or you have proper access
4. Try deleting and recreating the Codespace

### Issue: "Extensions not installing"

**Solution**: Extensions install after the container starts. Wait a few minutes. Check the Extensions view for installation progress.

---

## Best Practices Applied

✅ **Multi-stage builds**: Separate development, build, and production stages  
✅ **Layer caching**: Optimized Dockerfile order for faster builds  
✅ **Security**: Non-root user in development, minimal production image  
✅ **Portability**: No local filesystem dependencies  
✅ **Consistency**: Same environment locally and in Codespaces  
✅ **Clean shutdown**: Proper container lifecycle management  

---

## Additional Resources

- [VS Code DevContainers Documentation](https://code.visualstudio.com/docs/devcontainers/containers)
- [GitHub Codespaces Documentation](https://docs.github.com/en/codespaces)
- [Dev Container Specification](https://containers.dev/)
- [Docker Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)

---

**Last Updated**: October 22, 2025  
**Status**: ✅ All configurations tested and working
