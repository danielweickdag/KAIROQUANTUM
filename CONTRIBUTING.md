# Contributing to KAIRO QUANTUM

Thank you for your interest in contributing to KAIRO QUANTUM! This document provides guidelines and instructions for contributing.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

---

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Our Standards

- **Be respectful**: Treat everyone with respect and consideration
- **Be collaborative**: Work together to improve the project
- **Be constructive**: Provide helpful feedback and suggestions
- **Be patient**: Remember that everyone is learning

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 15+
- Docker (optional)
- Git

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   git clone https://github.com/YOUR_USERNAME/KAIROQUANTUM.git
   cd KAIROQUANTUM
   ```

2. **Run automated setup**
   ```bash
   ./scripts/setup.sh
   ```

3. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Start development servers**
   ```bash
   ./scripts/start.sh
   ```

---

## 🔄 Development Workflow

### 1. Pick an Issue

- Check [open issues](https://github.com/yourusername/KAIROQUANTUM/issues)
- Comment on the issue to claim it
- Wait for maintainer approval before starting

### 2. Create a Branch

Branch naming conventions:
- **Feature**: `feature/description`
- **Bug Fix**: `fix/description`
- **Documentation**: `docs/description`
- **Refactor**: `refactor/description`

Examples:
```bash
git checkout -b feature/add-options-trading
git checkout -b fix/login-redirect-bug
git checkout -b docs/update-api-docs
```

### 3. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add tests for new features
- Update documentation as needed

### 4. Test Your Changes

```bash
# Run all tests
./scripts/test.sh

# Run specific tests
./scripts/test.sh backend
./scripts/test.sh python
./scripts/test.sh frontend
```

### 5. Commit Your Changes

See [Commit Messages](#commit-messages) section below.

### 6. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a PR on GitHub.

---

## 💻 Coding Standards

### TypeScript/JavaScript (Backend & Frontend)

- **Style Guide**: Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier

```bash
# Auto-fix linting issues
npm run lint -- --fix

# Format code
npm run format
```

**Best Practices**:
- Use TypeScript for type safety
- Prefer `const` over `let`, avoid `var`
- Use async/await over callbacks
- Add JSDoc comments for complex functions
- Keep functions small and focused

**Example**:
```typescript
/**
 * Calculate user's total portfolio value
 * @param userId - User's unique identifier
 * @returns Promise resolving to total value in USD
 */
async function calculatePortfolioValue(userId: string): Promise<number> {
  const positions = await getPositions(userId);
  const total = positions.reduce((sum, pos) => sum + pos.value, 0);
  return total;
}
```

### Python (Analytics Service)

- **Style Guide**: [PEP 8](https://pep8.org/)
- **Linting**: Ruff
- **Type Checking**: mypy
- **Formatting**: Black

```bash
# Lint Python code
ruff check .

# Type check
mypy .

# Format code
black .
```

**Best Practices**:
- Use type hints for function parameters and return values
- Follow PEP 8 naming conventions
- Add docstrings to all functions and classes
- Keep functions pure when possible

**Example**:
```python
from typing import List, Dict
from datetime import datetime

async def calculate_sharpe_ratio(
    user_id: str,
    risk_free_rate: float = 0.02
) -> float:
    """
    Calculate Sharpe Ratio for a user's trading performance.

    Args:
        user_id: User's unique identifier
        risk_free_rate: Annual risk-free rate (default 2%)

    Returns:
        Sharpe Ratio as a float
    """
    returns = await get_user_returns(user_id)
    avg_return = sum(returns) / len(returns)
    std_dev = calculate_std_dev(returns)

    return (avg_return - risk_free_rate) / std_dev if std_dev > 0 else 0.0
```

### Database

- **Migrations**: Use Prisma migrations, never manual SQL in production
- **Naming**: Use snake_case for table and column names
- **Indexes**: Add indexes for frequently queried columns

```bash
# Create migration
cd backend
npx prisma migrate dev --name add_new_feature

