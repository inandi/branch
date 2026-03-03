/**
 * Forks Git Module
 *
 * Runs git commands in the workspace repo: resolve root, current branch, and create/checkout branches.
 * Uses execFile with repo root as cwd; formats errors for user display (e.g. ENOENT → "install git").
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 1.1.1
 * @version 1.1.1
 * @copyright (c) 2026 Gobinda Nandi
 */

import { execFile } from "node:child_process";

/** Result of a successful git command: stdout and stderr strings */
export type GitResult = { stdout: string; stderr: string };

/**
 * Run a git command in the given working directory.
 * @param args - Git arguments (e.g. ["rev-parse", "--show-toplevel"])
 * @param cwd - Working directory (e.g. repo root or workspace folder path)
 * @returns Promise that resolves with { stdout, stderr } or rejects with error (stdout/stderr attached)
 */
function execGit(args: string[], cwd: string): Promise<GitResult> {
  return new Promise((resolve, reject) => {
    execFile(
      "git",
      args,
      { cwd, windowsHide: true, maxBuffer: 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          const e = error as NodeJS.ErrnoException & {
            stdout?: string;
            stderr?: string;
          };
          e.stdout = String(stdout ?? "");
          e.stderr = String(stderr ?? "");
          reject(e);
          return;
        }

        resolve({ stdout: String(stdout ?? ""), stderr: String(stderr ?? "") });
      }
    );
  });
}

/**
 * Ensure the path is inside a git work tree and return the repo root.
 * @param cwd - Path to start from (e.g. workspace folder)
 * @returns Absolute path to the git repository root
 * @throws Error if not inside a git work tree
 */
export async function getRepoRoot(cwd: string): Promise<string> {
  const inside = await execGit(["rev-parse", "--is-inside-work-tree"], cwd);
  if (inside.stdout.trim() !== "true") {
    throw new Error("Not inside a git work tree.");
  }

  const root = await execGit(["rev-parse", "--show-toplevel"], cwd);
  return root.stdout.trim();
}

/**
 * Get the current branch name in the repository.
 * Uses `git branch --show-current` with fallback to `git rev-parse --abbrev-ref HEAD`.
 *
 * @param repoRoot - Absolute path to the git repo root
 * @returns Current branch name (e.g. "main"); may be "HEAD" in detached state
 */
export async function getCurrentBranch(repoRoot: string): Promise<string> {
  const r1 = await execGit(["branch", "--show-current"], repoRoot);
  const name = r1.stdout.trim();
  if (name.length > 0) return name;

  const r2 = await execGit(["rev-parse", "--abbrev-ref", "HEAD"], repoRoot);
  return r2.stdout.trim();
}

/**
 * Create and checkout a new branch in the repository.
 * @param repoRoot - Absolute path to the git repo root
 * @param branchName - Full branch name (e.g. "feature/main/my-slug")
 * @returns Promise that resolves when checkout succeeds or rejects with git error
 */
export async function checkoutNewBranch(repoRoot: string, branchName: string): Promise<void> {
  await execGit(["checkout", "-b", branchName], repoRoot);
}

/**
 * Format a git or exec error for user display.
 * Handles ENOENT (git not found) with a friendly message; otherwise combines message, stderr, stdout.
 *
 * @param err - Caught error (may have message, code, stdout, stderr)
 * @returns Single string suitable for showErrorMessage or output channel
 */
export function formatGitError(err: unknown): string {
  if (!err || typeof err !== "object") return String(err);

  const anyErr = err as { message?: string; stdout?: string; stderr?: string; code?: string };
  if (anyErr.code === "ENOENT") {
    return "Git was not found on your PATH. Install git and restart VS Code.";
  }

  const parts = [anyErr.message, anyErr.stderr, anyErr.stdout].filter(Boolean);
  return parts.join("\n").trim();
}

