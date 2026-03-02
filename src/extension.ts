import * as vscode from "vscode";
import { checkoutNewBranch, formatGitError, getCurrentBranch, getRepoRoot } from "./git";
import { sanitizeBranchSegment, slugify } from "./slugify";

type TypePickItem =
  | (vscode.QuickPickItem & { itemKind: "type"; branchType: string })
  | (vscode.QuickPickItem & { itemKind: "manage" });

function getConfig() {
  return vscode.workspace.getConfiguration("fork");
}

async function pickWorkspaceFolder(): Promise<vscode.WorkspaceFolder> {
  const folders = vscode.workspace.workspaceFolders ?? [];
  if (folders.length === 0) {
    throw new Error("Open a folder/workspace to use Fork.");
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

function getBranchTypes(): string[] {
  const cfg = getConfig();
  const raw = cfg.get<unknown>("types");
  const list = Array.isArray(raw) ? raw : ["feature", "bug", "hotfix"];

  const types = list
    .map((t) => String(t).trim())
    .filter((t) => t.length > 0);

  return Array.from(new Set(types));
}

function getMaxSlugLength(): number {
  const cfg = getConfig();
  const v = cfg.get<number>("maxSlugLength", 80);
  return Number.isFinite(v) ? v : 80;
}

function getStatusBarLabel(): string {
  const cfg = getConfig();
  return cfg.get<string>("statusBarLabel", "$(git-branch) fork");
}

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

export function activate(context: vscode.ExtensionContext) {
  const output = vscode.window.createOutputChannel("Fork");

  const cmd = vscode.commands.registerCommand("fork.createBranch", async () => {
    try {
      const folder = await pickWorkspaceFolder();
      const repoRoot = await getRepoRoot(folder.uri.fsPath);
      const baseBranchRaw = await getCurrentBranch(repoRoot);
      if (!baseBranchRaw || baseBranchRaw === "HEAD") {
        throw new Error("Detached HEAD: check out a base branch (e.g. main) first.");
      }
      const baseBranch = sanitizeBranchSegment(baseBranchRaw);

      const types = getBranchTypes();
      const picked = await showTypePicker(types);
      if (!picked) return;

      if (picked.itemKind === "manage") {
        await vscode.commands.executeCommand("workbench.action.openSettings", "fork.types");
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
      const slug = slugify(title, maxLen);
      if (!slug) {
        throw new Error("Title produced an empty slug. Try a different title.");
      }

      if (!baseBranch) {
        throw new Error("Could not determine a base branch (detached HEAD?).");
      }

      const branchName = `${picked.branchType}/${baseBranch}/${slug}`;
      output.appendLine(`[fork] repoRoot=${repoRoot}`);
      output.appendLine(`[fork] baseBranch=${baseBranchRaw}`);
      output.appendLine(`[fork] create=${branchName}`);

      await checkoutNewBranch(repoRoot, branchName);
      vscode.window.showInformationMessage(`Switched to ${branchName}`);
    } catch (err) {
      const message = formatGitError(err) || String(err);
      output.appendLine(`[fork] error: ${message}`);
      vscode.window.showErrorMessage(message);
    }
  });

  const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  status.command = "fork.createBranch";
  status.text = getStatusBarLabel();
  status.tooltip = "Create a structured git branch";
  status.show();

  context.subscriptions.push(cmd, status, output);

  vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration("fork.statusBarLabel")) {
      status.text = getStatusBarLabel();
    }
  });
}

export function deactivate() {}

