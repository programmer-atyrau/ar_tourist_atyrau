Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AR Tourist - HTTPS Launcher" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Setting HTTPS environment variables..." -ForegroundColor Yellow
$env:HTTPS = "true"
$env:SSL_CRT_FILE = "localhost.pem"
$env:SSL_KEY_FILE = "localhost-key.pem"

Write-Host ""
Write-Host "Environment variables set:" -ForegroundColor Green
Write-Host "HTTPS: $env:HTTPS" -ForegroundColor Cyan
Write-Host "SSL_CRT_FILE: $env:SSL_CRT_FILE" -ForegroundColor Cyan
Write-Host "SSL_KEY_FILE: $env:SSL_KEY_FILE" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting React app with HTTPS..." -ForegroundColor Green
Write-Host "The app will be available at: https://localhost:3000" -ForegroundColor Yellow
Write-Host ""

npm start

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
