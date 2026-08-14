# Contributing to DevBox

Thanks for your interest! Here's how to contribute:

## Adding a New Tool

1. Create `src/plugins/ToolNameTool.tsx` with a named export `ToolNameTool`
2. Add it to `src/plugins/registry.ts`
3. Run `npm run build` to verify
4. Open a PR

## Code Style

- TypeScript, React functional components
- Tailwind CSS for styling
- No external dependencies unless absolutely necessary
- Keep tools under 200 lines if possible

## Before Submitting

- [ ] `npm run build` passes
- [ ] `npm run lint` passes (or note why it fails)
- [ ] Tool works offline
- [ ] No data leaves the browser
