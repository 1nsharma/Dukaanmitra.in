@echo off
title DukaanMitra Docker Launcher
cd /d "%~dp0"
echo ================================================================
echo       DukaanMitra AI Commerce System - Docker Launcher
echo ================================================================

echo [1/2] Verifying Docker Desktop Daemon...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Docker Desktop daemon is not running!
    echo Please start Docker Desktop from your Start Menu and try again.
    echo.
    pause
    exit /b 1
)

echo [2/2] Launching DukaanMitra Unified Containers...
docker compose up -d

echo.
echo ================================================================
echo   DukaanMitra AI Commerce System is LIVE in Docker!
echo ================================================================
echo   - Mitra-OS Web Portal:       http://localhost:5173
echo   - DukaanMitra Customer:      http://localhost:3002
echo   - Core Event Engine:         http://localhost:3000
echo   - AI Superintelligence:      http://localhost:8000
echo   - OpenWA WhatsApp Gateway:   http://localhost:2785
echo ================================================================
echo Container status:
docker compose ps
echo.
pause
