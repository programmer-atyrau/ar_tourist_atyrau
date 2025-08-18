@echo off
echo Starting AR Tourist with HTTPS...
echo.
echo This script will start the app with HTTPS for Android compatibility
echo.
echo Installing mkcert if not present...
npm install -g mkcert

echo.
echo Creating SSL certificate...
mkcert -install
mkcert localhost

echo.
echo Starting the app with HTTPS...
set HTTPS=true
set SSL_CRT_FILE=localhost.pem
set SSL_KEY_FILE=localhost-key.pem
echo.
echo SSL Certificate: %SSL_CRT_FILE%
echo SSL Key: %SSL_KEY_FILE%
echo HTTPS: %HTTPS%
echo.
echo Starting React app with HTTPS...
npm start

pause
