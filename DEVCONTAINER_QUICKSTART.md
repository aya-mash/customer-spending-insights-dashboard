# DevContainer Quick Start Guide

## 🚀 Quick Commands

### Start Development in VS Code DevContainer

```bash
# Just press F1 and select: "Dev Containers: Reopen in Container"
# Or use the command palette
```

### Manual Docker Commands

```powershell
# Development
docker-compose -f docker-compose.dev.yml up --build

# Production
docker-compose up --build -d

# Stop all
docker-compose down
docker-compose -f docker-compose.dev.yml down

# Clean rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

## 📋 What Was Fixed

| File | Main Issue | Fix |
|------|-----------|-----|
| `devcontainer.json` | Invalid mounts for Codespaces | Removed local filesystem mounts |
| `docker-compose.dev.yml` | Wrong build target | Changed to `development` stage |
| `Dockerfile` | No development stage | Added 3-stage build |
| `docker-compose.yml` | Unnecessary metadata | Cleaned up labels |

## ✅ Verification Steps

After reopening in container:

1. **Check terminal** - Should show `node@container-id:/workspace$`
2. **Run dev server** - It should auto-start, or run `yarn dev:docker`
3. **Check ports** - Port 5173 should be forwarded
4. **Test extensions** - ESLint, Prettier should work
5. **Make a change** - Hot reload should work

## 🔍 Troubleshooting

### Container won't build
```powershell
# Clear Docker cache
docker system prune -a
docker volume prune

# Rebuild
docker-compose -f docker-compose.dev.yml build --no-cache
```

### Permission errors
```bash
# Inside container
sudo chown -R node:node /workspace
# Or rebuild - the new Dockerfile handles this
```

### Port conflicts
```powershell
# Find what's using port 5173
netstat -ano | findstr :5173
# Kill it or change port in docker-compose.dev.yml
```

### Codespaces not starting
- Check your GitHub Codespaces quota
- Try deleting and recreating
- Check repository access permissions

## 🎯 What You Get

✅ Consistent environment across team  
✅ No "works on my machine" issues  
✅ Same setup locally and in Codespaces  
✅ All extensions pre-installed  
✅ Hot reload working  
✅ Git credentials automatic  
✅ Proper Node.js user permissions  

## 📝 Notes

- **First build**: Takes 5-10 minutes
- **Subsequent builds**: ~30 seconds (cached layers)
- **Container size**: ~500MB (development), ~50MB (production)
- **Yarn version**: 1.22.22 (configured in Dockerfile)
- **Node version**: 20 LTS (Alpine)

## 🔗 Related Files

- `.devcontainer/devcontainer.json` - DevContainer configuration
- `docker-compose.dev.yml` - Development services
- `docker-compose.yml` - Production services
- `Dockerfile` - Multi-stage build definition
- `.dockerignore` - Build exclusions
- `nginx.conf` - Production server config

---

**Ready to go!** Just reopen in container and start coding. 🎉
