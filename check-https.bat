@echo off
echo Checking HTTPS configuration...
echo.

echo Current environment variables:
echo HTTPS=%HTTPS%
echo SSL_CRT_FILE=%SSL_CRT_FILE%
echo SSL_KEY_FILE=%SSL_KEY_FILE%
echo.

echo SSL certificate files:
if exist localhost.pem (
    echo ✓ localhost.pem found
) else (
    echo ✗ localhost.pem NOT found
)

if exist localhost-key.pem (
    echo ✓ localhost-key.pem found
) else (
    echo ✗ localhost-key.pem NOT found
)

echo.
echo To start with HTTPS, run: start-https.bat
pause
