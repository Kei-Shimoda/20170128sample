# CLAUDE.md

This file provides guidance to AI assistants (Claude Code and similar tools) working in this repository.

## Repository Overview

**Name:** 20170128sample  
**Owner:** Kei-Shimoda  
**Created:** January 28, 2017  
**Status:** Minimal placeholder repository — no source code or build system exists yet.

This repository currently contains only a `README.md` with a title header. It was initialized as a first commit and has had no further development.

## Current Repository Structure

```
20170128sample/
├── CLAUDE.md       # This file
└── README.md       # Project title only
```

## Git Workflow

- **Default branch:** `master`
- **Development branches:** Use descriptive branch names (e.g., `feature/add-xyz`, `fix/issue-description`)
- There is a single initial commit (`2705ed7`) on `master`; all new work should branch from it

### Branch conventions

When starting new work:
```bash
git checkout -b feature/<short-description>
```

Push changes:
```bash
git push -u origin <branch-name>
```

## Development Setup

No build system, package manager, or runtime dependencies are currently defined. When the project gains code, update this section with:

- Language/runtime version requirements
- Dependency installation steps (`npm install`, `pip install -r requirements.txt`, etc.)
- Environment variable setup

## Testing

No test suite exists. When tests are added, document the command to run them here (e.g., `npm test`, `pytest`, `make test`).

## Code Conventions

No conventions are established yet. When code is added, document:

- Formatting tools and config (Prettier, Black, gofmt, etc.)
- Linting setup
- Naming conventions
- Commit message style

## Notes for AI Assistants

- This repository is essentially empty. When asked to add functionality, prefer creating well-structured, idiomatic code appropriate to whatever language/framework is chosen.
- Update this `CLAUDE.md` whenever new tooling, conventions, or structural decisions are made.
- Do not push directly to `master` — create a feature branch and push there.
