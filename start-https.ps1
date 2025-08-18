Write-Host "Starting AR Tourist with HTTPS..." -ForegroundColor Green
Write-Host ""

# Check if SSL certificates exist
if (-not (Test-Path "localhost.pem") -or -not (Test-Path "localhost-key.pem")) {
    Write-Host "SSL certificates not found. Creating them..." -ForegroundColor Yellow
    
    # Check if mkcert is installed
    try {
        mkcert -version | Out-Null
        Write-Host "mkcert is installed" -ForegroundColor Green
    } catch {
        Write-Host "Installing mkcert..." -ForegroundColor Yellow
        npm install -g mkcert
    }
    
    Write-Host "Creating SSL certificate..." -ForegroundColor Yellow
    mkcert -install
    mkcert localhost
}

Write-Host ""
Write-Host "SSL certificates found:" -ForegroundColor Green
Write-Host "Certificate: localhost.pem" -ForegroundColor Cyan
Write-Host "Key: localhost-key.pem" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting the app with HTTPS..." -ForegroundColor Green

# Set environment variables
$env:HTTPS = "true"
$env:SSL_CRT_FILE = "localhost.pem"
$env:SSL_KEY_FILE = "localhost-key.pem"

# Display environment variables
Write-Host "Environment variables set:" -ForegroundColor Yellow
Write-Host "HTTPS: $env:HTTPS" -ForegroundColor Cyan
Write-Host "SSL_CRT_FILE: $env:SSL_CRT_FILE" -ForegroundColor Cyan
Write-Host "SSL_KEY_FILE: $env:SSL_KEY_FILE" -ForegroundColor Cyan
Write-Host ""

# Start the app
npm start

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
