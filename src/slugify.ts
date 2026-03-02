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

export function sanitizeBranchSegment(input: string): string {
  const replaced = input.trim().replace(/\//g, "-");
  const s = slugify(replaced, 64);
  return s || replaced.replace(/^-+|-+$/g, "");
}

