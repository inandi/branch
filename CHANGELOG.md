# Release v1.1.2 - 2026-03-03

## Improvements
- **Tooling and dependencies**: Updated development dependencies (including VS Code typings) to align with the supported VS Code engine.

---

# Release v1.1.1 - 2026-03-03

## New Features
- **Fork status bar branch creator**: Create git branches from the status bar using the format `type/baseBranch/slug`.
- **Configurable branch types and slug length**: Control prefixes and slug length via `fork.types`, `fork.maxSlugLength`, and `fork.statusBarLabel`.
- **Git-aware behavior**: Only shows the Fork icon when a workspace folder contains a `.git` directory and uses the current branch as the base.

## Improvements
- **Error handling and UX**: Clear messages for non-git folders, detached HEAD, missing git, and invalid titles.
- **Documentation and code comments**: Added README/docs and JSDoc-style comments for the core modules (`extension`, `git`, `slugify`).
- **Project setup and release tooling**: Added `.gitignore`, LICENSE, CHANGELOG, and release scripts/notes, and refined `package.json` metadata for author, publisher, and scripts.

---

