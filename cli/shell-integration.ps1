# PowerShell Key Handler Integration for Terminal Commands Hub
# Save this file or load it in your $PROFILE by adding:
# . "path\to\cli\shell-integration.ps1"

$ScriptDir = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$CliPath = Join-Path $ScriptDir "dist\index.js"

# Verify Node and file path exist
if (-not (Test-Path $CliPath)) {
    Write-Warning "Terminal Commands Hub CLI file not found at: $CliPath. Please run 'npm run build' first."
} else {
    # Check if PSReadLine module is available
    if (Get-Module PSReadLine -ListAvailable) {
        Set-PSReadLineKeyHandler -Key 'Alt+q' -BriefDescription 'TerminalHubMenu' -LongDescription 'Open the Terminal Commands Hub interactive menu' -ScriptBlock {
            # Clear the current command line input
            [Microsoft.PowerShell.PSConsoleReadLine]::RevertLine()
            
            # Use a temp file to capture output without breaking console TTY
            $tempFile = [System.IO.Path]::GetTempFileName()
            
            # Execute node CLI redirecting stdout only to file
            node "$CliPath" interactive > $tempFile
            
            if (Test-Path $tempFile) {
                $cmd = Get-Content $tempFile
                Remove-Item $tempFile
                if ($cmd) {
                    [Microsoft.PowerShell.PSConsoleReadLine]::Insert($cmd)
                    [Microsoft.PowerShell.PSConsoleReadLine]::AcceptLine()
                }
            }
        }
        Write-Host "Terminal Commands Hub: Alt+Q keybinding registered in PowerShell." -ForegroundColor Cyan
    } else {
        Write-Warning "PSReadLine module is not loaded. Ctrl+G keybinding could not be registered."
    }
}
