@echo off
title DukaanMitra Docker Stop
cd /d "%~dp0"
echo Stopping DukaanMitra containers...
docker compose down
echo.
echo All DukaanMitra containers stopped.
pause
