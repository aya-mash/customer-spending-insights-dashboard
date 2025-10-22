# VS Code Workspace Setup

This project includes a comprehensive VS Code workspace configuration to ensure a consistent development experience across the team.

## Quick Start

### Option 1: Open Workspace File (Recommended)
1. Open VS Code
2. File → Open Workspace from File
3. Select `customer-spending-insights-dashboard.code-workspace`
4. VS Code will prompt you to install recommended extensions - click "Install All"

### Option 2: Open Folder
1. Open VS Code
2. File → Open Folder
3. Select the project root directory
4. VS Code will prompt you to install recommended extensions - click "Install All"

The `.vscode` configuration files will automatically apply the project settings.

## Workspace Features

### Recommended Extensions
The workspace configuration includes recommendations for essential extensions:

#### Core Development
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **TypeScript** - Enhanced TypeScript support

#### Testing & Quality
- **Vitest Explorer** - Test runner integration
- **Playwright Test** - E2E testing support
- **Error Lens** - Inline error highlighting
- **Code Spell Checker** - Spell checking in code

#### Productivity
- **Path Intellisense** - Autocomplete for file paths
- **Auto Rename Tag** - Automatically rename paired HTML/JSX tags
- **GitLens** - Enhanced Git capabilities
- **Todo Tree** - Highlight TODO comments

#### Docker & Deployment
- **Docker** - Docker file support
- **Markdown All in One** - Enhanced markdown editing

### Editor Settings

The workspace is pre-configured with:
- **Format on Save** - Automatic code formatting
- **ESLint Auto-fix** - Automatic linting fixes on save
- **TypeScript Path Resolution** - Uses workspace TypeScript version
- **File Nesting** - Groups related files (tests, stories) with their components
- **Consistent Formatting** - 2-space indentation, LF line endings

### Tasks

Access these via `Terminal → Run Task` or `Ctrl+Shift+P` → "Tasks: Run Task":

- **dev-server** - Start Vite development server (http://localhost:5173)
- **storybook-server** - Start Storybook (http://localhost:6006)
- **build** - Production build (⌘⇧B / Ctrl+Shift+B)
- **test** - Run all tests
- **lint** - Check code for linting errors
- **lint:fix** - Auto-fix linting errors
- **build:staging** - Staging build
- **preview** - Preview production build

### Debug Configurations

Access via `Run → Start Debugging` or `F5`:

1. **Launch Chrome - Dev Server**
   - Launches the development server in Chrome with debugging
   - Requires the dev server task to run first

2. **Launch Chrome - Storybook**
   - Launches Storybook in Chrome with debugging
   - Requires the storybook server task to run first

3. **Run Tests**
   - Runs all Vitest tests with debugging

4. **Debug Current Test File**
   - Debugs only the currently open test file

## File Nesting

The workspace automatically groups related files in the explorer:
- Test files (`.spec.ts`, `.test.ts`) nest under their source files
- Story files (`.stories.tsx`) nest under their components
- Configuration files nest under their root files

## EditorConfig

The `.editorconfig` file ensures consistent coding styles across all editors (not just VS Code):
- LF line endings (Unix-style)
- UTF-8 encoding
- 2-space indentation for JS/TS/CSS/HTML
- Trailing whitespace trimming

## Custom Settings

### Per-User Overrides
If you need to override workspace settings for your local environment:
1. Open Settings (`⌘,` / `Ctrl+,`)
2. Switch to "Workspace" tab
3. Any changes you make will be stored locally and won't affect the shared configuration

### Spell Checker Dictionary
The workspace includes common technical terms. To add words:
1. Right-click on the underlined word
2. Select "Add to Workspace Dictionary"

## Troubleshooting

### Extensions Not Installing
1. Open Command Palette (`⌘⇧P` / `Ctrl+Shift+P`)
2. Type "Extensions: Show Recommended Extensions"
3. Manually install any missing extensions

### TypeScript Version Mismatch
1. Open any `.ts` or `.tsx` file
2. Click the TypeScript version in the status bar (bottom right)
3. Select "Use Workspace Version"

### Format on Save Not Working
1. Check that Prettier is installed
2. Verify it's set as the default formatter:
   - Command Palette → "Format Document With..."
   - Select "Configure Default Formatter"
   - Choose "Prettier - Code formatter"

### Tasks Not Running
1. Ensure you've run `yarn install` first
2. Check that yarn is available in your PATH
3. Try running the command manually in the terminal first

## Development Workflow

### Starting Development
1. Open the workspace file
2. Run Task: `dev-server` (or `yarn dev` in terminal)
3. Start coding with hot reload

### Running Tests
- Run all tests: Task `test` or `yarn test`
- Debug specific test: Open test file → F5
- Watch mode: `yarn test --watch` in terminal

### Debugging
1. Set breakpoints in your code (click left of line number)
2. Press F5 and select configuration
3. Debug in Chrome DevTools or VS Code debugger

### Before Committing
1. Run Task: `lint` to check for errors
2. Run Task: `test` to ensure tests pass
3. Use GitLens or source control panel to review changes

## Additional Resources

- [VS Code Workspace Docs](https://code.visualstudio.com/docs/editor/workspaces)
- [EditorConfig](https://editorconfig.org/)
- [Project README](./README.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## Need Help?

If you encounter issues with the workspace configuration:
1. Check this guide for troubleshooting steps
2. Ensure all dependencies are installed (`yarn install`)
3. Try closing and reopening the workspace
4. Check that you're using a recent version of VS Code
