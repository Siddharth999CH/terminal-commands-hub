"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function activate(context) {
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
        }
        else {
            const shellPath = activeTerminal.creationOptions?.shellPath || vscode.env.shell;
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
        }
        else {
            const runScript = path.join(workspaceRoot, 'cli', 'run.sh');
            shellCommand = `source "${runScript}"`;
        }
        // Send the execution sequence to launch the interactive menu directly in the terminal
        activeTerminal.sendText(shellCommand);
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
