@echo off
title QM Asset Control Center - System Launcher
echo ==================================================
echo       Starting QM Asset Control Center...
echo ==================================================
echo.

:: 1. Start the Backend in a new window
echo [1/2] Starting Backend Server (Port 5402)...
cd backend
start "QM Backend Server" cmd /k "title QM Backend (Port 5402) && node dist/server.js"
cd ..

:: 2. Start the Frontend in a new window
echo [2/2] Starting Frontend Server (Port 5401)...
start "QM Frontend Server" cmd /k "title QM Frontend (Port 5401) && npm run preview"

echo.
echo ==================================================
echo   System is now running in separate windows!
echo   You can access it at http://10.50.20.20:5401
echo ==================================================
echo.
pause
