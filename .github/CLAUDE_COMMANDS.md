# Claude GitHub Action Commands

Use these commands in PR comments to trigger Claude:

## Basic Commands
- `/claude review` - General code review
- `/claude security` - Security-focused review
- `/claude performance` - Performance analysis
- `/claude svelte5` - Svelte 5 migration check
- `/claude accessibility` - A11y audit

## Advanced Commands
- `/claude refactor {component}` - Suggest refactoring for specific component
- `/claude test {file}` - Generate tests for a file
- `/claude docs` - Generate documentation
- `/claude optimize` - Performance optimization suggestions

## Project-Specific Commands
- `/claude check-filters` - Verify unified filter implementation
- `/claude check-auth` - Validate auth flow security
- `/claude check-payments` - Review payment integration
- `/claude check-types` - TypeScript type safety check

## Examples
```
/claude review focus on the new payment integration

/claude security especially check the Stripe webhook handling

/claude svelte5 help me migrate this component to modern patterns

/claude performance analyze the bundle size impact
```

## Tips
1. Be specific in your requests for better results
2. Claude will comment directly on code lines
3. Use `/claude` in PR description for automatic review
4. Combine with manual review for best results