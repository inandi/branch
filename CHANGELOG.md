# Release v2.1.1 - 2026-04-07

## Improvements
- Updated release automation to support publishing to both Visual Studio Marketplace and Open VSX Registry.
- Added release-time validation to ensure `package.json` version consistency before publishing.
- Marked the extension as a preview release.

## Bug Fixes
- Improved publishing token checks and error handling in the release script to fail fast with clearer messages.

---

# Release v1.2.2 - 2026-03-03

## New Features
- No new user-facing features in this release.

## Improvements
- Renamed the extension from "Fork" to "Forks" and updated commands, configuration keys, docs, and marketplace metadata for consistent branding.
- Updated tooling and development dependencies (including VS Code typings) to align with the supported VS Code engine.

## Bug Fixes
- No specific bug fixes recorded for this release.

## Deprecated Features
- None.

## Known Issues
- None new; see CHANGELOG and GitHub issues for existing items.

## Acknowledgments
- Thanks to everyone using Forks and providing feedback.

---

# Release v1.1.2 - 2026-03-03

## Improvements
- **Tooling and dependencies**: Updated development dependencies (including VS Code typings) to align with the supported VS Code engine.

---

# Release v1.1.1 - 2026-03-03

## New Features
- **Forks status bar branch creator**: Create git branches from the status bar using the format `type/baseBranch/slug`.
- **Configurable branch types and slug length**: Control prefixes and slug length via `forks.types`, `forks.maxSlugLength`, and `forks.statusBarLabel`.
- **Git-aware behavior**: Only shows the Forks icon when a workspace folder contains a `.git` directory and uses the current branch as the base.

## Improvements
- **Error handling and UX**: Clear messages for non-git folders, detached HEAD, missing git, and invalid titles.
- **Documentation and code comments**: Added README/docs and JSDoc-style comments for the core modules (`extension`, `git`, `slugify`).
- **Project setup and release tooling**: Added `.gitignore`, LICENSE, CHANGELOG, and release scripts/notes, and refined `package.json` metadata for author, publisher, and scripts.

---

