@echo off
title QM Asset Control Center - PM2 Launcher
echo ==================================================
echo   Starting QM Asset Control Center with PM2...
echo ==================================================
echo.

:: 1. Start the Backend
echo [1/3] Starting Backend Server (qm-backend)...
cd backend
call pm2 start dist/server.js --name "qm-backend"
cd ..

:: 2. Start the Frontend
echo [2/3] Starting Frontend Server (qm-frontend)...
call pm2 start "npm run preview" --name "qm-frontend"

:: 3. Save PM2 list
echo.
echo [3/3] Saving PM2 configuration so it runs on startup...
call pm2 save

echo.
echo ==================================================
echo   System has been successfully started with PM2!
echo   You can view the status using: pm2 status
echo   Access the system at: http://10.50.20.20:5401
echo ==================================================
echo.
pause
