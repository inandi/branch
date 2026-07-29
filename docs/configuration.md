# Configuration

Forks Next reads settings from the `forks.next` namespace.

## Settings

- **`forks.next.types`** (array of strings)  
  Branch type options shown in the picker.  
  Default: `feature`, `bug`, `hotfix`

- **`forks.next.maxSlugLength`** (number)  
  Max length for the slugified title portion.  
  Default: `80`

- **`forks.next.statusBarLabel`** (string)  
  Text shown in the status bar (Codicons supported).  
  Default: `$(git-branch) forks`

- **`forks.next.useLastSegmentAsBase`** (boolean)  
  Use the last segment of the current branch as the base branch.  
  When on a branch like `feature/master/test`, uses `test` instead of the full name.  
  Default: `false`

## Example `settings.json`

```json
{
  "forks.next.types": ["feature", "bug", "hotfix", "docs", "refactor", "chore"],
  "forks.next.maxSlugLength": 96,
  "forks.next.statusBarLabel": "$(git-branch) forks",
  "forks.next.useLastSegmentAsBase": false
}
```

## Output format

Forks creates branches as:

`<type>/<baseBranch>/<slug>`

Example:

`feature/main/new-ui-for-user-profile-page`

