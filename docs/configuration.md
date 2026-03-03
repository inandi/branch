# Configuration

Forks reads settings from the `forks` namespace.

## Settings

- **`forks.types`** (array of strings)  
  Branch type options shown in the picker.  
  Default: `feature`, `bug`, `hotfix`

- **`forks.maxSlugLength`** (number)  
  Max length for the slugified title portion.  
  Default: `80`

- **`forks.statusBarLabel`** (string)  
  Text shown in the status bar (Codicons supported).  
  Default: `$(git-branch) forks`

## Example `settings.json`

```json
{
  "forks.types": ["feature", "bug", "hotfix", "docs", "refactor", "chore"],
  "forks.maxSlugLength": 96,
  "forks.statusBarLabel": "$(git-branch) forks"
}
```

## Output format

Forks creates branches as:

`<type>/<baseBranch>/<slug>`

Example:

`feature/main/new-ui-for-user-profile-page`

