# CLAUDE.md - Pewterfelt Extension

## Build Commands
- `pnpm dev` - Start development server
- `pnpm build` - Create production bundle
- `pnpm package` - Package extension for distribution

## Code Style Guidelines
- **Formatting**: Prettier with 80 char width, 2 space tabs, no semicolons, double quotes
- **Imports**: Sorted using `@ianvs/prettier-plugin-sort-imports` in specified order
- **Path Aliases**: Use `~` prefix for imports from project root (e.g., `~components/Button`)
- **TypeScript**: Strict typing required for all components and functions
- **React Components**: Functional components with typed props
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Error Handling**: Use try/catch blocks for async operations
- **State Management**: Use React hooks (useState, useEffect) for component state

## Project Structure
- `.tsx` files for React components
- `.ts` files for utility functions
- `popup.tsx` - Main entry point for the extension popup
- Add `options.tsx` or `content.ts` to root for additional extension pages