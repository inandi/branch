/**
 * Forks Extension Entry Module
 *
 * VS Code extension that creates structured git branches from the status bar.
 * Registers the forks.createBranch command, shows a status bar item only when the workspace
 * has a git repo, and runs the flow: pick folder → resolve repo/base branch → pick type →
 * input title → slugify → git checkout -b type/baseBranch/slug.
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 1.1.1
 * @version 1.1.1
 * @copyright (c) 2026 Gobinda Nandi
 */

import * as vscode from "vscode";
import * as fs from "node:fs";
import * as path from "node:path";
import { checkoutNewBranch, formatGitError, getCurrentBranch, getRepoRoot } from "./git";
import { sanitizeBranchSegment, slugify } from "./slugify";

/** Quick Pick item: either a branch type (with branchType) or the "Edit types…" management action */
type TypePickItem =
  | (vscode.QuickPickItem & { itemKind: "type"; branchType: string })
  | (vscode.QuickPickItem & { itemKind: "manage" });

/**
 * Get the Forks extension configuration (forks.* settings).
 * @returns Workspace configuration for the "forks" namespace
 */
function getConfig() {
  return vscode.workspace.getConfiguration("forks");
}

/**
 * Resolve the workspace folder to use for git operations.
 * If multiple folders exist, shows a Quick Pick; otherwise returns the single folder or throws.
 *
 * @returns The chosen workspace folder
 * @throws Error if no folder open or user cancels
 */
async function pickWorkspaceFolder(): Promise<vscode.WorkspaceFolder> {
  const folders = vscode.workspace.workspaceFolders ?? [];
  if (folders.length === 0) {
    throw new Error("Open a folder/workspace to use Forks.");
  }
  if (folders.length === 1) return folders[0];

  const picked = await vscode.window.showQuickPick(
    folders.map((f) => ({ label: f.name, description: f.uri.fsPath, folder: f })),
    { placeHolder: "Pick a workspace folder" }
  );

  if (!picked) {
    throw new Error("Cancelled.");
  }

  return picked.folder;
}

/**
 * Check if any opened workspace folder contains a .git directory.
 * Used to decide whether to show the Forks status bar item.
 *
 * @param folders - Current workspace folders (or undefined)
 * @returns true if at least one folder has a .git directory
 */
function workspaceHasGitRepo(folders: readonly vscode.WorkspaceFolder[] | undefined): boolean {
  if (!folders || folders.length === 0) return false;

  for (const f of folders) {
    try {
      const gitPath = path.join(f.uri.fsPath, ".git");
      const stat = fs.statSync(gitPath);
      if (stat.isDirectory()) {
        return true;
      }
    } catch {
      // ignore
    }
  }

  return false;
}

/**
 * Read branch type prefixes from settings (forks.next.types).
 * @returns Non-empty, deduplicated list of type strings (default: feature, bug, hotfix)
 */
function getBranchTypes(): string[] {
  const cfg = getConfig();
  const raw = cfg.get<unknown>("next.types");
  const list = Array.isArray(raw) ? raw : ["feature", "bug", "hotfix"];

  const types = list
    .map((t) => String(t).trim())
    .filter((t) => t.length > 0);

  return Array.from(new Set(types));
}

/**
 * Read max slug length from settings (forks.next.maxSlugLength).
 * @returns Positive number (default 80) or 80 if invalid
 */
function getMaxSlugLength(): number {
  const cfg = getConfig();
  const v = cfg.get<number>("next.maxSlugLength", 80);
  return Number.isFinite(v) ? v : 80;
}

/**
 * Read status bar label from settings (forks.next.statusBarLabel).
 * @returns Label string (default: "$(git-branch) forks")
 */
function getStatusBarLabel(): string {
  const cfg = getConfig();
  return cfg.get<string>("next.statusBarLabel", "$(git-branch) forks");
}

