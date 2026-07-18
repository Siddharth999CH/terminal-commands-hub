#!/usr/bin/env node
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
exports.commandsList = void 0;
const commander_1 = require("commander");
const os = __importStar(require("os"));
const readline = __importStar(require("readline"));
const path = __importStar(require("path"));
const program = new commander_1.Command();
program
    .name('term-hub')
    .description('A library of terminal commands and utility scripts')
    .version('1.0.0');
exports.commandsList = [
    {
        name: 'Git Status',
        description: 'Check current status of the git repository',
        executable: 'git status'
    },
    {
        name: 'Run Development',
        description: 'Start the local development server/build',
        executable: 'npm run dev'
    },
    {
        name: 'Install Dependencies',
        description: 'Install dependencies using npm',
        executable: 'npm install'
    },
    {
        name: 'Git Pull',
        description: 'Fetch and merge latest changes from remote',
        executable: 'git pull'
    },
    {
        name: 'Git Pull Branch',
        description: 'Pull changes from a custom remote and branch',
        executable: 'git-pull-prompt'
    },
    {
        name: 'Git Diff',
        description: 'Show changes in working directory',
        executable: 'git diff'
    },
    {
        name: 'Run Tests',
        description: 'Run project unit and integration tests',
        executable: 'npm test'
    },
    {
        name: 'Run Build',
        description: 'Compile the project files for production',
        executable: 'npm run build'
    },
    {
        name: 'Git Log',
        description: 'Show git history (last 5 commits)',
        executable: 'git log -n 5 --oneline'
    },
    {
        name: 'Docker PS',
        description: 'List active Docker containers',
        executable: 'docker ps'
    },
    {
        name: 'Git Clone Repository',
        description: 'Clone a remote repository into a new folder',
        executable: 'git-clone-prompt'
    },
    {
        name: 'List files in directory',
        description: 'Lists files in the current working directory',
        executable: 'list-dir',
        isCliCommand: true
    },
    {
        name: 'Move folder up',
        description: 'Navigate up one directory level',
        executable: 'cd ..'
    },
    {
        name: 'Go to previous folder',
        description: 'Navigate to the previously visited directory',
        executable: 'cd -'
    },
    {
        name: 'Show system info',
        description: 'Displays basic system architecture and memory usage',
        executable: 'sys-info',
        isCliCommand: true
    },
    {
        name: 'Ping host',
        description: 'Pings a host (defaults to google.com)',
        arguments: '[host]',
        executable: 'ping-host',
        isCliCommand: true
    }
];
// Add metadata command for wrappers
program
    .command('list-metadata')
    .description('Output JSON metadata of all commands for IDE extensions to integrate')
    .action(() => {
    console.log(JSON.stringify(exports.commandsList, null, 2));
});
// Implement command: sys-info
program
    .command('sys-info')
    .description('Displays basic system architecture, OS, and memory information')
    .action(() => {
    console.log('--- System Information ---');
    console.log(`OS Platform: ${os.platform()}`);
    console.log(`OS Release: ${os.release()}`);
    console.log(`Architecture: ${os.arch()}`);
    console.log(`CPUs: ${os.cpus().length}`);
    console.log(`Total Memory: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`);
    console.log(`Free Memory: ${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`);
    console.log(`Uptime: ${(os.uptime() / 3600).toFixed(2)} hours`);
});
// Implement command: ping-host
program
    .command('ping-host')
    .description('Pings a given host (defaults to google.com)')
    .argument('[host]', 'Host to ping', 'google.com')
    .action((host) => {
    console.log(`Pinging host: ${host}...`);
    // On Windows, use "ping -n 4", on Unix "ping -c 4"
    const isWindows = process.platform === 'win32';
    const pingCmd = isWindows ? `ping -n 4 ${host}` : `ping -c 4 ${host}`;
    const { exec } = require('child_process');
    exec(pingCmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(stdout);
    });
});
// Implement command: list-dir
program
    .command('list-dir')
    .description('Lists contents of the current working directory')
    .action(() => {
    const fs = require('fs');
    const path = require('path');
    const dir = process.cwd();
    console.log(`Listing directory: ${dir}\n`);
    try {
        const files = fs.readdirSync(dir);
        files.forEach((file) => {
            const stats = fs.statSync(path.join(dir, file));
            const type = stats.isDirectory() ? '[DIR]' : '[FILE]';
            const size = stats.isFile() ? `(${stats.size} bytes)` : '';
            console.log(`  ${type.padEnd(8)} ${file} ${size}`);
        });
    }
    catch (err) {
        console.error(`Unable to scan directory: ${err.message}`);
    }
});
async function showInteractiveMenu() {
    const cliPath = path.resolve(__dirname, 'index.js');
    const options = exports.commandsList.map(cmd => {
        let executable = cmd.executable;
        if (cmd.isCliCommand) {
            executable = `node "${cliPath}" ${cmd.executable}`;
        }
        return {
            label: cmd.name,
            description: cmd.description,
            command: executable
        };
    });
    options.push({ label: 'Cancel', description: 'Exit the menu', command: '' });
    let selectedIndex = 0;
    let hasRendered = false;
    const totalLines = options.length + 2; // Header + options + footer
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }
    // Hide cursor
    process.stderr.write('\x1b[?25l');
    const render = () => {
        if (hasRendered) {
            readline.moveCursor(process.stderr, 0, -totalLines);
        }
        else {
            hasRendered = true;
        }
        let output = '';
        output += '\r\x1b[K\x1b[1;35m--- Terminal Commands Hub ---\x1b[0m\n';
        options.forEach((opt, idx) => {
            const prefix = idx === selectedIndex ? '\x1b[36m> ' : '  ';
            const label = idx === selectedIndex ? `\x1b[36m[${opt.label}]\x1b[0m` : opt.label;
            const desc = `\x1b[90m(${opt.description})\x1b[0m`;
            output += `\r\x1b[K${prefix}${label.padEnd(45)}  ${desc}\n`;
        });
        output += '\r\x1b[K\x1b[90m(Use Up/Down arrows to navigate, Enter to select, Esc to cancel)\x1b[0m';
        process.stderr.write(output);
    };
    render();
    return new Promise((resolve) => {
        const handleKey = (str, key) => {
            if ((key.ctrl && key.name === 'c') || key.name === 'escape') {
                cleanup();
                resolve(null);
            }
            else if (key.name === 'up') {
                selectedIndex = (selectedIndex - 1 + options.length) % options.length;
                render();
            }
            else if (key.name === 'down') {
                selectedIndex = (selectedIndex + 1) % options.length;
                render();
            }
            else if (key.name === 'return') {
                cleanup();
                const selected = options[selectedIndex];
                if (selected.command === 'git-clone-prompt') {
                    process.stdin.resume();
                    const rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });
                    rl.question('\n\x1b[36mEnter Git repository URL to clone:\x1b[0m ', (url) => {
                        rl.close();
                        process.stdin.pause();
                        if (url.trim()) {
                            resolve(`git clone ${url.trim()}`);
                        }
                        else {
                            resolve(null);
                        }
                    });
                }
                else if (selected.command === 'git-pull-prompt') {
                    process.stdin.resume();
                    const rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });
                    rl.question('\n\x1b[36mEnter remote name (default: origin):\x1b[0m ', (remote) => {
                        const r = remote.trim() || 'origin';
                        rl.question('\x1b[36mEnter branch name (default: main):\x1b[0m ', (branch) => {
                            const b = branch.trim() || 'main';
                            rl.close();
                            process.stdin.pause();
                            resolve(`git pull ${r} ${b}`);
                        });
                    });
                }
                else {
                    resolve(selected.command);
                }
            }
        };
        const cleanup = () => {
            // Clear all lines we printed
            readline.moveCursor(process.stderr, 0, -totalLines);
            for (let i = 0; i <= totalLines; i++) {
                process.stderr.write('\r\x1b[K');
                if (i < totalLines) {
                    process.stderr.write('\n');
                }
            }
            readline.moveCursor(process.stderr, 0, -totalLines);
            // Show cursor
            process.stderr.write('\x1b[?25h');
            process.stdin.removeListener('keypress', handleKey);
            if (process.stdin.isTTY) {
                process.stdin.setRawMode(false);
            }
            process.stdin.pause();
        };
        process.stdin.on('keypress', handleKey);
    });
}
// Implement command: interactive
program
    .command('interactive')
    .description('Launch interactive menu to select and execute commands in the shell')
    .action(async () => {
    const cmd = await showInteractiveMenu();
    if (cmd) {
        console.log(cmd);
    }
});
program.parse(process.argv);
