$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$firstTermNode = Join-Path $PSScriptRoot '.runtime\node-v22.16.0-win-x64'
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    if (-not (Test-Path -LiteralPath (Join-Path $firstTermNode 'node.exe'))) {
        throw 'Install Node.js 22, then run npm install and npm run dev.'
    }
    $env:Path = "$firstTermNode;$env:Path"
}
if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot 'node_modules'))) {
    & npm.cmd install
    if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed.' }
}
& npm.cmd run dev