/**
 * Show Quick Pick of branch types plus "Edit types…" option.
 * @param types - Branch type strings to show (e.g. feature, bug, hotfix)
 * @returns Selected item (type or manage), or undefined if cancelled
 */
async function showTypePicker(types: string[]): Promise<TypePickItem | undefined> {
  const items: TypePickItem[] = [
    ...types.map((t) => ({
      itemKind: "type" as const,
      branchType: t,
      label: t,
      description: `${t}/…`
    })),
    { itemKind: "manage" as const, label: "$(gear) Edit types…", description: "Open settings" }
  ];

  return vscode.window.showQuickPick(items, {
    placeHolder: "Select a branch type"
  });
}

/**
 * Called when the extension is activated (e.g. on startup or when command runs).
 * Registers forks.createBranch, creates status bar item only when workspace has git,
 * and subscribes config change for status bar label.
 *
 * @param context - Extension context for subscriptions
 */
export function activate(context: vscode.ExtensionContext) {
  const output = vscode.window.createOutputChannel("Forks");

  const cmd = vscode.commands.registerCommand("forks.createBranch", async () => {
    try {
      const folder = await pickWorkspaceFolder();
      const repoRoot = await getRepoRoot(folder.uri.fsPath);
      const baseBranchRaw = await getCurrentBranch(repoRoot);
      if (!baseBranchRaw || baseBranchRaw === "HEAD") {
        throw new Error("Detached HEAD: check out a base branch (e.g. main) first.");
      }

      const useLastSegment = getConfig().get<boolean>("next.useLastSegmentAsBase", false);
      const baseBranch = useLastSegment
        ? sanitizeBranchSegment(baseBranchRaw.split("/").pop() || baseBranchRaw, { keepDots: true })
        : sanitizeBranchSegment(baseBranchRaw);

      const types = getBranchTypes();
      const picked = await showTypePicker(types);
      if (!picked) return;

      if (picked.itemKind === "manage") {
        await vscode.commands.executeCommand("workbench.action.openSettings", "forks.next.types");
        return;
      }

      const title = await vscode.window.showInputBox({
        title: "Create git branch",
        prompt: `Title for ${picked.branchType}/${baseBranch}/…`,
        placeHolder: 'e.g. New UI for \"User Profile\" page',
        validateInput: (v) => (String(v ?? "").trim().length === 0 ? "Title is required." : undefined)
      });
      if (title === undefined) return;

      const maxLen = getMaxSlugLength();
      const slug = slugify(title, maxLen, { keepDots: true });
      if (!slug) {
        throw new Error("Title produced an empty slug. Try a different title.");
      }

      if (!baseBranch) {
        throw new Error("Could not determine a base branch (detached HEAD?).");
      }

      const branchName = `${picked.branchType}/${baseBranch}/${slug}`;
      output.appendLine(`[forks] repoRoot=${repoRoot}`);
      output.appendLine(`[forks] baseBranch=${baseBranchRaw}`);
      output.appendLine(`[forks] create=${branchName}`);

      await checkoutNewBranch(repoRoot, branchName);
      vscode.window.showInformationMessage(`Switched to ${branchName}`);
    } catch (err) {
      const message = formatGitError(err) || String(err);
      output.appendLine(`[forks] error: ${message}`);
      vscode.window.showErrorMessage(message);
    }
  });

  const folders = vscode.workspace.workspaceFolders ?? [];
  const hasGit = workspaceHasGitRepo(folders);

  if (hasGit) {
    const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    status.command = "forks.createBranch";
    status.text = getStatusBarLabel();
    status.tooltip = "Create a structured git branch";
    status.show();

    context.subscriptions.push(status);

    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("forks.next.statusBarLabel")) {
        status.text = getStatusBarLabel();
      }
    });
  }

  context.subscriptions.push(cmd, output);
}

/**
 * Called when the extension is deactivated.
 * No cleanup required; subscriptions are disposed by VS Code.
 */
export function deactivate() { }

