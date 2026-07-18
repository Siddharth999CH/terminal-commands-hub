# Run wrapper for Terminal Commands Hub
$tempFile = [System.IO.Path]::GetTempFileName()
$cliPath = Join-Path $PSScriptRoot "dist\index.js"
node "$cliPath" interactive > $tempFile
if (Test-Path $tempFile) {
    $cmd = Get-Content $tempFile
    Remove-Item $tempFile
    if ($cmd) {
        Invoke-Expression $cmd
    }
}
