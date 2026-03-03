# Forks — documentation

- **What it does**: Creates a new git branch from a status-bar flow, enforcing the format `type/baseBranch/slug`.
- **How to use it**: Click the status bar item (**forks**) or run the command `Forks: Create structured branch`.
- **Where to configure it**: VS Code Settings (`forks.*`).

## Quick example

Input title:
`New UI for "User Profile" Page!`

When you’re currently on `main` and choose `feature`, Forks creates:
`feature/main/new-ui-for-user-profile-page`

## Docs

- [Architecture and data flow](./architecture.md)
- [Configuration reference](./configuration.md)