# Generate Prisma client
npx prisma generate
```

---

## 🧪 Testing Guidelines

### Backend Tests (Jest)

```typescript
describe('StripeService', () => {
  it('should create checkout session', async () => {
    const session = await stripeService.createCheckoutSession(
      'cus_123',
      'price_123',
      'http://success.com',
      'http://cancel.com'
    );

    expect(session).toBeDefined();
    expect(session.url).toContain('checkout.stripe.com');
  });
});
```

### Python Tests (pytest)

```python
import pytest
from app.compliance import check_pattern_day_trading

@pytest.mark.asyncio
async def test_pdt_detection():
    user_id = "test-user-123"
    trade = {...}  # Mock trade data

    result = await check_pattern_day_trading(user_id, trade)

    assert result["status"] == "flag"
    assert "Pattern Day Trading" in result["reason"]
```

### Frontend Tests (React Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import { ComparativeProfitAnalysis } from './ComparativeProfitAnalysis';

test('renders upgrade prompt for free tier', () => {
  render(<ComparativeProfitAnalysis />);
  expect(screen.getByText(/Upgrade to Pro/i)).toBeInTheDocument();
});
```

### Test Coverage

- **Minimum Coverage**: 80% for new code
- **Focus Areas**: Business logic, API endpoints, data transformations
- **Skip**: Simple getters/setters, trivial functions

---

## 📝 Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# Good commit messages
git commit -m "feat(trading): add options trading support"
git commit -m "fix(auth): resolve JWT expiration bug"
git commit -m "docs(readme): update installation instructions"

# Bad commit messages (avoid these)
git commit -m "fixed stuff"
git commit -m "WIP"
git commit -m "asdfasdf"
```

### Detailed Example

```
feat(compliance): add wash sale detection

Implemented wash sale rule checking to prevent users from
violating the 30-day rule. The system now:
- Tracks buy/sell transactions within 30-day window
- Flags potential wash sales in compliance audit
- Provides clear warnings to users

Closes #123
```

---

## 🔀 Pull Request Process

### Before Submitting

- [ ] Run all tests: `./scripts/test.sh`
- [ ] Run linting: `npm run lint`
- [ ] Update documentation if needed
- [ ] Add tests for new features
- [ ] Ensure no merge conflicts with `main`

### PR Title

Use the same format as commit messages:
```
feat(trading): add options trading support
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
```

### Review Process

1. **Automated Checks**: CI/CD pipeline must pass
2. **Code Review**: At least 1 maintainer approval required
3. **Testing**: Reviewer tests changes locally
4. **Merge**: Squash and merge to keep history clean

### After Merge

- Delete your feature branch
- Update your local `main` branch
- Close related issues

---

## 🐛 Reporting Bugs

### Before Reporting

1. Check [existing issues](https://github.com/yourusername/KAIROQUANTUM/issues)
2. Try latest version
3. Collect error logs and reproduction steps

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS 13.0]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]

## Logs/Screenshots
[Paste relevant logs or add screenshots]
```

---

## 💡 Feature Requests

### Before Requesting

1. Check [existing feature requests](https://github.com/yourusername/KAIROQUANTUM/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)
2. Discuss in [Discussions](https://github.com/yourusername/KAIROQUANTUM/discussions)

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Problem it Solves
What problem does this feature address?

## Proposed Solution
How should this feature work?

## Alternatives Considered
What other solutions did you consider?

## Additional Context
Any other relevant information
```

---

## 📚 Resources

- [API Documentation](https://docs.kairoquantum.com/api)
- [Architecture Overview](./MICROSERVICES_ARCHITECTURE.md)
- [Deployment Guide](./README.md#-deployment)
- [Discord Community](https://discord.gg/kairoquantum)

---

## ❓ Questions?

- **Discord**: https://discord.gg/kairoquantum
- **Email**: dev@kairoquantum.com
- **GitHub Discussions**: https://github.com/yourusername/KAIROQUANTUM/discussions

---

## 🙏 Thank You!

Thank you for contributing to KAIRO QUANTUM! Your contributions help make trading technology more accessible to everyone.

**Happy Coding! 🚀**
