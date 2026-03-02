# Architecture & data flow

Fork is a small VS Code extension that wires UI prompts to a git command.

## Main components

- **Entry point**: `src/extension.ts`
  - Registers command `fork.createBranch`
  - Creates the status bar item (click → command)
  - Orchestrates the picker + input + git execution
- **Git adapter**: `src/git.ts`
  - Finds repo root
  - Reads current branch name (used as `baseBranch`)
  - Runs `git checkout -b <branchName>`
- **Naming utilities**: `src/slugify.ts`
  - `slugify(title, maxLen)` → `new-ui-for-user-profile-page`
  - `sanitizeBranchSegment(baseBranch)` prevents `/` from leaking into the “base branch” segment

## Data flow

```mermaid
flowchart TD
  userClick[User_clicks_statusBar] --> command[fork.createBranch]
  command --> ws[Pick_workspace_folder]
  ws --> repo[Resolve_repo_root]
  repo --> base[Read_current_branch_as_baseBranch]
  base --> typePick[QuickPick_branch_type]
  typePick --> title[InputBox_title]
  title --> slug[Slugify_title]
  slug --> name[Assemble_branchName_type/base/slug]
  name --> git[Run_git_checkout_-b]
  git --> ok[Show_success_message]
  git --> err[Show_error_message]
```

## Error handling (high-level)

- **No workspace open** → prompts you to open a folder/workspace
- **Not a git repo** → errors (detected via `git rev-parse --is-inside-work-tree`)
- **Detached HEAD** → asks you to check out a base branch first
- **Git not found** → clear “install git” message

