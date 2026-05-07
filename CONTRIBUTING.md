# Contributing to AI Contract Auditor

Thank you for your interest in contributing! 🎉

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/ai-contract-audit.git`
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env.local` and add your `GEMINI_API_KEY`
5. Start dev server: `npm run dev`

## Development Workflow

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes, then run tests
npm test

# Run linter
npm run lint

# Commit with conventional commits
git commit -m "feat: add your feature"
git commit -m "fix: fix a bug"
git commit -m "docs: update documentation"

# Push and open a Pull Request
git push origin feature/your-feature-name
```

## Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Add tests for new functionality
- Update documentation if needed
- Ensure all tests pass: `npm test`
- Ensure linter passes: `npm run lint`

## Reporting Bugs

Open an issue with:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## Feature Requests

Open an issue with:

- Clear description of the feature
- Why it would be useful
- Any implementation ideas

## Questions?

Open an issue with the `question` label.
