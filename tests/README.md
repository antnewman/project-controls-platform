# Testing Documentation

## Overview

This project has comprehensive test coverage including:
- **Unit Tests (60%)**: Test individual functions, hooks, and components
- **Integration Tests (25%)**: Test complete feature workflows
- **E2E Tests (10%)**: Test real user scenarios in actual browsers
- **Visual Regression Tests (5%)**: Ensure UI consistency
- **Performance Tests**: Monitor Core Web Vitals

## Running Tests

### Unit Tests

```bash
# Watch mode (recommended for development)
npm test

# Run once
npm run test:run

# With coverage report
npm run test:coverage

# Interactive UI
npm run test:ui

# Watch specific file
npm test -- Button.test
```

### E2E Tests

```bash
# Headless mode (default)
npm run test:e2e

# With browser UI visible
npm run test:e2e:headed

# Interactive debug mode
npm run test:e2e:debug

# Interactive Playwright UI
npm run test:e2e:ui

# View last test report
npm run test:e2e:report
```

### Visual Regression Tests

```bash
# Run visual tests
npm run test:visual

# Update snapshots (when UI changes are intentional)
npm run test:visual:update
```

### All Tests

```bash
# Run all tests (unit + E2E)
npm run test:all

# CI pipeline (includes coverage)
npm run test:ci
```

## Test Structure

```
tests/
├── unit/                    # Unit tests (60% of suite)
│   ├── lib/                 # Utility functions
│   ├── hooks/               # React hooks
│   └── components/          # UI components
├── integration/             # Integration tests (25%)
│   ├── riskAnalysis.test.tsx
│   ├── wbsGenerator.test.tsx
│   └── navigation.test.tsx
├── e2e/                     # E2E tests (10%)
│   ├── riskAnalysis.spec.ts
│   ├── wbsGenerator.spec.ts
│   ├── navigation.spec.ts
│   └── accessibility.spec.ts
├── visual/                  # Visual regression (5%)
│   └── snapshots.spec.ts
├── performance/             # Performance tests
│   ├── lighthouse.test.ts
│   └── webVitals.test.ts
└── helpers/                 # Test utilities
    ├── testUtils.tsx
    └── mockApi.ts
```

## Coverage Requirements

The project enforces minimum coverage thresholds:

- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 75%
- **Statements**: 80%

View coverage report:
```bash
npm run test:coverage
# Then open coverage/index.html
```

## Writing Tests

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest'
import { myFunction } from '@/lib/utils'

describe('myFunction', () => {
  it('should do something', () => {
    expect(myFunction()).toBe(expectedValue)
  })
})
```

### Component Tests

```typescript
import { render, screen } from '@testing-library/react'
import { MyComponent } from '@/components/MyComponent'

it('renders correctly', () => {
  render(<MyComponent />)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
```

### E2E Tests

```typescript
import { test, expect } from '@playwright/test'

test('user can complete workflow', async ({ page }) => {
  await page.goto('/feature')
  await page.click('button')
  await expect(page.locator('text=Success')).toBeVisible()
})
```

## Best Practices

### General
- Write tests before fixing bugs (TDD)
- Keep tests simple and focused
- Test behavior, not implementation
- Use descriptive test names
- Avoid testing third-party libraries

### Unit Tests
- Test edge cases and error conditions
- Mock external dependencies
- Use `createMock*` helpers from test utils
- Aim for fast execution (<100ms per test)

### Integration Tests
- Test complete user flows
- Use real components when possible
- Mock only external APIs
- Test error handling

### E2E Tests
- Focus on critical user journeys
- Keep tests independent
- Use data-testid for stable selectors
- Handle timing with proper waits

### Visual Tests
- Update snapshots intentionally
- Review diffs carefully
- Test responsive breakpoints
- Keep snapshots small and focused

## Debugging Tests

### Vitest (Unit/Integration)
```bash
# Debug in VS Code
1. Set breakpoint
2. Run "JavaScript Debug Terminal"
3. Run: npm test

# Debug specific test
npm test -- --reporter=verbose ComponentName
```

### Playwright (E2E)
```bash
# Debug mode (pauses on each step)
npm run test:e2e:debug

# View trace for failed tests
npx playwright show-trace test-results/trace.zip

# Generate trace for specific test
npx playwright test --trace on
```

## Continuous Integration

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main`

CI Pipeline:
1. **Lint** - Code style checks
2. **Unit Tests** - With coverage upload
3. **E2E Tests** - In Chromium, Firefox, WebKit
4. **Visual Tests** - Screenshot comparison
5. **Build** - Verify production build

View results:
- GitHub Actions tab
- PR checks
- Codecov reports

## Troubleshooting

### Tests Failing Locally

```bash
# Clear caches
rm -rf node_modules coverage test-results
npm ci

# Reinstall Playwright
npx playwright install --with-deps
```

### Flaky Tests

- Increase timeouts for slow operations
- Use `waitFor` instead of fixed delays
- Ensure proper test isolation
- Check for race conditions

### Coverage Issues

```bash
# Check what's not covered
npm run test:coverage
open coverage/index.html

# Run specific test file
npm test -- path/to/file.test.ts
```

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [Project Documentation](../README.md)

## Contributing

When adding new features:
1. Write tests first (TDD)
2. Ensure coverage stays above thresholds
3. Update this documentation if needed
4. Run full test suite before PR

```bash
npm run test:ci
```
