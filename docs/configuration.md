# Configuration

Fork reads settings from the `fork` namespace.

## Settings

- **`fork.types`** (array of strings)  
  Branch type options shown in the picker.  
  Default: `feature`, `bug`, `hotfix`

- **`fork.maxSlugLength`** (number)  
  Max length for the slugified title portion.  
  Default: `80`

- **`fork.statusBarLabel`** (string)  
  Text shown in the status bar (Codicons supported).  
  Default: `$(git-branch) fork`

## Example `settings.json`

```json
{
  "fork.types": ["feature", "bug", "hotfix", "docs", "refactor", "chore"],
  "fork.maxSlugLength": 96,
  "fork.statusBarLabel": "$(git-branch) fork"
}
```

## Output format

Fork creates branches as:

`<type>/<baseBranch>/<slug>`

Example:

`feature/main/new-ui-for-user-profile-page`

