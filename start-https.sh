#!/bin/bash

echo "Starting AR Tourist with HTTPS..."

# Check if SSL certificates exist
if [ ! -f "localhost.pem" ] || [ ! -f "localhost-key.pem" ]; then
    echo "SSL certificates not found. Creating them..."
    
    # Check if mkcert is installed
    if ! command -v mkcert &> /dev/null; then
        echo "Installing mkcert..."
        npm install -g mkcert
    fi
    
    echo "Creating SSL certificate..."
    mkcert -install
    mkcert localhost
fi

echo ""
echo "SSL certificates found:"
echo "Certificate: localhost.pem"
echo "Key: localhost-key.pem"
echo ""

echo "Starting the app with HTTPS..."

# Set environment variables and start
HTTPS=true SSL_CRT_FILE=localhost.pem SSL_KEY_FILE=localhost-key.pem npm start
