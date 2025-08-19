@echo off
echo ========================================
echo   AR Tourist - HTTPS Launcher
echo ========================================
echo.

echo Setting HTTPS environment variables...
set HTTPS=true
set SSL_CRT_FILE=localhost.pem
set SSL_KEY_FILE=localhost-key.pem

echo.
echo Environment variables set:
echo HTTPS=%HTTPS%
echo SSL_CRT_FILE=%SSL_CRT_FILE%
echo SSL_KEY_FILE=%SSL_KEY_FILE%
echo.

echo Starting React app with HTTPS...
echo The app will be available at: https://localhost:3000
echo.
npm start

pause
