# Start All Services
Write-Host "Starting Gram Panchayat Chandra AI System..." -ForegroundColor Cyan

$root = $PSScriptRoot

# 1. Mini-service (vapi-webhook)
Write-Host "[1/3] Starting vapi-webhook on :3003..." -ForegroundColor Yellow
$svcDir = Join-Path $root "mini-services\vapi-webhook"
Start-Process -FilePath "bun" -ArgumentList "index.ts" -WorkingDirectory $svcDir -WindowStyle Hidden

Start-Sleep 2

# 2. Cloudflare Tunnel
Write-Host "[2/3] Starting Cloudflare tunnel..." -ForegroundColor Yellow
$cf = Join-Path $root "cloudflared.exe"
if (Test-Path $cf) {
    Start-Process -FilePath $cf -ArgumentList "tunnel","--url","http://localhost:3003" -WindowStyle Hidden -RedirectStandardOutput (Join-Path $root "cf-tunnel.log") -RedirectStandardError (Join-Path $root "cf-tunnel-err.log")
}

Start-Sleep 5

# 3. Next.js dev server
Write-Host "[3/3] Starting website on :3000..." -ForegroundColor Yellow
$env:NODE_ENV = "development"
Start-Process -FilePath "bun" -ArgumentList "run","dev" -WorkingDirectory $root -WindowStyle Hidden

Write-Host "`nAll services starting. Website: http://localhost:3000" -ForegroundColor Green
Write-Host "Check tunnel URL in cf-tunnel.log" -ForegroundColor Green
