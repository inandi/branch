/**
 * Fork Slugify Module
 *
 * Utilities to turn human-readable titles and branch segments into git-safe slugs:
 * lowercase, hyphen-separated, no special characters, optional max length.
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 1.1.1
 * @version 1.1.1
 * @copyright (c) 2026 Gobinda Nandi
 */

/**
 * Slugify a string for use in branch names.
 * Lowercases, replaces non-alphanumeric with hyphens, collapses/trims hyphens, and enforces max length.
 *
 * @param input - Raw title or segment (e.g. "New UI for \"User Profile\"!")
 * @param maxLength - Maximum length of the slug (0 or non-finite = no limit)
 * @returns Slug (e.g. "new-ui-for-user-profile") or empty string if input yields nothing
 */
export function slugify(input: string, maxLength: number): string {
  const cleaned = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (cleaned.length === 0) {
    return "";
  }

  const limited =
    Number.isFinite(maxLength) && maxLength > 0 ? cleaned.slice(0, maxLength) : cleaned;

  return limited.replace(/^-|-$/g, "");
}

/**
 * Sanitize a branch name segment (e.g. current branch name) so it can be used as one path part.
 * Replaces slashes with hyphens and slugifies; avoids empty result by falling back to trimmed input.
 *
 * @param input - Segment that may contain slashes (e.g. "feature/main")
 * @returns Safe segment (e.g. "feature-main")
 */
export function sanitizeBranchSegment(input: string): string {
  const replaced = input.trim().replace(/\//g, "-");
  const s = slugify(replaced, 64);
  return s || replaced.replace(/^-+|-+$/g, "");
}

