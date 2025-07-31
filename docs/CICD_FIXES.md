# CI/CD Fixes Required (Phase 3)

## GitHub Actions Issues

### 1. Missing Secrets
- **ANTHROPIC_API_KEY**: Required for Claude workflows
- **Action**: Add to repository secrets in GitHub settings

### 2. Insufficient Permissions
**Current**: `contents: read`
**Required**: `contents: write`

Files to update:
- `.github/workflows/claude.yml`
- `.github/workflows/claude-advanced.yml`
- `.github/workflows/claude-security.yml`

### 3. Node Version Mismatch
- **Issue**: Workflows use default Ubuntu Node version, not Node 22.x as specified in package.json
- **Fix**: Add setup-node step with version 22.x in all workflows

### 4. Missing Playwright Tests
- **Issue**: No Playwright tests triggered on pull requests
- **Fix**: Add Playwright workflow for visual regression testing

## Required Workflow Updates

### Example Fix for claude.yml:
```yaml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: write  # Changed from read
  pull-requests: write
  issues: write

jobs:
  claude-review:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22.x'  # Match package.json engines
      
      - name: Claude Code Review
        uses: anthropics/claude-code-action@beta
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

### New Playwright Workflow:
```yaml
name: Playwright Tests

on:
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '22.x'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Install Playwright Browsers
        run: pnpm exec playwright install --with-deps
      
      - name: Run Playwright tests
        run: pnpm exec playwright test
      
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Security Considerations
- Ensure ANTHROPIC_API_KEY has minimal required permissions
- Consider using environment-specific secrets
- Enable secret scanning in repository settings
- Add branch protection rules requiring CI to pass