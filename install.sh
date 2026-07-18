#!/bin/bash
# Installer script for Terminal Commands Hub on macOS/Linux

INSTALL_DIR="$HOME/.terminal-commands-hub"
echo "Installing Terminal Commands Hub to $INSTALL_DIR..."

# 1. Check prerequisites
if ! command -v node >/dev/null 2>&1; then
    echo "Error: Node.js is not installed. Please install Node.js and try again."
    exit 1
fi
if ! command -v git >/dev/null 2>&1; then
    echo "Error: Git is not installed. Please install Git and try again."
    exit 1
fi

# 2. Clone repository to installation directory
if [ -d "$INSTALL_DIR" ]; then
    echo "Directory already exists. Pulling latest changes..."
    cd "$INSTALL_DIR"
    git pull
else
    echo "Cloning repository..."
    git clone https://github.com/Siddharth999CH/terminal-commands-hub.git "$INSTALL_DIR"
    cd "$INSTALL_DIR"
fi

# 3. Build workspace
echo "Installing npm dependencies and building..."
npm install
npm run build

# 4. Link CLI globally
echo "Linking CLI globally..."
cd cli
npm link
cd ..

# 5. Add shell profile integration
th_integration='
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
'

# Add to ~/.zshrc if exists
if [ -f "$HOME/.zshrc" ]; then
    if ! grep -q "term-hub interactive" "$HOME/.zshrc"; then
        echo "$th_integration" >> "$HOME/.zshrc"
        echo "Added integration to ~/.zshrc"
    else
        echo "Integration already exists in ~/.zshrc"
    fi
fi

# Add to ~/.bashrc if exists
if [ -f "$HOME/.bashrc" ]; then
    if ! grep -q "term-hub interactive" "$HOME/.bashrc"; then
        echo "$th_integration" >> "$HOME/.bashrc"
        echo "Added integration to ~/.bashrc"
    else
        echo "Integration already exists in ~/.bashrc"
    fi
fi

# 6. Install VS Code Extension if code is installed
if command -v code >/dev/null 2>&1; then
    echo "VS Code detected. Packaging and installing VS Code extension..."
    cd vscode-extension
    npx @vscode/vsce package --allow-missing-repository --skip-license
    VSIX_FILE=$(ls *.vsix | head -n 1)
    if [ -n "$VSIX_FILE" ]; then
        code --install-extension "$VSIX_FILE"
        echo "VS Code extension installed successfully."
    fi
    cd ..
else
    echo "VS Code command line tool ('code') not found. Skipping extension installation."
fi

echo "Installation completed! Restart your terminal and run 'th' to begin."
