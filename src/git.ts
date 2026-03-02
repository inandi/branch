import { execFile } from "node:child_process";

export type GitResult = { stdout: string; stderr: string };

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

export async function getRepoRoot(cwd: string): Promise<string> {
  const inside = await execGit(["rev-parse", "--is-inside-work-tree"], cwd);
  if (inside.stdout.trim() !== "true") {
    throw new Error("Not inside a git work tree.");
  }

  const root = await execGit(["rev-parse", "--show-toplevel"], cwd);
  return root.stdout.trim();
}

export async function getCurrentBranch(repoRoot: string): Promise<string> {
  const r1 = await execGit(["branch", "--show-current"], repoRoot);
  const name = r1.stdout.trim();
  if (name.length > 0) return name;

  const r2 = await execGit(["rev-parse", "--abbrev-ref", "HEAD"], repoRoot);
  return r2.stdout.trim();
}

export async function checkoutNewBranch(repoRoot: string, branchName: string): Promise<void> {
  await execGit(["checkout", "-b", branchName], repoRoot);
}

export function formatGitError(err: unknown): string {
  if (!err || typeof err !== "object") return String(err);

  const anyErr = err as { message?: string; stdout?: string; stderr?: string; code?: string };
  if (anyErr.code === "ENOENT") {
    return "Git was not found on your PATH. Install git and restart VS Code.";
  }

  const parts = [anyErr.message, anyErr.stderr, anyErr.stdout].filter(Boolean);
  return parts.join("\n").trim();
}

