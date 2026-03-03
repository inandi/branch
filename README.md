<div align="center">
  <h1>Fork [Beta]</h1>
  <p><strong>Standardized Git Branches from the Status Bar</strong></p>
</div>

Tired of typing branch names by hand or forgetting your team’s conventions? Fork pins a branch creator to your status bar—pick a type, enter a title, and get a clean branch name like `feature/main/new-ui-for-profile`.

## What is Fork?

Fork is a VS Code extension that creates structured git branches from a guided flow. Click **Fork** in the status bar, choose a type (e.g. feature, bug, hotfix), type a short title, and Fork slugifies it and runs `git checkout -b type/baseBranch/slug` for you.

## Why Use Fork?

- **Consistent naming**: Enforces a `type/baseBranch/slug` format so branches look the same across the team
- **Smart slugification**: Turns titles like `New UI for "User Profile"!` into `new-ui-for-user-profile`
- **Context-aware**: Uses your current branch as the base (e.g. `feature/main/...` when you’re on `main`)
- **Zero-clutter UI**: One status bar item; the icon only appears when the workspace has a git repo
- **Customizable types**: Add your own prefixes (e.g. `refactor`, `docs`, `chore`) in settings
- **Character limit**: Optional max length for the slug so branch names stay readable (e.g. under 100 chars)

## Getting Started

### Installation

1. Open VS Code or Cursor
2. Go to the Extensions view
3. Search for **Fork**
4. Click Install

### First Steps

1. **Open a folder** that is a git repository (Fork only shows its status bar icon when a `.git` folder exists)
2. **Click the Fork icon** in the status bar (or run **Fork: Create structured branch** from the Command Palette)
3. **Pick a branch type** (e.g. feature, bug, hotfix—or add more in settings)
4. **Enter a title** (e.g. `New UI for User Profile page`) and confirm—Fork creates and checks out the new branch

### Commands

- **Fork: Create structured branch** – Open the branch-creation flow (type → title → `git checkout -b`)

## How It Works

### Branch format

Branches are created as:

`<type>/<baseBranch>/<slug>`

Example: on `main`, choosing **feature** and title **New UI for "User Profile" Page!** produces:

`feature/main/new-ui-for-user-profile-page`

### Settings

Configure Fork under the **Fork** section in settings (`fork.*`):

- **fork.types** – Branch type prefixes in the picker (default: `feature`, `bug`, `hotfix`)
- **fork.maxSlugLength** – Max length for the slug part (default: `80`)
- **fork.statusBarLabel** – Status bar text (default: `$(git-branch) fork`; Codicons supported)

Press **F5** to launch the Extension Development Host.

## Support the Project

If Fork helps your workflow, you can support the project (no pressure):

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/igobinda)

## Need Help?

- **Docs**: See [docs/README.md](docs/README.md) for overview, [docs/architecture.md](docs/architecture.md) for data flow, and [docs/configuration.md](docs/configuration.md) for settings
- **Issues**: Found a bug or have an idea? Open an issue on GitHub
- **Repository**: [github.com/iNandi/fork](https://github.com/iNandi/fork)

## License

This project is licensed under the MIT License.

---

**Made with ❤️ by Gobinda Nandi**
