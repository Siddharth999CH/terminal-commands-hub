import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface CommandMetadata {
  name: string;
  description: string;
  arguments?: string;
  executable: string;
  isCliCommand?: boolean;
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('terminal-commands-hub.runCommand', async () => {
    // Resolve real physical path to CLI executable (resolves symlinks/junctions)
    const realDir = fs.realpathSync(__dirname);
    const cliPath = path.resolve(realDir, '..', '..', 'cli', 'dist', 'index.js');
    
    // Check if the CLI executable exists on disk
    if (!fs.existsSync(cliPath)) {
      vscode.window.showErrorMessage(`Terminal Commands Hub: CLI executable not found at ${cliPath}`);
      return;
    }
    
    // Get the active terminal or create a new one, avoiding the PowerShell Extension Terminal
    let activeTerminal = vscode.window.activeTerminal;
    if (!activeTerminal || activeTerminal.name === 'PowerShell Extension Terminal') {
      activeTerminal = vscode.window.createTerminal("Terminal Hub");
    }
    
    // Show the terminal pane
    activeTerminal.show(true);
    
    // Get workspace root to resolve scripts path
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || path.resolve(realDir, '..', '..');
    
    // Check terminal name and environment default shell to determine execution syntax
    const termName = activeTerminal.name.toLowerCase();
    let isPowerShell = false;
    
    if (termName.includes('powershell') || termName.includes('pwsh') || termName.includes('extension')) {
      isPowerShell = true;
    } else {
      const shellPath = (activeTerminal.creationOptions as vscode.TerminalOptions)?.shellPath || vscode.env.shell;
      if (shellPath) {
        const lowerShell = shellPath.toLowerCase();
        if (lowerShell.includes('powershell') || lowerShell.includes('pwsh') || lowerShell.endsWith('powershell.exe') || lowerShell.endsWith('pwsh.exe')) {
          isPowerShell = true;
        }
      }
    }
    
    let shellCommand = '';
    if (isPowerShell) {
      const runScript = path.join(workspaceRoot, 'cli', 'run.ps1');
      shellCommand = `& "${runScript}"`;
    } else {
      const runScript = path.join(workspaceRoot, 'cli', 'run.sh');
      shellCommand = `source "${runScript}"`;
    }
    
    // Send the execution sequence to launch the interactive menu directly in the terminal
    activeTerminal.sendText(shellCommand);
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
