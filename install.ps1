# Installer script for Terminal Commands Hub on Windows

$installDir = Join-Path $HOME ".terminal-commands-hub"
Write-Host "Installing Terminal Commands Hub to $installDir..." -ForegroundColor Cyan

# 1. Check prerequisites
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js is not installed. Please install Node.js and try again."
    exit 1
}
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git is not installed. Please install Git and try again."
    exit 1
}

# 2. Clone repository to installation directory if it doesn't exist
if (Test-Path $installDir) {
    Write-Host "Directory already exists. Pulling latest changes..." -ForegroundColor Yellow
    Push-Location $installDir
    git pull
    Pop-Location
} else {
    Write-Host "Cloning repository..." -ForegroundColor Cyan
    git clone https://github.com/Siddharth999CH/terminal-commands-hub.git $installDir
}

# 3. Build workspace
Push-Location $installDir
Write-Host "Installing npm dependencies and building..." -ForegroundColor Cyan
npm install
npm run build

# 4. Link CLI globally
Write-Host "Linking CLI globally..." -ForegroundColor Cyan
Push-Location cli
npm link
Pop-Location

# 5. Add PowerShell profile integration
$profileDir = Split-Path -Parent $PROFILE
if (!(Test-Path $profileDir)) {
    New-Item -Type Directory -Path $profileDir -Force
}
if (!(Test-Path $PROFILE)) {
    New-Item -Type File -Path $PROFILE -Force
}

$integrationPath = Join-Path $installDir "cli\shell-integration.ps1"
$profileContent = Get-Content $PROFILE -Raw
if ($profileContent -notlike "*shell-integration.ps1*") {
    $integrationCode = "`r`n# Terminal Commands Hub`r`n. `"$integrationPath`""
    Add-Content -Path $PROFILE -Value $integrationCode
    Write-Host "Added integration to PowerShell profile." -ForegroundColor Green
} else {
    Write-Host "Integration already exists in PowerShell profile." -ForegroundColor Yellow
}

# 6. Install VS Code Extension if code is installed
if (Get-Command code -ErrorAction SilentlyContinue) {
    Write-Host "VS Code detected. Packaging and installing VS Code extension..." -ForegroundColor Cyan
    Push-Location vscode-extension
    npx @vscode/vsce package --allow-missing-repository --skip-license
    $vsixFile = Get-ChildItem *.vsix | Select-Object -First 1
    if ($vsixFile) {
        code --install-extension $vsixFile.FullName
        Write-Host "VS Code extension installed successfully." -ForegroundColor Green
    }
    Pop-Location
} else {
    Write-Warning "VS Code command line tool ('code') not found. Skipping extension installation."
}

Pop-Location
Write-Host "Installation completed! Restart your terminal and run 'th' to begin." -ForegroundColor Green
