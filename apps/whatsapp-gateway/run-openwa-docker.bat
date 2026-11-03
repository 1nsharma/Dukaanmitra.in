@echo off
title OpenWA Docker Quickstart (Port 2785)
cd /d "%~dp0"
echo ================================================================
echo       OpenWA WhatsApp Gateway - Single Container Quickstart
echo       Dashboard & API: http://localhost:2785
echo ================================================================

docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker Desktop daemon is not running!
    pause
    exit /b 1
)

echo Starting OpenWA container on port 2785...
docker compose -f docker-compose.dev.yml up -d

echo.
echo OpenWA is running at: http://localhost:2785
docker compose -f docker-compose.dev.yml ps
echo.
pause
