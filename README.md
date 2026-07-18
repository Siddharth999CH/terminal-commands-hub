# Terminal Commands Hub

An interactive utility to quickly select and run your most frequently used development commands (Git, npm, Docker, system diagnostics) directly in your terminal, or via a VS Code right-click context menu.

---

## How It Works (Architecture)

1. **Child Process Limitation:** A child process (like Node.js) cannot change the state or directory of the parent shell.
2. **Double-Layer Solution:** The Node CLI operates in `interactive` mode to let you pick a command. It prints the selected command to a temporary file. A lightweight shell wrapper (or alias function) then reads that command and executes it directly inside the host shell context.

---

## Installation & Setup

### **Recommended: One-Liner Automatic Installation**

Open your terminal and paste the command for your operating system. The installer script will automatically clone the repository, build the dependencies, link the executable globally, configure your shell profile integration (`th` command), and build/install the VS Code extension.

#### **Windows (PowerShell)**
```powershell
irm https://raw.githubusercontent.com/Siddharth999CH/terminal-commands-hub/main/install.ps1 | iex
```

#### **macOS / Linux (Bash/Zsh)**
```bash
curl -fsSL https://raw.githubusercontent.com/Siddharth999CH/terminal-commands-hub/main/install.sh | bash
```

---

### **Alternative: Manual Step-by-Step Installation**

If you prefer to install it manually:

#### 1. Clone & Build the Project
Clone the repository and build the workspace:

```bash
# Clone this repository
git clone https://github.com/Siddharth999CH/terminal-commands-hub.git
cd terminal-commands-hub

# Install dependencies and build
npm install
npm run build
```

### 2. Global Terminal Integration

To run the hub inside **any terminal** on your machine using the shorthand command `th`, follow the setup for your shell below:

#### **Option A: Zsh (`~/.zshrc`) or Bash (`~/.bashrc`)**
1. Link the package globally:
   ```bash
   cd cli
   npm link
   ```
2. Open your shell profile configuration (`~/.zshrc` or `~/.bashrc`):
   ```bash
   nano ~/.zshrc
   ```
3. Add this helper function at the bottom:
   ```bash
   # Terminal Commands Hub Integration
   th() {
       local tempFile
       tempFile=$(mktemp)
       term-hub interactive > "$tempFile"
       if [ -s "$tempFile" ]; then
           eval "$(cat "$tempFile")"
       fi
       rm -f "$tempFile"
   }
   ```
4. Reload your profile:
   ```bash
   source ~/.zshrc
   ```
5. Type `th` in any terminal to open the interactive menu!

---

#### **Option B: Windows PowerShell (`$PROFILE`)**
1. Link the package globally:
   ```powershell
   cd cli
   npm link
   ```
2. Open your PowerShell profile in Notepad:
   ```powershell
   notepad $PROFILE
   ```
3. Add the following function and alias:
   ```powershell
   # Terminal Commands Hub Integration
   function Get-TerminalHubCommand {
       $tempFile = [System.IO.Path]::GetTempFileName()
       term-hub interactive > $tempFile
       if (Test-Path $tempFile) {
           $cmd = Get-Content $tempFile
           Remove-Item $tempFile
           if ($cmd) {
               Invoke-Expression $cmd
           }
       }
   }
   Set-Alias th Get-TerminalHubCommand
   ```
4. Reload your profile:
   ```powershell
   . $PROFILE
   ```
5. Type `th` in any PowerShell window to open the interactive menu!

---

### 3. VS Code Extension Setup (Context Menu)

To enable right-clicking inside a VS Code terminal and selecting **"Terminal Hub: Run Command"**:

1. Install the VS Code extension packager if you haven't:
   ```bash
   npm install -g @vscode/vsce
   ```
2. Package the extension into a `.vsix` file:
   ```bash
   cd vscode-extension
   npx @vscode/vsce package
   ```
   *This creates a package named `terminal-commands-hub-extension-1.0.0.vsix`.*
3. Install the package in VS Code:
   - **Command Line:**
     ```bash
     code --install-extension terminal-commands-hub-extension-1.0.0.vsix
     ```
   - **VS Code UI:**
     - Open the Extensions pane (`Ctrl+Shift+X`).
     - Click the three dots `...` (More Actions) in the top-right corner of the pane.
     - Select **"Install from VSIX..."** and select the generated file.

Now, right-clicking inside any terminal in VS Code will open the context menu showing the option to run your commands!
