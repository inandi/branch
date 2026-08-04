<div align="center">
  <h1>Forks Next</h1>
  <p><strong>Standardized Git Branches from the Status Bar</strong></p>
</div>

Tired of typing branch names by hand or forgetting your team’s conventions? Forks pins a branch creator to your status bar—pick a type, enter a title, and get a clean branch name like `feature/main/new-ui-for-profile`.

## What is Forks?

Forks is a VS Code extension that creates structured git branches from a guided flow. Click **Forks** in the status bar, choose a type (e.g. feature, bug, hotfix), type a short title, and Forks slugifies it and runs `git checkout -b type/baseBranch/slug` for you.

## Why Use Forks?

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
3. Search for **Forks**
4. Click Install

### First Steps

1. **Open a folder** that is a git repository (Forks only shows its status bar icon when a `.git` folder exists)
2. **Click the Forks icon** in the status bar (or run **Forks: Create structured branch** from the Command Palette)
3. **Pick a branch type** (e.g. feature, bug, hotfix—or add more in settings)
4. **Enter a title** (e.g. `New UI for User Profile page`) and confirm—Forks creates and checks out the new branch

### Commands

- **Forks: Create structured branch** – Open the branch-creation flow (type → title → `git checkout -b`)

## How It Works

### Branch format

Branches are created as:

`<type>/<baseBranch>/<slug>`

Example: on `main`, choosing **feature** and title **New UI for "User Profile" Page!** produces:

`feature/main/new-ui-for-user-profile-page`

### Settings

Configure Forks under the **Forks Next** section in settings (`forks.next.*`):

- **forks.next.types** – Branch type prefixes in the picker (default: `feature`, `bug`, `hotfix`)
- **forks.next.maxSlugLength** – Max length for the slug part (default: `80`)
- **forks.next.statusBarLabel** – Status bar text (default: `$(git-branch) forks`; Codicons supported)
- **forks.next.useLastSegmentAsBase** – Use the last segment of the current branch as the base branch (default: `false`)

#### `forks.next.useLastSegmentAsBase`

When you work on a branch that already contains nested segments (e.g. `feature/master/test`), Forks normally uses the **entire** current branch name as the base, producing deeply nested results like:

```
feature/feature-master-test/my-new-feature
```

Enabling `useLastSegmentAsBase` tells Forks to use only the **last segment** (`test`) as the base branch instead:

```
feature/test/my-new-feature
```

| Current branch | Disabled (default) | Enabled |
|---|---|---|
| `main` | `feature/main/...` | `feature/main/…` (unchanged) |
| `feature/master/test` | `feature/feature-master-test/...` | `feature/test/...` |
| `bug/hotfix/login-bug` | `feature/bug-hotfix-login-bug/...` | `feature/login-bug/...` |

### Slugification

- Titles are lowercased and most non-alphanumeric characters become hyphens.
- **Dots (`.`) and underscores (`_`) are always preserved** in the slug.

Examples:

| Title input | Slug output |
|---|---|
| `New UI for "User Profile" Page!` | `new-ui-for-user-profile-page` |
| `fix login.page_v2` | `fix-login.page_v2` |

Press **F5** to launch the Extension Development Host.

## Need Help?

- **Docs**: See [docs/README.md](docs/README.md) for overview, [docs/architecture.md](docs/architecture.md) for data flow, and [docs/configuration.md](docs/configuration.md) for settings
- **Issues**: Found a bug or have an idea? Open an issue on GitHub
- **Repository**: [github.com/2501224066/forks](https://github.com/2501224066/forks)

## License

This project is licensed under the MIT License.

---

**Made with ❤️ by PopoanFly**
