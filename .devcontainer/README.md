# VS Code Dev Container Setup

This project includes a fully configured VS Code Dev Container for consistent development environments across team members.

## Features

### Pre-installed Extensions
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Tailwind CSS IntelliSense**: CSS class autocomplete
- **Playwright Test**: E2E test runner
- **Vitest Explorer**: Unit test runner UI
- **TypeScript**: Advanced TypeScript support
- **Auto Rename Tag**: Rename paired HTML/JSX tags
- **Path Intellisense**: File path autocomplete
- **Code Spell Checker**: Catch typos in code
- **Error Lens**: Inline error messages
- **Docker**: Container management

### Configured Settings
- **Format on Save**: Automatic code formatting with Prettier
- **ESLint Auto-fix**: Fix linting issues on save
- **TypeScript Workspace Version**: Uses project's TypeScript version
- **Terminal**: Bash as default shell

### Port Forwarding
- **5173**: Vite development server (auto-notify)
- **6006**: Storybook (silent)

### Volume Mounts
- **Source Code**: Mounted at `/workspace` with hot reload support
- **Git Config**: Your local `.gitconfig` is shared with the container
- **SSH Keys**: Your SSH keys are available for git operations

## Quick Start

### Prerequisites
1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Install [VS Code](https://code.visualstudio.com/)
3. Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Opening the Dev Container

1. **From VS Code**:
   - Open the project folder
   - Press `F1` or `Ctrl+Shift+P` (Windows/Linux) / `Cmd+Shift+P` (Mac)
   - Select "Dev Containers: Reopen in Container"
   - Wait for the container to build (first time only, ~2-5 minutes)

2. **From Command Palette**:
   ```bash
   # Clone the repository
   git clone <repository-url>
   cd customer-spending-insights-dashboard
   
   # Open in VS Code
   code .
   
   # Use Command Palette: "Dev Containers: Reopen in Container"
   ```

3. **From Terminal** (if Remote-CLI is installed):
   ```bash
   devcontainer open .
   ```

### First Build
The first time you open the dev container:
1. Docker will build the development image (~2-5 minutes)
2. Post-create command will run `yarn install`
3. All extensions will be installed
4. You're ready to code!

### Using the Dev Container

Once inside the container, all commands work as normal:

```bash
# Start development server
yarn dev

# Run tests
yarn test

# Run linting
yarn lint

# Build for production
yarn build

# Start Storybook
yarn storybook
```

The development server will be automatically forwarded to your local machine at http://localhost:5173.

## Container Architecture

### Base Image
- **Node.js 20**: Latest LTS version
- **Git**: For version control
- **GitHub CLI**: For GitHub operations

### Development Setup
- **Package Manager**: Yarn 1.22.22
- **Hot Reload**: Source code mounted as volume
- **Anonymous Volumes**: `node_modules` isolated from host for performance

### Environment Variables
Development environment variables are automatically loaded from `.env.development`:
- `VITE_ENV=development`
- `VITE_API_BASE_URL=/api`
- `VITE_ENABLE_MOCKS=true`

## Troubleshooting

### Container Won't Build
```bash
# Rebuild without cache
docker-compose -f docker-compose.dev.yml build --no-cache
```

### Port Already in Use
```bash
# Stop existing containers
docker-compose -f docker-compose.dev.yml down

# Or change the port in docker-compose.dev.yml
ports:
  - "5174:5173"  # Changed from 5173
```

### Git Authentication Issues
Make sure your `.gitconfig` and `.ssh` directory are properly mounted (configured automatically in `devcontainer.json`).

### Extensions Not Installing
- Check your internet connection
- Try rebuilding the container: "Dev Containers: Rebuild Container"

### Slow Performance on Windows
1. **Enable WSL 2**: Much faster than Hyper-V
2. **Clone inside WSL**: Clone the repo in WSL filesystem (`\\wsl$\Ubuntu\home\...`)
3. **Exclude from Antivirus**: Add Docker Desktop and WSL to Windows Defender exclusions

## Benefits

### Consistency
- Same Node version across all developers
- Same extensions and settings
- Same environment variables

### Onboarding
- New developers can start coding in minutes
- No need to install Node, Yarn, or configure tools
- Everything "just works"

### Isolation
- Project dependencies don't conflict with other projects
- Clean environment for each project
- Easy to reset: just rebuild the container

## Advanced Configuration

### Customizing Extensions
Edit `.devcontainer/devcontainer.json`:
```json
{
  "customizations": {
    "vscode": {
      "extensions": [
        "your.extension-id"
      ]
    }
  }
}
```

### Adding Features
Use [Dev Container Features](https://containers.dev/features):
```json
{
  "features": {
    "ghcr.io/devcontainers/features/python:1": {}
  }
}
```

### Running Additional Services
Edit `docker-compose.dev.yml` to add services like PostgreSQL, Redis, etc.

## Alternatives

If you prefer not to use Dev Containers, you can still develop locally:
1. Install Node.js 20+
2. Run `yarn install`
3. Run `yarn dev`

All features work the same way, but you'll need to manage your own environment.

## Resources
- [Dev Containers Documentation](https://code.visualstudio.com/docs/devcontainers/containers)
- [Dev Container Features](https://containers.dev/features)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
